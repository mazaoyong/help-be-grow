<template>
  <div class="list">
    <div class="list__title">
      {{ title }}({{ total }})
    </div>
    <slot />
    <p
      v-show="!finished && !loading"
      class="list__showmore"
      @click="onShowMore">
      显示更多
    </p>
    <van-loading v-show="loading" class="list__loading" />
  </div>
</template>

<script>
import { Loading } from 'vant';

export default {
  name: 'show-more-list',

  components: {
    'van-loading': Loading,
  },

  props: {
    loading: Boolean,
    finished: Boolean,
    title: String,
    total: Number,
  },

  methods: {
    onShowMore() {
      this.$emit('show-more');
    },
  },
};
</script>

<style lang="scss" scoped>
.list {
  background: #f7f8fa;
  padding-bottom: 8px;

  &__title {
    padding: 12px 16px;
    font-size: 14px;
    line-height: 20px;
    color: #323233;
    background: #fff;
  }

  &__showmore {
    height: 30px;
    line-height: 30px;
    text-align: center;
    font-size: 12px;
    color: #999;
  }
}
</style>
