import React from 'react';
import { ENUM_SWITCH_FUNC, SHOP_ABILTY_CODE, HideSwitchItem } from './types';

export const itemFieldMap = {
  [ENUM_SWITCH_FUNC.SUBS]: [
    {
      itemType: 1,
      field: 'subscriptions_count',
    },
    {
      itemType: 2,
      field: 'subscriptions_count',
    },
  ],
  [ENUM_SWITCH_FUNC.UPD]: [
    {
      itemType: 2,
      field: 'contents_count',
    },
    {
      itemType: 3,
      field: 'column_count',
    },
    {
      itemType: 3,
      field: 'content_count',
    },
  ],
  [ENUM_SWITCH_FUNC.PLAY]: [
    {
      itemType: 1,
      field: 'pageview_count',
    },
  ],
};

const paidContentAbility = _global.paidContentAbility;

export const hideSwitchList: HideSwitchItem[] = [
  {
    switchFun: ENUM_SWITCH_FUNC.SUBS,
    title: '课程订购数',
    // 默认展示，对分销版隐藏
    isHide: paidContentAbility !== SHOP_ABILTY_CODE.USABLE,
    renderDesc: checked => (
      <span>
        <em>{checked ? '显示' : '隐藏'}</em>
        将
        <em>{checked ? '显示' : '隐藏'}</em>
        知识付费的购买人数
      </span>
    ),
  },
  {
    switchFun: ENUM_SWITCH_FUNC.UPD,
    title: '专栏/会员更新期数',
    renderDesc: checked => (
      <span>
        <em>{checked ? '显示' : '隐藏'}</em>
        专栏/会员权益将
        <em>{checked ? '显示' : '隐藏'}</em>
        更新期数
      </span>
    ),
  },
  {
    switchFun: ENUM_SWITCH_FUNC.PLAY,
    title: '课程浏览量/播放量',
    renderDesc: checked => (
      <span>
        <em>{checked ? '显示' : '隐藏'}</em>
        <em>{checked ? '显示' : '隐藏'}</em>线上课详情页浏览量/音频、视频播放次数
      </span>
    ),
  },
].filter(({ isHide }) => !isHide);
