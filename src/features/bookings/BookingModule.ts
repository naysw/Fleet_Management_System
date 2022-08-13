import { Module } from '@nestjs/common';
import { CustomerModule } from '../customers/CustomerModule';
import { BookingController } from './controllers/BookingController';
import { BookingRepository } from './repositories/BookingRepository';
import { BookingService } from './services/BookingService';

@Module({
  imports: [CustomerModule],
  controllers: [BookingController],
  providers: [BookingService, BookingRepository],
})
export class BookingModule {}
