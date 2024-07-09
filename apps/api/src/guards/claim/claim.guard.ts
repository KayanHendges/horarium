import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class ClaimGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(_context: ExecutionContext): boolean {
    return true;
  }
}
