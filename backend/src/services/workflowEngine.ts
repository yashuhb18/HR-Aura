import mongoose from 'mongoose';
import AIWorkflow from '../models/AIWorkflow.js';
import Employee from '../models/Employee.js';
import Attendance from '../models/Attendance.js';
import LeaveRequest from '../models/LeaveRequest.js';
import OnboardingTask from '../models/OnboardingTask.js';
import Approval from '../models/Approval.js';
import PayrollRecord from '../models/PayrollRecord.js';
import { AIService } from './aiService.js';
import { BlockchainService } from './blockchainService.js';
import { MakeAutomationService } from './makeAutomationService.js';
import { RealtimeNotificationService } from './realtimeNotificationService.js';
import { IntentDetectionResult } from './intentDetectionService.js';

type WorkflowType = 'leave' | 'onboarding' | 'payroll';
type WorkflowStepStatus = 'pending' | 'processing' | 'completed' | 'failed';
type WorkflowStep = { name: string; status: WorkflowStepStatus; result?: any };

const systemUserId = () => new mongoose.Types.ObjectId('000000000000000000000000');
const money = (value: number) => Math.round(value * 100) / 100;
const daysBetweenInclusive = (start: Date, end: Date) => Math.max(1, Math.ceil((end.getTime() - start.getTime()) / 86400000) + 1);

export class WorkflowEngine {
    private static async createWorkflow(type: WorkflowType, steps: string[], initiatedBy?: string) {
        const workflow = new AIWorkflow({
            type,
            status: 'initiated',
            initiatedBy: initiatedBy && mongoose.Types.ObjectId.isValid(initiatedBy) ? initiatedBy : systemUserId(),
            steps: steps.map((name) => ({ name, status: 'pending' }))
        });

        await workflow.save();
        await RealtimeNotificationService.mirrorWorkflow(workflow);
        await RealtimeNotificationService.publishWorkflowEvent({
            workflowId: workflow._id.toString(),
            type,
            status: 'initiated',
            message: `${type} automation workflow initiated`
        });

        return workflow;
    }

    private static async completeStep(workflow: any, name: string, result?: any) {
        const step = (workflow.steps as WorkflowStep[]).find((item) => item.name === name);
        if (step) {
            step.status = 'completed';
            step.result = result;
        }

        workflow.status = 'processing';
        await workflow.save();
        await RealtimeNotificationService.mirrorWorkflow(workflow);
        await RealtimeNotificationService.publishWorkflowEvent({
            workflowId: workflow._id.toString(),
            type: workflow.type,
            status: workflow.status,
            step: name,
            message: `${name} completed`,
            payload: result || {}
        });
    }

    private static async finishWorkflow(workflow: any, response: string, payload: Record<string, unknown>) {
        workflow.status = 'completed';
        await workflow.save();
        await RealtimeNotificationService.mirrorWorkflow(workflow);
        await RealtimeNotificationService.publishWorkflowEvent({
            workflowId: workflow._id.toString(),
            type: workflow.type,
            status: 'completed',
            message: response,
            payload
        });
    }

