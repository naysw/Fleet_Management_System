import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { BookingModule } from "./features/bookings/BookingModule";
import { CustomerModule } from "./features/customers/CustomerModule";
import { ServiceModule } from "./features/services/ServiceModule";
import { VehicleModule } from "./features/vehicles/VehicleModule";
import { GlobalModule } from "./GlobalModule";

@Module({
  imports: [
    GlobalModule,
    CustomerModule,
    BookingModule,
    ServiceModule,
    VehicleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
