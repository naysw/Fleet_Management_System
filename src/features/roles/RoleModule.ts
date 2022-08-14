import { Module } from "@nestjs/common";
import { RoleRepository } from "./repositories/RoleRepository";
import { RoleService } from "./services/RoleService";

@Module({
  imports: [],
  providers: [RoleService, RoleRepository],
  exports: [RoleService],
})
export class RoleModule {}
