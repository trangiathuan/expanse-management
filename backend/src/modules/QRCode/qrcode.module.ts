import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QRCode, QRCodeSchema } from './qrcode.shema';
import { QRCodeService } from './qrcode.service';

import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CloudinaryService } from '../../common/services/cloudinary.service';
import { QRCodeController } from './qrcode.controller';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: QRCode.name, schema: QRCodeSchema }]),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: { expiresIn: '1d' },
            }),
            inject: [ConfigService],
        }),
    ],
    controllers: [QRCodeController],
    providers: [QRCodeService, CloudinaryService],
    exports: [MongooseModule],
})
export class QRCodeModule { }
