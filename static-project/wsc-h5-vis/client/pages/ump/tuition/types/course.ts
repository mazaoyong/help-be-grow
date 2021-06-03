/** 课程类型枚举 */
export enum CourseType {
  /** 内容 */
  CONTENT = 1,
  /** 直播 */
  LIVE = 0,
  /** 专栏 */
  COLUMN = 2
}

/** 课程基本信息 */
export interface ICourseBaseInfo {
  /** 课程 id */
  alias: string;
  /** 课程类型 */
  type: CourseType

}

export interface ICourseItem {
  /** 商品alais */
  goodsAlias?: string
  /** 销量信息 */
  soldNum?: number
  /** 商品id */
  goodsId?: number
  /** 商品价格 单位：分 */
  price?: number
  /** 商品图片 */
  imageUrl?: string
  /** 媒体类型  内容类型 */
  mediaType?: number
  /** 商品最大价格 */
  maxPrice?: number
  /** 商品名称 */
  title?: string
}
