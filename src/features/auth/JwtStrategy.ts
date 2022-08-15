import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { JwtPayload } from "jsonwebtoken";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserService } from "../users/services/UserService";
import { ACCESS_TOKEN_SECRET } from "./config/auth";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: ACCESS_TOKEN_SECRET,
    });
  }

  /**
   * return user after validate
   *
   * @param payload JwtPayload
   * @returns Promise<User>
   */
  async validate(payload: JwtPayload): Promise<any> {
    console.log(payload.sub);

    try {
      return await this.userService.findByIdOrFail(payload.sub);
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
