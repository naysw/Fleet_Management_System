import { Module } from "@nestjs/common";
import { RoleModule } from "../roles/RoleModule";
import { UserController } from "./controllers/UserController";
import { UserRepository } from "./repositories/UserRepository";
import { UserService } from "./services/UserService";

@Module({
  imports: [RoleModule],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService, UserRepository],
})
export class UserModule {}
