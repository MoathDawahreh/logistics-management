import {
  Injectable,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import {
  Kafka,
  Producer,
  Consumer,
  ProducerRecord,
  ConsumerSubscribeTopics,
  ConsumerRunConfig,
} from 'kafkajs';
@Injectable()
export class ConsumerService implements OnApplicationShutdown {
  private kafka: Kafka;
  private consumers: Consumer[] = [];

  constructor() {
    this.kafka = new Kafka({
      brokers: ['localhost:9092'],
    });
  }

  async consume(topic: ConsumerSubscribeTopics, config: ConsumerRunConfig) {
    const consumer = this.kafka.consumer({
      groupId: 'shipment-tracking-group',
    });
    await consumer.connect();
    await consumer.subscribe(topic);
    await consumer.run(config);
    this.consumers.push(consumer);
  }

  async onApplicationShutdown() {
    await Promise.all(this.consumers.map((consumer) => consumer.disconnect()));
  }
}
