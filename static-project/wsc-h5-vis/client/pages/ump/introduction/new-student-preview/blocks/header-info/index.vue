<template>
  <div class="header-info">
    <div class="header-info-top">
      <join-count-banner v-if="data.showJoinNum" :count="2000" :color-style="data.posterStyle" />
    </div>
    <div class="header-info-user">
      <div class="header-info-user-img">
        <img :src="currentUser.avatar" />
      </div>
      <div class="header-info-user-tip">{{ currentUser.name }}送你一个奖励</div>
    </div>
  </div>
</template>

<script>
import JoinCountBanner from '../../../components/join-count-banner';
import { getCurrentUserInfo } from '../../../utils';

export default {
  name: 'header-info',
  data() {
    return {
      currentUser: getCurrentUserInfo(),
    };
  },
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {
    JoinCountBanner,
  },
};
</script>

<style lang="scss" scoped>
@import '../../../new-student/blocks/header-info/index.scss';
</style>
