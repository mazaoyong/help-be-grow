import React, { FC, useState, ReactNode } from 'react';
import { useFieldValue } from 'formulr';
import { FormField } from 'zent';
import { ZentForm } from 'zent/es/form/ZentForm';
import {
  IFormItemProps,
  IDependent,
  IFormShow,
  IFormWatch,
  IGetPropsFn,
  IFormShowFn,
} from '../../types';
import { useUpdateEffect } from '../../hooks';
import FormSetItem from '../form-set-item';
import { getKeyName } from '../../utils';

function showIsFalse(show?: IFormShow) {
  return show && show.value !== undefined && show.value === false;
}

function getComponentsProps(form: ZentForm<any>, props?: IGetPropsFn) {
  let p = {};
  if (props) {
    p = props(form);
  }
  return p;
}

function getFieldProps(form: ZentForm<any>, props: any = {}, componentProps?: IGetPropsFn) {
  let p = {};
  if (componentProps) {
    p = componentProps(form);
  }
  return {
    ...props,
    ...p,
  };
}

export const FormItem: FC<IFormItemProps> = (props) => {
  const {
    config: {
      name,
      type,
      component,
      watch = [],
      show,
      children = [],
      props: propsFn,
      fieldProps,
      destroyOnUnmount = true,
      ...other
    },
    form,
    initialState = true,
    checkShowState = false,
  } = props;
  const componentProps = getComponentsProps(form, propsFn);
  let slot: ReactNode = null;
  if (children.length > 0) {
    slot = children.map((one, i) => (
      <FormItem key={getKeyName(one, i)} config={one} form={form} initialState={initialState} />
    ));
  }
  // 没有名字 == 不是表单
  if (!name) {
    // 不是函数，纯展示
    if (typeof component !== 'function') {
      return component as any;
    }
    // 函数都当组件处理
    const GroupComponent = component as any;
    return (
      <GroupComponent form={form} {...componentProps}>
        {slot}
      </GroupComponent>
    );
  }
  const FormFieldComponent = component as any;
  const formProps = getFieldProps(
    form,
    {
      name,
      destroyOnUnmount,
      ...other,
    },
    fieldProps
  );
  const checkShowFunc = show && show.fn ? false : true;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [exist, setExist] = useState(checkShowState ? checkShowFunc : true);
  const arr: IDependent[] = [...watch];
  const watchLen = watch.length;
  if (show && show.fn) {
    arr.push(show);
  }
  if (Array.isArray(arr) && arr.length > 0) {
    arr.forEach((watchItem: IFormWatch, i) => {
      const { dep = [], fn, immediate } = watchItem;
      const currentValues: any[] = [];
      let deps: string[] = [];
      if (!Array.isArray(dep)) {
        deps = [dep];
      } else {
        deps = dep;
      }
      deps.forEach((depName) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const value = useFieldValue<any>(depName);
        currentValues.push(value);
        currentValues[depName as any] = value;
      });
      // eslint-disable-next-line react-hooks/rules-of-hooks
      useUpdateEffect(
        () => {
          const values = currentValues.length < 2 ? currentValues[0] : currentValues;
          if (i === watchLen) {
            // 超过watch length的，肯定就是show
            if (fn) {
              const flag = (fn as IFormShowFn)(values, form);
              if (flag instanceof Promise) {
                flag
                  .then((nextFlag) => {
                    setExist(nextFlag);
                  })
                  .catch(() => {});
              } else {
                setExist(flag);
              }
            }
          } else {
            initialState && fn && fn(values, form);
          }
        },
        currentValues,
        immediate
      );
    });
  }
  if (!exist || showIsFalse(show)) return null;
  if (type === 'field') {
    return (
      <FormFieldComponent {...formProps} {...componentProps}>
        {slot}
      </FormFieldComponent>
    );
  }
  if (Array.isArray(name)) {
    return (
      <FormSetItem
        component={component as any}
        componentProps={componentProps}
        formProps={formProps}
      >
        {slot}
      </FormSetItem>
    );
  }
  return (
    <FormField {...formProps} defaultValue={formProps.defaultValue}>
      {(childProps) => (
        <FormFieldComponent {...childProps} {...componentProps}>
          {slot}
        </FormFieldComponent>
      )}
    </FormField>
  );
};
