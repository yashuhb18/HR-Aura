import { IntentDetectionService } from './intentDetectionService.js';
import { WorkflowEngine } from './workflowEngine.js';
import { RealtimeNotificationService } from './realtimeNotificationService.js';
import { RAGService } from '../rag/ragService.js';

export class WorkflowRouter {
    static async route(command: string, context: Record<string, any> = {}) {
        await RealtimeNotificationService.saveChatMessage('user', command, { context });
        const intent = await IntentDetectionService.detect(command);

        let result;
        if (intent.intent === 'apply_leave') {
            result = await WorkflowEngine.runLeaveAutomation(intent, context.userId);
        } else if (intent.intent === 'run_payroll') {
            result = await WorkflowEngine.runPayrollAutomation(context.userId);
        } else if (intent.intent === 'onboarding' && context.employeeId) {
            result = await WorkflowEngine.runOnboardingWorkflow(context.employeeId, context.userId);
        } else if (intent.intent === 'onboarding') {
            result = {
                type: 'onboarding',
                action: 'employee_required',
                response: 'I can start onboarding automation as soon as an employee profile is selected or created.',
                suggestedSteps: ['Create employee', 'Select employee', 'Generate onboarding checklist'],
                intent
            };
        } else {
            // Attempt RAG (Retrieval-Augmented Generation) for general questions
            const ragResponse = await RAGService.answerWithPolicy(command);
            
            result = {
                type: 'general',
                action: 'rag_response',
                response: ragResponse,
                suggestedSteps: ['Apply leave', 'View my profile', 'Run payroll'],
                intent
            };
        }

        await RealtimeNotificationService.saveChatMessage('assistant', result.response, {
            action: result.action,
            type: result.type,
            workflowId: result.data?.workflowId
        });

        return { ...result, intent };
    }
}
