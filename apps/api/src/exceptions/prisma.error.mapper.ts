import { HttpStatus } from '@nestjs/common';
import { Prisma } from '@repo/db';

const { BAD_REQUEST, NOT_FOUND, CONFLICT } = HttpStatus;

const prismaCodeMapper: IPrismaCodeMapper = {
  2000: { statusCode: BAD_REQUEST },
  2001: { statusCode: NOT_FOUND },
  2002: { statusCode: CONFLICT },
  2003: { statusCode: BAD_REQUEST },
  2005: { statusCode: BAD_REQUEST },
  2006: { statusCode: BAD_REQUEST },
  2011: { statusCode: BAD_REQUEST },
  2012: { statusCode: BAD_REQUEST },
  2013: { statusCode: BAD_REQUEST },
  2014: { statusCode: BAD_REQUEST },
  2020: { statusCode: BAD_REQUEST },
  2023: { statusCode: BAD_REQUEST },
  2025: { statusCode: NOT_FOUND },
  2033: { statusCode: BAD_REQUEST },
};

const httpMessageMapper: Record<number, string> = {
  [BAD_REQUEST]: 'Bad Request',
  [NOT_FOUND]: 'Not Found',
  [CONFLICT]: 'Conflict',
};

export const prismaExceptionFilter = (
  exception: Prisma.PrismaClientKnownRequestError,
): HttpExceptionDetails => {
  const { code } = exception;

  const [extractedCode] = code.match(/\d+/g) || [];
  const numberCode = Number(extractedCode);
  const prismaCode = prismaCodeMapper[numberCode];

  if (!prismaCode)
    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      errorMessage: 'Internal Erro',
    };

  const { statusCode, customMessage } = prismaCode;

  return {
    statusCode,
    errorMessage:
      customMessage || httpMessageMapper[statusCode] || 'Internal Error',
  };
};
