<template>
  <div
    v-if="isMobile && isRewardOpen"
    class="live-room-reward ump-btn-box"
    @click="openRewardPopup"
  >
    <img :src="icon" alt="打赏">
  </div>
</template>
<script>
import openPricePop from '../../components/price-pop';
import { logRewardEntry } from '../../track';
import { CUSTOM_REWARD_ICON_MAP, DEFAULT_REWARD_ICON } from '../../constants';

/** 对某商家特殊处理，替换打赏图标
 *  @todo 后面会支持在 B 端配置，此处取值需要改一下。
 */
const icon = CUSTOM_REWARD_ICON_MAP[_global.kdt_id] ?? DEFAULT_REWARD_ICON;

export default {
  name: 'live-room-reward',

  data: () => ({ icon }),

  rootGetters: ['alias', 'isMobile', 'isRewardOpen'],

  methods: {
    openRewardPopup() {
      logRewardEntry(this.alias);
      openPricePop({
        props: {
          alias: this.alias,
        },
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.live-room-reward {
  img {
    width: 30px !important;
    height: 30px !important;
    margin: 7px;
    overflow: hidden;
    opacity: 1;
  }
}
</style>
