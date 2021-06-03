/* eslint-disable camelcase */
export interface IListParams {
  title: string;
  showInStore: string | null;
  sellStatus: string;
  sellerType: string;
  liveStatus?: string;
  liveType?: string;
  groupId?: number;
  // other
  page: number;
  pageSize: number;
  sortType: 'ASNC' | 'DESC' | null;
  sortBy: string;
  subSortBy: string;
}

export interface ILiveItem {
  alias: string;
  column_title: string;
  cover: string;
  created_at: number;
  goods_id: number;
  has_product_lock: boolean;
  id: number;
  is_free: number;
  is_lock: boolean;
  kdt_id: number;
  live_detail_url: string;
  live_start_at: number;
  live_status: number;
  live_type: number;
  // popularize_code: string;
  price: number;
  publish_at: number;
  sales: number;
  sell_status: number;
  sell_time_type: number;
  seller_type: number;
  serial_no: number;
  show_in_store: number;
  stock: number;
  title: string;
  updated_at: number;
  item_create_mode: 0 | 1;
}
