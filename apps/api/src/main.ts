import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from './config';
import { GlobalErrorHandler } from './exceptions/global.error.handler';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({ origin: '*' });
  app.useGlobalFilters(new GlobalErrorHandler());

  await app.listen(config.SERVER_PORT, () =>
    Logger.log(`Server running on port ${config.SERVER_PORT}`),
  );
}
bootstrap();
