import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookingModule } from './features/bookings/BookingModule';
import { CustomerModule } from './features/customers/CustomerModule';
import { ServiceModule } from './features/services/ServiceModule';
import { GlobalModule } from './GlobalModule';

@Module({
  imports: [GlobalModule, CustomerModule, BookingModule, ServiceModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
