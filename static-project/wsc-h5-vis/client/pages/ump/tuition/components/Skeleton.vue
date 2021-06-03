<template>
  <div class="tuition-skeleton">
    <section class="header">
      <van-skeleton :row="2" />
    </section>

    <section class="mailbox">
      <van-skeleton title :row="3" />
    </section>

    <section class="progress">
      <van-skeleton title :row="1" />
    </section>

    <section class="friends">
      <van-skeleton :row="1" />
    </section>

    <section class="courses">
      <van-skeleton title :row="8" />
    </section>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import { Skeleton as VanSkeleton } from 'vant';

export default Vue.extend({
  name: 'skeleton',
  components: {
    VanSkeleton,
  },
});
</script>

<style lang="scss" scoped>
.tuition-skeleton {

  background-image: url(https://b.yzcdn.cn/public_files/9a36882e5ba15954dbf3043e16073a86.png);
  background-size: 0%;
  section {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .van-skeleton {
    width: 100%;
  }
  section.header {
    height: 200px;
    margin: 0 -16px;
    border-bottom-left-radius: 100px;
    border-bottom-right-radius: 100px;
    background-image: linear-gradient(135deg, #81fbb8 10%, #28c76f 100%);
    align-items: flex-start;
    padding-top: 50px;
  }
  section.mailbox {
    background-image: linear-gradient(151deg, #fefefe 0%, #ffeed7 100%);
    border-radius: 8px;
    height: 194px;
    margin-top: -40px;
  }
  section.progress {
    margin-top: 16px;
    height: 91px;
    background: #ffffff;
    border-radius: 8px;
  }
  section.friends {
    margin-top: 16px;
    height: 60px;
    background: #ffffff;
    border-radius: 8px;
  }
  section.courses {
    margin-top: 16px;
    height: 300px;
    background: #ffffff;
    border-radius: 8px;
  }
}
</style>
