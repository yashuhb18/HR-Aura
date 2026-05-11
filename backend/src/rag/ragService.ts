import fs from 'fs';
import path from 'path';
import { LLMService } from '../services/llmService.js';

export class RAGService {
    private static docsPath = path.resolve('src/rag/documents');

    /**
     * Searches for relevant policy text and generates a grounded AI response.
     */
    static async answerWithPolicy(query: string): Promise<string> {
        try {
            // 1. Retrieve: Get all policy docs
            const files = fs.readdirSync(this.docsPath);
            let context = '';
            
            for (const file of files) {
                const content = fs.readFileSync(path.join(this.docsPath, file), 'utf-8');
                context += `\n--- Document: ${file} ---\n${content}\n`;
            }

            // 2. Augment & Generate: Call Gemini (good for long context)
            return await LLMService.call(
                'gemini',
                'You are Aura AI Policy Assistant. Answer the user query strictly using the provided HR Policy Context below. If the answer is not in the context, say you don\'t know.',
                `CONTEXT:\n${context}\n\nQUERY: ${query}`
            );
        } catch (error) {
            console.error('RAG Error:', (error as Error).message);
            return "I'm having trouble accessing the policy database right now. Please try again shortly.";
        }
    }
}
