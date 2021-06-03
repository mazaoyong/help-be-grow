import React from 'react';
import { FormControl, Form, FormError, IValidators, Validators } from 'zent';
import { Richtext } from '@youzan/react-components';

import {
  toolBarConfig,
  limitation,
  UEditorConfig,
  isToolbarAutoFloat,
  uploadDefaultConfig,
} from './rich-text-config';
import './styles.scss';

interface IRichTextProps extends Record<string, any> {
  label: string;
  name: string;
  defaultValue: string;
  required?: string | boolean;
  validators?: IValidators<string>;
  placeholder?: string;
}
const RichtextField: React.FC<IRichTextProps> = (props) => {
  const { name, defaultValue, validators, required, placeholder, ...controlProps } = props;
  const [richtextKey, setRichtextKey] = React.useState(0);
  const richtextRef = React.useRef<any | null>(null);
  const richTextModel = Form.useField<string>(
    name,
    defaultValue,
    passiveValidators(required, validators),
  );

  const handleRichText = React.useCallback(
    (value: string) => {
      richTextModel.value = value;
      richTextModel.validate();
    },
    [richTextModel],
  );

  // 页面进来的时候判断下工具栏是否应该被浮动
  const editorConfig = React.useMemo(
    () => UEditorConfig({ placeholder, autoFloatEnabled: isToolbarAutoFloat() }),
    [placeholder],
  );

  React.useLayoutEffect(() => {
    requestAnimationFrame(() => {
      try {
        const isPristine = richTextModel.pristine();
        const initValues = richTextModel.initialValue;
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
    <FormControl
      {...controlProps}
      required={!!required}
      invalid={!!richTextModel.error}
      className="modify-question__field expand"
    >
      <div className="rich-text__wrapper">
        <Richtext
          ref={richtextRef}
          key={richtextKey}
          // prettier-ignore
          editorConfig={Object.assign({
            toolbars: toolBarConfig,
          }, editorConfig)}
          uploadConfig={uploadDefaultConfig}
          value={richTextModel.value}
          onChange={handleRichText}
        />
        {richTextModel.error && <FormError>{richTextModel.error.message}</FormError>}
      </div>
    </FormControl>
  );
};

export default RichtextField;
const passiveValidators = (required: any, validators?: IValidators<any>) => {
  if (required) {
    return ([Validators.required(required || '请输入')] as IValidators<any>).concat(
      validators || [limitation],
    );
  }
  return validators;
};
