import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User, UserSchema } from '../users/user.shema';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { ExpenserModule } from '../expense/expense.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        PassportModule,
        ExpenserModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: { expiresIn: '30d' },
            }),
            inject: [ConfigService],
        }),
    ],
    providers: [UserService, JwtStrategy],
    controllers: [UserController],
})
export class UserModule { }