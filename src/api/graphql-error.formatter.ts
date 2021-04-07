import { GraphQLFormattedError, formatError, GraphQLError } from 'graphql';
import { isServerError, ServerError } from '@core/error/base.error';
import { ArgumentValidationError } from 'type-graphql';
import { StatusCode } from '@core/error';

interface FormatedServerError extends GraphQLFormattedError {
  code?: number;
  name?: string;
  additionalInfo?: string;
}

export const errorFormatter = (error: GraphQLError) => {
  let data: FormatedServerError = formatError(error);
  const originalError = error.originalError as ServerError | ArgumentValidationError;

  if (isServerError(error.originalError)) {
    const serverError = originalError as ServerError;
    data = {
      ...data,
      code: serverError.code,
      name: serverError.name,
      message: serverError.message,
      additionalInfo: serverError.additionalInfo,
    };
  } else if (originalError instanceof ArgumentValidationError) {
    data = {
      ...data,
      code: StatusCode.BadRequest,
      name: originalError.name,
      message: originalError.message,
    };
  }
  return data;
};
