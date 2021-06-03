<template>
  <div class="present-popup">
    <section
      v-for="item in couponAndScore"
      :key="item.id"
      class="section"
    >
      <div class="title">
        {{ item.sectionTitle }}
      </div>
      <div class="sub-title">
        {{ `送${item.name}` }}
      </div>
    </section>

    <section
      v-if="presentGoods"
      class="section good"
    >
      <div class="title">
        送赠品
      </div>
      <template v-for="good in presentGoods">
        <a
          :key="good.id"
          :href="good.url"
          @click="stopPropagation"
        >
          <div class="good-item">
            <img-wrap
              class="img-wrap"
              width="110px"
              height="62px"
              fullfill="!small.jpg"
              :src="good.imageUrl"
              :cover="false"
            />
            <div class="content">
              <div class="title">{{ good.title }}</div>
              <div class="sub-title">
                <span class="desc">{{ good.desc }}</span>
                <span class="num">{{ good.num | pipeNum }}</span>
              </div>
              <p
                v-theme:color.main
                class="price"
              >
                ￥{{ good.price }}
              </p>
            </div>
          </div>

        </a>
      </template>
    </section>
  </div>
</template>

<script >
// 由于使用 store ，命令式的 popup 暂时还不能连接 store ，所以这里用声明式组件
import { ImgWrap } from '@youzan/vis-ui';

export default {
  components: {
    ImgWrap,
  },
  filters: {
    pipeNum(val) {
      return `x${val}`;
    },
  },

  props: {
    /**
     * coupon?:
     * score?: {}
     * good?: { goods: Array<{imageUrl, num, url, presentPrice}>}
     */
    presentInfo: {
      type: Object,
      default() {
        return {};
      },
    },
  },

  computed: {
    couponAndScore() {
      const { coupon, score } = this.presentInfo;
      return [coupon, score].filter((d) => d);
    },
    presentGoods() {
      const { good } = this.presentInfo;
      if (!good) return null;
      return good.goods;
    },
  },

  methods: {
    stopPropagation(e) {
      e.stopPropagation();
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'mixins/index.scss';

.present-popup {
  padding: 16px;
  padding-top: 5px;

  .section {
    margin-bottom: 16px;

    .title {
      color: $main-text-color;
      font-weight: bold;
      font-size: 14px;
      margin-bottom: 4px;
      line-height: 18px;
    }

    .sub-title {
      color: $disabled-color;
      font-size: 12px;
      line-height: 16px;
    }
  }

  .good-item {
    padding: 12px 0px;
    display: flex;

    .img-wrap {
      margin-right: 6px;
      flex-shrink: 0;
      border-radius: 4px;
      overflow: hidden;
    }

    .content {
      display: flex;
      flex: 1;
      flex-direction: column;
      justify-content: space-between;

      .title {
        overflow: hidden;
        max-height: 32px;
        font-size: 12px;
        font-weight: normal;
        line-height: 16px;
      }

      .sub-title {
        display: flex;
        justify-content: space-between;

        .desc {
          @include ellipsis;
          margin-right: 15px;
        }
      }
      .price {
        font-size: 14px;
        font-weight: bold;
      }
    }
  }
}
</style>
