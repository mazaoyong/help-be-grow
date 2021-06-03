import React from 'react';
import cx from 'classnames';
import {
  DatePicker,
  DateRangePicker,
  Form,
  FormControl,
  FormError,
  Input,
  MonthPicker,
  NumberInput,
  QuarterPicker,
  TimePicker,
  TimeRangePicker,
  ValidateOccasion,
  WeekPicker,
} from 'zent';
import {
  IEasyFormFieldRenderProps,
  FormFieldsType,
  NormalEasyFormModel,
  NormalStatusModel,
} from '../types';
import { changeValueAdaptor } from '../utils/change-value-adaptor';
import { invariant } from '../utils/invariant';

// Zent中不能直接使用的组件
import {
  SelectType,
  RadioType,
  CheckboxType,
  DateRangeQuickPickerType,
} from '../../easy-list/components/filter/components';
import { EasyFormColorPicker } from './color-picker';
import { EasyFormSwitch } from './switch';
import { isOptionsRequiredType } from '../utils/is-options-required-type';
import { getDecoratedLabel } from '../hooks/use-form-configs';
import { initValidators } from '../utils/get-form-builder';

const { useField } = Form;
type AdaptorCompType = React.ComponentType<Record<string, any>>;
type ExcludeType = '__internal_group__' | '__internal_list__' | 'Custom' | 'Plain';
const UseDirectlyComponentMap: Record<Exclude<FormFieldsType, ExcludeType>, AdaptorCompType> = {
  Checkbox: CheckboxType,
  ColorPicker: EasyFormColorPicker,
  DatePicker,
  DateRangePicker: DateRangePicker,
  DateRangeQuickPicker: DateRangeQuickPickerType,
  Input,
  MonthPicker: MonthPicker,
  NumberInput,
  QuarterPicker: QuarterPicker,
  Radio: RadioType,
  Select: SelectType,
  Switch: EasyFormSwitch,
  TimePicker: TimePicker,
  TimeRangePicker: TimeRangePicker,
  WeekPicker: WeekPicker,
};

const FormDescription: React.FC<{ description?: React.ReactNode }> = (props) => {
  if (props.description !== undefined)
    return <p className="easy-form description-content">{props.description}</p>;
  return null;
};

type EasyFormNormalFieldRender = IEasyFormFieldRenderProps<NormalEasyFormModel, NormalStatusModel>;
export const EasyFormNormalFieldRender: React.FC<EasyFormNormalFieldRender> = (props) => {
  const {
    addColon,
    model: valueRef,
    statusModel: statusRef,
    config: fieldConfig,
    onChange: formChangeCallback,
    /** 外部传入的disabled属性，拥有最高的优先级*/ disabled: forceDisabled = false,
  } = props;
  const { validateOccasion, validators, ...restFieldConfig } = fieldConfig;
  const valueModel = useField(valueRef);
  const statusModel = useField(statusRef);
  // 使用包裹函数包裹一下然后初始化validators
  if (valueModel.validators.length === 0) {
    valueModel.validators = initValidators(validators, statusModel);
  }
  const normalFieldCls = React.useMemo(
    () => cx('easy-form normal-field', { 'field-error': valueModel.error !== null }),
    [valueModel.error]
  );

  /** props和status与value的更新频率不尽相同，所以这里隔离开来缓存，减少更新频次 */
  const { disabled, visible, ...curProps } = React.useMemo(() => statusModel.value, [
    statusModel.value,
  ]);

  const setFieldChangeState = React.useCallback(
    (execValidators: boolean) => {
      valueModel.isTouched = true;
      // 重新校验
      const needValidate =
        /** 是否需要重新校验 */ execValidators ||
        /** 或是已经校验过并且报错*/ valueModel.error !== null;
      needValidate && valueModel.validate();
    },
    [valueModel]
  );

  const handleValueChange = React.useCallback(
    (input: any) => {
      const nextFieldValue = changeValueAdaptor(input);
      const prevValue = valueModel.getRawValue();
      if (prevValue !== nextFieldValue) {
        valueModel.value = nextFieldValue;
        setFieldChangeState(validateOccasion === ValidateOccasion.Change);
        // 通知上层，触发watch函数
        formChangeCallback(restFieldConfig.name, nextFieldValue);
        restFieldConfig.onChange && restFieldConfig.onChange(nextFieldValue);
      }
    },
    [valueModel, setFieldChangeState, validateOccasion, formChangeCallback, restFieldConfig]
  );

  const handleFieldBlur = React.useCallback(() => {
    setFieldChangeState(validateOccasion === ValidateOccasion.Blur);
  }, [setFieldChangeState, validateOccasion]);

  /**
   * 需要额外添加的属性
   */
  const addonProps = React.useMemo(() => {
    const _addonProps: Record<string, any> = {};
    if (isOptionsRequiredType(restFieldConfig)) {
      _addonProps.options = restFieldConfig.options;
    }
    return _addonProps;
  }, [restFieldConfig]);

  const FieldContentComponent = React.useMemo(() => {
    if (restFieldConfig.type === 'Custom') {
      invariant(
        () => restFieldConfig.renderField !== undefined,
        `config.name为${restFieldConfig.name}的renderField不能为空`
      );
      return restFieldConfig.renderField as React.ComponentType<AdaptorCompType>;
    } else {
      // @ts-ignore
      return UseDirectlyComponentMap[restFieldConfig.type] || null;
    }
  }, [restFieldConfig]);
  /** 如果不存在目标组件，就不展示这个内容 */
  if (!FieldContentComponent) {
    console.warn(
      `不存在字段为${restFieldConfig.name}，类型为${restFieldConfig.type}的组件，如果为"Custom"类型，请确认声明了"renderField"方法`
    );
    return null;
  }
  return (
    <div data-testid={`easy-form-field-${fieldConfig.name}`} className={normalFieldCls}>
      {visible ? (
        <FormControl
          {...(restFieldConfig.fieldProps || {})}
          required={restFieldConfig.required}
          /** label不能被覆盖 */
          label={getDecoratedLabel(restFieldConfig.label, { addColon })}
          invalid={!!valueModel.error}
        >
          <div className="easy-form normal-field__content">
            {fieldConfig.prefix || null}
            <FieldContentComponent
              {...addonProps}
              {...curProps}
              value={valueModel.value}
              disabled={forceDisabled || disabled}
              onChange={handleValueChange}
              onBlur={handleFieldBlur}
            />
            {fieldConfig.suffix || null}
          </div>
          <FormDescription description={restFieldConfig.helpDesc} />
          {valueModel.error && (
            <FormError className="easy-form error-content">{valueModel.error.message}</FormError>
          )}
        </FormControl>
      ) : null}
    </div>
  );
};
