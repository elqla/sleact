import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

const getEnv = async () => {
  // axios.get(/비밀키 요청)
  return {
    DB_PASSWORD: 'nodejsbook',
    NAME: '제로초바보',
  };
};
@Module({
  // forRoot등 안에 설정을 넣어주어야함.
  imports: [ConfigModule.forRoot({ isGlobal: true, load: [getEnv] })],
  controllers: [AppController],
  providers: [AppService, ConfigService],
})
export class AppModule {}
