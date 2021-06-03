import cloneDeep from 'lodash/cloneDeep';

// 实物分组数据格式
// // 分组名称
// title: '',
// // 是否显示分组名称
// show_tag_title: '1',
// // 第一排序优先级
// first_priority: '0',
// // 第二排序优先级
// second_priority: '1',
// // 列表样式（0: 大图, 1: 小图, 2: 一大两小, 3: 详细列表)
// size: '2',
// // (0: 卡片式, 1: 瀑布流, 2: 极简样式)
// size_type: '0',
// // 显示购买按钮（0: 不显示, 1: 显示）
// buy_btn: '1',
// // 购买按钮样式
// buy_btn_type: '1',
// // 显示商品名（0: 不显示, 1: 显示）
// show_title: '0',
// // 显示价格（0: 不显示, 1: 显示）
// price: '1',
// // 是否显示购物车图标
// cart: '1',
// content: '',
// // 是不是默认的分类
// is_default: '0',
// // 最热分类下用，用来配置按照pv或者按照销量排序
// hot_tag_order: ''
export function tagGoodsAdapter(list) {
  const _list = cloneDeep(list);
  const configData = _list.filter(item => item.type === 'config')[0]; // 页面配置
  const groupData = _list.filter(item => item.type === 'edu-group')[0]; // 分组配置

  if (groupData) {
    const {
      displayLabel,
      groupFirstRule,
      groupSecondRule,
      // listMode,
      groupLabel,
      isDefault,
    } = groupData;

    configData.show_tag_title = displayLabel ? '1' : '0';

    // 后端根据first_priority、second_priority做排序
    if (groupFirstRule === 0) { // 序号越大越靠前
      configData.first_priority = '0';
    }
    if (groupFirstRule === 1) { // 最热的排在前面
      configData.first_priority = '3';
    }

    if (groupSecondRule === 0) { // 创建时间越晚越靠前
      configData.second_priority = '1';
    }
    if (groupSecondRule === 1) { // 创建时间越早越靠前
      configData.second_priority = '2';
    }
    if (groupSecondRule === 2) { // 最热的排在前面
      configData.second_priority = '3';
    }

    // 实物商品的title代表分组名称和页面名称，但是教育分组的分组名称和页面名称是区分开的（产品确认）
    // 此处把title赋值给page_title提交，后端返回时转换回title
    configData.page_title = configData.title;
    configData.title = groupLabel;

    // 仅做兼容
    configData.hot_tag_order = '';
    configData.size_type = '0';
    configData.is_default = `${isDefault}`;
    configData.content = '';
    configData.cart = '0';
    configData.price = '0';
    configData.show_title = '0';
    configData.size = '0';
  }

  _list[0] = configData;
  return _list;
}

export function getDefaultGroupData() {
  return [
    {
      'type': 'config',
      'title': '微页面标题',
      'color': '#f9f9f9',
      'is_global_setting': '1',
      'category': [],
      'description': '',
      'show_tag_title': '1',
      'first_priority': '0',
      'second_priority': '1',
      'page_title': '微页面标题',
      'hot_tag_order': '',
      'size_type': '0',
      'is_default': '0',
      'content': '',
      'cart': '0',
      'price': '0',
      'show_title': '0',
      'size': '0',
    },
    {
      'hotTagOrder': 'sold_num_d30',
      'listMode': 0,
      'goodsStyle': 0,
      'goodsRadius': 0,
      'imgSize': 0,
      'textStyle': 1,
      'textAlign': 0,
      'pageMargin': 15,
      'goodsPadding': 10,
      'templateType': 0,
      'menuType': 0,
      'menuPosition': 0,
      'displayLabel': true,
      'groupLabel': '课程分组',
      'groupDesc': '',
      'groupFirstRule': 0,
      'groupSecondRule': 0,
      'displayContent': {
        'course': [
          0,
          1,
          4,
        ],
        'content': [
          0,
          2,
          3,
          4,
        ],
        'column': [
          0,
          2,
          3,
        ],
        'live': [
          0,
          2,
          3,
        ],
      },
      'type': 'edu-group',
    },
  ];
}
