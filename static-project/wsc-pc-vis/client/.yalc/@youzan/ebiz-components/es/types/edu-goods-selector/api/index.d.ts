import { IFetchGoodsResult } from '../types';
/** 只适合于单纯选择教育商品的商品列表分页接口 */
export declare function fetchGoods(payload: any): Promise<IFetchGoodsResult>;
/** 商品列表分页接口（实际化接口，需要后端配置） */
export declare function fetchGoodsForUmp(payload: any): Promise<IFetchGoodsResult>;
/** 获取商品选择器配置 */
export declare function getConfig(payload: any): Promise<unknown>;
/** 商品分组分页接口 */
export declare function fetchFilterGroups(payload: any): Promise<unknown>;
