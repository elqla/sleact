import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';

@Module({
  providers: [EventsGateway],
  exports: [EventsGateway], // module import 시 provider도 쓰려면 export 추가
})
export class EventsModule {}
