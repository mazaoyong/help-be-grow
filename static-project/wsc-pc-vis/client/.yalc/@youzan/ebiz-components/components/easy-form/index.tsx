import React from 'react';
import get from 'lodash/get';
import isNil from 'lodash/isNil';
import merge from 'lodash/merge';
import isObjectLike from 'lodash/isObjectLike';
import { Button, Form } from 'zent';

import { EasyFormPreview } from './components/preview';

import { useFormConfigs } from './hooks/use-form-configs';
import { useUpdateTimes } from '../utils/use-update-times';
import { group } from './utils/get-group-config';
import { list } from './utils/get-list-config';
import { IEasyFormInstance, IEasyFormProps } from './types';

import './styles.scss';
import { invariant } from './utils/invariant';
import { RenderField } from './components/render-filed';
import { useFormWatches } from './hooks/use-form-watches';
import { propWalker } from './utils/props-walker';

const { useForm, ValidateOption } = Form;
const EasyFormRenderer = React.forwardRef<IEasyFormInstance, IEasyFormProps>(
  function EasyFormRendererWithRef(props, easyFormRef) {
    useUpdateTimes(true, 'EasyForm');
    const {
      addColon = true,
      children,
      config,
      overrideConfigs = {},
      preview = false,
      renderSubmit = true,
      scrollToError = true,
      splitVM = false,
      onError,
      onSubmit: propsSubmitHandler,
      ...restFormProps
    } = props;
    if (isNil(config)) {
      throw new Error('EasyForm.config不能为空');
    }

    const { valueBuilder, statusBuilder, decoratedConfigs, formConfigs } = useFormConfigs({
      config,
      overrideConfigs,
    });
    const formStatusInstance = useForm(statusBuilder);
    const formInstance = useForm(valueBuilder);
    const { handleValueChange } = useFormWatches({
      config: formConfigs,
      formInstance,
      formStatusInstance,
    });

    // 重写patchValue方法，添加触发watch的时机
    const easyFormPatchValues = React.useCallback(
      (newValues, invokeWatch = true) => {
        let updatedValues = newValues;
        const valueKeys = Object.keys(newValues);
        if (invokeWatch && valueKeys.length) {
          const walker = propWalker((v) => !isObjectLike(v));
          const modifiedKeys: string[][] = [];
          valueKeys.forEach((key) => {
            const modifiedKey = walker(key, newValues[key]);
            modifiedKey && modifiedKeys.push(modifiedKey);
          });
          modifiedKeys.forEach((modifiedKey) => {
            const newValue = get(newValues, modifiedKey[0]);
            handleValueChange(modifiedKey[0], newValue);
          });
          updatedValues = merge(formInstance.getValue(), newValues);
        }
        formInstance.patchValue(updatedValues);
      },
      [formInstance, handleValueChange]
    );
    const formRef = React.useMemo<IEasyFormInstance>(
      () => ({
        zentForm: formInstance,
        easyForm: { patchValue: easyFormPatchValues },
      }),
      [easyFormPatchValues, formInstance]
    );
    React.useImperativeHandle(easyFormRef, () => formRef);

    // 包裹submit fail组件，添加scroll2error 兼容
    const handleScrollToError = React.useCallback(() => {
      if (scrollToError) {
        const firstErrorEle = document.querySelector('.field-error');
        if (firstErrorEle) {
          firstErrorEle.scrollIntoView(true);
        }
      }
    }, [scrollToError]);

    const handleSubmit = React.useCallback(() => {
      formInstance.validate(ValidateOption.IncludeUntouched).then((maybeError) => {
        const thereHasError = hasError(maybeError);
        if (thereHasError) {
          onError && onError(maybeError);
          handleScrollToError();
        } else propsSubmitHandler(formRef);
      });
    }, [formInstance, formRef, handleScrollToError, onError, propsSubmitHandler]);

    // 如果是视图数据完全分离的模式
    React.useEffect(() => {
      invariant(() => !(splitVM && children), 'splitVM模式下，EasyForm.children不能为空');
    }, [children, splitVM]);

    return (
      <div data-testid="easy-form-container" className="easy-form form-container">
        <Form
          layout="horizontal"
          {...restFormProps}
          form={formInstance}
          scrollToError={scrollToError}
        >
          {splitVM
            ? children
            : decoratedConfigs.map((fieldConfig, index) => {
                if (fieldConfig.type === 'Plain') {
                  return (
                    <div key={`plain-${index}`} className="easy-form form-field__plain">
                      {fieldConfig.node}
                    </div>
                  );
                }
                return (
                  <RenderField
                    addColon={addColon}
                    config={fieldConfig}
                    key={fieldConfig.name}
                    onChange={handleValueChange}
                    statusForm={formStatusInstance}
                    valueForm={formInstance}
                  />
                );
              })}
          {!!renderSubmit && (
            <div className="easy-form form-submit-box">
              {typeof renderSubmit === 'function' ? (
                renderSubmit(handleSubmit, formRef)
              ) : (
                <Button type="primary" onClick={handleSubmit}>
                  提交
                </Button>
              )}
            </div>
          )}
        </Form>
        <div className="easy-form form-previewer">
          {preview && <EasyFormPreview form={formInstance} statusForm={formStatusInstance} />}
        </div>
      </div>
    );
  }
);

function hasError(maybeError: any): boolean {
  // 如果不是数组，就直接判断是否有错
  if (!Array.isArray(maybeError)) return !isNil(maybeError);
  return maybeError.some((curMaybeError) => {
    if (Array.isArray(curMaybeError)) {
      return hasError(curMaybeError);
    }
    return !isNil(curMaybeError);
  });
}

const EasyForm = {
  EasyFormRenderer,
  list,
  group,
};
export default EasyForm;
export * from './types';
