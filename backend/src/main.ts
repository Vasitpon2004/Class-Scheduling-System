import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //เพื่อให้อนุญาตให้เว็บไซต์หรือแอปพลิเคชันจากเว็บอื่นสามารถส่งRequestและรับข้อมูลจากserverของเราได้
  app.enableCors({ origin: 'http://localhost:5173', Credential: true });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true
    }),
  );
  const config = new DocumentBuilder()
    .setTitle('Test API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  SwaggerModule.setup('api', app, SwaggerModule.createDocument(app, config));
  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
