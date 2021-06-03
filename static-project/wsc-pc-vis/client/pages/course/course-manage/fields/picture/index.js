import { Form } from '@zent/compat';
import React from 'react';
import { ArthurContainer } from '@youzan/arthur-scheduler-react';
import { EduImageUpload } from '@youzan/ebiz-components';

const { Field } = Form;
const { ImageUploadFieldWithControlGroup } = EduImageUpload;

export default props => {
  return (
    <ArthurContainer name="common.pictureMaterial" namespace="shop">
      {model => {
        const maxSize = model.maxSize ? model.maxSize / (1024 * 1024) : 3;
        return (
          <Field
            name="pictures"
            label={props.label}
            tip="建议尺寸：750 x 420 像素，你可以拖拽图片调整图片顺序，最多传15张"
            className="upload-field"
            value={props.pictures}
            component={ImageUploadFieldWithControlGroup}
            maxAmount={15}
            maxSize={maxSize}
            required
            validations={{
              required: true,
              min(values, value) {
                return value.length !== 0;
              },
            }}
            validationErrors={{
              required: '最少需要添加一张图片',
              min: '最少需要添加一张图片',
            }}
            canSort
            canPreview
            needDetail
          />
        );
      }}
    </ArthurContainer>
  );
};
