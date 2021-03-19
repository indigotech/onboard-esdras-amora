import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { UserEntity } from '@data/entities/user.entity';
import { InsertUserParams, UserModel } from '@domain/model';

@Service()
export class UserDbDataSource {
  constructor(@InjectRepository(UserEntity) private readonly dbOrmRepository: Repository<UserEntity>) {}

  insert(input: InsertUserParams): Promise<UserModel> {
    return this.dbOrmRepository.save(input);
  }

  findOneByEmail(email: string): Promise<UserModel | undefined> {
    return this.dbOrmRepository.findOne({ where: { email } });
  }
}
