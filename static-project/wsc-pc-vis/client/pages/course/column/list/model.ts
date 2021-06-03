/* eslint-disable camelcase */
export interface IListParams {
  title: string;
  status: string;
  isUpdate: string | null;
  showInStore: string | null;
  columnType: string | null;
  groupId: number;
  // other
  page: number;
  pageSize: number;
  sortType: 'ASNC' | 'DESC' | null;
  sortBy: string;
  subSortBy: string;
}

export interface IColumnItem {
  alias: string;
  column_type: number;
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
}
