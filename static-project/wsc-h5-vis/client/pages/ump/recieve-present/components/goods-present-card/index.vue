<template>
  <goods-card title="以下实物赠品需要填写收货地址/选择自提点：">
    <div class="goods-list">
      <div v-for="item in list" :key="item.alias" class="goods-present">
        <img-wrap
          width="72px"
          height="72px"
          class="goods-img"
          :cover="false"
          fullfill="!100x100.jpg"
          :src="item.imageUrl"
        />
        <div class="goods-info">
          <div class="goods-title">
            {{ item.title }}
          </div>
          <div class="goods-extra">
            <span class="goods-sku">{{ item.presentSkuDesc }}</span>
            <span class="goods-num">{{ item.num ? `x${item.num}` : '' }}</span>
          </div>
          <div class="btn-area">
            <!-- vant升级2.0之后，可直接使用url参数 -->
            <van-button
              class="reveive-btn main-btn"
              type="primary"
              size="mini"
              tag="a"
              :href="getUrl(item)"
              round
            >
              {{ getText(item) }}
            </van-button>
          </div>
        </div>
      </div>
    </div>
  </goods-card>
</template>

<script>
import { Button } from 'vant';
import { ImgWrap } from '@youzan/vis-ui';
import GoodsCard from '../goods-card';

const { kdt_id: kdtId } = _global;

export default {
  name: 'goods-present-card',

  components: {
    [Button.name]: Button,
    [ImgWrap.name]: ImgWrap,
    [GoodsCard.name]: GoodsCard,
  },

  props: {
    list: {
      type: Array,
      default() {
        return [];
      },
    },
  },

  methods: {
    getUrl(item) {
      // 0：未领取 1：已领取
      if (item.receiveStatus) {
        return `/wsctrade/order/detail?order_no=${item.presentOrderNo}&kdt_id=${kdtId}`;
      }
      return `/wscgoods/detail/${item.alias}?alias=${item.alias}&present=${item.presentRecordAlias}`;
    },

    getText(item) {
      // 0：未领取 1：已领取
      if (item.receiveStatus) {
        return '查看订单';
      }
      return '立即领取';
    },
  },
};
</script>

<style lang="scss" scoped>
@import "mixins/index.scss";

.goods-present {
  display: flex;
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }
}

.goods-img {
  margin-right: 8px;
  flex-shrink: 0;
  border-radius: 3px;
}

.goods-info {
  width: 100%;
  flex: 1 1 0;
  overflow: hidden;
}

.goods-title {
  margin: 2px 0;
  font-size: 13px;
  line-height: 16px;
  color: #323233;
  word-break: break-all;
  @include ellipsis;
}

.goods-extra {
  height: 30px;
  font-size: 12px;
  line-height: 16px;
  color: #C8C9CC;
}

.goods-num {
  float: right;
}

.btn-area {
  text-align: right;
}

.btn-area .reveive-btn {
  padding: 0 10px;
  width: auto;

  &::after {
    border: 0 none;
  }
}
</style>
