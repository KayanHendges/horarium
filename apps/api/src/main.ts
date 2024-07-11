import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { GlobalErrorHandler } from './exceptions/global.error.handler';
import { config } from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({ origin: '*' });

  app.useGlobalFilters(new GlobalErrorHandler());

  await app.listen(config.SERVER_PORT, () =>
    Logger.log(`Server running on port ${config.SERVER_PORT}`),
  );
}
bootstrap();
