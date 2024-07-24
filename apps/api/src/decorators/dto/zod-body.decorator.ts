import { ZodValidationPipe } from '@/pipes/zodValidationPipe';
import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import z from 'zod';

export const RequestBody = createParamDecorator(
  (_: any, ctx: ExecutionContext) => ctx.switchToHttp().getRequest().body,
);

export const ZodBody = <T extends z.ZodObject<any>>(schema: T) =>
  RequestBody(new ZodValidationPipe(schema));
