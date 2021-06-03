export const TITLE = {
  title: '猜你喜欢', // 推荐位名称
  type: 0, // 写死，传统模式
  showMethod: '0', // 显示位置，0:居左，1:居中，2:居右
  subTitle: '', // 副标题
  backgroundColor: '#f9f9f9', // 背景颜色
  showTitleComponent: 1,
  source: 0, // 推荐规则 0：猜你喜欢 1：看了又看 2：买了又买 3：大家都在买
};

export const GOODS = {
  countType: '0', // 显示个数类型，0:手动输入，1:全部
  // 商品
  goods: [],

  // 商品分组
  goods_list: {},

  // 商品来源类型选择(0: 商品来源，1：商品分组来源)
  goods_from: '0',

  // 显示比例
  display_scale: '0',

  // 显示个数
  goods_number_v2: '6',

  // 列表样式（0: 大图, 1: 小图, 2: 一大两小, 3: 详细列表)
  size: '0',

  // (0: 卡片1, 1: 瀑布流, 2: 极简样式, 3: 促销样式, 5: 卡片2)
  size_type: '0',

  // 显示购买按钮（0: 不显示, 1: 显示）
  buy_btn: '1',

  // 购买按钮样式
  buy_btn_type: '1',

  // 一行三个以及横向滚动：是否显示购买按钮。
  // 这两种情况下 buy_btn 是不生效的。
  // 默认不显示
  buy_btn_express: '0',

  // 购买按钮自定义文案
  button_text: '',

  // 显示商品名（0: 不显示, 1: 显示）
  title: '1',

  // 显示商品描述
  show_sub_title: '1',

  // 显示价格（0: 不显示, 1: 显示）
  price: '1',

  // 是否显示角标 (0: 不显示, 1: 显示)
  show_corner_mark: '0',

  // 角标样式（0: 新品, 1: 热卖, 2: NEW, 3: HOT, 4: 自定义）
  corner_mark_type: '0',

  // 自定义角标图片
  corner_mark_image: '',

  // 编辑时的默认占位图片，一般通过各个微页面模板指定
  default_image_url: '',

  // 图片填充方式
  image_fill_style: '1',

  // 页面边距
  page_margin: 15,

  // 商品间距
  goods_margin: 10,

  // 商品倒角 (1: 直角, 2: 圆角)
  border_radius_type: '1',

  // 文本对齐方式（left: 左对齐, center: 居中）
  text_align_type: 'left',

  // 文本样式 (1: 常规体, 2: 加粗体)
  text_style_type: '2',
};

// 推荐位名称字数上限
export const TITLE_MAX_NUM = 8;
// 推荐位名称字数超上限提示
export const TITLE_MAX_NOTICE = `最多输入${TITLE_MAX_NUM}个字`;

export const ALIGN_TEXT = ['左对齐', '居中', '右对齐'];

export const SOURCE_LIST = [
  {
    value: 0,
    title: '猜你喜欢',
    tip: '根据用户综合行为进行推荐',
    position: 'top-left',
  },
  {
    value: 1,
    title: '看了又看',
    tip: '侧重推荐用户经常浏览的商品',
    position: 'top-right',
  },
  {
    value: 2,
    title: '买了又买',
    tip: '侧重推荐复购率高的商品',
    position: 'top-left',
  },
  {
    value: 3,
    title: '大家都在买',
    tip: '侧重推荐销量、好评率高的商品',
    position: 'top-right',
  },
];

export const SOURCE_MAP = SOURCE_LIST.reduce((map, item) => {
  map[item.value] = item.title;
  return map;
}, {});
