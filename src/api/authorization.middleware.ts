import { AuthChecker } from 'type-graphql';
import Container from 'typedi';
import { ServerError, StatusCode } from '../core/error';
import { LocalizationService } from '../core/localization';
import { ServerContext } from './server.context';

export const AuthorizationMiddleware: AuthChecker<ServerContext> = async (a) => {
  const locale = Container.get(LocalizationService);
  const userId = a;

  if (!userId) {
    throw new ServerError(StatusCode.Unauthorized, locale.__('global.error.unauthorized'));
  }

  return true;
};
