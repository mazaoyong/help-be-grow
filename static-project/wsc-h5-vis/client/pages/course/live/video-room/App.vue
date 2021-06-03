<template>
  <div class="video-room">
    <div id="umpBtnBox" class="video-room__ump-btns" @click.capture="recordClick">
      <live-room-selling />
      <live-room-reward />
    </div>
  </div>
</template>

<script>
import sessionStorage from '@youzan/utils/browser/session_storage';
import UA from 'zan-utils/browser/ua_browser';
import umpBtnEffects from './utils/ump-btn-effects';
import Reward from './blocks/reward';
import LiveSelling from './blocks/live-selling';

export default {
  name: 'video-room',

  components: {
    'live-room-reward': Reward,
    'live-room-selling': LiveSelling,
  },

  rootGetter: ['alias'],

  mounted() {
    if (UA.isIOS()) {
      window.onpageshow = (event) => {
        const hasLeftLiveRoom = sessionStorage.getItem('hasLeftLiveRoom') === '1';
        if (hasLeftLiveRoom || event.persisted) {
          window.location.reload();
        }
      };
    } else {
      if (sessionStorage.getItem('hasLeftLiveRoom') === '1') {
        window.location.reload();
      }
    }
    this.$rootDispatch('initData');
    // 初始化营销按钮容器副作用
    umpBtnEffects(['x']);
    sessionStorage.removeItem('hasLeftLiveRoom');
  },

  methods: {
    recordClick() {
      sessionStorage.setItem('hasLeftLiveRoom', '1');
    },
  },
};
</script>

<style lang="scss">
body {
  overflow: hidden;
}

.video-room {
  position: relative;

  &__ump-btns {
    position: fixed;
    display: flex;
    flex-direction: column;
    width: 44px;
    bottom: 72px;
    right: 8px;

    .ump-btn-box {
      position: relative;
      overflow: hidden;
      margin-bottom: 16px !important;
      width: 44px;
      height: 44px;
      border-radius: 22px;
      box-sizing: border-box;
      background-color: #fff;
      box-shadow: rgba($color: #000000, $alpha: 0.16) 0 0 6px;
    }

    &.moving .ump-btn-box {
      opacity: 0.7;
    }
  }
}
</style>
