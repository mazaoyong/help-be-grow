<template>
  <router-view />
</template>

<script>
export default {
  name: 'reward-list-router-view',
};
</script>

<style lang="scss">
@import 'mixins/index.scss';

.reward-list {
  position: relative;
  padding: 10px;

  h3 {
    margin-bottom: 10px;
    font-size: 14px;
    line-height: 20px;
    color: #969799;
  }

  &__ft {
    font-size: 12px;
    line-height: 16px;
    color: #969799;
    text-align: center;
  }

  &__expire-link {
    cursor: pointer;
  }

  /* 奖品通用样式 */
  .award {
    position: relative;
    display: flex;
    height: 90px;
    padding: 10px 15px;
    margin-bottom: 10px;
    overflow: hidden;
    background-color: #fff;
    border-radius: 4px;
    flex-direction: row;
    align-items: center;
    box-sizing: border-box;

    & > div {
      position: relative;
      display: flex;
      height: 100%;
      overflow: hidden;
    }

    &__left {
      flex-shrink: 0;
    }

    &__right {
      flex-grow: 1;
      width: 0;
      flex-direction: column;

      & > span {
        @include ellipsis;
      }

      .van-button {
        width: auto;
        padding: 0 6px;
        border-radius: 11px;
      }
    }

    &__bottom {
      display: flex;
      align-items: center;
      padding-right: 62px;
    }

    &__number {
      font-size: 32px;
      font-weight: 600;
      line-height: 30px;
    }

    &__unit {
      position: relative;
      top: 6px;
      font-size: 12px;
      line-height: 16px;
    }

    &__label {
      font-size: 14px;
      font-weight: 500;
      line-height: 20px;
      color: #323233;
    }

    &__descs {
      float: left;
      width: 100%;
    }

    &__desc {
      font-size: 12px;
      line-height: 14px;
      color: #969799;

      @include ellipsis;
    }

    &__btn {
      float: right;
      margin-right: -62px;
      font-size: 12px;
      line-height: 20px;
    }

    &__btn-text {
      color: #969799;
    }

    &__status-icon {
      position: absolute;
      top: -12px;
      right: -8px;
      width: 60px;
      height: 60px;
      background-position: center;
      background-repeat: no-repeat;
      background-size: contain;
    }

    &__status-icon-1 {
      background-image: url(https://img01.yzcdn.cn/public_files/2019/05/08/fe787c1c5a229c2bb74d35848e7cd792.png);
    }

    &__status-icon-2 {
      background-image: url(https://img01.yzcdn.cn/public_files/2019/05/08/8198388eb343380df7305c4767d32eb1.png);
    }
  }

  .vis-no-course {
    margin-top: 160px;
  }
}
</style>
