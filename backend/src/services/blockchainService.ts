import crypto from 'crypto';
import BlockchainLog from '../models/BlockchainLog.js';

export class BlockchainService {
    static async generateHash(data: any): Promise<string> {
        return crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex');
    }

    static async verifyAction(action: string, entityType: string, entityId: string, data: any) {
        // Get the last log to find the previous hash
        const lastLog = await BlockchainLog.findOne().sort({ timestamp: -1 });
        const previousHash = lastLog ? lastLog.hash : '0'.repeat(64);

        const currentHash = await this.generateHash({
            action,
            entityType,
            entityId,
            data,
            previousHash,
            timestamp: new Date()
        });

        const log = new BlockchainLog({
            action,
            entityType,
            entityId,
            hash: currentHash,
            previousHash,
            timestamp: new Date()
        });

        await log.save();
        return currentHash;
    }

    static async getAuditTrail(entityId: string) {
        return await BlockchainLog.find({ entityId }).sort({ timestamp: 1 });
    }
}
