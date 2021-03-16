import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { UserEntity } from '../entities/user.entity';
import { UserInputModel, UserModel } from '../../domain/model';

@Service()
export class UserDbDataSource {
  constructor(@InjectRepository(UserEntity) private readonly dbOrmRepository: Repository<UserEntity>) {}

  async insert(input: UserInputModel): Promise<UserModel> {
    return await this.dbOrmRepository.save(input);
  }

  async findOneByEmail(email: string): Promise<UserModel | undefined> {
    return await this.dbOrmRepository.findOne({ where: { email } });
  }
}
