import { Module } from '@nestjs/common';
import { ShipmentController } from './shipment.controller';
import { ShipmentService } from './shipment.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ShipmentSchema } from './shipment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Shipment', schema: ShipmentSchema }]),
  ],
  controllers: [ShipmentController],
  providers: [ShipmentService],
})
export class ShipmentsModule {}
