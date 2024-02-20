import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Shipment, ShipmentDocument } from './shipment.schema';
import { ShipmentDto } from './dto';
import { ProducerService } from '../kafka/producer.service';

@Injectable()
export class ShipmentService {
  constructor(
    @InjectModel(Shipment.name) private shipmentModel: Model<ShipmentDocument>,
    private readonly producerService: ProducerService,
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
    const shipment = (await this.getShipmentById(
      shipmentId,
    )) as ShipmentDocument;
    Object.assign(shipment, updateData);
    return shipment.save();
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

  async updatedeliveryRoute(
    shipmentId: string,
    updateData: ShipmentDto,
  ): Promise<Shipment> {
    const shipment = (await this.getShipmentById(
      shipmentId,
    )) as ShipmentDocument;
    Object.assign(shipment, updateData);

    await this.producerService.produce({
      topic: 'test',
      messages: [
        {
          key: shipmentId,
          value: 'Hello its moath.. ', //JSON.stringify(shipment),
        },
      ],
    });
    return shipment.save();
  }
}
