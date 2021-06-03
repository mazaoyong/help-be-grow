/**
 * 老师组件枚举值
 */
import * as Types from './types.js';

export const pickTeacher = {
  custom: {
    index: 0,
    label: '自定义',
    value: 0,
  },
  all: {
    index: 1,
    label: '全部',
    value: 1,
  },
};

/**
 * 列表样式
 */
export const listMode = {
  twoColsInOneRow: {
    label: '一行两个',
    index: 0,
    value: 0,
  },
  threeColsInOneRow: {
    label: '一行三个',
    index: 1,
    value: 1,
  },
  details: {
    label: '详细列表',
    index: 2,
    value: 2,
  },
  horizontalSlide: {
    label: '横向滑动',
    index: 3,
    value: 3,
  },
};

/**
 * 展示样式配置
 */
export const styleControl = {
  pageMargin: {
    index: 0,
    formType: Types.slider,
    label: '页面边距',
  },
  goodsPadding: {
    index: 1,
    formType: Types.slider,
    label: '人物间距',
  },
  avatarPos: {
    index: 2,
    formType: Types.radio,
    label: '头像位置',
    items: [
      {
        label: '一右一左',
        value: 0,
      },
      {
        label: '全部在左',
        value: 1,
      },
      {
        label: '全部在右',
        value: 2,
      },
    ],
  },
  avatarShape: {
    index: 3,
    formType: Types.radio,
    label: '头像形状',
    items: [
      {
        label: '圆形',
        value: 0,
      },
      {
        label: '正方形',
        value: 1,
      },
    ],
  },
  goodsRadius: {
    index: 4,
    formType: Types.radio,
    label: '商品倒角',
    items: [
      {
        label: '直角',
        value: 0,
      },
      {
        label: '圆角',
        value: 1,
      },
    ],
  },
  cardStyle: {
    index: 5,
    formType: Types.radio,
    label: '人物样式',
    items: [
      {
        label: '无边白底',
        value: 0,
      },
      {
        label: '卡片投影',
        value: 1,
      },
      {
        label: '描边白底',
        value: 2,
      },
      {
        label: '无边透明底',
        value: 3,
      },
    ],
  },
  imgSize: {
    index: 6,
    formType: Types.radio,
    label: '图片填充',
    items: [
      {
        label: '填充',
        value: 0,
      },
      {
        label: '周边留白',
        value: 1,
      },
    ],
  },
  textStyle: {
    index: 7,
    formType: Types.radio,
    label: '文本样式',
    items: [
      {
        label: '常规体',
        value: 1,
      },
      {
        label: '加粗体',
        value: 0,
      },
    ],
  },
  textAlign: {
    index: 8,
    formType: Types.radio,
    label: '文本对齐',
    items: [
      {
        label: '左对齐',
        value: 0,
      },
      {
        label: '居中对齐',
        value: 1,
      },
    ],
  },
  displayContent: {
    index: 9,
    formType: Types.checkbox,
    label: '显示内容',
    items: [
      {
        label: '老师名称',
        value: 0,
      },
      {
        label: '职位描述',
        value: 1,
      },
      {
        label: '老师简介',
        value: 2,
      },
    ],
  },
};
