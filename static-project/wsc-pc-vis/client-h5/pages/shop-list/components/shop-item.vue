<template>
  <div class="shop-item" @click="toWorkTable">
    <img-wrap
      class="logo"
      :width="'30px'"
      :height="'30px'"
      :src="logo"
      :fullfill="'!60x0.jpg'"
      :cover="false"
    />
    <span class="shop-name">
      {{ shopName }}
    </span>
    <vis-icon
      class="arrow-right"
      name="arrow"
      size="14px"
      color="#7d7e80"
    />
  </div>
</template>

<script>
import { Toast } from 'vant';
import { get } from 'lodash';
import { shop } from 'pages-api';
import { Icon, ImgWrap } from '@youzan/vis-ui';

const global = window._global;

export default {
  name: 'shop-item',
  components: {
    'vis-icon': Icon,
    'img-wrap': ImgWrap,
  },
  props: {
    logo: {
      type: String,
      default: '',
    },
    shopName: {
      type: String,
      default: '',
    },
    kdtId: {
      type: Number,
      default: 0,
    },
  },
  methods: {
    // 集成连锁进店判断
    toWorkTable() {
      // 机构下的校区列表（含总部）
      this.searchShopForSwitch()
        .then(res => {
          // 只有一个校区
          if (res.total === 1) {
            this.authBeforeEntryShop(res.data[0].kdtId)
              .then(() => {
                window.location.href = '/v4/vis/h5/edu/work-table';
              });
          // 连锁多校区
          } else if (res.total > 1) {
            window.location.href = `/v4/vis/h5/edu/mult-shop-list?kdtId=${this.kdtId}`;
          // 单店
          } else {
            this.authBeforeEntryShop(this.kdtId)
              .then(() => {
                window.location.href = '/v4/vis/h5/edu/work-table';
              });
          }
        })
        .catch(msg => {
          Toast(msg || '请重试');
          window.location.href = '/v4/vis/h5/edu/shop-list';
        });
    },
    authBeforeEntryShop(kdtId) {
      return new Promise((resolve, reject) => {
        shop.AuthBeforeEntryShop({
          kdtId,
        })
          .then(() => {
            resolve();
          })
          .catch(msg => {
            Toast(msg || '请重试');
            reject();
          });
      });
    },
    searchShopForSwitch() {
      return shop.searchShopForSwitch({
        hqKdtId: this.kdtId || get(global.shopInfo, 'rootKdtId') || 0,
        pageNumber: 1,
        pageSize: 10,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.shop-item {
  display: flex;
  position: relative;
  margin: 0 auto 10px 0;
  height: 62px;
  border-radius: 4px;
  background-color: #f7f8fa;
  .logo {
    display: block;
    margin: 16px 0 16px 10px;
    border-radius: 15px;
    flex: none;
  }
  .shop-name {
    display: block;
    margin: 0 30px 0 8px;
    width: 160px;
    font-size: 14px;
    font-weight: bold;
    line-height: 62px;
    height: 62px;
    color: #333;
    flex: auto;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  .arrow-right {
    position: absolute;
    top: 24px;
    right: 12px;
  }
}
.tip {
  text-align: center;
}
</style>
