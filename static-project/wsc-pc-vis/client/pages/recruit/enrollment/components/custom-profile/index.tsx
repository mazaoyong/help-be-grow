
import { Form } from '@zent/compat';
import React, { ReactNode, useMemo } from 'react';
import omit from 'lodash/omit';
import get from 'lodash/get';

import formatFields, { getAge } from './utils/format-fields';
import { SelectType, AddressType, ImageType, GenderType } from './components';
import './styles/index.scss';

export { getAge };
export type ObjectLike<T = any> = {[key: string]: T};
export enum DataType {
  TEXT = 0,
  NUMBER,
  DATE,
  PROVINCE,
  GENDER,
  IMAGE,
  ADDRESS,
  SELECT,
  MULTI_SELECT,
  PHONE,
};

type validationFunc = (values: any, value: any) => boolean;
export interface IProfileField extends Record<string, any> {
  label: string;
  name: any;
  value: any;
  dataType: DataType;
  options: Array<{
    text: ReactNode;
    value: any;
  }>;
  // 关于字符串映射
  reflect?: (values: ObjectLike) => any;
  disabled?: true;
  required?: boolean;
  validations?: ObjectLike<boolean | validationFunc>;
  validationErrors?: ObjectLike<string>;
}

interface ICustomProfileProps {
  initialValue?: ObjectLike[];
  fields: IProfileField[];
  applicableScenes: number;
  onSubmit(values: ObjectLike): void;
  onChange?(name: any, value: any): void;
  remoteConf?: Record<string, string>;
};

const { Field, FormDatePickerField, FormInputField, FormNumberInputField } = Form as any;
// 错误提示
const ERROR_HINT = {
  validations: {
    required: true,
  },
  validationErrors: {
    required: '该项不能为空',
  },
};
// 手机格式校验
const PHONE_TEST = /^1[3-9]\d{9}$/;
// 身份证校验
export const idCardTest = /((^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}$))|(^\d\*{16}\w$)/;

const CustomProfile = (props: ICustomProfileProps) => {
  const formattedFields = useMemo(
    () => {
      const fieldsConfig = formatFields(
        props.fields,
        props.initialValue || [],
        props.applicableScenes,
      );
      return fieldsConfig;
    },
    [props.fields, props.initialValue, props.applicableScenes],
  );

  const handleFieldChange = name => value => {
    const { onChange } = props;
    if (onChange) {
      onChange(name, value);
    }
  };

  const renderComponents = (fieldsConfig: IProfileField[]): (ReactNode | null)[] | null => {
    if (fieldsConfig.length === 0) {
      return null;
    }

    // apollo配置
    // placehodlers
    let placeholders: string[] = [];
    if (props.remoteConf) {
      placeholders = get(props.remoteConf, 'placeholders', '[]') as unknown as string[];
    }
    return fieldsConfig.map(config => {
      let customConf: Record<string, any> = Object.assign({}, { width: '185px' }, config);
      if (customConf.required) {
        customConf.validations = Object.assign({}, ERROR_HINT.validations, config.validations);
        customConf.validationErrors = Object.assign({}, ERROR_HINT.validationErrors, config.validationErrors);
      }
      customConf.label = config.label + '：';
      // 删除不必要的属性
      customConf = omit(
        customConf,
        [
          'applicableScenes', 'attrItem', 'attributeId', 'attributeKey',
          'attributeTitle', 'attributeType', 'dataType', 'createdAt',
          'serialNo',
        ],
      );
      // 添加onChange事件
      customConf.onChange = handleFieldChange(customConf.name);

      const { dataType } = config;
      // 拿到placeholder，但是原有的placeholder不能被替换
      if (get(customConf, 'placeholder') === undefined) {
        customConf.placeholder = get(placeholders, `[${dataType}]`, '请输入');
      }
      switch (dataType) {
        case DataType.TEXT:
        case DataType.NUMBER:
          const TEXT_LIMITATION = get(props.remoteConf, 'textLimit', 20);
          const NUMBER_LIMITATION = get(props.remoteConf, 'numberLimit', 20);
          const CURRENT_LIMITATION = dataType === DataType.TEXT ? TEXT_LIMITATION : NUMBER_LIMITATION;
          customConf.validations = Object.assign({}, {
            underLimit(_, value) {
              return String(value).length <= CURRENT_LIMITATION;
            },
          }, customConf.validations);
          customConf.validationErrors = Object.assign({}, {
            underLimit: `最多填写${CURRENT_LIMITATION}个字`,
          }, customConf.validationErrors);
          if (dataType === DataType.NUMBER) {
            customConf.showStepper = true;
          }
          const Node = dataType === DataType.NUMBER ? FormNumberInputField : FormInputField;
          return (
            <Node
              {...customConf}
              key={customConf.name}
            />
          );
        case DataType.GENDER:
          return (
            <Field
              {...customConf}
              key={customConf.name}
              component={GenderType}
            />
          );
        case DataType.SELECT:
          return (
            <Field
              {...customConf}
              key={customConf.name}
              component={SelectType}
            />
          );
        case DataType.MULTI_SELECT:
          // 添加多选的校验
          if (customConf.required) {
            customConf.validations = Object.assign({}, {
              isValid(_, value) {
                return Array.isArray(value) && value.length > 0;
              },
            }, customConf.validations);
            customConf.validationErrors = Object.assign({}, {
              isValid: '请选择至少一个选项',
            }, customConf.validationErrors);
          }
          return (
            <Field
              {...customConf}
              tags
              key={customConf.name}
              component={SelectType}
            />
          );
        // 地址类型的数据也同理使用省份的组件
        case DataType.ADDRESS:
        case DataType.PROVINCE:
          customConf.validations = Object.assign({}, {
            isAddress(_, value) {
              if (Array.isArray(value)) {
                const hasStreet = dataType === DataType.PROVINCE ? true : !!value[1];
                return value.length === 0 ||
                  (Array.isArray(value[0]) && value[0].length === 3 && hasStreet);
              }
              return true;
            },
          }, customConf.validations);
          customConf.validationErrors = Object.assign({}, {
            isAddress: '地址格式错误',
          }, customConf.validationErrors);
          return (
            <Field
              {...customConf}
              dataType={dataType}
              key={customConf.name}
              component={AddressType as any}
            />
          );
        // 日期类型
        case DataType.DATE:
          return (
            <FormDatePickerField
              {...customConf}
              key={customConf.name}
            />
          );
        // 手机
        case DataType.PHONE:
          customConf.value = (customConf.value || '').toString();
          if (customConf.required) {
            customConf.validations = Object.assign({ matchRegex: PHONE_TEST }, customConf.validations);
            customConf.validationErrors = Object.assign(
              { matchRegex: '手机号不合法' },
              customConf.validationErrors,
            );
          }
          return (
            <FormNumberInputField
              {...customConf}
              key={customConf.name}
            />
          );
        case DataType.IMAGE:
          return (
            <Field
              {...customConf}
              key={customConf.name}
              component={ImageType}
            />
          );
        default: return null;
      }
    });
  };

  return <section className="custom-profile">{renderComponents(formattedFields)}</section>;
};

export default CustomProfile;
