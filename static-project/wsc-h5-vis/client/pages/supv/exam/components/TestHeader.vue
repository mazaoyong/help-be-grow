<template>
  <div class="live-detail-header">
    <div class="live-detail-header__title" v-html="title" />
    <div class="live-detail-header__lecturer">
      <i class="live-detail-header__lecturer__idcard" />
      共{{ questionCount }}道题
    </div>
    <div class="live-detail-header__status">
      <i class="live-detail-header__status__contact" />
      {{ joinCount }}人已参加
    </div>
  </div>
</template>

<script>
export default {
  name: 'test-header',

  props: {
    title: [String],
    questionCount: [Number, String],
    joinCount: [Number, String],
  },
};
</script>

<style lang="scss"></style>
