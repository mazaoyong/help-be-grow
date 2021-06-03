/* eslint-disable camelcase */
export interface IListParams {
  pageNumber: number;
  pageSize: number;
  order: string;
  orderBy: string;
  subSortBy: string;
  columnAlias: string;
  directoryId: number;
  status: string | number;
  keyWord: string;
  onlySort: string | undefined;
}

export interface IColumnItem {
  alias: string;
  column_alias: string;
  contents_count: number;
  cover: string;
  goods_id: number;
  has_product_lock: boolean;
  is_lock: boolean;
  is_shared: number;
  is_update: number;
  price: number;
  price_info: string;
  publish_at: number;
  redirect_url: string;
  serial_no: number;
  show_in_store: number;
  subscriptions_count: number;
  state_info: string;
  status: number;
  title: string;
  media_type: number;
  seller_type: number;
  is_free: number;
  column_serial_no: number;
  directory_id: number;
}

export interface IColumnData {
  alias: string;
  author: string;
  cover: string;
  contentsCount: number;
  price: number;
  isUpdate: number;
  isShared: number;
  status: number;
  summary: string;
  title: string;
  publishAt: number;
  redirectUrl: string;
  subscriptionsCount: number;
}
