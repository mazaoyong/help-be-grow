const DEFAULT_COLOR = '#f9f9f9';

// 标题组件默认值
export const titleInitialValue = {
  title: '',
  sub_title: '',
  title_template: '0',
  show_method: '0',
  color: DEFAULT_COLOR,
  sub_entry: [],
  // 标题模版
  // 0 => 传统样式
  // 1 => 模仿微信图文页样式
  wx_title_date: '',
  wx_title_author: '',
  wx_title_link: '',
  // 链接地址
  // 0 => 引导关注
  // 1 => 其他链接
  wx_title_link_type: '0',
  wx_link: {},
  wx_link_url: '',
};

// 图文导航默认值
export const imageTextNavInitialValue = {
  show_method: '8', // 8 图片导航，9 文字导航
  background_color: '#f2f2f2',
  color: '#000',
  slide_setting: '0', // 滑动设置
  count: 4, // 横向滑动一屏显示的数量
  border_width: 0, // 图片间隙
};
