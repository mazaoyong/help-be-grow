import React from 'react';
import {
  FormRadioGroupField,
  FormInputField,
  FormNumberInputField,
  FormColorPickerField,
  Validators,
} from 'zent';
import { IFormCreatorConfig } from '@youzan/ebiz-components/es/types/easy-form-archive';

import { radioGroupChildren } from './basic-form-configs';
import { FoundationAvailable } from '../../types';

export enum MarqueeTypeEnums {
  STATIC_TEXT = 1,
  CUSTOMER_NAME,
}

const marqueeFormConfig = (): IFormCreatorConfig[] => [
  {
    name: 'openMarquee',
    label: '防录屏跑马灯：',
    type: 'field',
    defaultValue: FoundationAvailable.AVAILABLE,
    helpDesc: (
      <article>
        <p>直播过程中，直播画面中将出现跑马灯的内容。</p>
        <p>注：移动端全屏播放时，会导致跑马灯失效。</p>
      </article>
    ),
    component: FormRadioGroupField,
    children: radioGroupChildren('开启', '关闭'),
  },
  {
    name: 'marqueeType',
    label: '跑马灯类型：',
    type: 'field',
    defaultValue: MarqueeTypeEnums.STATIC_TEXT,
    component: FormRadioGroupField,
    children: radioGroupChildren('固定文字', '客户名称', [
      MarqueeTypeEnums.STATIC_TEXT,
      MarqueeTypeEnums.CUSTOMER_NAME,
    ]),
    show: {
      dep: 'openMarquee',
      fn(openMarquee) {
        return openMarquee === FoundationAvailable.AVAILABLE;
      },
    },
  },
  {
    name: 'marqueeContent',
    label: '跑马灯内容：',
    type: 'field',
    defaultValue: '',
    component: FormInputField,
    required: true,
    validators: [
      Validators.required('请输入跑马灯内容'),
      Validators.maxLength(20, '最多输入20个字'),
    ],
    props() {
      return {
        props: {
          width: '184px',
          placeholder: '20个字以内',
        },
      };
    },
    show: {
      dep: ['openMarquee', 'marqueeType'],
      fn([openMarquee, marqueeType]) {
        return (
          openMarquee === FoundationAvailable.AVAILABLE &&
          marqueeType === MarqueeTypeEnums.STATIC_TEXT
        );
      },
    },
  },
  {
    name: 'marqueeFontSize',
    label: '字体大小：',
    type: 'field',
    defaultValue: 20,
    component: FormNumberInputField,
    required: '请输入字体大小',
    props() {
      return {
        props: {
          min: 1,
          max: 256,
          integer: true,
          showStepper: true,
          width: '184px',
        },
      };
    },
    show: {
      dep: 'openMarquee',
      fn(openMarquee) {
        return openMarquee === FoundationAvailable.AVAILABLE;
      },
    },
  },
  {
    name: 'marqueeOpacity',
    label: '字体透明度：',
    type: 'field',
    defaultValue: '0',
    component: FormNumberInputField,
    required: '请输入字体透明度',
    props() {
      return {
        props: {
          min: 1,
          max: 99,
          addonAfter: '%',
          width: '184px',
        },
      };
    },
    show: {
      dep: 'openMarquee',
      fn(openMarquee) {
        return openMarquee === FoundationAvailable.AVAILABLE;
      },
    },
  },
  {
    name: 'marqueeFontColor',
    label: '字体颜色：',
    type: 'field',
    defaultValue: '#999',
    component: FormColorPickerField,
    required: '请选择字体颜色',
    props() {
      return {
        props: {
          type: 'simple',
        },
      };
    },
    show: {
      dep: 'openMarquee',
      fn(openMarquee) {
        return openMarquee === FoundationAvailable.AVAILABLE;
      },
    },
  },
];

export const marqueePickList = [
  'openMarquee',
  'marqueeType',
  'marqueeContent',
  'marqueeFontSize',
  'marqueeOpacity',
  'marqueeFontColor',
];
export default marqueeFormConfig;
