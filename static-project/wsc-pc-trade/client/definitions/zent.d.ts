import React from 'react';
import { Form } from 'zent';

declare global {
  /**
   * 为 zent 组件的 Props 添加 HTMLElement 基本属性
   */
  type ComponentWithHTMLAttributes<P = {}> = React.ComponentClass<
    P & React.HTMLAttributes<HTMLElement>
  >;

  /** 为zent-form包裹定义 */
  type ZENTFORM<EXTENDS> = Form.IWrappedComponentProps & EXTENDS;
  type ZENTFORM_PROPS_KEY = keyof Form.IWrappedComponentProps;

  type ZENT_FIELD_COMP<EXTENDS = {}> = Omit<
    Form.IFieldProps,
    'component' | 'ref' | 'asyncValidation' | 'displayError' | 'validations' | keyof EXTENDS
  > &
    Form.IContolGroupProps & {
      clearErrorOnFocus: boolean;
      isDirty: boolean; // 表单元素值被改变过
      isActive: boolean; // 表单元素为input且获得了焦点
      error: string | null; // 第一个校验错误文本信息（没有报错时为 null ）
      errors: string[]; // 校验错误文本信息数组（没有错误时为空数组）
    } & EXTENDS;

  type ZENT_FIELD<EXTENDS = {}> = Omit<Form.IFieldProps, 'component' | 'ref' | keyof EXTENDS> &
    Form.IContolGroupProps &
    Omit<EXTENDS, 'onChange'> &
    Partial<Pick<EXTENDS, 'onChange'>>;
}
