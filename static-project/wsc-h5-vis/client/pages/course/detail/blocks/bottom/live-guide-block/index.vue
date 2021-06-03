<template>
  <div v-if="show" class="live-guide" :style="{ width: `${pageWidth}px` }">
    <van-cell title="使用电脑观看直播体验更佳" is-link @click="showPopup">
      <vis-icon
        slot="icon"
        name="pc-live"
        size="16"
        color="#155BD4"
      />
    </van-cell>
  </div>
</template>

<script>
import { Cell as VanCell } from 'vant';
import { Icon as VisIcon } from '@youzan/vis-ui';
import { wrapLogin as authorizeMobile } from '@/common/utils/login';
import { LIVE_TYPE } from '@/constants/course/live-type';
import openCopyPopup from './components/openCopyPopup';

export default {
  name: 'live-guide',

  components: {
    VanCell,
    VisIcon,
  },

  rootState: ['goodsData', 'mpFollowed'],
  rootGetters: ['pageWidth'],

  computed: {
    show() {
      const { liveType, isOwnAsset } = this.goodsData;

      if (isOwnAsset && liveType === LIVE_TYPE.YZ_EDU_LIVE) {
        return true;
      }

      return false;
    },
  },

  methods: {
    showPopup() {
      authorizeMobile({
        forceLogin: false,
        authTypeList: ['mobile'],
      }, () => {
        this.showCopyPopup();
      });
    },

    showCopyPopup() {
      openCopyPopup();
    },
  },
};
</script>

<style lang="scss">
.live-guide {
  position: fixed;
  bottom: 50px;
  left: 50%;
  z-index: 1;
  width: 100%;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
  transform: translateX(-50%);

  .van-cell {
    background: #e8effa;
  }

  .vis-icon {
    position: relative;
    top: 4px;
    margin-right: 8px;
  }

  .van-cell__right-icon {
    color: #646566;
  }
}
</style>
