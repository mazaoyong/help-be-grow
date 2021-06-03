<template>
  <div class="header-info">
    <div class="header-info-top">
      <join-count-banner
        v-if="introductionInfo.showJoinNum && count > 0"
        :count="count"
        :color-style="pageStyle"
      />
    </div>
    <div class="header-info-user">
      <div class="header-info-user-img">
        <img :src="inviteUserInfo.avatar" />
      </div>
      <div class="header-info-user-tip">{{ inviteUserInfo.name }}送你一个奖励</div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import JoinCountBanner from '../../../components/join-count-banner';

export default {
  name: 'header-info',
  data() {
    return {};
  },
  computed: {
    ...mapState(['introductionInfo', 'count', 'inviteUserInfo']),
    ...mapGetters(['pageStyle']),
  },
  components: {
    JoinCountBanner,
  },
};
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
