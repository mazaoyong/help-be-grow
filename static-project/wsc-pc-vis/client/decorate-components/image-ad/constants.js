import { tagMap } from '@youzan/react-components/es/components/choose-dialog/ChooseMenu';

// 选择模板
export const tempTypeMap = [
  {
    title: '一行一个',
    image: '/public_files/2018/10/16/53de703992f6bf2e6f02af1141a01e28.png',
    value: '7',
    suitableWidth: 750,
  },
  {
    title: '轮播海报',
    image: '/public_files/2018/10/16/b0278c2049020fa553715ff6f7693e35.png',
    value: '5',
  },
  {
    title: '大图横向滑动',
    image: '/public_files/2018/10/16/84f845b6bb88de38ba20ad4d1d367de0.png',
    value: '6',
    size: '0',
    suitableWidth: 670,
  },
  {
    title: '小图横向滑动',
    image: '/public_files/2018/10/16/339902d75cd7526336282fe842f2477f.png',
    value: '6',
    size: '1',
    suitableWidth: 305,
  },
  {
    title: '导航横向滑动',
    image: '/public_files/2018/10/16/64caa6255228d07633b8caa1c0b08312.png',
    value: '6',
    size: '2',
  },
  {
    title: '绘制热区',
    image: '/public_files/2018/10/16/6e73c52489306e39010d63ef20970d49.png',
    value: '7',
  },
];

export const imageNavOptions = [4, 5, 6, 7, 8, 9, 10];

// 图片广告最大数量限制
export const MAXNUM = 10;

// 热区编辑器步骤
export const hotAreaEditorSteps = ['添加热区', '调整热区大小和位置', '设置关联链接', '保存生效'];

export const hotAreaLinkTitleMap = tagMap;

export const hotAreaDialogImageWidth = 526;

export const helpText = '该图片在小程序不显示';

export const DEFAUTL_INDEX = 0;
export const TOP_DOWN_INDEX = 0;
export const CAROUSEL_INDEX = 1;
export const BIG_SCORLL_INDEX = 2;
export const SMALL_SCORLL_INDEX = 3;
export const IMAGE_NAV_INDEX = 4;
export const HOT_AREA_INDEX = 5;
export const IMAGE_SPACING_INDEX_BAG = [
  TOP_DOWN_INDEX,
  BIG_SCORLL_INDEX,
  SMALL_SCORLL_INDEX,
  IMAGE_NAV_INDEX,
  HOT_AREA_INDEX,
];
