import React from 'react';
import ContentList from '../../course/content/list/';
import LiveList from '../../course/live/list';
import ColumnList from '../../course/column/list';
import PunchList from '../../ump/punch/ListPage';
import Ump from '../ump/app';
import BenefitList from '../../ump/benefit/list';
import OrderRecord from '../../ump/record/order';

import { arrayWrapper } from 'fns/chain';
import {
  isWscHqStore,
  isUnifiedHqStore,
  isUnifiedShop,
  isRetailMinimalistHqStore,
  isRetailMinimalistShop,
  isRetailMinimalistPartnerStore,
  isUnifiedPartnerStore
} from '@youzan/utils-shop';

// 判断是否显示badge
import UmpTabsContent from './components/ump-tabs-content';

export const TabsConfig = arrayWrapper(
  {
    // 群打卡在微商城总店、零售3.0总店，零售极简版合伙人中不展示
    '3': !(
      isWscHqStore ||
      isUnifiedHqStore ||
      isRetailMinimalistHqStore ||
      isRetailMinimalistPartnerStore ||
      isUnifiedPartnerStore
    ),
    // 会员权益支持零售 3.0 店铺
    '5': !_global.isSuperStore || isUnifiedShop || isRetailMinimalistShop,
  },
  [
    {
      path: 'content',
      name: '内容',
      component: ContentList,
    },
    {
      path: 'live',
      name: '直播',
      component: LiveList,
    },
    {
      path: 'column',
      name: '专栏',
      component: ColumnList,
    },
    {
      path: 'punch',
      name: '群打卡',
      component: PunchList,
    },
    {
      path: 'ump',
      name: <UmpTabsContent />,
      component: Ump,
    },
    {
      path: 'benefit',
      name: '会员权益',
      component: BenefitList,
    },
    {
      path: 'order',
      name: '订购记录',
      component: OrderRecord,
    },
  ],
);
