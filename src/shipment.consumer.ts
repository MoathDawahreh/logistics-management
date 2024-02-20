import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConsumerService } from './modules/kafka/consumer.service';

@Injectable()
export class ShipmentConsumer implements OnModuleInit {
  constructor(private readonly consumerService: ConsumerService) {}
  async onModuleInit() {
    await this.consumerService.consume(
      {
        topics: ['shipment-updates'],
      },
      {
        eachMessage: async ({ topic, partition, message }) => {
          const shipmentUpdate = JSON.parse(message.value.toString());
          console.log('Received shipment update:', shipmentUpdate);

          console.log({
            value: message.value.toString(),
            topic,
            partition,
          });
          // TODO?: send the update to connected clients via WebSocket
        },
      },
      'shipment-updates',
    );
    return 'hello its me ------------>';
  }
}
