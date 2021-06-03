<template>
  <div v-if="status !== activityStatus.END" :class="['count-down', `count-down-style-${pageStyle}`]">
    <div class="count-down__inner">
      <van-count-down
        :time="time"
        @finish="finish"
        class="count-down__detail"
      >
        <template slot-scope="{ days, hours, minutes, seconds }">
          <span v-if="days || hours || minutes || seconds" class="tip">{{ tipText }}</span>
          <span v-if="days" class="block days">{{ days }}</span>
          <span v-if="days" class="colon days">天</span>
          <span class="block time">{{ hours }}</span>
          <span class="colon">:</span>
          <span class="block time">{{ minutes }}</span>
          <span class="colon ">:</span>
          <span class="block time">{{ seconds }}</span>
        </template>
      </van-count-down>
    </div>
  </div>
</template>

<script>
import { CountDown } from 'vant';
import { ACTIVITY_STATUS } from '../../constants';

export default {
  name: 'count-down',

  components: {
    'van-count-down': CountDown,
  },

  props: {
    endAt: {
      type: [String, Number],
      default: 0,
    },

    pageStyle: {
      type: Number,
      default: 1,
    },

    status: {
      type: Number,
      default: 1,
    },
  },

  data() {
    return {
      activityStatus: ACTIVITY_STATUS,
    };
  },

  computed: {
    time() {
      return this.endAt - new Date().getTime();
    },

    tipText() {
      if (this.status === ACTIVITY_STATUS.NOT_START) {
        return '距开始';
      }
      return '倒计时';
    },
  },

  methods: {
    finish() {
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    },
  },
};
</script>

<style lang="scss" scoped>
.count-down {
  display: flex;
  justify-content: center;
  margin-top: 15px;

  &__inner {
    display: flex;
    align-items: center;
    height: 36px;
    border-radius: 18px;
    // background-image: linear-gradient(180deg, #FFEBAD 0%, #FFFFFF 94%);
  }

  &__detail {
    height: 32px;
    padding: 0 19px;
    line-height: 36px;
    border-radius: 16px;
    // background-image: linear-gradient(139deg, #FFFFFF 0%, #FFE8E0 100%);

    .tip {
      margin-right: 6px;
      font-size: 14px;
      line-height: 20px;
      // color: #d62109;
    }

    .colon {
      margin: 0 6px;
      line-height: 20px;
      font-size: 14px;
      font-weight: bold;
      vertical-align: text-bottom;

      &.days {
        font-weight: normal;
        vertical-align: initial;
      }
    }

    .block {
      display: inline-block;
      // background-color: #d62109;
      line-height: 22px;
      border-radius: 2px;
      font-size: 16px;
      font-weight: 500;
      color: #fff;

      &.days {
        min-width: 22px;
        text-align: center;
      }

      &.time {
        width: 22px;
        text-align: center;
      }
    }
  }

  &.count-down-style {
    &-1 {
      .count-down {
        &__inner {
          background-image: linear-gradient(180deg, #ffebad 0%, #fff 94%);
        }

        &__detail {
          background-image: linear-gradient(139deg, #fff 0%, #ffe8e0 100%);
          .tip {
              color: #d62109;
            }

            .colon {
              color: #d62109;
            }

          .block {
            background-color: #d62109;
          }
        }
      }
    }

    &-2 {
      .count-down {
        &__inner {

          background-image: linear-gradient(180deg, #affffb 0%, #fff 94%);
        }

        &__detail {
          background-image: linear-gradient(112deg, #fff 6%, #d1f1ff 87%);
          .tip {
              color: #0c65c5;
            }

            .colon {
              color: #0c65c5;
            }

          .block {
            background-color: #0c65c5;
          }
        }
      }
    }

    &-3 {
      .count-down {
        &__inner {
          background-image: linear-gradient(180deg, #d4cfff 0%, #FFFFFF 94%);
        }

        &__detail {
          background-image: linear-gradient(115deg, #fff 5%, #f8f1ff 100%);

          .tip {
              color: #4245ed;
            }

            .colon {
              color: #4245ed;
            }

          .block {
            background-color: #4245ed;
          }
        }
      }
    }
  }
}
</style>
