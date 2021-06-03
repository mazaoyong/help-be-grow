<template>
  <div class="no-recommend__box">
    <div class="no-recommend__box-img">
      <img
        src="https://img01.yzcdn.cn/public_files/6a6bf026b0272474adb32ee546df691e.png!large.png"
        alt="no-recommend.png"
      >
    </div>
    <div class="no-recommend__box-desc">
      <p>好物正在赶来的路上</p>
    </div>
  </div>
</template>
<script>
export default {
  name: 'no-recommend',
};
</script>
<style lang="scss" scoped>
.no-recommend__box {
  display: flex;
  width: 100%;
  height: inherit;
  flex-direction: column;

  &-img {
    margin: 0 auto;

    img {
      width: 160px;
      height: 160px;
    }
  }

  &-desc {
    margin-top: 16px;
    font-size: 14px;
    line-height: 18px;
    color: #969799;
    text-align: center;
  }
}
</style>
