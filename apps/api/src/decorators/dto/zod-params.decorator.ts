import { ZodValidationPipe } from '@/pipes/zodValidationPipe';
import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import z from 'zod';

export const RequestParams = createParamDecorator(
  (_: any, ctx: ExecutionContext) => ctx.switchToHttp().getRequest().params,
);

export const ZodParams = <T extends z.ZodObject<any>>(schema: T) =>
  RequestParams(new ZodValidationPipe(schema));
