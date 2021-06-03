import React, { FC, useState, useEffect, useMemo, forwardRef, useImperativeHandle } from 'react';
import { Form } from 'zent';
import { FormStrategy } from 'formulr';
import omit from 'lodash/omit';
import { FormPreview } from '../form-preview';
import { FormItem } from '../form-item';
import { IFormRenderProps } from '../../types';
import { getKeyName } from '../../utils';

const { useForm } = Form;

// eslint-disable-next-line react/display-name
export const FormRender: FC<IFormRenderProps> = forwardRef<any, IFormRenderProps>(
  (props, formRef) => {
    // eslint-disable-next-line
    const { initialize, config, preview, onSubmit, children, checkShowState = false, ...formProps } = props;
    const form = useForm(FormStrategy.View);
    const [initialState, setInitialState] = useState<boolean>(!initialize);
    const childrenContent = useMemo(() => {
      if (typeof children === 'function') {
        return children(form);
      }
      return children;
    }, [children]);

    useEffect(() => {
      initialize &&
        initialize().then((value) => {
          form.initialize(value);
          setTimeout(() => {
            setInitialState(true);
          });
        });
    }, [initialize]);

    useImperativeHandle(formRef, () => form);

    return (
      <Form {...omit(formProps, ['ref'])} form={form} onSubmit={onSubmit}>
        {config.map((one, i) => (
          <FormItem key={getKeyName(one, i)} config={one} form={form} initialState={initialState} checkShowState={checkShowState} />
        ))}
        {preview && <FormPreview form={form} />}
        {childrenContent}
      </Form>
    );
  }
);
