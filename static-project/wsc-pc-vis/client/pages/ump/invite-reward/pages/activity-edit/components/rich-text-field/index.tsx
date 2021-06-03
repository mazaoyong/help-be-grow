import React from 'react';
import { FormControl, Form } from 'zent';
import { Richtext } from '@youzan/react-components';

interface IRichTextProps extends Record<string, any> {
  label: string;
  name: string;
  defaultValue: string;
  editorConfig?: Record<string, any>;
  className?: string;
}

const uploadConfig = {
  materials: true,
  type: 'image',
  tokenUrl: `${_global.url.v4}/api/iron/materials/shopPubImgUploadToken.json`,
  maxAmount: 1,
  kdtId: _global.kdtId,
};

const RichtextField: React.FC<IRichTextProps> = (props) => {
  const { name, defaultValue, editorConfig, className, ...controlProps } = props;
  const [richtextKey, setRichtextKey] = React.useState(0);
  const richtextRef = React.useRef<any | null>(null);
  const richTextModel = Form.useField<string>(
    name,
    defaultValue,
  );

  const handleRichText = React.useCallback(
    (value: string) => {
      richTextModel.value = value;
      richTextModel.validate();
    },
    [richTextModel],
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
      required={false}
      invalid={!!richTextModel.error}
      className={`modify-question__field expand ${className}`}
    >
      <div className="rich-text__wrapper">
        <Richtext
          ref={richtextRef}
          key={richtextKey}
          editorConfig={editorConfig}
          value={richTextModel.value}
          uploadConfig={uploadConfig}
          onChange={handleRichText}
        />
      </div>
    </FormControl>
  );
};

export default RichtextField;
