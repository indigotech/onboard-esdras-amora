import { Resolver, Query, Ctx } from 'type-graphql';
import { ServerError, StatusCode } from '@core/error';
import { ServerContext } from '../server.context';
import { LocalizationService } from '@core/localization';

@Resolver()
export class HelloResolver {
  constructor(private readonly locale: LocalizationService) {}

  @Query(() => String)
  hello(@Ctx() context: ServerContext): string {
    if (!context.userId) {
      throw new ServerError(StatusCode.Unauthorized, this.locale.__('user.error.invalid-jwt'));
    }
    return 'Hello World';
  }
}
