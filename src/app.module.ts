import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./features/auth/AuthModule";
import { BookingModule } from "./features/bookings/BookingModule";
import { CustomerModule } from "./features/customers/CustomerModule";
import { InvoiceModule } from "./features/invoices/InvoiceModule";
import { ServiceModule } from "./features/services/ServiceModule";
import { UserModule } from "./features/users/UserModule";
import { VehicleModule } from "./features/vehicles/VehicleModule";
import { GlobalModule } from "./GlobalModule";

@Module({
  imports: [
    GlobalModule,
    UserModule,
    CustomerModule,
    BookingModule,
    ServiceModule,
    VehicleModule,
    AuthModule,
    InvoiceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
