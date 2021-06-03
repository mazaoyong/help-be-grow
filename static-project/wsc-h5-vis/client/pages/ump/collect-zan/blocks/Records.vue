<template>
  <div class="block-records">
    <div class="block-records__title">
      助力记录
    </div>

    <div v-if="recordList.length">
      <div class="block-records__avatars">
        <img
          v-for="record in recordList"
          :key="record.id"
          class="block-records__avatar"
          :src="record.avatar"
        >
      </div>
    </div>
    <div v-else class="block-records__empty">
      暂无助力记录，快去邀请好友吧
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'block-records',

  computed: {
    ...mapGetters(['recordList']),
  },
};
</script>

<style lang="scss">
.block-records {
  min-height: 120px;
  text-align: center;
  background: #ffbc52;
  border: 1px solid #ffce92;
  border-radius: 8px;
  box-sizing: border-box;

  &__title {
    position: relative;
    display: inline-block;
    margin-top: 15px;
    font-size: 16px;
    font-weight: 500;
    line-height: 20px;
    color: #fff;

    &::before {
      position: absolute;
      top: 5px;
      left: -29px;
      width: 21px;
      height: 9px;
      background: url(https://b.yzcdn.cn/public_files/40c8afed04d584242cbfae0b49136b24.png);
      background-size: 100% 100%;
      content: '';
    }

    &::after {
      position: absolute;
      top: 5px;
      right: -29px;
      width: 21px;
      height: 9px;
      background: url(https://b.yzcdn.cn/public_files/40c8afed04d584242cbfae0b49136b24.png);
      background-size: 100% 100%;
      content: '';
      transform: rotate(180deg);
    }
  }

  &__avatars {
    display: inline-block;
    margin: 4px 27px 24px 6px;
    text-align: left;
  }

  &__avatar {
    width: 36px;
    height: 36px;
    margin: 20px 0 0 20px;
    border-radius: 50%;
  }

  &__empty {
    margin-top: 24px;
    font-size: 14px;
    line-height: 18px;
    color: #fff;
  }
}
</style>
