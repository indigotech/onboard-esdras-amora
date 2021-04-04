import * as Faker from 'faker';
import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { CryptoService } from '@core/crypto.service';
import { UserEntity } from '@data/db/entities';

@Service()
export class UserSeed {
  constructor(
    @InjectRepository(UserEntity) private readonly dbOrmRepository: Repository<UserEntity>,
    private readonly cryptoService: CryptoService,
  ) {}

  exec(amount = 50) {
    const users = new Array(amount).fill(0).map(() => {
      const fakeUser = new UserEntity();
      fakeUser.name = Faker.name.findName();
      fakeUser.email = Faker.internet.email();
      fakeUser.salt = this.cryptoService.generateRandomPassword();
      fakeUser.password = this.cryptoService.generateHashWithSalt('1234qwer', fakeUser.salt);
      return fakeUser;
    });

    return this.dbOrmRepository.save(users);
  }
}
