import { ErrorType, StatusCode } from './error.type';

export const BaseErrorToken = Symbol();
export class ServerError extends Error {
  [BaseErrorToken] = true;
  code: ErrorType | StatusCode;
  additionalInfo?: string;

  constructor(type: ErrorType | StatusCode, message: string, additionalInfo?: string) {
    super(message);

    this.code = type;
    this.name = ErrorType[type];
    this.message = message;
    this.additionalInfo = additionalInfo;
  }
}

export function isServerError(error: any): error is ServerError {
  return error?.[BaseErrorToken] ?? false;
}
