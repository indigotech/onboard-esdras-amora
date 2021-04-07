import { AuthChecker } from 'type-graphql';
import Container from 'typedi';
import { ServerError, StatusCode } from '@core/error';
import { LocalizationService } from '@core/localization';
import { ServerContext } from './server.context';

export const AuthorizationMiddleware: AuthChecker<ServerContext> = async (data) => {
  const locale = Container.get(LocalizationService);

  if (!data.context?.userId) {
    throw new ServerError(StatusCode.Unauthorized, locale.__('global.error.unauthorized'));
  }

  return true;
};
