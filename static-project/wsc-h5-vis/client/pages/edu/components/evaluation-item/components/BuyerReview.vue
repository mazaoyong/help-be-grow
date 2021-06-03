<template>
  <div class="buyer-review">
    <p class="buyer-review__title tag-text">
      {{ days }}
    </p>
    <p
      v-if="value.evaluation"
      class="buyer-review__content"
    >
      {{ value.evaluation }}
    </p>
    <img-list
      v-if="value.pictures && value.pictures.length > 0"
      :mode="mode"
      :list="value.pictures"
    />
  </div>
</template>

<script>
import ImgList from './ImgList';

export default {
  name: 'buyer-review',

  components: {
    ImgList,
  },

  props: {
    mode: Number,
    value: Object,
  },

  computed: {
    days() {
      if (this.value.days > 0) {
        return `用户${this.value.days}天后追评`;
      } else {
        return '用户当天追评';
      }
    },
  },
};
</script>

<style lang="scss">
.buyer-review {
  margin-top: 10px;
  padding-top: 10px;
  position: relative;

  &::before {
    top: 0;
    right: 0;
    left: 40px;
    content: ' ';
    position: absolute;
    pointer-events: none;
    box-sizing: border-box;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    border-bottom: 1px solid #ebedf0;
  }

  &__title {
    color: #f44;
    font-size: 12px;
    padding: 5px 0 5px 40px;
  }

  &__content {
    line-height: 20px;
    font-size: 13px;
    color: #323233;
    padding: 5px 0 5px 40px;
    word-wrap: break-word;
  }
}
</style>
