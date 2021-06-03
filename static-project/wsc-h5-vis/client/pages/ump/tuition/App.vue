<!-- 攒学费活动落地页 -->
<template>
  <vis-page-container class="tuition">
    <skeleton v-if="showSkeleton" />
    <!-- <template v-else> -->
    <template v-else>
      <!-- ⬇ 头部区块 -->
      <block-header />
      <!-- ⬇ 中间主区块 -->
      <block-main />
      <!-- ⬇ 助力进度区块 -->
      <block-progress v-if="blockProgressIsVisible" />
      <!-- ⬇ 助力人展示区块 -->
      <block-friends v-if="blockFriendsIsVisible" />
      <!-- ⬇ 课程展示区块 -->
      <block-courses />

      <!-- ⬆ 区块部分 ⬆ -->
      <!-- ⬇ 弹窗部分 ⬇ -->

      <!-- ⬇ 可兑换课程列表弹窗 -->
      <popup-courses />
      <!-- ⬇ 引导参加活动弹窗 -->
      <popup-guide />
      <!-- ⬇ 他人助力活动弹窗 -->
      <popup-boost />
      <!-- ⬇ 二次确认弹窗 -->
      <popup-confirm />
      <!-- ⬇ 分享弹窗 -->
      <popup-share />
    </template>
  </vis-page-container>
</template>

<script>
import Vue from 'vue';
import { mapGetters } from 'vuex';

import BlockMain from './blocks/BlockMain.vue';
import PopupBoost from './blocks/PopupBoost.vue';
import PopupGuide from './blocks/PopupGuide.vue';
import PopupShare from './blocks/PopupShare.vue';
import BlockHeader from './blocks/BlockHeader.vue';
import BlockFriends from './blocks/BlockFriends.vue';
import BlockCourses from './blocks/BlockCourses.vue';
import PopupConfirm from './blocks/PopupConfirm.vue';
import PopupCourses from './blocks/PopupCourses.vue';
import BlockProgress from './blocks/BlockProgress.vue';

import Skeleton from './components/Skeleton.vue';

import VisPageContainer from '@/pages/edu/components/page-container/index.vue';

export default Vue.extend({
  name: 'tuition-app',
  components: {
    Skeleton,
    BlockMain,
    PopupBoost,
    PopupGuide,
    PopupShare,
    BlockHeader,
    PopupConfirm,
    BlockCourses,
    BlockFriends,
    BlockProgress,
    PopupCourses,
    VisPageContainer,
  },
  computed: {
    /** 从 Store 获取 Block 展示逻辑 */
    ...mapGetters([
      /** 助力进度 Block 是否显示 */
      'blockProgressIsVisible',
      /** 助力好友 Block 是否显示 */
      'blockFriendsIsVisible',
    ]),
    showSkeleton() {
      return !this.$store.state.appIsReady;
    },
  },
  mounted() {
    // @ts-ignore
    const { params, query } = this.$route;
    this.$store.dispatch('initApp', {
      alias: params.alias,
      fromId: query.fromId,
      source: query.source,
    });
  },
});
</script>

<style lang="scss" scoped>
.tuition {
  padding: 0 16px;
}
</style>
