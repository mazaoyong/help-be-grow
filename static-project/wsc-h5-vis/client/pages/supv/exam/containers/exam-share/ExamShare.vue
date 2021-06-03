<template>
  <div class="exam-share">
    <div class="exam-share__avstar" />
    <div class="exam-share__desc" />
    <div class="exam-share__qrcode">
      <div class="exam-share__qrcode-icon">
        二维码
      </div>
      <div class="exam-share__qrcode-title">
        <div class="exam-share__qrcode-title--line" />
        <div class="exam-share__qrcode-title--line" />
        <div class="exam-share__qrcode-title--half" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'vis-exam-share',
};
</script>

<style lang="scss">
$c-place-bg: #f8f8f8;

.exam-share {
  width: 240px;
  margin: 0 auto;

  &__avstar {
    width: 58px;
    height: 58px;
    background-color: $c-place-bg;
    border-radius: 50%;
    margin: 20px auto;
  }

  &__desc {
    width: 240px;
    height: 251px;
    background-color: $c-place-bg;
    margin-bottom: 20px;
  }

  &__qrcode {

    &-icon {
      width: 55px;
      height: 55px;
      background-color: $c-place-bg;
      line-height: 55px;
      text-align: center;
      font-size: 12px;
      color: #afafaf;
      float: left;
    }

    &-title {
      display: inline-block;
      width: 174px;
      margin-left: 11px;

      &--line {
        height: 13px;
        background-color: $c-place-bg;
        margin-bottom: 8px;
      }

      &--half {
        width: 127px;
        height: 13px;
        background-color: $c-place-bg;
      }
    }
  }
}
</style>
