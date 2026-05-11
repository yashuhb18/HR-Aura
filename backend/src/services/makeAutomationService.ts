type MakePayload = {
    event: string;
    workflowId: string;
    entityType: string;
    entityId: string;
    summary?: string;
    data?: Record<string, unknown>;
};

export class MakeAutomationService {
    static async trigger(payload: MakePayload) {
        const webhookUrl = process.env.MAKE_WEBHOOK_URL;
        if (!webhookUrl) {
            throw new Error('MAKE_WEBHOOK_URL is required for automation delivery');
        }

        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(process.env.MAKE_WEBHOOK_SECRET ? { 'X-HR-Aura-Signature': process.env.MAKE_WEBHOOK_SECRET } : {})
            },
            body: JSON.stringify({
                source: 'hr-aura',
                triggeredAt: new Date().toISOString(),
                ...payload
            })
        });

        if (!response.ok) {
            throw new Error(`Make.com webhook failed with ${response.status} ${response.statusText}`);
        }

        return {
            delivered: true,
            status: response.status,
            statusText: response.statusText
        };
    }
}
