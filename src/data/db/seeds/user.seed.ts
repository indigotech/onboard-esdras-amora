import * as Faker from 'faker';
import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { CryptoService } from '@core/crypto.service';
import { UserEntity } from '@data/db/entities';
import { AddressSeed } from './address.seed';

@Service()
export class UserSeed {
  constructor(
    @InjectRepository(UserEntity) private readonly dbOrmRepository: Repository<UserEntity>,
    private readonly cryptoService: CryptoService,
    private readonly addressSeed: AddressSeed,
  ) {}

  async exec(amount = 50, base: Partial<UserEntity> = {}) {
    const arr = new Array(amount).fill(0);
    const users = await Promise.all(
      arr.map(async () => {
        const fakeUser = this.dbOrmRepository.create({
          name: Faker.name.findName(),
          email: Faker.internet.email(),
          salt: this.cryptoService.generateRandomPassword(),
          addresses: await this.addressSeed.exec(Faker.datatype.number({ min: 0, max: 2 })),
          ...base,
        });

        fakeUser.password = this.cryptoService.generateHashWithSalt('1234qwer', fakeUser.salt);

        return fakeUser;
      }),
    );

    return this.dbOrmRepository.save(users);
  }
}
