import * as Faker from 'faker';
import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { AddressEntity } from '@data/db/entities';

@Service()
export class AddressSeed {
  constructor(@InjectRepository(AddressEntity) private readonly dbOrmRepository: Repository<AddressEntity>) {}

  exec(amount = 2) {
    const users = new Array(amount).fill(0).map(() => {
      const fakeAddress = new AddressEntity();
      fakeAddress.cep = Faker.address.zipCode();
      fakeAddress.street = Faker.address.streetName();
      fakeAddress.streetNumber = Faker.datatype.number(9999).toString();
      fakeAddress.complement = Faker.address.streetPrefix();
      fakeAddress.neighborhood = Faker.address.streetName();
      fakeAddress.city = Faker.address.city();
      fakeAddress.state = Faker.address.stateAbbr();

      return fakeAddress;
    });

    return this.dbOrmRepository.save(users);
  }
}
