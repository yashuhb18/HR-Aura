export class AIService {
    static async generateLeaveSummary(employeeName: string, leaveType: string, startDate: Date, endDate: Date, reason: string): Promise<string> {
        // In a real scenario, this would call OpenAI/LangChain
        // For hackathon demo, we'll return a believable AI response
        return `AI ANALYSIS: ${employeeName} is requesting ${leaveType} from ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}. The reason provided ("${reason}") aligns with standard policy. No overlapping critical project deadlines detected. RECOMENDATION: Approve.`;
    }

    static async getEmployeeInsights(employeeId: string): Promise<any> {
        // Mocking AI analysis of productivity and burnout
        const scores = {
            productivity: Math.floor(Math.random() * 40) + 60,
            burnoutRisk: Math.floor(Math.random() * 30) + 10,
            sentiment: 'Positive'
        };

        return {
            summary: `Based on recent attendance patterns and leave frequency, the employee shows a ${scores.productivity}% productivity trend. Burnout risk is currently at ${scores.burnoutRisk}%, which is within acceptable limits.`,
            scores
        };
    }

    static async generateOnboardingTasks(designation: string, department: string): Promise<string[]> {
        // Mocking AI-generated checklist
        return [
            `Setup ${department} specific development environment`,
            `Complete ${designation} security training`,
            `Schedule 1-on-1 with team lead`,
            `Review ${department} roadmap for Q2`,
            `Onboarding session with HR for benefits overview`
        ];
    }

    static async processCopilotCommand(command: string): Promise<any> {
        // Simple command parsing for demo
        const lowerCommand = command.toLowerCase();
        
        if (lowerCommand.includes('leave')) {
            return {
                type: 'leave',
                action: 'initiate_leave_workflow',
                response: 'I can help you apply for leave. Could you specify the dates and reason?',
                suggestedSteps: ['Select Dates', 'Provide Reason', 'Submit Request']
            };
        }

        if (lowerCommand.includes('onboarding') || lowerCommand.includes('new hire')) {
            return {
                type: 'onboarding',
                action: 'generate_onboarding_plan',
                response: 'Preparing a customized onboarding workflow for the new recruit. Which department are they joining?',
                suggestedSteps: ['Select Department', 'Enter Designation', 'Generate Tasks']
            };
        }

        return {
            type: 'general',
            action: 'chat',
            response: "I'm your HR Aura Copilot. I can help with leaves, onboarding, and employee analytics. How can I assist you today?",
            suggestedSteps: ['Show attendance trends', 'Check leave balance', 'Start onboarding']
        };
    }
}
