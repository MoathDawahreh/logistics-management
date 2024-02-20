import { Injectable } from '@nestjs/common';
import { ProducerService } from './modules/kafka/producer.service';

@Injectable()
export class AppService {
  constructor(private readonly producerService: ProducerService) {}
  async getHello(): Promise<string> {
    await this.producerService.produce({
      topic: 'test',
      messages: [{ value: 'Hello KafkaJS user!' }],
    });
    return "The server is up! Let's ROCK!";
  }
}
