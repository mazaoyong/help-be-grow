import React, { useRef, useEffect, useState } from 'react';
import { hashHistory } from 'react-router';
import { EasyFormArchive } from '@youzan/ebiz-components';
import { IFormCreatorConfig } from '@youzan/ebiz-components/es/types/easy-form-archive';
import { ZentForm } from 'zent/es/form/ZentForm';
import { FormInputField, Validators, Radio, FormRadioGroupField, Notify } from 'zent';
import InfoCollectField from 'components/field/info-collect';
import {
  ExamPublishType,
  ExamValidityType,
  ExamLimitType,
  ExamAnswerDisplayType,
} from '../../types';
import Footer from './blocks/footer';
import store from './store';
import {
  IPubConfigData,
  IValidConfigData,
  ITimesConfigData,
  CoverImage,
  RelatedCourse,
  InfoCollectOpen,
  PubConfig,
  ValidConfig,
  DurationConfig,
  TimesConfig,
  ReExamInterval,
  RichTextField,
} from './blocks/fields';
import { reverseAdaptSettingData } from './utils';
import { getExamTemplateDetail, countJoinUsers } from '../../api';
import { useCheckInfoCollect } from '@ability-center/course';
import { get } from 'lodash';

const { EasyForm } = EasyFormArchive;

const { useStoreBy } = store;
interface IConfigOpts {
  infoCollect: {
    available: boolean;
    needBuy: boolean;
    showInClue: boolean;
  };
}
const config: (isInit: boolean, opts: IConfigOpts) => IFormCreatorConfig[] = (isInit, opts) => [
  {
    component: <h3 className="setting-header">基本信息</h3>,
  },
  {
    component: (
      <FormInputField
        name="name"
        label="考试名称："
        required
        props={{ placeholder: '请输入考试名称，最多40个字', maxLength: 40, width: 270 }}
        validators={[Validators.required('请输入考试名称')]}
      />
    ),
  },
  {
    name: 'cover',
    label: '封面图：',
    required: true,
    component: CoverImage,
    defaultValue: '',
    helpDesc: <p>建议尺寸：750*420 像素，小于1M，支持jpg、png、jpeg格式</p>,
    validators: [Validators.required('请上传封面图')],
  },
  {
    name: 'detail',
    label: '详情：',
    required: true,
    component: isInit
      ? RichTextField
      : () => {
        return null;
      },
    defaultValue: '',
    className: 'rich-text-field',
    validators: [Validators.required('请输入详情')],
  },
  {
    name: 'relatedCourse',
    label: '关联课程：',
    component: RelatedCourse,
    helpDesc: '开启后，报名关联课程的学员才能参加考试',
    defaultValue: { open: false, data: [] },
    validators: [
      (val) => {
        if (val.open) {
          if (val.data.length === 0) {
            return {
              name: 'error',
              message: '请选择课程',
            };
          }
        }
        return null;
      },
    ],
  },
  {
    name: 'infoCollectOpen',
    label: '信息采集：',
    component: InfoCollectOpen,
    defaultValue: false,
    props() {
      return {
        disabled: !opts.infoCollect.available,
        available: opts.infoCollect.available,
        needBuy: opts.infoCollect.needBuy,
      };
    }
  },
  {
    name: 'infoCollect',
    label: '显示信息：',
    component: InfoCollectField,
    defaultValue: {},
    props: () => {
      return {
        enableSessionStorage: false,
        showRecordsLink: false,
        showInClue: opts.infoCollect.showInClue && true,
      };
    },
    show: {
      dep: 'infoCollectOpen',
      fn: (open) => open,
    },
    validators: [
      (val) => {
        if (val.customizeItems && val.customizeItems.length === 0) {
          return {
            name: 'error',
            message: '请选择采集信息',
          };
        }
        return null;
      },
    ],
    className: 'info-collect-field',
  },
  {
    component: <h3 className="setting-header">考试设置</h3>,
  },
  {
    name: 'pubConfig',
    label: '发布设置：',
    required: true,
    component: PubConfig,
    defaultValue: { type: ExamPublishType.PUBLISH } as IPubConfigData,
    validators: [
      (val: IPubConfigData) => {
        if (val.type === ExamPublishType.TIMER && !val.time) {
          return {
            name: 'error',
            message: '请选择发布时间',
          };
        }
        return null;
      },
    ],
  },
  {
    name: 'validConfig',
    label: '有效期：',
    required: true,
    component: ValidConfig,
    defaultValue: { type: ExamValidityType.FOREVER } as IValidConfigData,
    validators: [
      (val: IValidConfigData) => {
        const { type, rangeTime } = val;
        if (type === ExamValidityType.TIME_LIMIT) {
          if (!(rangeTime && rangeTime.every((item) => item.length > 0))) {
            return {
              name: 'error',
              message: '请选择开始/结束日期',
            };
          } else if (rangeTime[0] >= rangeTime[1]) {
            return {
              name: 'error',
              message: '结束时间需要大于开始时间',
            };
          }
        }
        return null;
      },
    ],
  },
  {
    name: 'duration',
    label: '考试时长：',
    required: true,
    component: DurationConfig,
    defaultValue: null,
    validators: [Validators.required('请填写考试时长')],
  },
  {
    name: 'timesConfig',
    label: '考试次数：',
    required: true,
    component: TimesConfig,
    defaultValue: { type: ExamLimitType.LIMIT, times: 1 } as ITimesConfigData,
    validators: [
      (val: ITimesConfigData) => {
        const { type, times } = val;
        if (type === ExamLimitType.LIMIT) {
          if (!times) {
            return {
              name: 'error',
              message: '请输入考试次数',
            };
          }
        }
        return null;
      },
    ],
  },
  {
    name: 'reexamInterval',
    label: '重考间隔：',
    required: true,
    component: ReExamInterval,
    defaultValue: null,
    show: {
      dep: 'timesConfig',
      fn: (timesConfig: ITimesConfigData) => {
        if (!timesConfig) return false;
        const { type, times } = timesConfig;
        return (
          (type === ExamLimitType.LIMIT && times && times > 1) || type === ExamLimitType.NO_LIMIT
        );
      },
    },
    validators: [Validators.required('请输入重考间隔')],
  },
  {
    name: 'answerDisplay',
    label: '答案展示：',
    required: true,
    component: FormRadioGroupField,
    defaultValue: ExamAnswerDisplayType.AFTER_COMMIT,
    type: 'field',
    helpDesc: '可选是否让学员在考试结束后看到答案解析，以及可以在何时看到答案解析。',
    children: [
      {
        component: <Radio value={ExamAnswerDisplayType.AFTER_COMMIT}>提交答卷后立即展示</Radio>,
      },
      {
        component: <Radio value={ExamAnswerDisplayType.AFTER_REVIEW}>提交且批阅完成后展示</Radio>,
      },
      {
        component: <Radio value={ExamAnswerDisplayType.HIDE}>隐藏答案</Radio>,
      },
    ],
  },
  {
    name: 'notice',
    label: '考试通知：',
    required: true,
    defaultValue: 'notice',
    component: () => (
      <a
        className="cursor-link"
        target="_blank"
        href="/v4/message/messagepush#/setting/ExamRemind"
        rel="noopener noreferrer"
      >
        前往设置
      </a>
    ),
    helpDesc: '自定义设置考试发布通知和成绩公布通知',
  },
];

