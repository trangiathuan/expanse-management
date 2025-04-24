// src/config/mongoose.config.ts
import { ConfigService } from '@nestjs/config';
import { MongooseModuleFactoryOptions } from '@nestjs/mongoose';

export const getMongoConfig = async (configService: ConfigService): Promise<MongooseModuleFactoryOptions> => {
    return {
        uri: configService.get<string>('MONGO_URI'),
        autoCreate: true,
        retryAttempts: 5,
        retryDelay: 2000,
    };
};