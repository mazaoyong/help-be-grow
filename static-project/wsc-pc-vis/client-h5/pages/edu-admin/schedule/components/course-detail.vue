<template>
  <ul class="course-detail">
    <li class="item">
      <span class="num">{{ detail.notSignInNum }}</span>
      <span class="desc">待签到</span>
    </li>
    <li class="item">
      <span class="num">{{ detail.signInNum }}</span>
      <span class="desc">已签到</span>
    </li>
    <li class="item">
      <span class="num">{{ detail.leaveNum }}</span>
      <span class="desc">请假</span>
    </li>
    <li class="item">
      <span class="num">{{ detail.notArrivedNum }}</span>
      <span class="desc">未到</span>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'course-detail',
  props: {
    detail: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.course-detail {
  display: flex;
  padding: 16px 0;
  border-radius: 4px;
  background-color: #fff;
  .item {
    display: block;
    flex: 1;
    text-align: center;
    .num {
      display: block;
      margin-bottom: 7px;
      font-size: 18px;
      color: #333;
    }
    .desc {
      display: block;
      font-size: 13px;
      color: #7d7e80;
    }
  }
}
</style>
