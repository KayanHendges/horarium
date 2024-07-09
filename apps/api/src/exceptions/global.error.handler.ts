import { prismaExceptionFilter } from '@/exceptions/prisma.error.mapper';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Prisma } from '@repo/db';
import { APIException } from '@repo/global';

@Catch()
export class GlobalErrorHandler implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    const { errorMessage, statusCode, details } =
      this.getExceptionDetails(exception);

    const message =
      statusCode !== HttpStatus.INTERNAL_SERVER_ERROR
        ? errorMessage
        : 'Internal server error';

    const exceptionResponse: APIException = {
      path: request?.url || 'Unknown url.',
      time: new Date().toISOString(),
      message,
      statusCode,
      details,
    };

    this.logException(exception, exceptionResponse);

    return response
      .status(exceptionResponse.statusCode)
      .json(exceptionResponse);
  }

  private getExceptionDetails(exception: unknown): HttpExceptionDetails {
    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      const errorMessage =
        typeof response === 'string' ? response : exception.message;

      const details =
        typeof response === 'object' && (response as any).message
          ? (response as any).message
          : undefined;

      return {
        statusCode: exception.getStatus(),
        errorMessage,
        details: details != errorMessage ? details : undefined,
      };
    }

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      return prismaExceptionFilter(exception);
    }

    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      errorMessage: 'Internal server error',
    };
  }

  private logException(exception: unknown, exceptionResponse: APIException) {
    if (
      exception instanceof HttpException ||
      exception instanceof Prisma.PrismaClientKnownRequestError ||
      exception instanceof Prisma.PrismaClientUnknownRequestError
    ) {
      const { message, stack, name } = exception;
      return Logger.error({
        ...exceptionResponse,
        ...exception,
        name,
        message,
        stack,
      });
    }

    return Logger.error({ ...exceptionResponse, exception });
  }
}
