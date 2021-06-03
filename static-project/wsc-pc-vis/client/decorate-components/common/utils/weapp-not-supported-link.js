import React from 'react';
import has from 'lodash/has';
import includes from 'lodash/includes';
import isNil from 'lodash/isNil';
import isFinite from 'lodash/isFinite';
import { tagMap as LINK_TYPE_MAP } from '@youzan/react-components/es/components/choose-dialog/ChooseMenu';
import '@youzan/react-components/es/components/choose-dialog/style';

const PREFIX = '小程序暂不支持';

// http://doc.qima-inc.com/pages/viewpage.action?pageId=10691308
export const GOODS_TYPE = {
  0: '普通',
  1: '拍卖',
  3: '降价拍',
  5: '外卖',
  10: '分销',
  20: '会员卡',
  21: '礼品卡',
  22: '团购券',
  23: '会议',
  25: '批发',
  30: '收银台',
  31: '知识付费',
  32: '药品',
  35: '酒店',
  40: '美业',

  // 暂时停用
  // 这两个判断不能用 goods_type，直接判断 is_virtual
  // 2: 虚拟商品
  // 3: 电子卡券
  60: '虚拟商品',
  61: '电子卡券',
};

// FIXME：直接读 _global
// 小程序分销白名单预计2018.3月底全量上线，到时候把这段条件代码去掉。
export const NOT_SUPPORTTED_GOODS_TYPE = [35];

// FIXME：直接读 _global
// 小程序分销白名单预计2018.3月底全量上线，到时候把这段条件代码去掉。
export const WEAPP_NOT_SUPPORTED_MSG = '小程序仅支持显示实物（含分销）、虚拟、电子卡券商品';
export const WEAPP_NOT_SUPPROTED_HOTEL_MSG =
  '小程序 v2.17 及以上版本支持，小程序仅支持显示实物（含分销）、虚拟、电子卡券商品';
export const WEAPP_NOT_SUPPROTED_BARGAIN_MSG = (
  <div>
    <p>小程序v2.23.6及以上版本支持，小程序仅支持显示实物（含分销）、虚拟、电子卡券商品;</p>
    <p>
      小程序 v2.39 以下暂不支持砍价活动自动获取，升级后可使用自动获取功能。
      <a
        href="https://www.youzan.com/v2/showcase/weapp/settings"
        target="_blank"
        rel="noopener noreferrer"
      >
        升级链接地址
      </a>
    </p>
    <p>
      10月25日起微信内打开的H5页面中不展示砍价组件，小程序页面正常展示。
      <a
        href="https://bbs.youzan.com/forum.php?mod=viewthread&tid=677881&page=1&extra=#pid3858390"
        target="_blank"
        rel="noopener noreferrer"
      >
        查看公告详情
      </a>
    </p>
  </div>
);

export const WEAPP_NOT_SUPPROTED_HOTEL_MSG_LIMIT_DISCOUNT =
  '小程序 v2.22.3 及以上版本支持，小程序仅支持显示实物（含分销）、虚拟、电子卡券商品';

const TYPE_FORMATTER = {
  goods(link) {
    let { goods_type: goodsType } = link;

    if (!isNil(goodsType)) {
      goodsType = +goodsType;
    }

    if (includes(NOT_SUPPORTTED_GOODS_TYPE, goodsType)) {
      return `${PREFIX}${GOODS_TYPE[goodsType]}${LINK_TYPE_MAP.goods}`;
    }
  },

  feature(link) {
    const templateId = +link.template_id;

    // 17 是外卖模版，小程序支持
    if (isFinite(templateId) && templateId > 1 && templateId < 19 && templateId !== 17) {
      return `${PREFIX}此模版下的${LINK_TYPE_MAP.feature}`;
    }
  },

  guaguale() {
    return `${PREFIX}${LINK_TYPE_MAP.guaguale}`;
  },

  wheel() {
    return `${PREFIX}${LINK_TYPE_MAP.wheel}`;
  },

  zodiac() {
    return `${PREFIX}${LINK_TYPE_MAP.zodiac}`;
  },

  crazyguess() {
    return `${PREFIX}${LINK_TYPE_MAP.crazyguess}`;
  },

  survey() {
    return `${PREFIX}${LINK_TYPE_MAP.survey}`;
  },

  history() {
    return `${PREFIX}${LINK_TYPE_MAP.history}`;
  },

  link() {
    return `${PREFIX}${LINK_TYPE_MAP.link}`;
  },

  // 多网店-网店列表
  offlinelist() {
    return `${PREFIX}${LINK_TYPE_MAP.offlinelist}`;
  },

  // 多网店-某网点主页
  offlinepage() {
    return `${PREFIX}${LINK_TYPE_MAP.offlinepage}`;
  },
};

export function getWeappNotSuppertedLinkMessage(link) {
  const { link_type: linkType } = link;

  if (has(TYPE_FORMATTER, linkType)) {
    return TYPE_FORMATTER[linkType](link);
  }
}
