import { VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';

(async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableVersioning({
    type: VersioningType.URI,
  });

  const PORT = process.env.PORT || 3002;

  await app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
})();
