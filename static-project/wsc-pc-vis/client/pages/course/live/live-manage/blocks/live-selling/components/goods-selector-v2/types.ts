import type { IGridColumn, IGridCellPos } from 'zent';
import type {
  IDict,
  IConfig,
  IGoodsConfig,
  ISelectResult,
  IChannelSelected,
  ITypeFilterOption,
  IFetchGoodsParams,
} from '@youzan/react-components/typings/components/goods-selector-v2';

export interface IGoods {
  goodsName: string;
  goodsPrice: number;
  goodsId: number;
  goodsImage?: string;
  goodsAlias: string;
  isEduGoods: boolean;
}
export type IAddGoodsParams = IChannelSelected['value'];
interface IFormProps {
  required?: boolean;
  label: string;
}
export interface IUmpConfig {
  activityId?: number;
  activityType: number;
}
export interface IGoodsSelectorV2Props extends IFormProps {
  /** 营销活动配置 */
  umpConfig: IUmpConfig;
  goodsList: IGoods[];
  width?: string;
  /**  grid需要添加的列 */
  attachColumns?: IGridColumn[];
  /** 展示的商品信息 */
  loading?: boolean;
  // 触发按钮文案
  triggerText?: string;
  helpDesc?: React.ReactNode;
  /** 如果不指定这个属性只会渲染一个删除按钮 */
  renderOperators?(goodsData: IGoods, gridPos: IGridCellPos): React.ReactNode;
  onChange?(goodsList: IAddGoodsParams): void;
  onDelete?(goods: any): void;
}

export type {
  IDict,
  IConfig,
  IGridColumn,
  IGoodsConfig,
  ISelectResult,
  ITypeFilterOption,
  IFetchGoodsParams,
};
