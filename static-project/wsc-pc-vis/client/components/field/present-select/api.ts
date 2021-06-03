import ajax from 'zan-pc-ajax';

const isSuperStore = _global.isSuperStore;
const BASE_URL = `${isSuperStore ? _global.url.store : _global.url.base}/v4`;

interface PaginationParams {
  pageSize: number;
  pageNumber: number;
}

interface DataResponse<T> {
  pageable: PaginationParams;
  content: T[];
  total: number;
}

export interface IPresentListItem {
  /** 商品alias */
  alias: string;
  /** 渠道类型 */
  channel?: number;
  goodsId?: number;
  /** 赠品id */
  id: number;
  /** 是否可选 */
  isAvailable?: boolean;
  isOwlGoods?: boolean;
  /** 是否单品多件 */
  multiPieces?: boolean;
  /** 限领次数 */
  presentLimit?: number;
  /** 赠品选择组件的商品图片地址 */
  picture?: {
    url: string;
  };
  /** 库存 */
  stock: number;
  /** 商品名称 */
  title: string;
  /** 不可选原因 */
  unAvailableReason?: string;
  imageUrl?: string;
  pieces?: number;
}

interface IGetPresentListParams {
  command: {
    channel: number;
    keyword: string;
  },
  pageRequest: {
    pageNumber: number;
    pageSize: number;
  }
}

export function getPresentList(data: IGetPresentListParams) {
  return ajax<DataResponse<IPresentListItem>>({
    method: 'get',
    url: `${BASE_URL}/vis/present-selector/presentList.json`,
    data,
  });
}
