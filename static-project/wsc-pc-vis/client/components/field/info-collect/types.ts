import { DataType } from '@ability-center/student';

export enum BooleanLike {
  False = 0,
  True,
}

export enum NeedVerifyCodeEnum {
  UNNEED,
  NEED,
}

export enum CollectPageTypeEnum {
  BEFORE_PURCHASE,
  AFTER_PURCHASE,
}

export interface IInfoCollectionValues {
  inClue: BooleanLike;
  customizeItems: number[];
  needVerifyCode?: NeedVerifyCodeEnum;
  collectPageType?: CollectPageTypeEnum;
}

export interface IInfoCollectionProps {
  value: IInfoCollectionValues;
  formatItems?: (items: IAttributeDTO[]) => IAttributeDTO[];
  expandLimit?: number;
  renderItem?: React.ComponentType<{ item: IAttributeDTO }>;
  enableSessionStorage?: boolean;
  showRecordsLink?: boolean;
  onChange(values: IInfoCollectionValues): void;
  showInClue?: boolean;
  infoCollectHelpDesc?: string;
  showDesc?: boolean;
  sceneId?: number;
  /** 信息采集增加了「手机号配置」和「采集页面」配置，当前仅线上课需要，攒学费等其他活动无需该配置 */
  isCoursePage?: boolean;
  disabled?: boolean;
}

export interface IAttributeDTO {
  attributeKey: string;
  attrItem: IAttributeItem[];
  attributeTags: string[];
  attributeType: AttributeTypeEnums;
  attributeId: number;
  attributeTitle: string;
  createdAt: string;
  canDel: boolean;
  dataType: DataType;
  needFill: boolean;
  placeholder: string;
  showDefault: boolean;
  serialNo: string;
}

export interface IAttributeItem {
  id: number;
  order: number;
  value: string;
}

export enum AttributeTypeEnums {
  STANDARD = 0,
  CUSTOM,
}
