import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TotalMoneyDocument = TotalMoney & Document;

@Schema()
export class TotalMoney {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    userId: string;

    @Prop({ required: true })
    total: number;
}
export const TotalMoneySchema = SchemaFactory.createForClass(TotalMoney);
