/**
 * 知识商品组件枚举值
 */
import * as Types from './types.js';
import get from 'lodash/get';

/**
 * 显示/不显示
 */
export const displayTitleBar = {
  visible: {
    index: 0,
    label: '显示',
    value: 1,
  },
  hidden: {
    index: 1,
    label: '不显示',
    value: 0,
  },
};

/**
 * 商品来源
 */
export const goodsFrom = {
  course: {
    index: 0,
    label: '线下课',
    value: Types.course,
  },
  column: {
    index: 1,
    label: '知识专栏',
    value: Types.column,
  },
  content: {
    index: 2,
    label: '知识内容',
    value: Types.content,
  },
  live: {
    index: 3,
    label: '知识直播',
    value: Types.live,
  },
};

/**
 * 列表样式
 */
export const listMode = {
  bigPic: {
    label: '大图模式',
    index: 0,
    value: 0,
  },
  twoColsInOneRow: {
    label: '一行两个',
    index: 1,
    value: 1,
  },
  threeColsInOneRow: {
    label: '一行三个',
    index: 2,
    value: 2,
  },
  details: {
    label: '详细列表',
    index: 3,
    value: 3,
  },
  oneBigWithTwoSmall: {
    label: '一大两小',
    index: 4,
    value: 4,
  },
  horizontalSlide: {
    label: '横向滑动',
    index: 5,
    value: 5,
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
    labelAlign: 'center',
  },
  goodsPadding: {
    index: 1,
    formType: Types.slider,
    label: '商品间距',
    labelAlign: 'center',
  },
  goodsStyle: {
    index: 2,
    formType: Types.radio,
    label: '商品样式',
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
  goodsRadius: {
    index: 3,
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
  imgSize: {
    index: 4,
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
    index: 5,
    formType: Types.radio,
    label: '文本样式',
    items: [
      {
        label: '加粗体',
        value: 0,
      },
      {
        label: '常规体',
        value: 1,
      },
    ],
  },
  textAlign: {
    index: 6,
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
    index: 7,
    formType: Types.checkbox,
    label: '显示内容',
    items: {
      course: [
        {
          label: '线下课名称',
          value: 0,
        },
        {
          label: '线下课简介',
          value: 1,
        },
        {
          label: '线下课标签',
          value: 2,
        },
        {
          label: '上课时间',
          value: 3,
        },
        {
          label: '价格',
          value: 4,
        },
      ],
      content: [
        {
          label: '内容标题',
          value: 0,
        },
        {
          label: '内容简介',
          value: 1,
        },
        {
          label: '所属专栏',
          value: 2,
        },
        {
          label: '更新日期',
          value: 3,
        },
        {
          label: '价格',
          value: 4,
        },
      ],
      column: [
        {
          label: '专栏标题',
          value: 0,
        },
        {
          label: '专栏简介',
          value: 1,
        },
        {
          label: '已更新期数',
          value: 2,
        },
        {
          label: '价格',
          value: 3,
        },
      ],
      live: [
        {
          label: '直播标题',
          value: 0,
        },
        {
          label: '直播简介',
          value: 1,
        },
        {
          label: '直播时间',
          value: 2,
        },
        {
          label: '价格',
          value: 3,
        },
      ],
    },
  },
};

export const defaultChecked = {
  course: [0, 1, 4],
  content: [0, 2, 3, 4],
  column: [0, 2, 3],
  live: [0, 2, 3],
};

// 编辑器默认值
export const defaultState = () => {
  const goodsFrom = get(window, '_global.isYZEdu') ? Types.course : Types.column;
  return {
    base: {
      listMode: 0, // 列表样式
      goodsStyle: 0, // 商品样式
      goodsRadius: 0, // 商品倒角
      imgSize: 0, // 图片填充
      textStyle: 1, // 文本样式
      textAlign: 0, // 文本对齐
      pageMargin: 15, // 页面边距
      goodsPadding: 10, // 商品间距
    },
    [Types.EDU_GOODS]: {
      knowledgeGoodsData: {
        goodsFrom, // 商品来源
        title: '课程', // 标题
        showAllGoodsEntry: true, // 是否显示全部入口
        displayTitleBar: 1, // 是否显示标题栏
        goodsFromMode: 0, // 选择展示最新或自定义商品
        maxNewestGoods: 6, // 展示最新的N个最新商品
        goodList: [], // 商品列表
        displayContent: defaultChecked[goodsFrom], // 显示内容
      },
      type: 'knowledge-goods',
    },
    [Types.EDU_GOODS_GROUP]: {
      templateType: 0, // 展示模板
      menuType: 0, // 菜单样式
      menuPosition: 0, // 菜单位置
      displayLabel: true, // 是否展示分组名称
      groupLabel: '', // 分组名称
      groupDesc: '', // 分组简介
      groupFirstRule: 0, // 第一排序规则
      groupSecondRule: 0, // 第二排序规则
      displayContent: defaultChecked, // 显示内容
      type: 'edu-goods-group',
    },
    [Types.EDU_GROUP]: {
      templateType: 0, // 展示模板
      menuType: 0, // 菜单样式
      menuPosition: 0, // 菜单位置
      displayLabel: true, // 是否展示分组名称
      hotTagOrder: 'sold_num_d30', // 最热分组排序规则
      groupLabel: '', // 分组名称
      groupDesc: '', // 分组简介
      groupFirstRule: 0, // 第一排序规则
      groupSecondRule: 0, // 第二排序规则
      displayContent: defaultChecked, // 显示内容
      type: 'edu-group',
    },
  };
};
