import { Pop } from '@zent/compat';
import React from 'react';
import { Label, Radio, Checkbox, FormError, Form, Icon } from 'zent';
import cx from 'classnames';
import { Richtext } from '@youzan/react-components';

import {
  toolBarConfig,
  limitation,
  UEditorConfig,
  isToolbarAutoFloat,
  uploadDefaultConfig,
} from '../rich-text-field/rich-text-config';
import { IOptionGroupFieldProps } from './index';
import get from 'lodash/get';

interface IOptionProps {
  type: IOptionGroupFieldProps['type'];
  order: number;
  isError: boolean;
  canDelete: boolean;
  onDelete(order: number): void;
  onCheck(order: number): void;
}
const Option: React.FC<IOptionProps> = (props) => {
  const { order = 0, type, isError, canDelete, onDelete, onCheck } = props;
  const [richtextKey, setRichtextKey] = React.useState(0);
  const richtextRef = React.useRef<any | null>(null);
  const richTextModel = Form.useField<string>('options', '', [limitation]);
  const rightAnswerModel = Form.useField<boolean>('rightAnswer', false);
  const label = React.useMemo(() => String.fromCharCode(order + 65), [order]);

  const hasError = React.useMemo(() => isError && !richTextModel.value, [
    isError,
    richTextModel.value,
  ]);
  const classesWithError = React.useMemo(
    () =>
      cx({
        'option-group__option-control': true,
        'has-error': hasError || !!richTextModel.error,
      }),
    [hasError, richTextModel.error],
  ); // 页面进来的时候判断下工具栏是否应该被浮动
  const editorConfig = React.useMemo(
    () => UEditorConfig({ placeholder: '请输入选项内容', autoFloatEnabled: isToolbarAutoFloat() }),
    [],
  );

  const handleValueChange = React.useCallback(
    (richTextValue) => {
      richTextModel.value = richTextValue;
      richTextModel.validate();
    },
    [richTextModel],
  );

  const handleCheck = React.useCallback(() => onCheck(order), [onCheck, order]);

  const SelectedField = React.useMemo(
    () =>
      type === 'single' ? (
        <Radio value={order} checked={rightAnswerModel.value} onChange={handleCheck}>
          设为正确答案
        </Radio>
      ) : (
        <Checkbox value={order} checked={rightAnswerModel.value} onChange={handleCheck}>
          设为正确答案
        </Checkbox>
      ),
    [handleCheck, order, rightAnswerModel.value, type],
  );

  const DeleteHandler = React.useMemo(
    () =>
      canDelete && (
        <Pop
          wrapperClassName="remove-option"
          trigger="hover"
          content="点击删除"
          position="top-center"
        >
          <Icon type="remove-o" onClick={() => onDelete(order)} />
        </Pop>
      ),
    [canDelete, onDelete, order],
  );

  React.useLayoutEffect(() => {
    requestAnimationFrame(() => {
      try {
        const isPristine = richTextModel.pristine();
        const initValues = richTextModel.value;
        if (isPristine && initValues) {
          setRichtextKey(0xb10000000);
        }
      } catch (err) {
        console.error('初始化富文本编辑器初值失败');
        console.error('[initialize error]', err);
      }
    });
  }, [richTextModel, richTextModel.initialValue]);

  return (
    <div className="option-group__option-item">
      <Label required>选项{label}：</Label>
      <div className={classesWithError}>
        <div className="option-group__rich-text">
          <Richtext
            ref={richtextRef}
            key={richtextKey}
            // prettier-ignore
            editorConfig={Object.assign({
              toolbars: toolBarConfig,
            }, editorConfig)}
            uploadConfig={uploadDefaultConfig}
            value={richTextModel.value}
            onChange={handleValueChange}
          />
          {DeleteHandler}
        </div>
        {(hasError || !!richTextModel.error) && (
          <FormError>{get(richTextModel, 'error.message', '还未填写选项信息')}</FormError>
        )}
        {SelectedField}
      </div>
    </div>
  );
};

export default Option;
