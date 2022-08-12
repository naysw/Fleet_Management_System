export interface BaseQueryInput<TFilter = unknown> {
  take?: number;
  skip?: number;
  orderBy?: string;
  keyword?: string;
  filter?: any;
  sort?: TFilter;
  select?: string;
  include?: string;
}
