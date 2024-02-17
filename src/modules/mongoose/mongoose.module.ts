import { Module } from '@nestjs/common';
import { MongooseController } from './mongoose.controller';
import { MongooseService } from './mongoose.service';

@Module({
  controllers: [MongooseController],
  providers: [MongooseService]
})
export class MongooseModule {}
