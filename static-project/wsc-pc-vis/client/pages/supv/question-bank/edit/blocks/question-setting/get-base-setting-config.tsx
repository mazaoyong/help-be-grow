import React from 'react';
import accMul from '@youzan/utils/number/accMul';
import { IOption } from '@youzan/ebiz-components/es/types/easy-list';
import { IFormCreatorConfig } from '@youzan/ebiz-components/es/types/easy-form-archive';
import { FormNumberInputField, INumberInputProps, FieldModel } from 'zent';

import FormSelectField from 'components/zent-legacy/form/field/FormSelectField';

import { QuestionType, QuestionLevel, ScoringFormula } from '@ability-center/supv/question-bank';

import CategoryField from '../../components/category-field';

type ModifyType = 'edit' | 'duplicate' | 'create';
interface IFormConfigParams {
  type: ModifyType;
  categoryName?: string;
}
const MAX_SCORE = 9999.99;
const scoreProps = (
  props?: Partial<INumberInputProps>,
  times?: number,
): Partial<INumberInputProps> =>
  Object.assign(
    {
      min: 0,
      decimal: 2,
      width: '96px',
      showStepper: true,
      max: accMul(MAX_SCORE, times || 1),
      className: 'question-setting__score-input',
    },
    props,
  );
const getBaseQuestionSetting = (params: IFormConfigParams): IFormCreatorConfig[] => [
  {
    name: 'categoryId',
    label: '所属分类：',
    type: 'field',
    required: '请选择所属分类',
    component: CategoryField,
    validators: [
      function validateCategoryId(value) {
        if (Number(value) === 0) {
          return {
            name: 'invalidCategoryId',
            message: '请选择一个分类',
          };
        }
        return null;
      },
    ],
    fieldProps() {
      return {
        selectedCategory: {
          categoryName: params.categoryName || '',
        },
        dialogProps: {
          title: '选择分类',
        },
        needSystemDefault: true,
      };
    },
  },
  {
    name: 'type',
    label: '题目类型：',
    type: 'field',
    required: '请选择题目类型',
    component: FormSelectField,
    defaultValue: QuestionType.Single,
    fieldProps() {
      return {
        props: {
          width: '96px',
          autoWidth: true,
          data: questionTypeOptions,
        },
      };
    },
  },
  {
    name: 'level',
    label: '题目难度：',
    type: 'field',
    required: '请选择题目难度',
    component: FormSelectField,
    defaultValue: QuestionLevel.Easy,
    fieldProps() {
      return {
        props: {
          width: '96px',
          autoWidth: true,
          data: questionLevelOptions,
        },
      };
    },
  },
];
const getScoreSettingConfig = (): IFormCreatorConfig[] => [
  {
    name: 'score',
    label: '题目总分：',
    type: 'field',
    required: '请输入题目总分',
    component: FormNumberInputField,
    fieldProps(ctx) {
      let disabled = false;
      let times = 1;
      if (ctx) {
        const questionTypeModel: FieldModel<QuestionType> = ctx.model.get('type');
        if (questionTypeModel) {
          const type = questionTypeModel.value;
          if (type === QuestionType.FillBlank) {
            disabled = true;
            // 填空题，总分的上限是20倍的最大分值
            times = 20;
          }
        }
      }
      return {
        className: 'with-suffix-letter',
        props: scoreProps({ disabled }, times),
      };
    },
  },
  {
    name: 'scoringFormula',
    type: 'field',
    component: FormSelectField,
    defaultValue: ScoringFormula.Less,
    // @ts-ignore
    destroyOnUnmount: false,
    show: {
      dep: 'type',
      fn(typeValue) {
        return typeValue === QuestionType.Multiple;
      },
    },
    fieldProps() {
      return {
        withoutLabel: true,
        className: 'hack-scoringFormula',
        props: {
          width: '112px',
          autoWidth: true,
          data: questionScoreFormulaOptions,
        },
      };
    },
  },
  {
    name: 'scoringValue',
    type: 'field',
    component: FormNumberInputField,
    // @ts-ignore
    destroyOnUnmount: false,
    show: {
      dep: 'type',
      fn(typeValue) {
        return [QuestionType.Multiple, QuestionType.FillBlank].includes(typeValue);
      },
    },
    fieldProps(ctx) {
      let withoutLabel = true;
      let label = '';
      let required: string | boolean = false;
      if (ctx) {
        const questionTypeModel: FieldModel<QuestionType> = ctx.model.get('type');
        if ([QuestionType.Multiple, QuestionType.FillBlank].includes(questionTypeModel.value)) {
          required = '请输入分数';
        }
        if (questionTypeModel.value === QuestionType.FillBlank) {
          label = '每空：';
          withoutLabel = false;
        }
      }
      return {
        label,
        required,
        withoutLabel,
        className: 'with-suffix-letter',
        props: scoreProps(),
      };
    },
  },
];
const getFormConfig = (params: IFormConfigParams): IFormCreatorConfig[] => [
  {
    name: 'baseQuestionSetting',
    type: 'field',
    withoutLabel: true,
    component: QuestionContentBaseWrapper,
    fieldProps() {
      return {
        className: 'modify-question__form',
      };
    },
    children: getBaseQuestionSetting(params),
  },
  {
    name: 'questionScoreSetting',
    component: QuestionContentBaseWrapper,
    withoutLabel: true,
    type: 'field',
    fieldProps() {
      return {
        className: 'modify-question__form clearMB',
      };
    },
    children: getScoreSettingConfig(),
  },
];

export default getFormConfig;

const QuestionContentBaseWrapper: React.FC<Record<string, any>> = ({ children, className }) => (
  <div className={className}>{children}</div>
);

const questionTypeOptions: IOption<number>[] = [
  {
    text: '单选题',
    value: QuestionType.Single,
  },
  {
    text: '多选题',
    value: QuestionType.Multiple,
  },
  {
    text: '判断题',
    value: QuestionType.Judge,
  },
  {
    text: '填空题',
    value: QuestionType.FillBlank,
  },
  {
    text: '问答题',
    value: QuestionType.Subjective,
  },
];

const questionLevelOptions: IOption<number>[] = [
  {
    text: '简单',
    value: QuestionLevel.Easy,
  },
  {
    text: '普通',
    value: QuestionLevel.Normal,
  },
  {
    text: '较难',
    value: QuestionLevel.Medium,
  },
];

const questionScoreFormulaOptions: IOption<number>[] = [
  {
    text: '少选得分',
    value: ScoringFormula.Less,
  },
  {
    text: '按选项记分',
    value: ScoringFormula.ByOption,
  },
];
