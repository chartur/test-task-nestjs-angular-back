import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../../entities/user.entity';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return false;
    }

    const admin = this.jwtService.verify<UserEntity>(token);

    if (!admin) {
      return false;
    }

    request['user'] = admin;
    return true;
  }
}
