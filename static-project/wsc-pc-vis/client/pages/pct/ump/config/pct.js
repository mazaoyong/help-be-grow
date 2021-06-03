// 知识付费营销工具
import get from 'lodash/get';
import { isInStoreCondition } from 'fns/chain';
const { v4 } = window._global.url;
const pctUrl = v4 + '/vis/pct/page';

const exam = get(window._global, 'whitelist.exam');

export default [
  {
    name: '买赠',
    url: `${pctUrl}/freebie`,
    supportWeapp: true,
    icon: '/public_files/125bdc85cb7e85a1178b99063185ea7a.png',
    srcset:'/public_files/ef1c235bc1edd415f7ba58920ad48497.png',
    desc: '购课赠送多重好礼，促进转化',
    hide: false,
  },
  {
    name: '好友助力',
    url: `${pctUrl}/boost`,
    supportWeapp: true,
    icon: '/public_files/41b2e950bf2ca2d89319bd17df60612b.png',
    srcset:'/public_files/4f879f58c7fcab0962ac3a52e248d403.png',
    desc: '粉丝裂变营销',
  },
  {
    name: '推荐有奖',
    supportWeapp: true,
    url: `${pctUrl}/referral#/referral/`,
    icon: '/public_files/27efbb126053492210ea003d570fad9c.png',
    srcset:'/public_files/57eaf84014e911738a6fa988364d23c7.png',
    desc: '老客带新客，推荐有礼',
  },
  {
    name: '趣味测试',
    supportWeapp: true,
    url: `${pctUrl}/exam#/exam`,
    icon: '/public_files/1ee6fdb6abd3d4feb6e218b9035c000c.png',
    srcset:'/public_files/1a1ea4b951d68bea320e6b9e41493cef.png',
    desc: '在线小测试，互动吸粉',
    hide: exam,
    color: 'green'
  },
];
