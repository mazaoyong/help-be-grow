<template>
  <a
    v-if="audioOrVideoPlayEndRecommendGoods"
    class="recommend"
    :href="url"
  >
    <p>为你推荐</p>
    <div class="goods">
      <img-wrap
        class="image"
        :width="`${isEdu ? 108 : 60}px`"
        height="60px"
        :fullfill="`!small.jpg`"
        :src="audioOrVideoPlayEndRecommendGoods.cover"
        disable-lazyload
      />
      <div class="info">
        <p class="title">{{ audioOrVideoPlayEndRecommendGoods.title }}</p>
        <p>￥{{ price }}</p>
      </div>
    </div>
  </a>
</template>

<script>
import format from '@youzan/utils/money/format';
import { ImgWrap } from '@youzan/vis-ui';

export default {
  components: {
    'img-wrap': ImgWrap,
  },

  rootState: ['kdtId', 'audioOrVideoPlayEndRecommendGoods'],

  computed: {
    isEdu() {
      return this.audioOrVideoPlayEndRecommendGoods.productType !== 0;
    },

    price() {
      return format(this.audioOrVideoPlayEndRecommendGoods.price);
    },

    url() {
      const { alias = '' } = this.audioOrVideoPlayEndRecommendGoods;
      return this.isEdu
        ? `/wscvis/course/detail/${alias}?kdt_id=${this.kdtId}`
        : `/wscgoods/detail/${alias}`;
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'mixins/index.scss';

.recommend {
  display: block;
  font-size: 12px;
  line-height: 16px;
  color: $white;
  text-align: left;

  .goods {
    display: flex;
    margin-top: 12px;

    .image {
      flex-shrink: 0;
      margin-right: 12px;
      border-radius: 4px;
    }

    .info {
      width: 100%;

      .title {
        @include multi-ellipsis(2);

        height: 32px;
        margin-bottom: 12px;
      }
    }
  }
}
</style>
