// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService); // Lấy ConfigService instance
  const port = configService.get('PORT') || 8888;

  app.enableCors({
    origin: '*', // hoặc true nếu muốn cho tất cả
    credentials: true, // nếu có dùng cookie, JWT trong header,...
  });

  await app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 Server running port ${port}`);
  });
}
bootstrap();