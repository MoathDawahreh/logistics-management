import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Shipment, ShipmentDocument } from './shipment.schema';
import { DeliveryRoute, ShipmentDto } from './dto';
import { ProducerService } from '../kafka/producer.service';
// import { ConsumerService } from '../kafka/consumer.service';

@Injectable()
export class ShipmentService  {
  constructor(
    @InjectModel(Shipment.name) private shipmentModel: Model<ShipmentDocument>,
    private readonly producerService: ProducerService,
    // private readonly consumerService: ConsumerService,
  ) {}

  async createShipment(
    shipmentData: ShipmentDto,
    userId: string,
  ): Promise<Shipment> {
    const createdShipment = new this.shipmentModel({
      ...shipmentData,
      user: userId,
    });
    return createdShipment.save();
  }

  async updateShipment(
    shipmentId: string,
    updateData: ShipmentDto,
  ): Promise<Shipment> {
    const updatedShipment = await this.shipmentModel.findByIdAndUpdate(
      shipmentId,
      updateData,
      { new: true },
    );

    await this.producerService.produce({
      topic: 'shipment-updates',
      messages: [{ value: JSON.stringify(updatedShipment) }],
    });

    return updatedShipment;
  }

  async getShipmentById(shipmentId: string): Promise<Shipment> {
    const shipment = await this.shipmentModel
      .findById(shipmentId)
      .populate('user');
    if (!shipment) {
      throw new NotFoundException('Shipment not found');
    }
    return shipment;
  }

  async deleteShipment(shipmentId: string): Promise<void> {
    await this.shipmentModel.findByIdAndDelete(shipmentId);
  }

  async getUserShipments(userId: string): Promise<Shipment[]> {
    return this.shipmentModel.find({ user: userId }).populate('user').exec();
  }
  // async onModuleInit() {
  //   await this.consumerService.consume(
  //     {
  //       topics: ['shipment-updates'],
  //     },
  //     {
  //       eachMessage: async ({ topic, partition, message }) => {
  //         const shipmentUpdate = JSON.parse(message.value.toString());
  //         // Process the shipment update
  //         console.log('Received shipment update:', shipmentUpdate);
  //         // Possibly send the update to connected clients via WebSocket
  //       },
  //     },
  //   );
  // }

  async updateDeliveryRoute(
    shipmentId: string,
    deliveryRoute: DeliveryRoute,
  ): Promise<any> {}

  async getRealTimeShipmentUpdates(shipmentId: string): Promise<any> {}
}
