import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class ShipmentTrackingGateway {
  @WebSocketServer() server: Server;

  //   constructor(private readonly kafkaService: KafkaService) {}

  handleShipmentLocationUpdate(update: any) {
    this.server.emit('shipment-location-update', update);
  }

  async subscribeToShipmentLocationUpdates() {}
}
