type IPrismaCodeMapper = Record<
  number,
  { statusCode: number; customMessage?: string }
>;

interface HttpExceptionDetails {
  statusCode: number;
  errorMessage: string;
  details?: any;
}
