import { Module } from "@nestjs/common";
import { CustomerModule } from "../customers/CustomerModule";
import { VehicleController } from "./controllers/VehicleController";
import { VehicleRepository } from "./repositories/VehicleRepository";
import { VehicleService } from "./services/VehicleService";

@Module({
  imports: [CustomerModule],
  controllers: [VehicleController],
  providers: [VehicleService, VehicleRepository],
  exports: [VehicleService],
})
export class VehicleModule {}
