<template>
  <card class="groupon-explain">
    <div class="step">
      <div v-for="(step, index) in stepList" :key="index" class="step__item">
        <div class="step__head">
          <van-icon
            v-theme.main
            v-theme.main10="'background'"
            class="step__icon"
            :name="step.icon"
            size="16"
          />
        </div>
        <div class="step__text">
          <p v-for="text in step.desc" :key="text">
            {{ text }}
          </p>
        </div>
        <div class="step__line" />
      </div>
    </div>
  </card>
</template>

<script>
import { Icon } from 'vant';
import { Card } from '@/pages/trade/buy/components/card';

export default {
  name: 'groupon-explain-block',

  components: {
    'van-icon': Icon,
    Card,
  },

  computed: {
    stepList() {
      return [
        {
          icon: 'point-gift',
          desc: ['选择课程', '开团/参团'],
        },
        {
          icon: 'friends',
          desc: ['邀请好友', '参团支付'],
        },
        {
          icon: 'checked',
          desc: ['人满参团', '失败退款'],
        },
      ];
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'mixins/index.scss';

.groupon-explain {
  .vis-biz-card__content {
    padding: 0 12px;
  }

  .step {
    position: relative;
    display: flex;
    padding: 16px 0;
  }

  .step__item {
    position: relative;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    &:first-child {
      .step__head {
        transform: none;
      }

      .step__text {
        text-align: left;
      }
    }

    &:last-child {
      position: absolute;
      right: 0;
      width: auto;
      align-items: flex-end;

      .step__head {
        transform: none;
      }

      .step__text {
        text-align: right;
      }

      .step__line {
        width: 0;
      }
    }

    &:first-child,
    &:last-child {
      .step__text {
        transform: none;
      }
    }
  }

  .step__head {
    padding: 0 12px;
    background-color: $white;
    transform: translateX(-50%);
    z-index: 1;
  }

  .step__icon {
    padding: 6px;
    border-radius: 14px;
  }

  .step__text {
    padding-top: 4px;
    font-size: 12px;
    line-height: 16px;
    text-align: center;
    transform: translateX(-50%);
  }

  .step__line {
    position: absolute;
    top: 14px;
    left: 0;
    width: 100%;
    height: 1px;
    background-color: #dcdee0;
  }
}
</style>
