import { LLMService } from './llmService.js';

type PayrollSummaryInput = {
    employeeName: string;
    periodLabel: string;
    grossSalary: number;
    netSalary: number;
    attendanceDays: number;
    paidLeaveDays: number;
    unpaidLeaveDays: number;
    deductions: {
        tax: number;
        benefits: number;
        unpaidLeave: number;
    };
};

export class AIService {
    static async generateLeaveSummary(employeeName: string, leaveType: string, startDate: Date, endDate: Date, reason: string): Promise<string> {
        // Groq is chosen for speed in simple summaries
        return LLMService.call(
            'groq',
            'You are HR Aura, an enterprise HR workflow copilot. Create concise, compliance-aware approval summaries.',
            `Create an HR approval summary for ${employeeName}. Leave type: ${leaveType}. Dates: ${startDate.toDateString()} to ${endDate.toDateString()}. Reason: ${reason}. Include eligibility, business risk, and manager recommendation.`
        );
    }

    static async getEmployeeInsights(employeeId: string): Promise<any> {
        // OpenAI for deep reasoning and complex analytics
        const text = await LLMService.call(
            'openai',
            'You are HR Aura, an enterprise employee analytics copilot. Return concise JSON only.',
            `Generate employee insight JSON for employeeId ${employeeId} with keys summary, scores.productivity, scores.burnoutRisk, scores.sentiment.`
        );
        try { return JSON.parse(text); } catch { return { summary: text }; }
    }

    static async generateOnboardingTasks(designation: string, department: string): Promise<string[]> {
        // Gemini for large-context/generative tasks
        const text = await LLMService.call(
            'gemini',
            'You are HR Aura, an enterprise onboarding automation engine. Return a JSON array of task names only.',
            `Generate 6 onboarding checklist task names for a ${designation} joining ${department}. Include access, compliance, manager alignment, payroll setup, document verification, and first-week enablement.`
        );

        try {
            const cleanText = text.replace(/```json|```/g, '').trim();
            const parsed = JSON.parse(cleanText);
            return Array.isArray(parsed) ? parsed : ['Setup profile', 'Review docs'];
        } catch (e) {
            return ['Setup workspace', 'Security training', 'Manager alignment'];
        }
    }

    static async generateOnboardingWelcomeSummary(employeeName: string, designation: string, department: string, tasks: string[]): Promise<string> {
        return LLMService.call(
            'gemini',
            'You are HR Aura. Write enterprise-ready onboarding workflow summaries.',
            `Write a concise onboarding summary for ${employeeName}, joining as ${designation} in ${department}. Tasks: ${tasks.join('; ')}.`
        );
    }

    static async generatePayrollSummary(input: PayrollSummaryInput): Promise<string> {
        // OpenAI for high-accuracy financial summaries
        return LLMService.call(
            'openai',
            'You are HR Aura, an enterprise payroll automation copilot. Produce concise payroll approval summaries.',
            `Create a payroll approval summary from this JSON: ${JSON.stringify(input)}. Include attendance basis, deductions, net payable, compliance note, and approval recommendation.`
        );
    }

    static async processCopilotCommand(command: string): Promise<any> {
        const { WorkflowRouter } = await import('./workflowRouter.js');
        return WorkflowRouter.route(command);
    }
}
