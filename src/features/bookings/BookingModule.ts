import { Module } from "@nestjs/common";
import { CustomerModule } from "../customers/CustomerModule";
import { ServiceModule } from "../services/ServiceModule";
import { VehicleModule } from "../vehicles/VehicleModule";
import { BookingController } from "./controllers/BookingController";
import { BookingRepository } from "./repositories/BookingRepository";
import { BookingService } from "./services/BookingService";

@Module({
  imports: [CustomerModule, VehicleModule, ServiceModule],
  controllers: [BookingController],
  providers: [BookingService, BookingRepository],
  exports: [BookingService],
})
export class BookingModule {}