    static async runLeaveAutomation(intent: IntentDetectionResult, initiatedBy?: string) {
        const workflow = await this.createWorkflow('leave', [
            'Intent detected',
            'Employee record loaded',
            'Leave balance checked',
            'Leave request created',
            'AI approval summary generated',
            'Manager approval workflow initiated',
            'Blockchain verification completed',
            'Make.com automation triggered'
        ], initiatedBy);

        await this.completeStep(workflow, 'Intent detected', intent);

        const employee = intent.entities.employeeId && mongoose.Types.ObjectId.isValid(intent.entities.employeeId)
            ? await Employee.findById(intent.entities.employeeId).populate('userId', 'name email')
            : await Employee.findOne({ status: { $in: ['active', 'onboarding'] } }).populate('userId', 'name email');

        if (!employee) throw new Error('Employee record is required for leave automation');
        await this.completeStep(workflow, 'Employee record loaded', { employeeId: employee._id.toString(), department: employee.department });

        const approvedLeaves = await LeaveRequest.find({ employeeId: employee._id, status: 'approved' });
        const usedDays = approvedLeaves.reduce((total, leave) => total + daysBetweenInclusive(new Date(leave.startDate), new Date(leave.endDate)), 0);
        const leaveBalance = Math.max(0, 24 - usedDays);
        await this.completeStep(workflow, 'Leave balance checked', { leaveBalance, usedDays });

        const startDate = new Date(intent.entities.startDate || Date.now());
        const endDate = new Date(intent.entities.endDate || intent.entities.startDate || Date.now());
        const employeeName = (employee.userId as any)?.name || employee.employeeId;
        const reason = intent.entities.reason || 'Requested through HR Aura Copilot';
        const leaveType = intent.entities.leaveType || 'Casual Leave';
        const aiSummary = await AIService.generateLeaveSummary(employeeName, leaveType, startDate, endDate, reason);

        const leaveRequest = new LeaveRequest({
            employeeId: employee._id,
            leaveType,
            startDate,
            endDate,
            reason,
            aiSummary,
            status: 'pending'
        });
        await leaveRequest.save();
        await RealtimeNotificationService.mirrorRecord('leave_requests', {
            id: leaveRequest._id.toString(),
            employee_id: employee._id.toString(),
            leave_type: leaveType,
            start_date: startDate.toISOString().slice(0, 10),
            end_date: endDate.toISOString().slice(0, 10),
            reason,
            status: leaveRequest.status,
            ai_summary: aiSummary,
            blockchain_hash: null,
            created_at: leaveRequest.createdAt
        });
        await this.completeStep(workflow, 'Leave request created', { leaveRequestId: leaveRequest._id.toString(), status: leaveRequest.status });
        await this.completeStep(workflow, 'AI approval summary generated', { aiSummary });

        const approval = new Approval({
            workflowId: workflow._id,
            entityType: 'leave_request',
            entityId: leaveRequest._id,
            requestedBy: employee.userId,
            approverRole: 'manager',
            status: 'pending',
            aiSummary
        });
        await approval.save();
        await RealtimeNotificationService.mirrorRecord('approvals', {
            id: approval._id.toString(),
            workflow_id: workflow._id.toString(),
            entity_type: approval.entityType,
            entity_id: leaveRequest._id.toString(),
            requested_by: employee.userId?.toString(),
            approver_role: approval.approverRole,
            status: approval.status,
            ai_summary: aiSummary,
            created_at: approval.createdAt
        });
        await this.completeStep(workflow, 'Manager approval workflow initiated', { approvalId: approval._id.toString(), approverRole: 'manager' });

        const verificationHash = await BlockchainService.verifyAction('AI_LEAVE_WORKFLOW', 'LeaveRequest', leaveRequest._id.toString(), {
            workflowId: workflow._id.toString(),
            approvalId: approval._id.toString(),
            leaveBalance,
            aiSummary
        });
        leaveRequest.blockchainHash = verificationHash;
        await leaveRequest.save();
        await RealtimeNotificationService.mirrorRecord('leave_requests', {
            id: leaveRequest._id.toString(),
            employee_id: employee._id.toString(),
            leave_type: leaveType,
            start_date: startDate.toISOString().slice(0, 10),
            end_date: endDate.toISOString().slice(0, 10),
            reason,
            status: leaveRequest.status,
            ai_summary: aiSummary,
            blockchain_hash: verificationHash,
            created_at: leaveRequest.createdAt
        });
        await this.completeStep(workflow, 'Blockchain verification completed', { verificationHash });

        const makeResult = await MakeAutomationService.trigger({
            event: 'leave.approval.requested',
            workflowId: workflow._id.toString(),
            entityType: 'leave_request',
            entityId: leaveRequest._id.toString(),
            summary: aiSummary,
            data: { approvalId: approval._id.toString(), employeeName, startDate, endDate, leaveType }
        });
        await this.completeStep(workflow, 'Make.com automation triggered', makeResult);

        const response = [
            `I've successfully processed your ${leaveType} request from ${startDate.toDateString()} to ${endDate.toDateString()}.`,
            'The request has been logged to the blockchain trust ledger, and I\'ve initiated the manager approval workflow.',
            'Your team has also been notified via the Make.com automation engine.'
        ].join(' ');

        const payload = { workflowId: workflow._id.toString(), leaveRequestId: leaveRequest._id.toString(), approvalId: approval._id.toString(), verificationHash, leaveBalance, aiSummary };
        await this.finishWorkflow(workflow, response, payload);

        return { type: 'leave', action: 'leave_automation_completed', response, workflow, data: payload, suggestedSteps: ['View approval queue', 'Track workflow', 'Notify manager'] };
    }

