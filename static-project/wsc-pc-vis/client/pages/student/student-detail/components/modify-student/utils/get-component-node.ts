import { DatePicker } from '@zent/compat';
import { ComponentType } from 'react';
import { FormInputField, FormNumberInputField } from 'zent';
import { DataType, IProfileField } from '../types';
import { SelectType, AddressType, ImageType, GenderType } from '../components';

const COMPONENT_MAP: Record<DataType, {
  isField: boolean;
  component: ComponentType<any>;
}> = {
  [DataType.TEXT]: {
    isField: true,
    component: FormInputField,
  },
  [DataType.NUMBER]: {
    isField: true,
    component: FormNumberInputField,
  },
  [DataType.DATE]: {
    isField: false,
    component: DatePicker,
  },
  [DataType.PROVINCE]: {
    isField: false,
    component: AddressType,
  },
  [DataType.IMAGE]: {
    isField: false,
    component: ImageType,
  },
  [DataType.GENDER]: {
    isField: false,
    component: GenderType,
  },
  [DataType.ADDRESS]: {
    isField: false,
    component: AddressType,
  },
  [DataType.SELECT]: {
    isField: false,
    component: SelectType,
  },
  [DataType.MULTI_SELECT]: {
    isField: false,
    component: SelectType,
  },
  [DataType.PHONE]: {
    isField: true,
    component: FormNumberInputField,
  },
};

function getComponentNode(field: IProfileField): {
  isField: boolean;
  component: ComponentType<any>;
} {
  const { dataType } = field;
  if (dataType !== undefined) {
    return COMPONENT_MAP[dataType];
  }
  return {
    isField: false,
    component: () => null,
  };
}

export default getComponentNode;
