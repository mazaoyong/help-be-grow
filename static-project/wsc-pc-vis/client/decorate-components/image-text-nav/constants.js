// 选择模板
export const tempTypeMap = [
  {
    title: '图片导航',
    image: '/public_files/2018/03/05/529cce58887e92027398cae070cb1a09.png',
    value: '8',
  },
  {
    title: '文字导航',
    image: '/public_files/2018/03/05/570bc12622847a5a100e4697c88065ef.png',
    value: '9',
  },
];

// 一屏可选的图片/文本数量
export const imageNavOptions = [4, 5, 6, 7, 8, 9, 10];

// 导航添加最大数量
export const NAV_MAXNUM = 10;

// 横向滑动
export const crossMode = '1';

// 图片导航
export const imageNav = '8';

// 文本导航
export const textNav = '9';

export const defaultImageTextNavData = {
  type: 'image_ad_selection',
  title: '',
  image_id: 0,
  image_url: '',
  image_thumb_url: '',
  image_width: 0,
  image_height: 0,
  link_id: '',
  link_type: '',
  link_title: '',
  link_url: '',
  alias: '',
};

export const imageHelpText = '该图片在小程序不显示';
export const textHelpText = '该文字在小程序不显示';
