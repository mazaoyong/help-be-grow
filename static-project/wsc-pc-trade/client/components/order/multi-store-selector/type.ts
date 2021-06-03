/**
 * 根据条件查询网点名称 request
 */
export interface IStoreListRequest {
  /** 是否为线上网点 */
  isOnline?: number;
  /** 是否为线下门店 */
  isStore?: boolean;
  /** 是否包含已删除的 */
  includeDel?: boolean;
  /** 外部编码 */
  outerId?: string;
}

/**
 * 根据条件查询网点名称 response
 */
export interface IStoreListItem {
  // 是否有效， true，有效； false，删除
  valid?: boolean;
  // 网点名称
  name?: string;
  // 网点id
  id?: number;
}
