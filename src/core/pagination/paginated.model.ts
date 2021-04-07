import { PageInfoModel } from './page-info.model';

export interface Paginated<TModel> {
  count: number;
  nodes: TModel[];
  pageInfo: PageInfoModel;
}
