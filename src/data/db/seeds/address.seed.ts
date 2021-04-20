import * as Faker from 'faker';
import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { AddressEntity } from '@data/db/entities';

@Service()
export class AddressSeed {
  constructor(@InjectRepository(AddressEntity) private readonly dbOrmRepository: Repository<AddressEntity>) {}

  exec(amount = 2, base: Partial<AddressEntity> = {}) {
    const addresses = new Array(amount).fill(0).map(() => {
      const fakeAddress = this.dbOrmRepository.create({
        cep: Faker.address.zipCode(),
        street: Faker.address.streetName(),
        streetNumber: Faker.datatype.number(9999).toString(),
        complement: Faker.address.streetPrefix(),
        neighborhood: Faker.address.streetName(),
        city: Faker.address.city(),
        state: Faker.address.stateAbbr(),
        ...base,
      });

      return fakeAddress;
    });

    return this.dbOrmRepository.save(addresses);
  }
}
