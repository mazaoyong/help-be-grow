import React from 'react';
import { FormCheckboxGroupField, Checkbox } from 'zent';
import { IFormCreatorConfig } from '@youzan/ebiz-components/es/types/easy-form-archive';

import RichTextField from '../../components/rich-text-field';
import BlankGroupField from '../../components/blank-group-field';

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
          placeholder: '题目示例：两个黄鹂（），一行白鹭（）。',
        };
      },
    },
    {
      name: 'answers',
      withoutLabel: true,
      component: BlankGroupField,
      type: 'field',
    },
    {
      name: 'answerRequest',
      label: '作答要求：',
      withoutError: true,
      component: FormCheckboxGroupField,
      type: 'field',
      children: [
        {
          component: (
            <div className="checkbox-group">
              <Checkbox value="answerOrder">答案顺序无要求</Checkbox>
              <Checkbox value="answerIgnoreCase">忽略大小写</Checkbox>
            </div>
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
