import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const webhookUrl = process.env.MAKE_WEBHOOK_URL;

export class AutomationService {
    static async triggerEvent(event: string, data: any) {
        if (!webhookUrl) {
            console.warn('⚠️ MAKE_WEBHOOK_URL not configured. Skipping automation trigger.');
            return;
        }

        try {
            console.log(`🤖 Triggering Automation: ${event}`);
            await axios.post(webhookUrl, {
                event,
                timestamp: new Date().toISOString(),
                platform: 'HR Aura',
                data
            });
        } catch (error) {
            console.error(`❌ Automation Error (${event}):`, (error as Error).message);
        }
    }
}
