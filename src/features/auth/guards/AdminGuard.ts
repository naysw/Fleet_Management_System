import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const { user } = context.switchToHttp().getRequest<{ user: any }>();

    if (!user) throw new UnauthorizedException();

    /**
     * check user has role
     *
     * @param roles array of roles
     * @param roleName string
     * @returns
     */
    function hasRole(roles: { name: string }[], roleName: string) {
      return roles.some((r) => r.name === roleName);
    }

    return user && user.roles && hasRole(user.roles, "ADMIN");
  }
}
