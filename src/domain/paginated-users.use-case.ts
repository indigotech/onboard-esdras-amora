import { Service } from 'typedi';
import { UserDbDataSource } from '@data/sources/user.db.datasource';
import { PageInput } from '@api/common/page.input';
import { formatPagination } from '@core/pagination';

@Service()
export class PaginatedUsersUseCase {
  constructor(private readonly datasource: UserDbDataSource) {}

  async exec(input: PageInput) {
    const { limit, offset } = formatPagination(input);
    const [nodes, count] = await this.datasource.findAndCount({ take: limit, skip: offset, order: { name: 'ASC' } });
    return {
      nodes,
      count,
      pageInfo: formatPagination(input, count),
    };
  }
}
