import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../user/user.schema';
import { ShipmentStatus } from './enum';

export type ShipmentDocument = Shipment & Document;

@Schema()
export class Shipment {
  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;

  @Prop({ required: true })
  origin: string;

  @Prop({ type: [{ latitude: Number, longitude: Number }], default: [] })
  deliveryRoute: { latitude: number; longitude: number }[];

  @Prop({ required: true })
  destination: string;

  @Prop({ required: true, default: 'Standard'})
  deliveryPreferences: string;

  @Prop({ enum: ShipmentStatus, default: ShipmentStatus.PENDING })
  status: ShipmentStatus;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  user: User;
}

export const ShipmentSchema = SchemaFactory.createForClass(Shipment);

ShipmentSchema.pre<ShipmentDocument>('updateOne', function (next) {
  this.set({ updatedAt: new Date() });
  next();
});
