import { IDict } from '@youzan/react-components/typings/components/goods-selector-v2';
import { IGetConfigOptions } from '../types';
export declare const getGoodsDict: (dict: IDict, isOnlyShowEduGoods: boolean, customManageUrl?: string | undefined) => IDict;
export declare const getConfig: (options: IGetConfigOptions) => import("@youzan/react-components/typings/components/goods-selector-v2").DeepPartial<import("@youzan/react-components/typings/components/goods-selector-v2").IConfig>;
