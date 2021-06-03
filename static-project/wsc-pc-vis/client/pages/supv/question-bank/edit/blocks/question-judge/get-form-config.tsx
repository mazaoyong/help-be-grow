import React from 'react';
import { FormRadioGroupField, Radio } from 'zent';
import { IFormCreatorConfig } from '@youzan/ebiz-components/es/types/easy-form-archive';

import RichTextField from '../../components/rich-text-field';

const getFormConfig = (): IFormCreatorConfig[] => {
  return [
    {
      name: 'title',
      label: '题目标题：',
      component: RichTextField,
      type: 'field',
      required: '还未填写题目信息',
      fieldProps() {
        return {
          placeholder: '请输入题目标题',
        };
      },
    },
    {
      name: 'rightAnswer',
      label: '答案：',
      component: FormRadioGroupField,
      defaultValue: true,
      type: 'field',
      required: true,
      children: [
        {
          component: (
            <>
              <Radio value={true}>正确</Radio>
              <Radio value={false}>错误</Radio>
            </>
          ),
        },
      ],
    },
    {
      name: 'answerAnalysis',
      label: '答案解析：',
      component: RichTextField,
      type: 'field',
      fieldProps() {
        return {
          placeholder: '请输入解析内容',
        };
      },
    },
  ];
};

export default getFormConfig;