export default function Setting({ next, index, id }) {
  const [setting, setSetting] = useStoreBy('setting');
  const [, setCount] = useStoreBy('attendExamStudentCount');
  const [isInit, setIsInit] = useState(false);
  const [isNextReady, setIsNextReady] = useState(false);
  const ref = useRef<ZentForm<any>>();

  const { infoCollectAvailable, infoCollectModel } = useCheckInfoCollect();
  const configOpts = React.useMemo<IConfigOpts>(
    () => ({
      infoCollect: {
        available: infoCollectAvailable,
        needBuy: get(infoCollectModel, 'needBuy', false),
        // 微课堂版本下隐藏进入线索选项
        showInClue: get(infoCollectModel, 'showInClue', true),
      },
    }),
    [infoCollectAvailable, infoCollectModel],
  );

  const onSubmit = React.useCallback((ctx: ZentForm<any>) => {
    setSetting(ctx.getValue());
    next && next();
  }, [next, setSetting]);

  useEffect(() => {
    // 如果是编辑模式且未设置setting的情况下才获取详情
    if (id && Object.keys(setting).length === 0) {
      getExamTemplateDetail(id)
        .then((res) => {
          if (res === null) {
            Notify.error('考试不存在');
            hashHistory.replace('/list');
            return;
          }
          const _setting = reverseAdaptSettingData(res);
          setSetting(_setting);
          ref.current && ref.current.patchValue(_setting);
          setIsInit(true);
          countJoinUsers(id).then((count) => {
            setCount(count);
            setIsNextReady(true);
          });
        })
        .catch((e) => {
          setIsInit(true);
          Notify.error(e);
        });
    } else {
      setIsNextReady(true);
      ref.current && ref.current.patchValue(setting);
      setIsInit(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="setting">
      <EasyForm
        ref={(form) => (ref.current = form)}
        config={config(isInit, configOpts)}
        layout="horizontal"
        onSubmit={onSubmit}
      >
        <Footer
          index={index}
          onCancelClick={() => hashHistory.push('/list')}
          nextDisabled={!isNextReady}
        />
      </EasyForm>
    </div>
  );
}
