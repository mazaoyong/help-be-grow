import React from 'react';
import { FormControl, Form, Button, IValidators, FieldSet, FieldModel } from 'zent';
import uniqueId from 'lodash/uniqueId';

import Option from './blank';
import './styles.scss';

export interface IBlankGroupFieldProps extends Record<string, any> {
  label: string;
  name: string;
}
const getUniqueKeyByPrefix = (): string => uniqueId('model-');
const BlankGroupField: React.FC<IBlankGroupFieldProps> = (props) => {
  const { name, ...controlProps } = props;
  const [keys, setKeys] = React.useState<string[]>([getUniqueKeyByPrefix()]);
  const questionOptionsModel = Form.useFieldArray(name, optionGroupValidators, ['']);

  const handleAddOption = React.useCallback(() => {
    questionOptionsModel.validate();
    questionOptionsModel.push('');
    setKeys((prevKeys) => prevKeys.concat(uniqueId('model-')));
  }, [questionOptionsModel]);

  const handleDeleteOption = React.useCallback(
    (order: number) => {
      setKeys((prevKeys) => prevKeys.filter((_, index) => index !== order));
      questionOptionsModel.splice(order, 1);
    },
    [questionOptionsModel],
  );

  // 如果是回填数据，可能key的数量不够
  const getUniqueKey = React.useCallback(
    (order: number): string => {
      const isOverSize = keys.length <= order + 1;
      if (isOverSize) {
        // 数组越界，添加一个唯一key并返回
        const newUniqueId = getUniqueKeyByPrefix();
        setKeys(keys.concat(newUniqueId));
        return newUniqueId;
      }
      return keys[order];
    },
    [keys],
  );

  const isError = React.useMemo(() => !!questionOptionsModel.error, [questionOptionsModel.error]);
  const [overSize, canDelete] = React.useMemo(() => {
    const children = questionOptionsModel.children;
    return [children.length === 20, children.length >= 2];
  }, [questionOptionsModel.children]);

  return (
    <FormControl {...controlProps} className="modify-question__field expand">
      <div className="blank-group__wrapper">
        {questionOptionsModel.children.map((optionModel, order) => (
          // @ts-ignore
          <FieldSet key={getUniqueKey(order)} model={optionModel as any}>
            <Option
              order={order}
              isError={isError}
              canDelete={canDelete}
              onDelete={handleDeleteOption}
              model={optionModel as FieldModel<string>}
            />
          </FieldSet>
        ))}
        {!overSize && (
          <Button outline type="primary" className="add-option-button" onClick={handleAddOption}>
            添加填空
          </Button>
        )}
      </div>
    </FormControl>
  );
};

export default BlankGroupField;
const optionRequired = (value: string | null) => {
  if (!value) return false;
  return Boolean(value);
};
const optionGroupValidators: IValidators<readonly (string | null)[]> = [
  (values) => {
    if (values) {
      const error = values.every(optionRequired) ? undefined : '还未填写选项信息';
      if (error) {
        return {
          name: 'optionRequired',
          message: error,
        };
      }
    }
    return null;
  },
];
