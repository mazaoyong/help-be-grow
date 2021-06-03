<template>
  <div class="top" :style="{ 'z-index': source === 'video' ? 10000 : 0}">
    <div class="topgoods">
      <div class="topgoods__hint">
        为你推荐
      </div>
      <a class="topgoods__container" :href="recommend.url">
        <img-wrap
          :class="isPct ? 'topgoods__pctimg' : 'topgoods__goodsimg'"
          :width="isPct ? '108px' : '60px'"
          :height="'60px'"
          :src="thumbnailUrl"
          disable-lazyload
        />
        <div class="topgoods__right">
          <div class="topgoods__title">
            {{ recommend.title }}
          </div>
          <div class="topgoods__price">
            {{ `￥${recommend.price}` }}
          </div>
        </div>
      </a>
    </div>
  </div>
</template>

<script>
import fullfillImage from 'zan-utils/fullfillImage';
import { ImgWrap } from '@youzan/vis-ui';

export default {
  name: 'top-recommends',

  components: {
    ImgWrap,
  },

  props: {
    singleModule: Object,
    // video or audio
    source: String,
  },

  computed: {
    isPct() {
      return this.recommend.productType !== 0;
    },

    recommend() {
      const item = this.singleModule.recommends && this.singleModule.recommends[0];
      if (item) {
        return Object.assign({}, item, {
          price: (item.price / 100).toFixed(2),
          url: item.url || `https://h5.youzan.com/v2/goods/${item.alias}`,
        });
      } else return {};
    },

    thumbnailUrl() {
      const width = this.isPct ? 216 : 120;
      return fullfillImage(this.recommend.cover, `!${width}x${width}.jpg`);
    },
  },
};
</script>

<style lang="scss">
.top {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-sizing: border-box;
  height: 100%;
  width: 100%;
  padding: 0 12px;

  .topgoods {

    &__hint {
      margin-bottom: 10px;
      line-height: 18px;
      font-size: 12px;
      color: #fff;
    }

    &__right {
      flex: 1 1 auto;
      margin-left: 10px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    &__container {
      display: flex;
      color: #fff;
    }

    &__pctimg {
      flex: 0 0 auto;
      width: 108px;
      height: 60px;
      object-fit: cover;
      border-radius: 4px;
    }

    &__goodsimg {
      flex: 0 0 auto;
      width: 60px;
      height: 60px;
      object-fit: cover;
      border-radius: 4px;
    }

    &__title {
      line-height: 18px;
      font-size: 12px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    &__price {
      line-height: 14px;
      font-size: 10px;
    }
  }
}
</style>
