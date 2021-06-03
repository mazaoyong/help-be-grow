<template>
  <vis-page-container class="old-student">
    <section v-if="data.posterStyle" :class="['old-student__content', `style-${data.posterStyle}`]">
      <header-info
        :old-stu-reward-tip="oldStuRewardTip"
        :new-stu-reward-tip="data.newStudentRewardTip"
        :count="2000"
        :show-join-num="data.showJoinNum"
      />

      <poster-swiper
        :customize-posters="data.oldStudentPoster.upload"
        :introducer-poster-setting="data.oldStudentPoster.list"
        :new-stu-reward-tip="newStuPosterRewardTip"
        :new-stu-reward-tip-simple="data.newStudentRewardTip"
        :poster-style="data.posterStyle"
        :introducer="introducer"
      />

      <div class="old-student__content-footer">
        <div class="share-btn" @click="onActionClick('share')">
          分享链接给好友
        </div>
        <div class="copy-link" @click="onActionClick('copy')">
          复制活动链接
        </div>
        <div class="time">
          {{ timeStr }}
        </div>
      </div>
    </section>
  </vis-page-container>
</template>
<script>
import formatDate from '@youzan/utils/date/formatDate';
import PageContainer from '@/pages/edu/components/page-container';
import HeaderInfo from '../old-student/blocks/header-info';
import PosterSwiper from './blocks/poster-swiper';
import { getCurrentUserInfo } from '../utils';

export default {
  name: 'old-student-preview',

  components: {
    'vis-page-container': PageContainer,
    HeaderInfo,
    PosterSwiper,
  },

  data() {
    return {
      data: {},
      introducer: getCurrentUserInfo(),
    };
  },

  computed: {
    timeStr() {
      const { time = [] } = this.data;
      return `${time[0] ? formatDate(time[0], 'YYYY.MM.DD') : ''} - ${
        time[1] ? formatDate(time[1], 'YYYY.MM.DD') : ''
      }`;
    },
    oldStuRewardTip() {
      const { oldStudentAwardLabel, oldStudentAwardName } = this.data;
      return `${oldStudentAwardLabel}可得${oldStudentAwardName}`;
    },
    newStuPosterRewardTip() {
      const tip = 'Hi！快来和我一起学习吧！送你';
      return `${tip}${this.data.newStudentRewardTip}`;
    },
  },

  mounted() {
    parent.postMessage('introduction-preview', '*');
    window.addEventListener('message', (event) => {
      if (event.data && event.data.posterStyle) {
        this.data = event.data;
      }
    });
  },
};
</script>
<style lang="scss" scoped>
.old-student {
  transform: scale(0.85);
  transform-origin: 0% 0%;
  font-size: 14px;
  background-color: #fff;

  &:before {
    position: fixed;
    display: block;
    content: '';
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 1;
  }

  &__content {
    background-position: top;
    background-repeat: no-repeat;
    background-size: cover;

    &.style {
      &-1 {
        background-image: url(https://b.yzcdn.cn/public_files/ef1a5a5d4ca11aab6684742098619399.png);
      }

      &-2 {
        background-image: url(https://b.yzcdn.cn/public_files/2833aa4be76bf28dc1f49f3a9ae5a396.png);
      }

      &-3 {
        background-image: url(https://b.yzcdn.cn/public_files/3c8c3ed5b0ec8ad1c9e4be3d5ca2e78e.png);
      }
    }

    &-footer {
      text-align: center;

      .share-btn {
        margin: 0 auto;
        width: 300px;
        height: 44px;
        line-height: 44px;
        background: #fff;
        border-radius: 20px;
        color: #323233;
        font-size: 16px;
        font-weight: 500;
      }

      .copy-link {
        margin-top: 12px;
        font-size: 14px;
        line-height: 20px;
        color: #fff;
      }

      .time {
        padding: 30px 0 16px;
        font-size: 12px;
        line-height: 17px;
        color: rgba(255, 255, 255, 0.5);
      }
    }
  }

  .view-achievement {
    display: inline-flex;
    align-items: center;
    font-size: 14px;
    color: #ff6711;
  }
}
</style>
