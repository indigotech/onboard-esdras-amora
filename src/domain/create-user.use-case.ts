import { Service } from 'typedi';
import { CryptoService } from '@core/crypto.service';
import { UserDbDataSource } from '@data/sources/user.db.datasource';
import { UserInputModel } from '@domain/model';
import { ServerError } from '@core/error/base.error';
import { StatusCode } from '@core/error/error.type';
import { PasswordValidator } from '@api/user/password.validator';

@Service()
export class CreateUserUseCase {
  constructor(
    private readonly datasource: UserDbDataSource,
    private readonly cryptoService: CryptoService,
    private readonly passwordValidator: PasswordValidator,
  ) {}

  async exec(input: UserInputModel) {
    this.passwordValidator.validate(input.password);

    const sameEmailUser = await this.datasource.findOneByEmail(input.email);

    if (sameEmailUser) {
      throw new ServerError(StatusCode.BadRequest, 'this email already exists');
    }

    const salt = this.cryptoService.generateRandomPassword();

    const hashedPassword = this.cryptoService.generateHashWithSalt(input.password, salt);

    return this.datasource.insert({ ...input, salt, password: hashedPassword });
  }
}
