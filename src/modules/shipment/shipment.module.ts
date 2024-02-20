import { Module } from '@nestjs/common';
import { ShipmentController } from './shipment.controller';
import { ShipmentService } from './shipment.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ShipmentSchema } from './shipment.schema';
// import { ShipmentTrackingGateway } from './shipment.gateway';
import { ProducerService } from '../kafka/producer.service';
import { ConsumerService } from '../kafka/consumer.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Shipment', schema: ShipmentSchema }]),
  ],
  controllers: [ShipmentController],
  providers: [ShipmentService, ProducerService, ConsumerService],
  // exports: [ShipmentTrackingGateway],
})
export class ShipmentsModule {}
