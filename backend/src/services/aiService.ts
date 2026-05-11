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
    private static async callOpenAI(system: string, prompt: string): Promise<string> {
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            throw new Error('OPENAI_API_KEY is required for AI workflow orchestration');
        }

        const response = await fetch('https://api.openai.com/v1/responses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: process.env.OPENAI_MODEL || 'gpt-5-codex',
                input: [
                    { role: 'system', content: system },
                    { role: 'user', content: prompt }
                ],
                text: { verbosity: 'low' }
            })
        });

        if (!response.ok) {
            throw new Error(`OpenAI request failed with ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const text = data.output_text || data.output?.[0]?.content?.[0]?.text;
        if (!text) {
            throw new Error('OpenAI response did not include output text');
        }

        return text;
    }

    static async generateLeaveSummary(employeeName: string, leaveType: string, startDate: Date, endDate: Date, reason: string): Promise<string> {
        return this.callOpenAI(
            'You are HR Aura, an enterprise HR workflow copilot. Create concise, compliance-aware approval summaries.',
            `Create an HR approval summary for ${employeeName}. Leave type: ${leaveType}. Dates: ${startDate.toDateString()} to ${endDate.toDateString()}. Reason: ${reason}. Include eligibility, business risk, and manager recommendation.`
        );
    }

    static async getEmployeeInsights(employeeId: string): Promise<any> {
        return this.callOpenAI(
            'You are HR Aura, an enterprise employee analytics copilot. Return concise JSON only.',
            `Generate employee insight JSON for employeeId ${employeeId} with keys summary, scores.productivity, scores.burnoutRisk, scores.sentiment.`
        );
    }

    static async generateOnboardingTasks(designation: string, department: string): Promise<string[]> {
        const text = await this.callOpenAI(
            'You are HR Aura, an enterprise onboarding automation engine. Return a JSON array of task names only.',
            `Generate 6 onboarding checklist task names for a ${designation} joining ${department}. Include access, compliance, manager alignment, payroll setup, document verification, and first-week enablement.`
        );

        const parsed = JSON.parse(text);
        if (!Array.isArray(parsed) || parsed.some((item) => typeof item !== 'string')) {
            throw new Error('OpenAI onboarding task response must be a JSON string array');
        }
        return parsed;
    }

    static async generateOnboardingWelcomeSummary(employeeName: string, designation: string, department: string, tasks: string[]): Promise<string> {
        return this.callOpenAI(
            'You are HR Aura. Write enterprise-ready onboarding workflow summaries.',
            `Write a concise onboarding summary for ${employeeName}, joining as ${designation} in ${department}. Tasks: ${tasks.join('; ')}.`
        );
    }

    static async generatePayrollSummary(input: PayrollSummaryInput): Promise<string> {
        return this.callOpenAI(
            'You are HR Aura, an enterprise payroll automation copilot. Produce concise payroll approval summaries.',
            `Create a payroll approval summary from this JSON: ${JSON.stringify(input)}. Include attendance basis, deductions, net payable, compliance note, and approval recommendation.`
        );
    }

    static async processCopilotCommand(command: string): Promise<any> {
        const { WorkflowRouter } = await import('./workflowRouter.js');
        return WorkflowRouter.route(command);
    }
}
