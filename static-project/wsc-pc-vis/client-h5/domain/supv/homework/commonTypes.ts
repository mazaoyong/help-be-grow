export interface IDirection {}

export interface INullHandling {}

export interface IOrder {
  nullHandling?: INullHandling;
  property?: string;
  direction?: IDirection;
}

export interface ISort {
  orders?: Array<IOrder>;
}

export interface IPageRequest {
  pageNumber?: number;
  /** 是否开启count，默认为开启 */
  countEnabled?: boolean;
  pageSize?: number;
  sort?: ISort;
}

export interface IMap<T1, T2> {

}

export interface IRequestResult<T> {
  /** 本次调用返回code，一般为错误代码 */
  code?: number
  /** 调用返回的数据 */
  data?: T
  /** 标识本次调用是否返回 */
  success?: boolean
  /** 请求Id */
  requestId?: string
  /** 本次调用返回的消息，一般为错误消息 */
  message?: string
  /** 调用失败返回的数据 */
  errorData?: IMap<string, unknown>
}

export type IPageable = IPageRequest

export type IPageRequestResult<T> = IRequestResult<{
  total?: number
  pageable?: IPageable
  content?: T[]
}>
