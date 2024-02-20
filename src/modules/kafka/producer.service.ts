// kafka.service.ts

import {
  Injectable,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import { Kafka, Producer, Consumer, ProducerRecord } from 'kafkajs';
import { kafkaConfig } from '../../config/kafka.config';

@Injectable()
export class ProducerService implements OnModuleInit, OnApplicationShutdown {
  private kafka: Kafka;
  private producer: Producer;
  private consumer: Consumer;

  constructor() {
    this.kafka = new Kafka({
      brokers: ['localhost:9092'],
    });
    this.producer = this.kafka.producer();
    // this.consumer = this.kafka.consumer({ groupId: 'shipment-tracking-group' });
  }

  async onModuleInit() {
    await this.producer.connect();
  }

  async produce(record: ProducerRecord) {
    await this.producer.send(record);
  }

  async onApplicationShutdown() {
    await this.producer.disconnect();
  }
}
