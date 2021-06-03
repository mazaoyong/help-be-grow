import React from 'react';
import { FormRadioGroupField, Radio } from 'zent';
import { IFormCreatorConfig } from '@youzan/ebiz-components/es/types/easy-form-archive';

import RichTextField from '../../components/rich-text-field';
import OptionGroupField from '../../components/option-group-field';
import { OptionsOrder } from '../../types';

interface ISelectFormParams {
  type: 'single' | 'multiple';
}
const getFormConfig = (params: ISelectFormParams): IFormCreatorConfig[] => {
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
      name: 'questionOptions',
      withoutLabel: true,
      component: OptionGroupField,
      type: 'field',
      fieldProps() {
        return {
          type: params.type,
        };
      },
    },
    {
      name: 'optionOrder',
      label: '选项顺序：',
      component: FormRadioGroupField,
      defaultValue: OptionsOrder.Fixed,
      type: 'field',
      required: true,
      children: [
        {
          component: (
            <>
              <Radio value={OptionsOrder.Fixed}>固定</Radio>
              <Radio value={OptionsOrder.Radom}>随机</Radio>
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
