import clone from 'lodash/clone';

import { OPERATORS } from './student-profile-columns';

type AttributeKey =
  | 'edu_stuName'
  | 'edu_stuAva'
  | 'edu_stuBirth'
  | 'edu_stuAge'
  | 'edu_stuSex'
  | 'edu_stuContractPhone'
  | 'edu_stuContractWeChat'
  | 'edu_stuAddress'
  | 'edu_stuGrade'
  | 'edu_idCard';

type Action = '系统设置，无法修改' | '关联"学员生日"配置' | OPERATORS[];

export const topAttributeKey: Partial<Record<AttributeKey, boolean>> = {
  edu_stuName: true,
  edu_stuContractPhone: true,
  edu_stuAva: true,
};

export const STANDARD_PROFILE_LIST = [
  'edu_stuName',
  'edu_stuAva',
  'edu_stuBirth',
  'edu_stuAge',
  'edu_stuSex',
  'edu_stuContractPhone',
  'edu_stuContractWeChat',
  'edu_stuAddress',
  'edu_stuGrade',
];

export const ATTR_TYPE_LABEL = [
  '文本',
  '数字',
  '日期',
  '省市区',
  '性别',
  '图片',
  '地址',
  '单选项',
  '多选项',
  '手机号',
];

export interface IStudentProfileItem {
  attributeId: number;
  dataType: number | string;
  attributeTitle: string;
  createdAt: number;
  sourceSerialNo: number | string;
  serialNo: number | string;
  isReserved?: boolean;
  actions?: Action;
  attributeKey?: AttributeKey | string;
  applicableScenes?: Array<{
    applicableScene: 1 | 2;
    required: boolean;
  }>;
  attrItem?: Array<{
    id: number;
    order: number;
    value: any;
  }>;
  isChoose?: boolean;
}

type CreateOrEditFormData = Omit<IStudentProfileItem, 'attrItem'> & { attrItem: any[] };

// 将配置信息中的标准资料项中的不可修改的资料项中`serialNo`进行转换，替换为“置顶”字样，同时添加`actions`属性，作为`columns`的操作配置，`actions`可能是一些特殊的说明，具体可以见上面的`forbidAttributeKeyLabel`
export default function(datasets: IStudentProfileItem[]): [IStudentProfileItem[], number[]] {
  if (!datasets.length) {
    return [[], []];
  }
  const forbidAttributeKeyLabel: Partial<Record<AttributeKey, Action>> = {
    edu_stuName: '系统设置，无法修改',
    edu_stuContractPhone: '系统设置，无法修改',
    edu_stuAva: [OPERATORS.EDIT],
  };
  const duplicatedData = clone(datasets);
  const addedProfileItems: number[] = [];

  duplicatedData.forEach(data => {
    const { attributeKey, attributeId } = data;
    addedProfileItems.push(attributeId);
    const ACTION_CONFIG = forbidAttributeKeyLabel[attributeKey || attributeId];
    // 无法修改的配置信息
    if (ACTION_CONFIG) {
      data.actions = ACTION_CONFIG;
    } else {
      data.actions = [OPERATORS.EDIT, OPERATORS.DELETE];
    }
    const isTopAttribute = topAttributeKey[attributeKey || attributeId] || false;
    data.isReserved = isTopAttribute;
    data.sourceSerialNo = data.serialNo;
    if (isTopAttribute) {
      data.serialNo = '置顶';
    }
  });

  return [duplicatedData, addedProfileItems];
}

export function convertDataType(dataType: number): string {
  if (dataType > ATTR_TYPE_LABEL.length) {
    return '-';
  }
  return ATTR_TYPE_LABEL[dataType];
}

type valuesType = Required<IStudentProfileItem>['attrItem'];
export function convertOptionValues(values: valuesType): valuesType {
  return values;
}

type ValueTextType = Array<{
  value: any;
  text: string;
}>;
export function convertToTextValue(data?: IStudentProfileItem): ValueTextType {
  if (data) {
    const { attrItem } = data;
    if (attrItem && attrItem.length) {
      return attrItem.map(item => ({
        value: item.id,
        text: item.value,
      }));
    }
  }
  return [];
}

export function formatCreateData(data: CreateOrEditFormData): CreateOrEditFormData {
  const duplicatedData = clone(data);
  const { attrItem = [] } = duplicatedData;
  if (attrItem.length) {
    duplicatedData.attrItem = attrItem.map(item => item.text);
  }
  duplicatedData.serialNo = data.sourceSerialNo;
  return duplicatedData;
}

type OldScenesType = Required<IStudentProfileItem>['applicableScenes'];
// 格式化编辑自定义资料项的数据，🚨编辑需要有一个oldApplicableScene
export function formatEditData(
  data: CreateOrEditFormData,
  oldScenes?: OldScenesType,
): CreateOrEditFormData & { oldApplicableScenes?: OldScenesType } {
  const duplicatedData = formatCreateData(data);
  if (!oldScenes) {
    return duplicatedData;
  }
  duplicatedData.serialNo = data.sourceSerialNo;
  return Object.assign(duplicatedData, { oldApplicableScenes: oldScenes });
}
