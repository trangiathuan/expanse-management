import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { getMongoConfig } from './config/mongoose.config';
import { UserModule } from './modules/users/user.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { ExpenserModule } from './modules/expense/expense.module';
import { QRCodeModule } from './modules/QRCode/qrcode.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getMongoConfig,
    }),
    UserModule,
    ExpenserModule,
    QRCodeModule
  ],
})
export class AppModule {
  configure(consumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