    static async runPayrollAutomation(initiatedBy?: string) {
        const workflow = await this.createWorkflow('payroll', [
            'Employee compensation data loaded',
            'Attendance and leave data analyzed',
            'Payroll records calculated',
            'AI payroll summaries generated',
            'Payroll approval workflow initiated',
            'Blockchain verification completed',
            'Make.com automation triggered'
        ], initiatedBy);

        const now = new Date();
        const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        const periodLabel = `${periodStart.toISOString().slice(0, 7)}`;

        const employees = await Employee.find({ status: { $in: ['active', 'onboarding'] } }).populate('userId', 'name email');
        if (!employees.length) throw new Error('Employee dataset is required for payroll automation');
        await this.completeStep(workflow, 'Employee compensation data loaded', { employeeCount: employees.length, periodLabel });

        const payrollRecords = [];
        for (const employee of employees as any[]) {
            if (!employee.monthlySalary || employee.monthlySalary <= 0) {
                throw new Error(`Monthly salary is missing for employee ${employee.employeeId}`);
            }

            const attendance = await Attendance.find({
                employeeId: employee._id,
                date: { $gte: periodStart, $lte: periodEnd }
            });
            const paidLeaves = await LeaveRequest.find({
                employeeId: employee._id,
                status: 'approved',
                leaveType: { $ne: 'Unpaid Leave' },
                startDate: { $lte: periodEnd },
                endDate: { $gte: periodStart }
            });
            const unpaidLeaves = await LeaveRequest.find({
                employeeId: employee._id,
                status: 'approved',
                leaveType: 'Unpaid Leave',
                startDate: { $lte: periodEnd },
                endDate: { $gte: periodStart }
            });

            const attendanceDays = attendance.filter((item) => item.status === 'present' || item.status === 'late').length;
            const paidLeaveDays = paidLeaves.reduce((sum, item) => sum + daysBetweenInclusive(new Date(item.startDate), new Date(item.endDate)), 0);
            const unpaidLeaveDays = unpaidLeaves.reduce((sum, item) => sum + daysBetweenInclusive(new Date(item.startDate), new Date(item.endDate)), 0);
            const dailyRate = employee.monthlySalary / 30;
            const deductions = {
                tax: money(employee.monthlySalary * 0.1),
                benefits: money(employee.monthlySalary * 0.02),
                unpaidLeave: money(unpaidLeaveDays * dailyRate)
            };
            const netSalary = money(employee.monthlySalary - deductions.tax - deductions.benefits - deductions.unpaidLeave);
            const employeeName = employee.userId?.name || employee.employeeId;
            const aiSummary = await AIService.generatePayrollSummary({
                employeeName,
                periodLabel,
                grossSalary: employee.monthlySalary,
                netSalary,
                attendanceDays,
                paidLeaveDays,
                unpaidLeaveDays,
                deductions
            });

            const payrollRecord = new PayrollRecord({
                workflowId: workflow._id,
                employeeId: employee._id,
                periodStart,
                periodEnd,
                grossSalary: employee.monthlySalary,
                attendanceDays,
                paidLeaveDays,
                unpaidLeaveDays,
                deductions,
                netSalary,
                aiSummary,
                status: 'approval_pending'
            });
            await payrollRecord.save();

            const verificationHash = await BlockchainService.verifyAction('AI_PAYROLL_RECORD', 'PayrollRecord', payrollRecord._id.toString(), {
                workflowId: workflow._id.toString(),
                employeeId: employee._id.toString(),
                periodLabel,
                grossSalary: employee.monthlySalary,
                netSalary
            });
            payrollRecord.blockchainHash = verificationHash;
            await payrollRecord.save();

            await RealtimeNotificationService.mirrorRecord('payroll_records', {
                id: payrollRecord._id.toString(),
                workflow_id: workflow._id.toString(),
                employee_id: employee._id.toString(),
                period_start: periodStart.toISOString().slice(0, 10),
                period_end: periodEnd.toISOString().slice(0, 10),
                gross_salary: employee.monthlySalary,
                attendance_days: attendanceDays,
                paid_leave_days: paidLeaveDays,
                unpaid_leave_days: unpaidLeaveDays,
                deductions,
                net_salary: netSalary,
                ai_summary: aiSummary,
                status: payrollRecord.status,
                blockchain_hash: verificationHash,
                created_at: payrollRecord.createdAt
            });

            payrollRecords.push({
                payrollRecordId: payrollRecord._id.toString(),
                employeeId: employee._id.toString(),
                employeeName,
                grossSalary: employee.monthlySalary,
                netSalary,
                verificationHash
            });
        }

        await this.completeStep(workflow, 'Attendance and leave data analyzed', { periodLabel });
        await this.completeStep(workflow, 'Payroll records calculated', { payrollRecordCount: payrollRecords.length });
        await this.completeStep(workflow, 'AI payroll summaries generated', { payrollRecordCount: payrollRecords.length });

        const approval = new Approval({
            workflowId: workflow._id,
            entityType: 'payroll',
            entityId: workflow._id,
            approverRole: 'hr',
            status: 'pending',
            aiSummary: `Payroll run ${periodLabel} generated for ${payrollRecords.length} employee(s).`
        });
        await approval.save();
        await this.completeStep(workflow, 'Payroll approval workflow initiated', { approvalId: approval._id.toString(), approverRole: 'hr' });

        const verificationHash = await BlockchainService.verifyAction('AI_PAYROLL_WORKFLOW', 'AIWorkflow', workflow._id.toString(), {
            periodLabel,
            payrollRecordCount: payrollRecords.length,
            approvalId: approval._id.toString()
        });
        await this.completeStep(workflow, 'Blockchain verification completed', { verificationHash });

        const makeResult = await MakeAutomationService.trigger({
            event: 'payroll.run.generated',
            workflowId: workflow._id.toString(),
            entityType: 'ai_workflow',
            entityId: workflow._id.toString(),
            summary: `Payroll run ${periodLabel} generated for ${payrollRecords.length} employee(s).`,
            data: { approvalId: approval._id.toString(), payrollRecords }
        });
        await this.completeStep(workflow, 'Make.com automation triggered', makeResult);

        const totalNetPayable = money(payrollRecords.reduce((sum, item) => sum + item.netSalary, 0));
        const response = [
            `I've completed the payroll run for ${periodLabel}.`,
            `I've calculated payroll for ${payrollRecords.length} employees with a total net payable of ${totalNetPayable}.`,
            'The entire run is now pending HR approval and has been secured on the blockchain.'
        ].join(' ');
        const payload = { workflowId: workflow._id.toString(), approvalId: approval._id.toString(), verificationHash, periodLabel, totalNetPayable, payrollRecords };
        await this.finishWorkflow(workflow, response, payload);

        return { type: 'payroll', action: 'payroll_automation_completed', response, workflow, data: payload, suggestedSteps: ['View payroll run', 'Approve payroll', 'Send payslips'] };
    }

