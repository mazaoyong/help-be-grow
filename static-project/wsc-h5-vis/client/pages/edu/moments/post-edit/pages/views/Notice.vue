<template>
  <van-notice-bar
    v-if="isShowNotice"
    text="动态将在视频转码、审核通过后自动发送。"
    mode="closeable"
  />
</template>

<script>
import { NoticeBar } from 'vant';

export default {
  name: 'v-notice',
  components: {
    'van-notice-bar': NoticeBar,
  },
  data() {
    return {
      isShowNotice: false,
    };
  },
  computed: {
    videoList() {
      return this.$store.state.edit.videoList;
    },
  },
  watch: {
    videoList: {
      handler(newValue, oldVal) {
        const { videoList = [], isNew } = this.$store.state.edit;
        if (newValue.length) {
          if (!isNew) {
            // 如果是编辑，所有视频审核通过则不显示 notice
            if (videoList.every(o => {
              return o.videoStatus === 4;
            })) {
              this.isShowNotice = false;
            } else {
              this.isShowNotice = true;
            }
          } else {
            this.isShowNotice = true;
          }
        } else if (newValue.length === 0) {
          this.isShowNotice = false;
        }
      },
      immediate: true,
    },
  },
};
</script>
