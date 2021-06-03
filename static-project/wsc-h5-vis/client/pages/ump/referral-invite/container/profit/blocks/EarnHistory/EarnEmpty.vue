<template>
  <div class="earn-empty">
    <img src="//b.yzcdn.cn/public_files/3bf75d66fbc671b8289b5b237749eb6e.png" alt="">
    <p class="earn-empty__text">
      暂无奖励，快去分享商品吧！
    </p>
  </div>
</template>

<script>
// 请注意文件名、最外层元素class和name属性要保持一致
export default {
  name: 'earn-empty',
};
</script>

<style lang="scss" scoped>
.earn-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 28px;

  &__text {
    font-size: 14px;
    line-height: 16px;
    color: #999999;
    margin-top: 12px;
    padding-bottom: 9px;
  }
}
</style>
