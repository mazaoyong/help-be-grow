<template>
  <div class="bottom-wrap">
    <div class="share-link-btn" @click="handleShareWechat">
      分享链接
    </div>
    <div class="share-poster-btn" @click="handleSharePoster">
      分享海报
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
export default {
  methods: {
    ...mapActions('recommend-gift', ['openSharePoster', 'openShareWechat']),
    handleSharePoster() {
      this.$track.collect('course_recommend_click:clickName', 'bottom_poster');
      this.$track.runTask('courseActivityPageClick');
      this.openSharePoster();
    },
    handleShareWechat() {
      this.$track.collect('course_recommend_click:clickName', 'bottom_wechat');
      this.$track.runTask('courseActivityPageClick');
      this.openShareWechat();
    },
  },

};
</script>

<style lang="scss" scoped>
@keyframes breath {
  from {
    transform: scale(1);
  }
  50% {
    transform: scale(.9);
  }
  to {
    transform: scale(1)
  }
}

.bottom-wrap {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #fff;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  z-index: 2;
}
.share-link-btn {
  flex: 0.3;
  background:#FCEAD5;
  color: #FF2A00;
}

.is-iphonex {
  padding-bottom: 34px;
}

.share-poster-btn {
  font-size: 18px;
  flex: 0.7;
  background: linear-gradient(to left, #FF7B16, #FF2A00);
  color: #fff;
  font-weight: bold;
  animation: breath 1.5s linear 1.5s infinite;
}
.share-link-btn, .share-poster-btn {
  height: 48px;
  line-height: 48px;
  text-align: center;
  border-radius: 24px;
}
.share-link-btn + .share-poster-btn {
  margin-left: 8px;
}
</style>
