<template>
  <div
    v-if="show"
    v-log="['click_invite', '点击最高赚']"
    class="share-block"
    @click="handleClick"
  >
    <div
      v-if="maxProfix"
      class="profix-container"
    >
      <van-icon v-theme:color.main name="invition" class="icon" />
      <p v-theme:color.main>
        最高赚￥{{ maxProfix }}
      </p>
    </div>

    <div
      v-else
      class="invite-container"
    >
      <van-icon v-theme:color.main name="invition" class="icon" />
      生成邀请卡
    </div>
  </div>
</template>

<script>
import { Icon } from 'vant';

import format from '@youzan/utils/money/format';
import rootStore from '@/pages/course/detail/store';
import { mapActions, mapGetters } from 'vuex';
import storeName from './name';
import store from './store';

rootStore.registerModule(storeName, store);

export default {
  storeName,

  components: {
    'van-icon': Icon,
  },

  getters: ['inviteMap'],
  rootState: ['env', 'user'],

  computed: {
    ...mapGetters('share-block', ['show']),
    maxProfix() {
      const maxInviteProfit = this.inviteMap.maxProfit;

      // 小于 1 分不展示
      if (maxInviteProfit < 1) {
        return 0;
      }

      return maxInviteProfit && format(maxInviteProfit);
    },
  },

  created() {
    if (this.env.isSwanApp && this.user.hasLogin) {
      this.register();
    }
  },
  mounted() {
    var showEvent = new CustomEvent('shareBlockMounted');
    document.dispatchEvent(showEvent);
  },
  methods: {
    ...mapActions('share-block', ['register']),
    handleClick() {
      // 默认走邀请卡逻辑
      this.$dispatch('goInvite');
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'mixins/index.scss';

.share-block {
  position: fixed;
  right: 0;
  bottom: 112px;
  z-index: 3;
  padding: 0 16px 0 12px;
  margin-bottom: constant(safe-area-inset-bottom);
  margin-bottom: env(safe-area-inset-bottom);
  font-size: 12px;
  line-height: 30px;
  background-color: $white;
  border-radius: 15px 0 0 15px;
  box-shadow: 0 1px 5px 0 rgba($black, .12);

  .profix-container {
    display: flex;
    align-items: center;
    font-weight: bold;
  }

  .invite-container {
    font-weight: bold;
  }

  .icon {
    font-size: 16px;
    margin-right: 5px;
    vertical-align: text-bottom;
  }
}
</style>
