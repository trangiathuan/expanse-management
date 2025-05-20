import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type QRCodeDocument = QRCode & Document;

@Schema()
export class QRCode {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    userId: Types.ObjectId;

    @Prop({ type: String, required: true })
    url: string;

    @Prop({ default: () => new Date() })
    createdAt: Date;
}

export const QRCodeSchema = SchemaFactory.createForClass(QRCode);