    static async runOnboardingWorkflow(employeeId: string, initiatedBy?: string) {
        const workflow = await this.createWorkflow('onboarding', [
            'Employee profile loaded',
            'AI onboarding checklist generated',
            'Onboarding tasks assigned',
            'Welcome summary generated',
            'Blockchain verification completed',
            'Make.com automation triggered'
        ], initiatedBy);

        const employee = await Employee.findById(employeeId).populate('userId', 'name email');
        if (!employee) throw new Error('Employee not found for onboarding workflow');
        await this.completeStep(workflow, 'Employee profile loaded', { employeeId: employee._id.toString(), department: employee.department });

        const taskNames = await AIService.generateOnboardingTasks(employee.designation, employee.department);
        await this.completeStep(workflow, 'AI onboarding checklist generated', { taskCount: taskNames.length, taskNames });

        const dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        const tasks = await Promise.all(taskNames.map((taskName) => new OnboardingTask({
            employeeId: employee._id,
            taskName,
            description: `AI-generated setup task for ${employee.department} onboarding.`,
            status: 'pending',
            dueDate
        }).save()));
        await Promise.all(tasks.map((task) => RealtimeNotificationService.mirrorRecord('onboarding_tasks', {
            id: task._id.toString(),
            employee_id: employee._id.toString(),
            task_name: task.taskName,
            description: task.description,
            status: task.status,
            due_date: task.dueDate?.toISOString().slice(0, 10),
            created_at: new Date().toISOString()
        })));
        await this.completeStep(workflow, 'Onboarding tasks assigned', { taskIds: tasks.map((task) => task._id.toString()) });

        const employeeName = (employee.userId as any)?.name || employee.employeeId;
        const welcomeSummary = await AIService.generateOnboardingWelcomeSummary(employeeName, employee.designation, employee.department, taskNames);
        await this.completeStep(workflow, 'Welcome summary generated', { welcomeSummary });

        const verificationHash = await BlockchainService.verifyAction('AI_ONBOARDING_WORKFLOW', 'Employee', employee._id.toString(), {
            workflowId: workflow._id.toString(),
            taskCount: tasks.length,
            welcomeSummary
        });
        employee.blockchainStatus = verificationHash;
        await employee.save();
        await RealtimeNotificationService.mirrorRecord('employees', {
            id: employee._id.toString(),
            user_id: employee.userId?.toString(),
            employee_id: employee.employeeId,
            name: employeeName,
            department: employee.department,
            designation: employee.designation,
            status: employee.status,
            performance_score: employee.performanceScore,
            burnout_risk: employee.burnoutRisk,
            blockchain_status: verificationHash,
            created_at: employee.joiningDate
        });
        await this.completeStep(workflow, 'Blockchain verification completed', { verificationHash });

        const makeResult = await MakeAutomationService.trigger({
            event: 'employee.onboarding.started',
            workflowId: workflow._id.toString(),
            entityType: 'employee',
            entityId: employee._id.toString(),
            summary: welcomeSummary,
            data: { taskIds: tasks.map((task) => task._id.toString()), employeeName }
        });
        await this.completeStep(workflow, 'Make.com automation triggered', makeResult);

        const response = [
            `I've successfully initiated the onboarding workflow for ${employeeName}.`,
            `I've generated and assigned ${tasks.length} specialized tasks for their role in ${employee.department}.`,
            'The welcome sequence is now active, and the record is secured on the blockchain ledger.'
        ].join(' ');

        const payload = { workflowId: workflow._id.toString(), employeeId: employee._id.toString(), taskIds: tasks.map((task) => task._id.toString()), verificationHash, welcomeSummary };
        await this.finishWorkflow(workflow, response, payload);

        return { type: 'onboarding', action: 'onboarding_automation_completed', response, workflow, data: payload, suggestedSteps: ['Track onboarding', 'Send welcome note', 'View checklist'] };
    }
}
