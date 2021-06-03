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
          placeholder: '请输入题目信息',
        };
      },
    },
    {
      name: 'answer',
      label: '参考答案：',
      component: RichTextField,
      type: 'field',
      required: '还未填写参考答案',
      fieldProps() {
        return {
          placeholder: '请输入参考答案',
        };
      },
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
