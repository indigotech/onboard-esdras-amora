import { Service } from 'typedi';
import { UserDbDataSource } from '@data/sources/user.db.datasource';
import { ServerError } from '@core/error/base.error';
import { StatusCode } from '@core/error/error.type';
import { LocalizationService } from '@core/localization';

@Service()
export class GetUserUseCase {
  constructor(private readonly datasource: UserDbDataSource, private readonly locale: LocalizationService) {}

  async exec(id: string) {
    const user = await this.datasource.findOneById(id);

    if (!user) {
      throw new ServerError(StatusCode.NotFound, this.locale.__('get-user.error.not-found'));
    }

    return user;
  }
}
