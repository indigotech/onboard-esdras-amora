import { Service } from 'typedi';
import { LoginResponse } from '@api/user/login.response';
import { CryptoService } from '@core/crypto.service';
import { UserDbDataSource } from '@data/sources/user.db.datasource';
import { LoginInputModel, UserTokenData } from '@domain/model';
import { ServerError } from '@core/error/base.error';
import { StatusCode } from '@core/error/error.type';
import { JwtService } from '@core/jwt.service';
import { LocalizationService } from '@core/localization';

@Service()
export class LoginUserUseCase {
  constructor(
    private readonly datasource: UserDbDataSource,
    private readonly cryptoService: CryptoService,
    private readonly jwtService: JwtService,
    private readonly locale: LocalizationService,
  ) {}

  async exec(input: LoginInputModel): Promise<LoginResponse> {
    const user = await this.datasource.findOneByEmail(input.email);

    if (!user) {
      throw new ServerError(StatusCode.BadRequest, this.locale.__('login.error.email-not-registered'));
    }

    const hashedPassword = this.cryptoService.generateHashWithSalt(input.password, user.salt);

    if (user.password !== hashedPassword) {
      throw new ServerError(StatusCode.BadRequest, this.locale.__('login.error.password-incorrect'));
    }

    return { ...user, token: this.jwtService.sign<UserTokenData>({ userId: user.id }, input.rememberMe) };
  }
}
