import { VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

(async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
  });

  const PORT = process.env.PORT || 3002;

  await app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
})();
