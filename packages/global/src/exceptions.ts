export interface APIException {
  readonly path: string;
  readonly time: string;
  readonly statusCode: number;
  readonly message: string;
  readonly details: any;
}
