<template>
  <a
    class="goods-item"
    :href="url"
  >
    <div class="img">
      <img-wrap
        width="100%"
        height="100%"
        :src="thumbUrl"
        :cover="false"
      />
      <div class="type">
        {{ typeStr }}
      </div>
    </div>
    <div class="info">
      <h2>{{ title }}</h2>
      <div class="info__ft">
        <div v-if="showPrice" class="price">
          <i>￥</i>
          <span>{{ priceStr }}</span>
        </div>
        <div v-else class="price" />
        <div
          v-if="count"
          class="count"
        >
          <span>{{ count }}</span>
          <span>{{ suffix }}</span>
        </div>
      </div>
    </div>
  </a>
</template>

<script>
import { ImgWrap } from '@youzan/vis-ui';
import get from 'lodash/get';
import { formatSalesNum } from '../../utils';
import { getSuffix } from 'common/utils/hide-info';

const EnumType = {
  1: '专栏',
  2: '内容',
  4: '直播',
  10: '线下课',
};

const EnumMediaType = {
  1: '图文',
  2: '音频',
  3: '视频',
  4: '直播',
};

export default {
  name: 'goods-item',
  components: {
    'img-wrap': ImgWrap,
  },
  props: {
    thumbUrl: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      default: 0,
    },
    title: {
      type: String,
      default: '',
    },
    url: {
      type: String,
      default: '',
    },
    type: {
      type: Number,
      default: -1,
    },
    mediaType: {
      type: Number,
      default: -1,
    },
    subscriptionCount: {
      type: Number,
      default: 0,
    },
    pageView: {
      type: Number,
      default: 0,
    },
    showPrice: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {};
  },
  computed: {
    typeStr() {
      const { type, mediaType } = this;
      let str = get(EnumType, type, '未知');
      if (type === 2) {
        str = get(EnumMediaType, mediaType, '未知');
      }
      return str;
    },
    priceStr() {
      const { price } = this;
      return price / 100;
    },
    count() {
      const { subscriptionCount, pageView, type } = this;
      const countMap = {
        1: subscriptionCount,
        2: pageView,
        4: pageView,
        10: subscriptionCount,
      };
      const count = countMap[type];
      return count ? formatSalesNum(count) : 0;
    },
    suffix() {
      return getSuffix(this.type, this.mediaType);
    },
  },
};
</script>

<style lang="scss">
.goods-item {
  display: flex;
  flex-direction: row;
  height: 118px;
  box-sizing: border-box;
  padding: 10px 15px;

  .img {
    position: relative;
    margin-right: 15.5px;
    width: 98px;
    height: 98px;

    .type {
      position: absolute;
      font-size: 11px;
      padding: 1px 6px;
      background: rgba(51, 51, 51, .7);
      border-radius: 2px;
      color: #fff;
      bottom: 5px;
      right: 5px;
    }
  }

  .info {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    width: 0;
    justify-content: space-between;
    position: relative;

    h2 {
      display: -webkit-box;
      font-size: 14px;
      color: #333;
      line-height: 17px;
      text-overflow: ellipsis;
      overflow: hidden;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    &__ft {
      display: flex;
      flex-direction: row;
      justify-content: space-between;

      .price,
      .count {
        display: flex;
        flex-direction: row;
        width: 0;
        align-items: center;
      }

      .price {
        flex-basis: 60%;
        color: #f44;
        font-size: 0;
        align-items: baseline;

        i,
        span {
          line-height: 17px;
          display: block;
        }

        i {
          font-size: 12px;
        }

        span {
          font-size: 16px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }

      .count {
        flex-basis: 40%;
        color: #999;
        font-size: 13px;
        line-height: 18px;
        justify-content: flex-end;
      }
    }
  }
}
</style>
