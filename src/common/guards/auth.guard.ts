import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ROLES_KEY } from '../decorators/auth.decorator';

/**
 * AuthGuard that validates JWT and checks if the user has the required roles.
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Extract roles required from @Roles decorator
    const roles = this.reflector.get<string[]>(ROLES_KEY, context.getHandler());

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers?.authorization;

    // Extract token from 'Bearer <token>'
    const token = authHeader?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Token not provided');
    }

    let decoded: any;

    try {
      // Verify and decode JWT
      decoded = await this.jwtService.verifyAsync(token);
      request.user = decoded; // Attach decoded user to request
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    // Check if user has one of the required roles
    if (roles && !roles.some((role) => decoded.roles?.includes(role))) {
      throw new ForbiddenException('Insufficient role');
    }

    return true;
  }
}
