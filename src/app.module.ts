import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CustomerModule } from './features/customers/CustomerModule';
import { GlobalModule } from './GlobalModule';

@Module({
  imports: [GlobalModule, CustomerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
