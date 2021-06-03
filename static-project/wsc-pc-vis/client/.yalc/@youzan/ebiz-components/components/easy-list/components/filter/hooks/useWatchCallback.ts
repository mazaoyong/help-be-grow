import React from 'react';
import { FieldModel } from 'zent';
import { ZentForm } from 'zent/es/form/ZentForm';

import { IFilterModelUnion, WatchFunc } from '../../../types/filter';
import { splitValuesFromModel } from '../utils';
import { EBIZ_NODE_ENV } from '../../../../utils/constants';

type FilterModels = ZentForm<Record<string, FieldModel<IFilterModelUnion>>>;
type FilterWatches = Record<string, [WatchFunc, string][]>;
type FieldCtxHandlerType = (payload: any) => void;

const useWatchCallback = (
  form: FilterModels,
  watches: FilterWatches,
  formChangeCallback: (updateFields: string[]) => void
) => {
  const blockUpdating = React.useRef(false);
  const prevFormValues = React.useRef<Record<string, any>>({});
  const updateFields = React.useRef(new Set<string>([]));
  const updateValuesMap = React.useRef<Map<string, IFilterModelUnion>>(new Map());
  const changeTimerRef = React.useRef<number | null>(null);
  const handleChangeCallback = React.useCallback(() => {
    if (changeTimerRef.current) {
      clearTimeout(changeTimerRef.current);
    }
    changeTimerRef.current = (setTimeout(() => {
      blockUpdating.current = true;
      updateValuesMap.current.forEach((updateValue, updateField) => {
        const updateModel = form.model.get(updateField);
        if (updateModel) {
          updateModel.value = updateValue;
        }
      });
      formChangeCallback(Array.from(updateFields.current));
      changeTimerRef.current = null;
      updateFields.current.clear();
      blockUpdating.current = false;
      // 记录下这一次的form表单的值
      const { values: formValues } = splitValuesFromModel(form.getValue());
      prevFormValues.current = formValues;
    }, 20) as unknown) as number;
  }, [form, formChangeCallback]);

  const handleChangeModel = React.useCallback(
    (modifyFieldName: string): FieldCtxHandlerType => (payload) => {
      // 被更新了，就添加一个
      updateFields.current.add(modifyFieldName);
      const modifyModel = form.model.get(modifyFieldName)!;
      const { fieldValue: prevValue, status: prevStatus, props: prevProps } = modifyModel.value;
      const { value, visible = prevStatus.visible, disabled = prevStatus.disabled, ...curProps } =
        payload || {};
      // 不断重写，延迟更新
      updateValuesMap.current.set(modifyFieldName, {
        fieldValue: value || prevValue,
        status: { visible, disabled },
        props: { ...prevProps, ...curProps },
      });
    },
    [form.model]
  );

  React.useEffect(() => {
    prevFormValues.current = splitValuesFromModel(form.getValue()).values;
  }, [form]);

  // 为model添加订阅
  React.useEffect(() => {
    if (Object.keys(watches).length) {
      Object.entries(watches).forEach(([watchModelName, handlers]) => {
        const watchModel = form.model.get(watchModelName);
        if (watchModel) {
          watchModel.value$.subscribe((curFiledUnion) => {
            const hasChanged = curFiledUnion.fieldValue !== prevFormValues.current[watchModelName];
            if (hasChanged && !blockUpdating.current) {
              // 如果走到这里，说明观察的对象一定在变化
              updateFields.current.add(watchModelName);
              updateValuesMap.current.set(watchModelName, curFiledUnion);
              const { fieldValue } = curFiledUnion;
              const { values: formValues } = splitValuesFromModel(form.getValue());
              handlers.forEach(([handler, modifyModelName]) =>
                handler(fieldValue, { set: handleChangeModel(modifyModelName) }, formValues)
              );
              handleChangeCallback();
            }
          });

          // 只有订阅了的watch参数才需要取消订阅
          /* istanbul ignore next */
          return () => {
            if (EBIZ_NODE_ENV !== 'test') {
              const unsubscribeKeys: string[] = [];
              Object.entries(watches).forEach(([targetModelName]) => {
                if (!unsubscribeKeys.includes(targetModelName)) {
                  const targetModel = form.model.get(targetModelName);
                  try {
                    targetModel && targetModel.value$.unsubscribe();
                    unsubscribeKeys.push(targetModelName);
                  } catch (e) {
                    /** do nothing */
                  }
                }
              });
            }
          };
        }
      });
    }
  }, [form, handleChangeCallback, handleChangeModel, watches]);
};

export { useWatchCallback };
