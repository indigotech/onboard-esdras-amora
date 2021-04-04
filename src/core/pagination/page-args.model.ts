import { isNil } from 'lodash';
import { PageInput } from '@api/common/page.input';
import { PageInfoModel } from './page-info.model';

export const formatPagination = (input: Partial<PageInput>, total = 0): PageInfoModel => {
  const limit = input.limit || 10;
  const offset = calculateOffset(input);
  return {
    limit,
    offset,
    page: input.page || Math.floor(offset / limit),
    totalPages: Math.ceil(total / limit),
    hasNextPage: total > offset + limit,
    hasPreviousPage: offset > 0,
  };
};

const calculateOffset = (args: Partial<PageInfoModel>) => {
  if (!isNil(args.offset)) {
    return args.offset;
  } else if (!isNil(args.page)) {
    return args.page * args.limit!;
  } else {
    return 0;
  }
};
