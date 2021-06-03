<template>
  <div class="feed-card">
    <van-skeleton
      title
      :avatar="avatar"
      :loading="loading"
    >
      <div class="feed-card__header">
        <div
          v-if="leftImage || $slots.leftImage"
          class="feed-card__header__image"
          :class="{
            'feed-card__header__image--rounded': rounded
          }"
        >
          <img-wrap
            v-if="leftImage"
            :width="'40px'"
            :height="'40px'"
            :src="leftImage"
            :cover="true"
          />
          <slot name="leftImage" />
        </div>
        <div
          class="feed-card__header__text"
          :independent="!leftImage"
        >
          <p
            v-if="title"
            class="feed-card__title"
            :class="{
              [`feed-card__title--${titleSize}`]: true
            }"
          >
            {{ title }}
          </p>
          <div v-if="desc || operation" class="feed-card__tip">
            <span v-if="desc" class="fedd-card__desc">{{ desc }}</span>
            <div class="feed-card__operation">
              <slot name="operation" />
            </div>
          </div>
        </div>
      </div>
    </van-skeleton>
    <van-skeleton
      :row="3"
      :loading="loading"
    >
      <slot name="content" />
    </van-skeleton>
    <div v-if="!loading" class="feed-card__badge">
      <slot name="badge" />
    </div>
    <slot v-if="!loading" name="default" />
  </div>
</template>

<script>
import { defineComponent } from '@vue/composition-api';
import { ImgWrap } from '@youzan/vis-ui';
import { Skeleton } from 'vant';

export default defineComponent({
  components: {
    'img-wrap': ImgWrap,
    'van-skeleton': Skeleton,
  },
  props: {
    title: {
      type: String,
      default: '',
    },
    desc: {
      type: String,
      default: '',
    },
    leftImage: {
      type: String,
      default: '',
    },
    /** 左边边图片是否为圆形 */
    rounded: {
      type: Boolean,
      default: false,
    },
    titleSize: {
      type: String,
      default: 'normal',
    },
    avatar: {
      type: Boolean,
      default: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
});
</script>

<style lang="scss" scoped>
.feed-card {
  position: relative;
  padding: 16px;
  margin: 12px;
  background-color: #fff;
  border-radius: 8px;

  &__header {
    display: flex;
    width: 100%;
    margin-bottom: 16px;
    box-sizing: border-box;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: center;

    &__image {
      margin-right: 8px;

      &--rounded {
        .imgWrap {
          border-radius: 50%;
        }
      }
    }

    &__text[independent] {
      width: 100%;
    }
  }

  &__title {
    font-size: 14px;
    font-weight: 500;
    line-height: 18px;
    color: #323233;

    &--large {
      font-size: 20px;
      font-weight: 500;
      line-height: 28px;
    }
  }

  &__tip {
    display: flex;
    width: 100%;
    margin-top: 4px;
    font-size: 12px;
    line-height: 18px;
    color: #969799;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
  }

  &__desc {
    max-width: 70%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__operation {
    max-width: 30%;
  }

  &__badge {
    position: absolute;
    top: 8px;
    right: 8px;
    z-index: 1;
  }

  .van-skeleton {
    padding: 0;
  }

  & > .van-skeleton:first-child {
    margin-bottom: 8px;
  }
}
</style>
