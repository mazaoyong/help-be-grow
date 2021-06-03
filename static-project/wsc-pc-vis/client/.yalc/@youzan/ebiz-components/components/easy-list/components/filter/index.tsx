import React from 'react';
import { isValidElementType } from 'react-is';
import { Form, FormControl } from 'zent';
import map from 'lodash/map';
import concat from 'lodash/concat';

import { Actions } from './Actions';
import { FilterField } from './components';
import { CollapseButton } from './CollapseButton';

import {
  FilterConfigType,
  ICollapseButtonRef,
  ICombinedFilterConf,
  IFilterProps,
  FilterRefType,
  ReservedType,
} from '../../types/filter';
import { ERROR_HINTS, adaptorConstructor } from './constant';
import { useDefaultQueries } from './hooks/useDefaultQueries';
import { useFormModelAndWatches } from './hooks/useFormConfigAndWatches';
import { useWatchCallback } from './hooks/useWatchCallback';
import { splitValuesFromModel } from './utils';

import {
  DatePicker,
  QuarterPicker,
  MonthPicker,
  WeekPicker,
  DateRangePicker,
  TimePicker,
  TimeRangePicker,
} from 'zent';
import {
  InputType,
  RadioType,
  SelectType,
  CheckboxType,
  DateRangeQuickPickerType,
} from './components';
export const ReservedCompReflect: Record<
  Exclude<ReservedType, 'Custom'>,
  React.ComponentType<any>
> = {
  Input: InputType,
  Radio: RadioType,
  Select: SelectType,
  Checkbox: CheckboxType,
  DatePicker: DatePicker,
  QuarterPicker: QuarterPicker,
  MonthPicker: MonthPicker,
  WeekPicker: WeekPicker,
  DateRangePicker: DateRangePicker,
  TimePicker: TimePicker,
  TimeRangePicker: TimeRangePicker,
  DateRangeQuickPicker: DateRangeQuickPickerType,
};

const { useForm } = Form;

