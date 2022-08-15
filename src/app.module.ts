import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import Joi from "joi";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { DEVELOPMENT, PRODUCTION } from "./config/constants";
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
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env"],
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid(DEVELOPMENT, PRODUCTION)
          .required()
          .trim()
          .default(DEVELOPMENT),
      }),
    }),
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
