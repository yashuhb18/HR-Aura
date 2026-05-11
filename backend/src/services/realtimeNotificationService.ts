import { supabase } from '../config/supabase.js';

type WorkflowEvent = {
    workflowId: string;
    type: string;
    status: string;
    step?: string;
    message: string;
    payload?: Record<string, unknown>;
};

export class RealtimeNotificationService {
    static async publishWorkflowEvent(event: WorkflowEvent) {
        const record = {
            workflow_id: event.workflowId,
            type: event.type,
            status: event.status,
            step: event.step || null,
            message: event.message,
            payload: event.payload || {},
            created_at: new Date().toISOString()
        };

        try {
            await supabase.from('workflow_events').insert(record);
            await supabase.channel(`workflow:${event.workflowId}`).send({
                type: 'broadcast',
                event: 'workflow_update',
                payload: record
            });
        } catch (error) {
            console.warn('Realtime workflow publish failed:', (error as Error).message);
        }

        return record;
    }

    static async mirrorWorkflow(workflow: any) {
        try {
            await supabase.from('ai_workflows').upsert({
                id: workflow._id.toString(),
                type: workflow.type,
                status: workflow.status,
                steps: workflow.steps,
                initiated_by: workflow.initiatedBy?.toString() || null,
                created_at: workflow.createdAt || new Date().toISOString(),
                updated_at: new Date().toISOString()
            });
        } catch (error) {
            console.warn('Supabase workflow mirror failed:', (error as Error).message);
        }
    }

    static async saveChatMessage(role: 'user' | 'assistant', content: string, metadata: Record<string, unknown> = {}) {
        try {
            await supabase.from('chat_history').insert({
                role,
                content,
                metadata,
                created_at: new Date().toISOString()
            });
        } catch (error) {
            console.warn('Chat history mirror failed:', (error as Error).message);
        }
    }

    static async mirrorRecord(table: string, record: Record<string, unknown>) {
        try {
            await supabase.from(table).upsert({
                ...record,
                updated_at: new Date().toISOString()
            });
        } catch (error) {
            console.warn(`Supabase ${table} mirror failed:`, (error as Error).message);
        }
    }
}
