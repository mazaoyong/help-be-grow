<template>
  <div class="sing-in-result-status-container">
    <div class="sing-in-result-status-container__container">
      <vis-icon
        name="check-o"
        class="sing-in-result-status-container__icon"
      />
      <span class="sing-in-result-status-container__name">
        签到成功
      </span>
    </div>
    <p class="sing-in-result-status-container__desc">
      {{ desc }}
    </p>
  </div>
</template>

<script>
import { Icon } from '@youzan/vis-ui';

export default {
  name: 'sign-in-status',

  components: {
    'vis-icon': Icon,
  },

  props: {
    info: {
      type: Object,
      default() {
        return {};
      },
      required: true,
    },
  },

  data() {
    return {
    };
  },

  computed: {
    desc() {
      const {
        studyTimes,
        remainingAsset,
        isStudyByCount,
      } = this.info;

      if (isStudyByCount) {
        return `你已积累签到学习${studyTimes}次，剩余${remainingAsset / 100}课时`;
      }
      return `你已积累签到学习${studyTimes}次`;
    },
  },
};
</script>

<style lang="scss">
  .sing-in-result-status-container {
    height: 110px;
    border-radius: 6px;
    margin: 10px;
    background-color: #fff;
    position: relative;
    overflow: hidden;

    &__container {
      font-size: 18px;
      text-align: center;
      margin-top: 25px;
      height: 25px;
      margin-bottom: 15px;
      flex-direction: row;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    &__icon {
      position: relative;
      margin-right: 92px;
      margin-bottom: 1px;
    }

    &__name {
      color: #323233;
      font-weight: bold;
      position: absolute;
      margin-left: 4px;
    }

    &__desc {
      color: #969799;
      font-size: 14px;
      text-align: center;
    }
  }
</style>
