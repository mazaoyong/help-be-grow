import isPlainObject from 'lodash/isPlainObject';
import isArray from 'lodash/isArray';
import pick from 'lodash/pick';
import get from 'lodash/get';
import isFunction from 'lodash/isFunction';
import find from 'lodash/find';
import uuid from '../utils/uuid';
import { isExpectedDesginType } from '../utils/design-type';

const UUID_KEY = '__wsc-decorate-uuid__';

// import seckillAdaptor from '@youzan/feature-adaptor/lib/new-seckill';

// 获取编辑数据后进行的操作
export const filterFuncMap = {
  // 分类模板
  classification(data, milestone) {
    if (milestone !== filterDataMileStone.AFTER_FETCH) {
      return data;
    }

    // 移除 undefined / null 的子分类
    return {
      ...data,
      categoryList: data.categoryList.map(item => ({
        ...item,
        subCategoryList: item.subCategoryList.filter(sub => sub !== undefined && sub !== null),
      })),
    };
  },

  // 秒杀
  ump_seckill(item, milestone) {
    if (milestone !== filterDataMileStone.AFTER_FETCH) {
      return item;
    }
    // TODO
    // return seckillAdaptor.newPolyFill(item);
  },

  // 标题
  title(data, milestone) {
    if (milestone !== filterDataMileStone.AFTER_SELECT) {
      return data;
    }

    // 转成 title-text 新组件
    return {
      type: 'title_text',
      template_type: data.title_template,
      title: data.title,
      desc: data.sub_title,
      align: +data.show_method === 2 ? '0' : data.show_method,
      title_size: '16',
      desc_size: '12',
      title_weight: '500',
      desc_weight: '400',
      title_color: '#323233',
      desc_color: '#969799',
      bg_color: data.color,
      show_divider: '0',
      is_link: data.sub_entry[0] && data.sub_entry[0].title ? '1' : '0',
      link_style: '2',
      link_text: '查看更多',
      link: data.sub_entry[0] || {},
      wx_date: data.wx_title_date,
      wx_author: data.wx_title_author,
      wx_link_title: data.wx_title_link,
      wx_link_type: data.wx_title_link_type,
      wx_link: isPlainObject(data.wx_link) ? data.wx_link : {},
    };
  },

  // 文本
  text(data, milestone) {
    if (milestone !== filterDataMileStone.AFTER_SELECT) {
      return data;
    }

    // 转成 title-text 新组件
    return {
      type: 'title_text',
      template_type: '0',
      title: '',
      desc: data.text,
      align: +data.show_method === 2 ? '0' : data.show_method,
      title_size: '16',
      desc_size: `${Math.min(data.font_size, 16)}`,
      title_weight: '500',
      desc_weight: '400',
      title_color: '#323233',
      desc_color: data.color,
      bg_color: data.bg_color,
      show_divider: data.show_split_line,
      is_link: data.link_id || data.link_type ? '1' : '0',
      link_style: '2',
      link_text: '查看更多',
      link: pick(data, ['alias', 'link_type', 'link_id', 'link_title', 'link_url', 'extra_data']),
      wx_date: '',
      wx_author: '',
      wx_link_title: '',
      wx_link_type: '0',
      wx_link: {},
    };
  },

  white(data, milestone) {
    if (milestone !== filterDataMileStone.AFTER_FETCH) {
      return data;
    }

    // 补上辅助线的默认属性
    return {
      ...data,
      lineType: 'solid',
      color: '#e5e5e5',
      hasPadding: 0,
    };
  },

  line(data, milestone) {
    if (milestone !== filterDataMileStone.AFTER_FETCH) {
      return data;
    }

    // 补上辅助空白的默认属性
    return {
      ...data,
      height: 30,
    };
  },

  shop_banner_weapp(data, milestone) {
    // 补齐线下门店组件的默认数据
    if (milestone === filterDataMileStone.AFTER_FETCH) {
      return {
        ...data,
        logo_style: '0',
        logo_url: get(_global, 'mp_data.logo', ''),
        store: {
          id: 0, // H5 的线下门店根据 id 去获取数据，其他属性没用到
          name: '',
          images: ['public_files/2017/07/11/f2a0a05d5a801cb51ecbc0710e6947fb.png'],
          address: '',
          time: '',
        },
      };
    }

    // 只保存店铺信息组件本身的数据
    if (milestone === filterDataMileStone.BEFORE_SAVE) {
      return pick(data, ['type', 'store_info_style', 'background_image']);
    }

    return data;
  },

  offline_shop_info(data, milestone) {
    // 补齐店铺信息组件的默认数据
    if (milestone === filterDataMileStone.AFTER_FETCH) {
      return {
        ...data,
        store_info_style: '0',
        background_image: 'public_files/2017/07/11/f2a0a05d5a801cb51ecbc0710e6947fb.png',
      };
    }

    // 只保存线下门店组件本身的数据
    if (milestone === filterDataMileStone.BEFORE_SAVE) {
      return pick(data, ['type', 'logo_style', 'logo_url', 'store']);
    }

    return data;
  },
};

/**
 * 清洗数据
 * @param {Array} data 源数据
 * @param {Number} milestone 时间节点
 */
export const filterData = (data: any, milestone: number = filterDataMileStone.AFTER_FETCH) => {
  const processFn = item => {
    const fn = filterFuncMap[item.type];
    if (fn) {
      return fn(item, milestone) || item;
    }
    return item;
  };

  if (isArray(data)) {
    return data.map(processFn);
  }

  if (data && data.type) {
    return processFn(data);
  }
};

/**
 * 定义不同的时间节点。在调用 filterDataMap 的时候会传入相应的时间节点
 * 组件可以在上面的 filterFuncMap 中根据需求在不同的时间节点进行数据操作
 */
export const filterDataMileStone = {
  AFTER_FETCH: 0, // 获取组件列表后
  AFTER_SELECT: 50, // 选中组件后
  BEFORE_SAVE: 99, // 保存前
};

export const checkComponentsLength = components => {
  let outOfRange = false;
  if (components.length > 1170000) {
    outOfRange = true;
  }

  return outOfRange;
};

export const shouldAddComponentPromise = (component, fn) => {
  if (isFunction(fn)) {
    return fn(component);
  }

  return Promise.resolve(true);
};

export const tagValuesWithUUID = values => {
  values.forEach(v => {
    if (!v[UUID_KEY]) {
      v[UUID_KEY] = uuid();
    }
  });
};

export const getUUIDFromValue = value => {
  return value && value[UUID_KEY];
};

export const validateComponentValue = (value, prevValue, changedProps, comEditors) => {
  const { type } = value;
  const comp = find(comEditors, c => isExpectedDesginType(c, type));
  const { validate } = comp.editor;
  let p;
  if (validate) {
    p = validate(value, prevValue, changedProps);
  } else {
    p = new Promise(resolve => {
      resolve([]);
    });
  }

  return p;
};
