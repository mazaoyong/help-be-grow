import React from 'react';
import { Form, FormControl } from 'zent';
import get from 'lodash/get';
import omit from 'lodash/omit';
import { ZentForm } from 'zent/es/form/ZentForm';

import { FieldModel } from 'formulr';

import { ICombinedFilterConf, IFilterModelUnion } from '../../../types/filter';
import { needOptions } from '../constant';

const { FieldValue } = Form;
const OMIT_PROPS_LIST = ['value', 'defaultValue', 'disabled', 'visible'];

interface IFilterFieldProps extends Record<string, any> {
  conf: ICombinedFilterConf;
  form: ZentForm<Record<string, FieldModel<IFilterModelUnion>>>;
  WrappedComp: React.ComponentType<any>;
  onValueChange(value: any, name: string): void;
}

const FilterField: React.FC<IFilterFieldProps> = (props) => {
  const { form, conf, WrappedComp, onValueChange } = props;
  const { name, label, onChange: nativeChangeHandler } = conf;
  const currentModel = React.useMemo(() => form.model.get(name), [form, name]);
  // 触发副作用函数
  const handleFiledChange = React.useCallback(
    (value: any) => {
      // 新版zent form使用rxjs，直接赋值
      const curFormValue = currentModel!.value;
      currentModel!.value = {
        ...curFormValue,
        fieldValue: value,
      };
      if (onValueChange) onValueChange(value, name);
      if (nativeChangeHandler) nativeChangeHandler(value);
    },
    [currentModel, name, nativeChangeHandler, onValueChange]
  );

  const getPassiveProps = React.useCallback(
    (conf: ICombinedFilterConf, curProps: any, curStatus: any) => {
      const partInheritProps = omit<Record<string, any>>(conf.inheritProps || {}, OMIT_PROPS_LIST);

      const mergedProps = curProps
        ? {
            ...curProps,
            ...partInheritProps,
            ...omit(curStatus, 'visible'),
          }
        : partInheritProps;

      if (!mergedProps.options && needOptions(conf)) {
        /* istanbul ignore next */
        if (!conf.options) {
          throw new Error(`type ${conf.type} required property options`);
        }
        mergedProps.options = conf.options;
      }
      return mergedProps;
    },
    []
  );

  if (currentModel) {
    return (
      <FieldValue model={currentModel}>
        {(formValue: IFilterModelUnion) =>
          get(formValue, 'status.visible', true) ? (
            <FormControl label={label} withoutLabel={!label} className="easy-filter__zent-control">
              <span data-testid={name}>
                <WrappedComp
                  width="185px"
                  {...getPassiveProps(conf, formValue.props, formValue.status)}
                  key={name}
                  value={formValue.fieldValue}
                  onChange={handleFiledChange}
                />
              </span>
            </FormControl>
          ) : null
        }
      </FieldValue>
    );
  }
  /* istanbul ignore next */
  return null;
};

export default FilterField;
