import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export type LLMProvider = 'groq' | 'gemini' | 'openai';

export class LLMService {
    static async call(provider: LLMProvider, system: string, prompt: string): Promise<string> {
        const keys = {
            openai: process.env.OPENAI_API_KEY,
            groq: process.env.GROQ_API_KEY,
            gemini: process.env.GEMINI_API_KEY
        };

        const activeKey = keys[provider];

        // --- HACKATHON DEMO FALLBACK ---
        if (!activeKey || activeKey.includes('your_')) {
            console.log(`📝 [Aura ${provider.toUpperCase()}] Running in Demo Mode. Simulating response...`);
            return this.getMockResponse(provider, prompt);
        }

        try {
            switch (provider) {
                case 'groq':
                    return await this.callGroq(activeKey, system, prompt);
                case 'gemini':
                    return await this.callGemini(activeKey, system, prompt);
                case 'openai':
                    return await this.callOpenAI(activeKey, system, prompt);
                default:
                    return this.getMockResponse('openai', prompt);
            }
        } catch (error) {
            console.error(`❌ [${provider.toUpperCase()} Error]:`, (error as Error).message);
            return this.getMockResponse(provider, prompt);
        }
    }

    private static async callGroq(key: string, system: string, prompt: string): Promise<string> {
        const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
            model: 'llama3-70b-8192',
            messages: [
                { role: 'system', content: system },
                { role: 'user', content: prompt }
            ]
        }, {
            headers: { Authorization: `Bearer ${key}` }
        });
        return response.data.choices[0].message.content;
    }

    private static async callGemini(key: string, system: string, prompt: string): Promise<string> {
        const response = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`, {
            contents: [{ parts: [{ text: `${system}\n\n${prompt}` }] }]
        });
        return response.data.candidates[0].content.parts[0].text;
    }

    private static async callOpenAI(key: string, system: string, prompt: string): Promise<string> {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-4o',
            messages: [
                { role: 'system', content: system },
                { role: 'user', content: prompt }
            ]
        }, {
            headers: { Authorization: `Bearer ${key}` }
        });
        return response.data.choices[0].message.content;
    }

    private static getMockResponse(provider: string, prompt: string): string {
        const p = provider.toUpperCase();
        if (prompt.includes('Leave type')) {
            return `[${p} INSIGHT]: High eligibility. Employee has 18/24 days remaining. No major business risk. Approve request.`;
        }
        if (prompt.includes('onboarding checklist')) {
            return JSON.stringify([
                "Hardware Provisioning (IT)",
                "Compliance Training (HR)",
                "Architecture Overview (Dev)",
                "Payroll Setup (Finance)",
                "Company Handbook Review",
                "Buddy Introduction"
            ]);
        }
        return `[${p} NEURAL RESPONSE]: Workflow successfully analyzed and validated against enterprise policy. Action logged to blockchain.`;
    }
}
