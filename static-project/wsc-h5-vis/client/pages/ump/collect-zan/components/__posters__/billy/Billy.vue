<template>
  <div class="billy">
    <img class="billy__avatar" :src="userAvatar">
    <div class="billy__username">
      {{ username }}
    </div>
    <p class="billy__text">
      “我很想学习这门课程，需要你的助力！”
    </p>
    <course-info
      :cover="courseCover"
      :title="courseTitle"
      :price="coursePrice"
      :desc="rewardText"
    />
    <share-qrcode :qrcode="qrcode" />
  </div>
</template>

<script>
import ShareQrcode from '../components/ShareQrcode';
import CourseInfo from '../components/CourseInfo';

export default {
  components: {
    ShareQrcode,
    CourseInfo,
  },

  props: {
    username: {
      type: String,
      default: '',
    },
    userAvatar: {
      type: String,
      default: 'https://img01.yzcdn.cn/public_files/2017/10/23/1321da81aa84d0539b0d5af73fbbf53b.png',
    },
    courseCover: {
      type: String,
      default: '',
    },
    courseTitle: {
      type: String,
      default: '',
    },
    coursePrice: {
      type: String,
      default: '',
    },
    rewardText: {
      type: String,
      default: '',
    },
    limitText: {
      type: String,
      default: '',
    },
    qrcode: {
      type: String,
      default: '',
    },
  },
};
</script>

<style lang="scss">
@import '../index';

.billy {
  position: relative;
  width: 300px;
  height: 506px;
  overflow: hidden;
  background: url(https://b.yzcdn.cn/public_files/b3f581fad7c986738310eb9742b4f577.png);
  background-size: 300px 506px;

  &__avatar {
    display: block;
    width: 36px;
    height: 36px;
    margin: 24px auto 0;
    border-radius: 50%;
  }

  &__username {
    height: 20px;
    margin-top: 4px;
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
    color: #fff;
    text-align: center;
  }

  &__text {
    margin-top: 4px;
    font-size: 14px;
    font-weight: 500;
    line-height: 18px;
    color: #fff;
    text-align: center;
  }

  .share-qrcode {
    margin-top: 47px;
  }
}
</style>
