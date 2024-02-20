import { Injectable, OnModuleInit } from '@nestjs/common';
import e from 'express';
import { ConsumerService } from './modules/kafka/consumer.service';

@Injectable()
export class TestConsumer implements OnModuleInit {
  constructor(private readonly consumerService: ConsumerService) {}
  async onModuleInit() {
    console.log('TestConsumer onModuleInit');
    await this.consumerService.consume(
      { topics: ['test-topic'] },
      {
        eachMessage: async ({ topic, partition, message }) => {
          console.log({
            value: message.value.toString(),
            topic,
            partition,
          });
        },
      },
    );
  }
}
