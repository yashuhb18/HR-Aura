import mongoose, { Schema, Document } from 'mongoose';

export interface IBlockchainLog extends Document {
    action: string;
    entityType: string;
    entityId: string;
    hash: string;
    previousHash: string;
    timestamp: Date;
}

const BlockchainLogSchema: Schema = new Schema({
    action: { type: String, required: true },
    entityType: { type: String, required: true },
    entityId: { type: String, required: true },
    hash: { type: String, required: true },
    previousHash: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

export default mongoose.model<IBlockchainLog>('BlockchainLog', BlockchainLogSchema);
