import { VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';
import cors from './config/cors';

(async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.use(cookieParser());
  app.enableCors(cors);
  app.use(compression());
  app.use(helmet());

  const PORT = process.env.PORT || 3002;

  await app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
})();
