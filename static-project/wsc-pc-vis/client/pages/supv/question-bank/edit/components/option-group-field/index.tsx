import React from 'react';
import uniqueId from 'lodash/uniqueId';
import { FormControl, Form, Button, IValidators, FieldSet, FieldArrayModel } from 'zent';

import Option from './option';
import './styles.scss';

export interface IOptionItem {
  options: string;
  rightAnswer: boolean;
}
export interface IOptionGroupFieldProps extends Record<string, any> {
  type: 'multiple' | 'single';
  label: string;
  name: string;
}
const OptionGroupField: React.FC<IOptionGroupFieldProps> = (props) => {
  const { type = 'single', name, ...controlProps } = props;
  const questionOptionsModel = Form.useFieldArray(
    name,
    optionGroupValidators,
    defaultOptionsAndKeys[0],
  );
  const [keys, setKeys] = React.useState<string[]>(defaultOptionsAndKeys[1]);

  const handleAddOption = React.useCallback(() => {
    questionOptionsModel.validate();
    questionOptionsModel.push(getDefaultOption());
    setKeys((prevKeys) => prevKeys.concat(getUniqueKeyByPrefix()));
  }, [questionOptionsModel]);

  const handleDeleteOption = React.useCallback(
    (order: number) => {
      toggleCheckedByType(type, order, questionOptionsModel);
      setKeys((prevKeys) => prevKeys.filter((_, index) => index !== order));
      questionOptionsModel.splice(order, 1);
    },
    [questionOptionsModel, type],
  );

  const handleAddCheck = React.useCallback(
    (order: number) => {
      toggleCheckedByType(type, order, questionOptionsModel);
    },
    [questionOptionsModel, type],
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
  const limitation = React.useMemo(() => (type === 'single' ? 2 : 3), [type]);
  const [overSize, canDelete] = React.useMemo(() => {
    const children = questionOptionsModel.children;
    return [children.length === 26, children.length >= limitation];
  }, [questionOptionsModel.children, limitation]);

  return (
    <FormControl {...controlProps} invalid={isError} className="modify-question__field expand">
      <div className="option-group__wrapper">
        {questionOptionsModel.children.map((optionModel, order) => (
          // @ts-ignore
          <FieldSet key={getUniqueKey(order)} model={optionModel as any}>
            <Option
              type={type}
              order={order}
              isError={isError}
              canDelete={canDelete}
              onCheck={handleAddCheck}
              onDelete={handleDeleteOption}
            />
          </FieldSet>
        ))}
        {!overSize && (
          <Button outline type="primary" className="add-option-button" onClick={handleAddOption}>
            添加选项
          </Button>
        )}
      </div>
    </FormControl>
  );
};

export default OptionGroupField;
const getDefaultOption = (): IOptionItem => ({
  options: '',
  rightAnswer: false,
});
const getUniqueKeyByPrefix = (): string => uniqueId('model-');
const optionRequired = (value: IOptionItem | null) => {
  if (!value) return false;
  return Boolean(value.options);
};
const optionGroupValidators: IValidators<readonly (IOptionItem | null)[]> = [
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

const defaultOptionsAndKeys: [IOptionItem[], string[]] = [
  [getDefaultOption(), getDefaultOption()],
  [getUniqueKeyByPrefix(), getUniqueKeyByPrefix()],
];

// 在单选和多选情况下选中和移除正确选项
function toggleCheckedByType(
  type: IOptionGroupFieldProps['type'],
  targetOrder: number,
  modelList: FieldArrayModel<IOptionItem>,
) {
  if (type === 'single') {
    // 如果是删除模式下，就将选项值清空
    resetAllRightAnswer(modelList);
    setSpecificRightAnswer(modelList, targetOrder, true);
  } else {
    // 如果找到选项或者是删除模式都返回筛选之后的数据
    setSpecificRightAnswer(modelList, targetOrder);
  }
}

function resetAllRightAnswer(modelList: FieldArrayModel<IOptionItem>) {
  if (modelList.children.length) {
    modelList.children.forEach((childModel) => {
      const rawValue: IOptionItem = childModel.getRawValue();
      childModel.patchValue(Object.assign(rawValue, { rightAnswer: false }));
    });
  }
}

function setSpecificRightAnswer(
  modelList: FieldArrayModel<IOptionItem>,
  targetOrder: number,
  state?: boolean,
) {
  if (modelList.children.length) {
    let currentState = state;
    modelList.children.forEach((childModel, index) => {
      if (index === targetOrder) {
        const rawValue: IOptionItem = childModel.getRawValue();
        rawValue.rightAnswer = currentState !== undefined ? currentState : !rawValue.rightAnswer;
        childModel.patchValue(rawValue);
      }
    });
  }
}
