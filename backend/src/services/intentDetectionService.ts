export type HRIntent = 'apply_leave' | 'run_payroll' | 'onboarding' | 'approval_update' | 'general';

export interface IntentDetectionResult {
    intent: HRIntent;
    confidence: number;
    entities: {
        employeeId?: string;
        employeeName?: string;
        leaveType?: string;
        startDate?: string;
        endDate?: string;
        reason?: string;
        department?: string;
        designation?: string;
        payrollPeriod?: string;
    };
}

const toIsoDate = (date: Date) => {
    const parts = new Intl.DateTimeFormat('en-CA', {
        timeZone: process.env.HR_AURA_TIMEZONE || 'Asia/Calcutta',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).formatToParts(date);

    const value = (type: string) => parts.find((part) => part.type === type)?.value;
    return `${value('year')}-${value('month')}-${value('day')}`;
};

export class IntentDetectionService {
    static async detect(command: string): Promise<IntentDetectionResult> {
        const lower = command.toLowerCase();
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        if (lower.includes('leave') || lower.includes('sick') || lower.includes('fever') || lower.includes('pto')) {
            const date = lower.includes('tomorrow') ? tomorrow : today;
            const reasonMatch = command.match(/because of (.+)$/i) || command.match(/for (.+)$/i);

            return {
                intent: 'apply_leave',
                confidence: 0.92,
                entities: {
                    leaveType: lower.includes('fever') || lower.includes('sick') ? 'Sick Leave' : 'Casual Leave',
                    startDate: toIsoDate(date),
                    endDate: toIsoDate(date),
                    reason: reasonMatch?.[1] || (lower.includes('fever') ? 'Fever' : 'Requested through AI Copilot')
                }
            };
        }

        if (lower.includes('payroll') || lower.includes('salary') || lower.includes('payslip') || lower.includes('pay run')) {
            return {
                intent: 'run_payroll',
                confidence: 0.93,
                entities: {
                    payrollPeriod: lower.includes('last month') ? 'last_month' : 'current_month'
                }
            };
        }

        if (lower.includes('onboard') || lower.includes('new hire') || lower.includes('new employee')) {
            return { intent: 'onboarding', confidence: 0.88, entities: {} };
        }

        if (lower.includes('attendance') && (lower.includes('pay') || lower.includes('salary'))) {
            return { intent: 'run_payroll', confidence: 0.86, entities: { payrollPeriod: 'current_month' } };
        }

        if (lower.includes('approve') || lower.includes('reject')) {
            return { intent: 'approval_update', confidence: 0.75, entities: {} };
        }

        return { intent: 'general', confidence: 0.45, entities: {} };
    }
}
