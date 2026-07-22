import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { User } from 'src/auth/entities/user.entity';
import { ValidRoles } from 'src/auth/interfaces/valid-roles';

@Injectable()
export class YourselfOrAdminGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    const user: User = req.user;
    if (user.roles.includes(ValidRoles.admin)) {
      return true;
    }
    const partsEndpoint = req.url.split('/');
    if (user.id === (partsEndpoint[partsEndpoint.length - 1])) {
      return true;
    }
    throw new ForbiddenException(`A user can only be accessed by themselves or by an administrator.`);
  }
}
