import React from 'react';
import { FormRadioGroupField, Radio } from 'zent';
import { IFormCreatorConfig } from '@youzan/ebiz-components/es/types/easy-form-archive';

import { FoundationAvailable } from '../../types';

const basicFormConfig = (): IFormCreatorConfig[] => [
  {
    name: 'openBarrage',
    label: '弹幕：',
    type: 'field',
    defaultValue: FoundationAvailable.AVAILABLE,
    helpDesc: '弹幕功能关闭后，播放器上将不显示弹幕开关。',
    component: FormRadioGroupField,
    children: radioGroupChildren('开启', '关闭'),
  },
  {
    name: 'showOnlineList',
    label: '在线列表：',
    type: 'field',
    defaultValue: FoundationAvailable.AVAILABLE,
    helpDesc: '设定在观看页是否显示当前的在线用户列表（仅支持PC端）。',
    component: FormRadioGroupField,
    children: radioGroupChildren(),
  },
  // TODO: 在线人数暂时不做
  // {
  //   name: 'showOnlineNumber',
  //   label: '在线人数：',
  //   type: 'field',
  //   defaultValue: FoundationAvailable.AVAILABLE,
  //   helpDesc: '设定在观看页是否显示当前的在线人数。',
  //   component: FormRadioGroupField,
  //   children: radioGroupChildren(),
  // },
  {
    name: 'openWelcome',
    label: '欢迎语：',
    type: 'field',
    defaultValue: FoundationAvailable.AVAILABLE,
    helpDesc: '设置用户进入直播间后，是否显示欢迎语。',
    component: FormRadioGroupField,
    children: radioGroupChildren(),
  },
  {
    name: 'chatImage',
    label: '聊天图片：',
    type: 'field',
    defaultValue: FoundationAvailable.AVAILABLE,
    helpDesc: '设置是否允许用户在聊天室中发送图片。',
    component: FormRadioGroupField,
    children: radioGroupChildren('允许', '禁止'),
  },
  // TODO: 送花也不做
  // {
  //   name: 'sendFlowers',
  //   label: '送花：',
  //   type: 'field',
  //   defaultValue: FoundationAvailable.AVAILABLE,
  //   helpDesc: '设置聊天区是否开启送花功能。',
  //   component: FormRadioGroupField,
  //   children: radioGroupChildren(),
  // },
];
export const radioGroupChildren = (
  availableText = '显示',
  disabledText = '隐藏',
  values?: [any, any],
) => [
  {
    component: (
      <>
        <Radio value={values ? values[0] : FoundationAvailable.AVAILABLE}>{availableText}</Radio>
        <Radio value={values ? values[1] : FoundationAvailable.DISABLED}>{disabledText}</Radio>
      </>
    ),
  },
];

export const basicPickList = [
  'openBarrage',
  'showOnlineList',
  'showOnlineNumber',
  'openWelcome',
  'chatImage',
  'sendFlowers',
];
export default basicFormConfig;
