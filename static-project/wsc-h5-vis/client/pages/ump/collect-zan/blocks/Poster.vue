<template>
  <van-popup v-model="show" class="block-poster">
    <main>
      <img-wrap
        v-if="posterUrl"
        :src="posterUrl"
        width="300px"
      />

      <van-loading v-else />

      <van-icon
        name="cross"
        color="#fff"
        size="18"
        @click="show = false"
      />
    </main>

    <div class="block-poster__tip">
      长按保存海报，发送给好友
    </div>
  </van-popup>
</template>

<script>
import { mapState } from 'vuex';
import { Popup as VanPopup, Loading as VanLoading, Icon as VanIcon } from 'vant';
import { ImgWrap } from '@youzan/vis-ui';

export default {
  name: 'block-poster',

  components: {
    VanPopup,
    VanLoading,
    VanIcon,
    ImgWrap,
  },

  data() {
    return {
      show: false,
    };
  },

  computed: {
    ...mapState(['posterUrl', 'showPoster']),
  },

  watch: {
    show(show) {
      if (!show) {
        this.$store.commit('updateShowPoster', false);
      }
    },
    showPoster(showPoster) {
      if (showPoster) {
        this.show = true;
      }
    },
  },
};
</script>

<style lang="scss">
.block-poster {
  overflow: hidden;
  background: transparent;
  user-select: none;

  main {
    display: flex;
    width: 300px;
    min-height: 506px;
    align-items: center;
    justify-content: center;
  }

  .imgWrap {
    overflow: hidden;
    border-radius: 8px;
  }

  &__tip {
    margin-top: 12px;
    font-size: 16px;
    color: #fff;
    text-align: center;
  }

  .van-icon-cross {
    position: absolute;
    top: 10px;
    right: 10px;
  }
}
</style>
