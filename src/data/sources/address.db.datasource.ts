import { Service } from 'typedi';
import { In, Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { AddressEntity } from '@data/db/entities';

@Service()
export class AddressDbDataSource {
  constructor(@InjectRepository(AddressEntity) private readonly dbOrmRepository: Repository<AddressEntity>) {}

  findByUserIds(userIds: string[]) {
    return this.dbOrmRepository.find({ where: { user: { id: In(userIds) } } });
  }
}
