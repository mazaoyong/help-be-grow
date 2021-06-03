<template>
  <div :class="['reward-item', `reward-item-style-${pageStyle}`]">
    <div v-if="tagDesc" class="reward-item__tag">
      <div class="tag-content">
        {{ tagDesc }}
      </div>
    </div>
    <div :class="['reward-item__content', awardNode === 0 ? 'new-reward' : '']">
      <div class="reward-item__left">
        <div class="desc van-multi-ellipsis--l2">
          {{ awardDesc }}
        </div>
      </div>
      <div class="reward-item__right">
        <img :src="awardIcon" class="icon">
      </div>
    </div>
  </div>
</template>

<script>
import { AWARD_TAG, AWARD_ICON } from '../../constants';

export default {
  name: 'reward-item',

  props: {
    awardNode: {
      type: Number,
      default: 0,
    },

    awards: {
      type: Array,
      default: () => {
        return [];
      },
    },

    pageStyle: {
      type: Number,
      default: 1,
    },
  },

  computed: {
    tagDesc() {
      return AWARD_TAG[this.awardNode];
    },

    awardDesc() {
      let desc = [];
      this.awards.forEach(item => {
        desc.push(item.awardBizId);
      });
      return desc.join(',');
    },

    awardIcon() {
      return AWARD_ICON[this.awardNode];
    },
  },
};
</script>

<style lang="scss" scoped>
.reward-item {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 96px;
  margin-bottom: 10px;

  &__tag {
    z-index: 10;
    width: fit-content;
    background-color: #fff;

    .tag-content {
      position: relative;
      top: 2px;
      left: 3px;
      z-index: 1;
      width: fit-content;
      padding: 1px 0 1px 8px;
      font-size: 12px;
      font-weight: 500;
      line-height: 17px;
      color: #ffeec9;
      border-top-left-radius: 4px;

      &::after {
        position: absolute;
        top: 0;
        width: 10px;
        height: 19px;
        border-bottom-right-radius: 100%;
        content: '';
      }
    }
  }

  &__content {
    position: absolute;
    display: flex;
    width: 100%;
    height: 96px;
    background-color: #fff0e8;
    background-repeat: no-repeat;
    // background-image: url(https://img01.yzcdn.cn/upload_files/2020/08/05/Fv6l8tnbfR_emK1IRSAeOJRZ9tFg.png);
    background-size: contain;
    border-radius: 4px;
    justify-content: space-between;

    &.new-reward {
      background-color: #fff0e8;
      border-radius: 4px;
    }
  }

  &__left {
    position: relative;
    display: inline-flex;
    flex: 1;
    padding-top: 32px;

    .desc {
      padding: 0 17px 0 13px;
      font-size: 16px;
      font-weight: 500;
      line-height: 24px;
      color: #6f1415;
      align-self: baseline;
    }
  }

  &__right {
    width: 80px;
    align-self: center;
    margin-right: 8px;

    .icon {
      width: 100%;
    }
  }

  &.reward-item-style {
    &-1 {
      .reward-item {
        &__tag {
          .tag-content {
            background-image: linear-gradient(87deg, #ff5406 2%, #ff0400 100%);

            &::after {
              background-color: #ff0400;
            }
          }
        }
      }
    }

    &-2 {
      .reward-item {
        &__tag {
          .tag-content {
            background-image: linear-gradient(90deg, #ff4363 0%, #fb095a 100%);

            &::after {
              background-color: #fb095a;
            }
          }
        }
      }
    }

    &-3 {
      .reward-item {
        &__tag {
          .tag-content {
            background-image: linear-gradient(87deg, #ff5406 2%, #ff0400 100%);

            &::after {
              background-color: #ff0400;
            }
          }
        }
      }
    }
  }
}
</style>
