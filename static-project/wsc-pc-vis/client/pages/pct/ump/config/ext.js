import React from 'react';

import CommentsPlugin from '../components/comments-plugin';
import { isInStoreCondition } from 'fns/chain';

const { v4 } = window._global.url;
const pctUrl = v4 + '/vis/pct/page';

// 是否是微商城连锁店铺
import {  isPureWscChainStore, isUnifiedShop, isRetailMinimalistPartnerStore } from '@youzan/utils-shop';


// 拓展功能
export default [
  {
    name: '信息隐藏',
    desc: '相关数据指标隐藏',
    url: `${pctUrl}/settings#/hiding`,
    icon: '/public_files/8b08d6e01af195c12a78682d73778764.png',
    srcset: '/public_files/0e691a1546a6fc9e9ad3defb3deaa04b.png',
    color:'green'
  },
  {
    name: '留言管理',
    desc: '用户心得交流，即时反馈评价',
    url: `${pctUrl}/comment`,
    icon: '/public_files/f93cf02f388b06799e3021a52800fe01.png',
    srcset: '/public_files/321316aa391e1d4781bb7953a8d5bde3.png',
    plugins: [<CommentsPlugin key="comment" />],
    color:'green',
  },
  {
    name: '课程分组',
    desc: '自定义课程分组',
    url: `${pctUrl}/courseGroup`,
    icon: '/public_files/de84dd77f619d7bc82f2d717a8933867.png',
    srcset:'/public_files/b3dd1551e03ed3aceaf3b3316743014c.png',
    color:'green',
    // 在零售 3.0 店铺下隐藏掉课程分组
    hide: isUnifiedShop
  }
];
