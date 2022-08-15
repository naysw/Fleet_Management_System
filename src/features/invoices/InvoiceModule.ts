import { Module } from "@nestjs/common";
import { BookingModule } from "../bookings/BookingModule";
import { CustomerModule } from "../customers/CustomerModule";
import { InvoiceController } from "./controllers/InvoiceController";
import { InvoiceRepository } from "./repositories/InvoiceRepository";
import { InvoiceService } from "./services/InvoiceService";

@Module({
  imports: [CustomerModule, BookingModule],
  controllers: [InvoiceController],
  providers: [InvoiceService, InvoiceRepository],
  exports: [],
})
export class InvoiceModule {}
