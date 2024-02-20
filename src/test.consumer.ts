import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConsumerService } from './modules/kafka/consumer.service';

@Injectable()
export class TestConsumer implements OnModuleInit {
  constructor(private readonly consumerService: ConsumerService) {}
  async onModuleInit() {
    await this.consumerService.consume(
      {
        topics: ['test'],
      },
      {
        eachMessage: async ({ topic, partition, message }) => {
          console.log({
            value: message.value.toString(),
            topic,
            partition,
          });
        },
      },
      'test',
    );
    return 'hello its me ------------>';
  }
}
