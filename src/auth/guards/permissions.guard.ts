import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
// import { ROLES_KEY,  } from '../../common/decorators';
import { ROLES_KEY } from '../../common/decorators/roles.decorator';
import { PERMISSIONS_KEY } from '../../common/decorators/permissions.decorator';
import { User } from '../../users/user.entity';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>(
      ROLES_KEY,
      context.getHandler(),
    );
    const requiredPermissions = this.reflector.get<string[]>(
      PERMISSIONS_KEY,
      context.getHandler(),
    );

    const request = context.switchToHttp().getRequest();
    const user: User = request.user;

    if (!requiredRoles && !requiredPermissions) {
      return true;
    }

    const hasRole = requiredRoles
      ? user.roles.some((role) => requiredRoles.includes(role.name))
      : false;

    const hasPermission = requiredPermissions
      ? user.roles.some((role) =>
          role.permissions.some((permission) =>
            requiredPermissions.includes(permission.name),
          )
        )
      : false;

    if (!hasRole || !hasPermission) {
      throw new ForbiddenException(
        'You do not have the necessary permissions or roles.',
      );
    }

    return true;
  }
}
