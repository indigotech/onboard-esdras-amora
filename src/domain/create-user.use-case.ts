import * as crypto from 'crypto';
import { Service } from 'typedi';
import { CryptoService } from '@core/crypto.service';
import { UserDbDataSource } from '@data/sources/user.db.datasource';
import { UserInputModel } from '@domain/model';

@Service()
export class CreateUserUseCase {
  constructor(private readonly datasource: UserDbDataSource, private readonly cryptoService: CryptoService) {}

  async exec(input: UserInputModel) {
    const sameEmailUser = await this.datasource.findOneByEmail(input.email);

    if (sameEmailUser) {
      throw new Error('this email already exists');
    }

    const salt = this.cryptoService.generateRandomPassword();

    const hashedPassword = this.cryptoService.generateHashWithSalt(input.password, salt);

    return this.datasource.insert({ ...input, salt, password: hashedPassword });
  }

  private generateHash(value: string): string {
    return crypto.createHash('sha256').update(value).digest('base64');
  }
}
