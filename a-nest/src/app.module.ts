import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { UsersModule } from './users/users.module';
import { DmsModule } from './dms/dms.module';
import { ChannelsModule } from './channels/channels.module';
import { WorkspacesModule } from './workspaces/workspaces.module';
import { TypeOrmModule } from '@nestjs/typeorm';

const getEnv = async () => {
  // axios.get(/비밀키 요청)
  return {
    DB_PASSWORD: 'nodejsbook',
    NAME: '제로초바보',
  };
};
@Module({
  // forRoot등 안에 설정을 넣어주어야함.
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule,
    DmsModule,
    ChannelsModule,
    WorkspacesModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      // username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: ['entities/*.ts'],
      // autoLoadEntities: true,
      // getManager로 row query날릴 수 있음. active record vs reference?
      synchronize: true, // db로 보낼때 -> 그 후 false
      logging: true, // ORM 맹신하지말고, loggin해서 orm이 어떤 sql로 쿼리를 날렸는지
      keepConnectionAlive: true, // hotreloading 시 디비연결 끊겼다고 하기때문에 켜야함.
      charset: 'utf8mb4', // 이모티콘도 써야해서
    }),
    // TypeOrmModule.forFeature([]) entities 넣어줄 것.
  ], // ENV load: [getEnv]
  controllers: [AppController],
  providers: [AppService, ConfigService],
  // 원래 .. providers: [{
  //  provide: AppService, (고유한 키)
  //  useClass: AppService (useValue 또는 class) // 이렇게 원하는 의존성 주입을 해줄 수 있음
  // }],
  //  useFactory:() => {} // 이런것도 있음. 등..
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
