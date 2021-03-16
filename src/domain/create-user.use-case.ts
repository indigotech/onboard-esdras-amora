import * as crypto from 'crypto';
import { Service } from 'typedi';
import { UserDbDataSource } from '../data/sources/user.db.datasource';
import { UserInputModel } from './model';

@Service()
export class CreateUserUseCase {
  constructor(private datasource: UserDbDataSource) {}

  async exec(input: UserInputModel): Promise<string> {
    const sameEmailUser = await this.datasource.findOneByEmail(input.email);

    if (sameEmailUser) {
      return 'error';
    }
    const hashedPassword = this.generateHash(input.password);

    await this.datasource.insert({ ...input, password: hashedPassword });

    return 'success';
  }

  private generateHash(value: string): string {
    return crypto.createHash('sha256').update(value).digest('base64');
  }
}
