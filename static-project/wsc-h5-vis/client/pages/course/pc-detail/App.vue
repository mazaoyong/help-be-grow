<template>
  <layout-pc-detail>
    <component
      :is="item.type"
      v-for="item in design.header"
      slot="header"
      :key="item.type"
    />

    <component
      :is="item.type"
      v-for="item in design.main"
      slot="main"
      :key="item.type"
    />

    <component
      :is="item.type"
      v-for="item in design.detail"
      slot="detail"
      :key="item.type"
    />

    <component
      :is="item.type"
      v-for="item in design.aside"
      :key="item.type"
      slot="aside"
    />

    <component
      :is="item.type"
      v-for="item in design.left"
      :key="item.type"
      slot="left"
    />

    <component
      :is="item.type"
      v-for="item in design.right"
      slot="right"
      :key="item.type"
    />

    <component
      :is="item.type"
      v-for="item in design.footer"
      slot="footer"
      :key="item.type"
    />
  </layout-pc-detail>
</template>

<script>
import asyncComponentLoader from '@/pages/course/detail/common/async-component-loader';
import LayoutPcDetail from './components/layouts/layout-pc-detail';
import { notifyBuyStatus } from './modules/buy';
import { notifyCollectInfoStatus } from './modules/navigation/live';

/* blocks:start */
import BlockLogo from './blocks/block-logo';
import BlockUserLogin from './blocks/block-user-login';
import BlockCover from './blocks/block-cover';
import BlockBaseInfo from './blocks/block-base-info';
import BlockDetail from './blocks/block-detail';

const BlockMobileQrcode = asyncComponentLoader(
  () => import(
    // webpackChunkName: 'block-mobile-qrcode'
    './blocks/block-mobile-qrcode'
  ),
  'block-mobile-qrcode',
);
const BlockShopQrcode = asyncComponentLoader(
  () => import(
    // webpackChunkName: 'block-shop-qrcode'
    './blocks/block-shop-qrcode'
  ),
  'block-shop-qrcode',
);
/* blocks:end */

export default {
  components: {
    LayoutPcDetail,

    BlockLogo,
    BlockUserLogin,
    BlockCover,
    BlockBaseInfo,
    BlockDetail,
    BlockMobileQrcode,
    BlockShopQrcode,
  },

  rootState: ['design', 'goodsData'],

  rootGetters: ['needCollectInfo'],

  mounted() {
    notifyBuyStatus(this.goodsData.isOwnAsset);
    notifyCollectInfoStatus(this.goodsData, this.needCollectInfo);
  },
};
</script>
