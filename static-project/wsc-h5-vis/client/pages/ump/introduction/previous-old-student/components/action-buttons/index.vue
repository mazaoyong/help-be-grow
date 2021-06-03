<template>
  <div :class="['action-buttons fixed-btn', `btn-style-${pageStyle}`]">
    <template v-if="status===activityStatus.STARTED">
      <div @click="onClick('link')" class="action-buttons__vice btn">
        分享链接
      </div>
      <div @click="onClick('card')" class="action-buttons__main btn">
        分享海报
      </div>
    </template>
    <div v-else @click="onClick('home')" class="action-buttons__main btn big">
      活动{{ status === activityStatus.NOT_START ? '未开始' : '已结束' }}，去看看其他课程吧
    </div>
  </div>
</template>

<script>
import { ACTIVITY_STATUS } from '../../constants';

export default {
  name: 'action-buttons',

  props: {
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

  methods: {
    onClick(type) {
      this.$emit('btnClick', type);
    },
  },
};
</script>

<style lang="scss" scoped>
.action-buttons {
  position: sticky;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 70px;
  background-color: #fff;
  z-index: 100;

  .btn {
    height: 48px;
    line-height: 48px;
    font-weight: 500;
    text-align: center;
  }

  &__main {
    width: 223px;
    border-radius: 24px;
    font-size: 18px;
    animation: breath .8s infinite linear;

    &.big {
      width: auto;
      padding: 0 16px;
    }
  }

  &__vice {
    width: 112px;
    margin-right: 8px;
    border-radius: 24px;
    font-size: 16px;
  }

  @keyframes breath {
    from {
      transform: scale(1);
    }
    50% {
      transform: scale(.9);
    }
    to {
      transform: scale(1)
    }
  }

  &.btn-style {
    &-1, &-3 {
      .action-buttons {
        &__main {
          background-image: linear-gradient(87deg, #FF5406 2%, #FF0400 100%);
          color: #ffeec9;
        }

        &__vice {
          background-color: #ffe9e8;
          color: #b1120a;
        }
      }
    }

    &-2 {
      .action-buttons {
        &__main {
          background-image: linear-gradient(90deg, #FF4363 0%, #FB095A 100%);
          color: #f9f5cd;
        }

        &__vice {
          background-color: #ffe9e8;
          color: #b1120a;
        }
      }
    }
  }
}
</style>
