import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { ActivityLogRepository } from "src/repositories/ActivityLogRepository";
import { ActivityLogService } from "src/services/ActivityLogService";
import { UserModule } from "../users/UserModule";
import { ACCESS_TOKEN_SECRET, TOKEN_EXPIRES_IN } from "./config/auth";
import { LoginController } from "./controllers/LoginController";
import { JwtStrategy } from "./JwtStrategy";

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: ACCESS_TOKEN_SECRET,
      signOptions: {
        expiresIn: TOKEN_EXPIRES_IN,
      },
    }),
    UserModule,
  ],
  controllers: [LoginController],
  providers: [JwtStrategy, ActivityLogService, ActivityLogRepository],
})
export class AuthModule {}
