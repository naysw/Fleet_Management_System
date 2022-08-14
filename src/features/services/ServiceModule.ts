import { Module } from "@nestjs/common";
import { ServiceController } from "./controllers/ServiceController";
import { ServiceRepository } from "./repositories/ServiceRepository";
import { ServiceService } from "./services/ServiceService";

@Module({
  controllers: [ServiceController],
  providers: [ServiceService, ServiceRepository],
  exports: [ServiceService],
})
export class ServiceModule {}
