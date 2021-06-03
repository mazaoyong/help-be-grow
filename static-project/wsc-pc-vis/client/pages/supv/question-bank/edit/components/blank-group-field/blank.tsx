import { Pop } from '@zent/compat';
import React from 'react';
import { Label, FormError, Form, Icon, FieldModel, Input, IInputChangeEvent } from 'zent';
import cx from 'classnames';

interface IBlankProps {
  order: number;
  isError: boolean;
  canDelete: boolean;
  model: FieldModel<string>;
  onDelete(order: number): void;
}
const Blank: React.FC<IBlankProps> = (props) => {
  const { order = 0, isError, canDelete, model, onDelete } = props;
  const blankModel = Form.useField(model);
  const label = React.useMemo(() => order + 1, [order]);

  const hasError = React.useMemo(() => isError && !blankModel.value, [isError, blankModel.value]);
  const classesWithError = React.useMemo(
    () =>
      cx({
        'blank-group__option-control': true,
        'has-error': hasError,
      }),
    [hasError],
  );

  const handleValueChange = React.useCallback(
    (evt: IInputChangeEvent) => {
      blankModel.value = evt.target.value;
    },
    [blankModel],
  );

  const DeleteHandler = React.useMemo(
    () =>
      canDelete && (
        <Pop
          wrapperClassName="remove-blank"
          trigger="hover"
          content="点击删除"
          position="top-center"
        >
          <Icon type="remove-o" onClick={() => onDelete(order)} />
        </Pop>
      ),
    [canDelete, onDelete, order],
  );

  return (
    <div className="blank-group__blank-item">
      <Label required>答案：</Label>
      <div className={classesWithError}>
        <div className="blank-group__blank-input">
          <Input
            width={640}
            addonBefore={label}
            value={blankModel.value}
            onChange={handleValueChange}
            placeholder="请输入答案，若有多个正确答案，用｜隔开"
          />
          {DeleteHandler}
        </div>
        {hasError && <FormError>还未填写选项信息</FormError>}
      </div>
    </div>
  );
};

export default Blank;
