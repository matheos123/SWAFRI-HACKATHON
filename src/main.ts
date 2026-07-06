import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import compression from 'compression';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { AppLogger } from './common/logger/app.logger';

async function bootstrap() {
  process.on('uncaughtException', (error) => {
    console.error('UncaughtException:', error);
    process.exit(1);
  });

  process.on('unhandledRejection', (reason) => {
    console.error('UnhandledRejection:', reason);
    process.exit(1);
  });

  const app = await NestFactory.create(AppModule, {
    logger: new AppLogger(),
    bufferLogs: true,
  });

  app.use(helmet());
  app.enableCors();
  app.use(compression());
  app.setGlobalPrefix('api');
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });
  app.enableShutdownHooks();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3000;

  const config = new DocumentBuilder()
    .setTitle('Web3 Battle Arena')
    .setDescription('Backend foundation for Web3 Battle Arena')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(port);
  console.log(`Application is running on http://localhost:${port}/api`);
}

bootstrap().catch((error) => {
  console.error('Bootstrap error:', error);
  process.exit(1);
});
