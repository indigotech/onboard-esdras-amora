import { GraphQLFormattedError, formatError, GraphQLError } from 'graphql';
import { isServerError, ServerError } from '@core/error/base.error';

interface FormatedServerError extends GraphQLFormattedError {
  code?: number;
  name?: string;
  additionalInfo?: string;
}

export const errorFormatter = (error: GraphQLError) => {
  let data: FormatedServerError = formatError(error);
  const originalError = error.originalError as ServerError;

  if (isServerError(error.originalError)) {
    data = {
      ...data,
      code: originalError.code,
      name: originalError.name,
      message: originalError.message,
      additionalInfo: originalError.additionalInfo,
    };
  }

  return data;
};