const FilterWithRef = React.forwardRef<FilterRefType, IFilterProps>(function Filter(props, ref) {
  const {
    actionsOption,
    autoFilter = false,
    backgroundColor = '#f7f8fa',
    collapseConfig = [],
    collapseSwitcherLabel,
    config,
    defaultCollapseState,
    formatFields,
    layout,
    onChange,
    onReset,
    onSubmit,
    renderActions,
  } = props;
  // ref and list listAdaptor
  const collapseButtonRef = React.useRef<ICollapseButtonRef | null>(null);

  const meldConfigs = React.useMemo(() => concat(config, collapseConfig), [collapseConfig, config]);
  const { models, watches } = useFormModelAndWatches(meldConfigs);
  const form = useForm(models);
  const listAdaptor = React.useMemo(() => adaptorConstructor(props), [props]);
  const filter: FilterRefType = React.useMemo(
    () => ({
      submit() {
        const formValues = form.getValue();
        const { values, status } = splitValuesFromModel(formValues);
        const formattedValues = formatFields ? formatFields(values, status) : values;
        onSubmit && onSubmit(formattedValues, status);
        if (listAdaptor.afterSubmit) listAdaptor.afterSubmit(values);
      },
      reset() {
        form.resetValue();
        onReset && onReset();
        const formValues = form.getValue();
        const { values } = splitValuesFromModel(formValues);
        if (listAdaptor.afterReset) listAdaptor.afterReset(values);
      },
      getQueries: () => listAdaptor.queries(props),
      getCurrentValues: () => {
        const formValues = form.getValue();
        const { values } = splitValuesFromModel(formValues);
        return values;
      },
      getLoading: () => listAdaptor.loading(props),
      toggleState: (nextState) => {
        collapseButtonRef.current && collapseButtonRef.current.toggleState(nextState);
      },
    }),
    [form, formatFields, listAdaptor, onReset, onSubmit, props]
  );
  React.useImperativeHandle(ref, () => filter);

  const handleAutoFilter = React.useCallback(() => {
    if (autoFilter) filter.submit();
  }, [autoFilter, filter]);

  const handleChange = React.useCallback(
    (updateFieldNames: string[]) => {
      const newFormValues = form.getValue();
      const { values, status } = splitValuesFromModel(newFormValues);
      const updateFields: { name: string; value: any }[] = [];
      if (updateFieldNames.length) {
        updateFieldNames.forEach((fieldName) =>
          updateFields.push({
            name: fieldName,
            value: newFormValues[fieldName].fieldValue,
          })
        );
        if (onChange) onChange(updateFields, values, status);
        handleAutoFilter();
      }
    },
    [form, handleAutoFilter, onChange]
  );

  // 添加监听
  useWatchCallback(form, watches, handleChange);

  const [init, setInit] = React.useState(false);
  const defaultQueries = useDefaultQueries(props, listAdaptor);
  React.useEffect(() => {
    if (!init && Object.keys(defaultQueries).length) {
      setInit(true);
      const formValues = form.getValue();
      const initValues: Record<string, any> = {};
      const notEmptyKeys: [string, any][] = [];
      Object.entries(defaultQueries).forEach(([fieldName, value]) => {
        if (value !== undefined) {
          notEmptyKeys.push([fieldName, value]);
        }
        initValues[fieldName] = {
          ...formValues[fieldName],
          fieldValue: value,
        };
      });
      form.patchValue(initValues);
      filter.submit();
    }
  }, [listAdaptor, defaultQueries, filter, form, init]);

  const renderFunction = React.useCallback(
    (config: ICombinedFilterConf) => {
      const { name } = config;
      let Comp: React.ComponentType<any> | undefined;
      if (typeof config.type === 'string') {
        // 根据配置渲染提供Filter提供的组件还是用户自己控制渲染
        if (config.type === 'Custom') {
          if (checkReactType(config.renderField, ERROR_HINTS.NOT_CUSTOM_TYPE)) {
            Comp = config.renderField;
          }
        } else Comp = ReservedCompReflect[config.type];
      }
      if (Comp) {
        return (
          <FilterField
            key={name}
            form={form}
            conf={config}
            WrappedComp={Comp}
            onValueChange={() => handleChange([name])}
          />
        );
      }
      /* istanbul ignore next */
      return null;
    },
    [form, handleChange]
  );

  const RENDER_FILTER_ITEMS = React.useCallback(
    (renderConfig: FilterConfigType) => {
      return (
        <div className="easy-filter__panel-container">
          {map(renderConfig, (configItem, index) => {
            let NODES: React.ReactNode = null;
            if (Array.isArray(configItem)) {
              const configGroup = configItem;
              NODES = map(configGroup, renderFunction);
            } else {
              NODES = renderFunction(configItem);
            }
            if (Array.isArray(NODES)) {
              return (
                <div key={`filter-group${index}`} className="easy-filter__panel">
                  {NODES}
                </div>
              );
            }
            return NODES;
          })}
        </div>
      );
    },
    [renderFunction]
  );

  const RENDER_BASE_FILTER_ITEMS = React.useMemo(
    () => (
      <div data-testid="filter-fields" className="easy-filter__panel-wrapper">
        {RENDER_FILTER_ITEMS(config)}
      </div>
    ),
    [RENDER_FILTER_ITEMS, config]
  );

  const [expand, setExpand] = React.useState(defaultCollapseState === 'expand');
  const showCollapseConfig = React.useMemo(() => collapseConfig && collapseConfig.length > 0, [
    collapseConfig,
  ]);
  const RENDER_COLLAPSE_FILTER_ITEMS = React.useMemo(() => {
    if (showCollapseConfig) {
      return (
        <div
          data-testid="filter-collapse-fields"
          className={`easy-filter__panel-wrapper easy-filter__panel_${
            expand ? 'expand' : 'collapse'
          }`}
        >
          {RENDER_FILTER_ITEMS(collapseConfig)}
        </div>
      );
    }
    return null;
  }, [RENDER_FILTER_ITEMS, collapseConfig, expand, showCollapseConfig]);

  const RENDER_ACTIONS = React.useMemo(() => {
    if (autoFilter) return null;
    let ActionInner = null;
    if (renderActions && checkReactType(renderActions, ERROR_HINTS.NOT_VALID_ELEMENT)) {
      const UserRenderActions = renderActions;
      ActionInner = <UserRenderActions filter={filter} />;
    } else {
      ActionInner = <Actions filter={filter} {...actionsOption} />;
    }
    return (
      <div className="easy-filter__panel">
        <FormControl className="easy-filter__zent-control">
          <div className="easy-filter__actions-outer">
            {ActionInner}
            {showCollapseConfig && (
              <CollapseButton
                ref={collapseButtonRef}
                defaultValue={expand}
                onChange={setExpand}
                labels={collapseSwitcherLabel}
              />
            )}
          </div>
        </FormControl>
      </div>
    );
  }, [
    actionsOption,
    autoFilter,
    collapseSwitcherLabel,
    expand,
    filter,
    renderActions,
    showCollapseConfig,
  ]);

  return (
    <Form
      layout={layout || 'horizontal'}
      form={form}
      className="easy-filter"
      style={{ backgroundColor }}
    >
      {RENDER_BASE_FILTER_ITEMS}
      {RENDER_COLLAPSE_FILTER_ITEMS}
      {RENDER_ACTIONS}
    </Form>
  );
});

export default FilterWithRef;

// 检查react type
function checkReactType(Comp: any, hint: string): Comp is React.ComponentType<any> {
  const res = isValidElementType(Comp);
  if (!res) {
    throw new Error(hint);
  }
  return Comp;
}
