import React, { FC, useCallback, ComponentClass } from 'react';
import { useField, FieldModel, FieldUtils } from 'formulr';
import { Form, FormControl } from 'zent';

interface IProps {
  component: ComponentClass<any> | FC<any>;
  componentProps: any;
  formProps: any;
}

type IModel = {
  value: any;
  model: FieldModel<any>;
  error: FieldModel<any>['error'];
  onChange: (data: any) => void;
};

type IModels = {
  [propName: string]: IModel;
};

const FormSetItem: FC<IProps> = props => {
  const { component: Comp, componentProps, formProps, children } = props;
  const { name, model: modelMap } = formProps;
  const models: IModels = {};
  name.forEach((fieldName: string) => {
    const { defaultValue, validators } = modelMap[fieldName] || {};
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const model = useField<any>(fieldName, defaultValue, validators);
    models[fieldName] = {
      value: model.value,
      model,
      error: model.error,
      onChange: FieldUtils.makeChangeHandler(model, Form.ValidateOption.Default, () => {
        model.validate();
      })
    };
  });
  const onChange = useCallback(
    data => {
      Object.keys(data)
        .filter(keyName => name.includes(keyName))
        .forEach(keyName => {
          const value = data[keyName];
          const model = models[keyName];
          model.onChange(value);
        });
    },
    [models, name]
  );
  return (
    <FormControl {...formProps}>
      <Comp componentProps={componentProps} {...models} onChange={onChange}>
        {children}
      </Comp>
    </FormControl>
  );
};

export default FormSetItem;
