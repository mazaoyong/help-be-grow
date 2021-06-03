<template>
  <div class="block-summary">
    <gauss-cover :url="coverUrl" />

    <div class="block-summary__intro">
      <h1 class="block-summary__title">
        {{ title }}
      </h1>

      <div v-if="userAvatars.length" class="block-summary__users">
        <div
          class="block-summary__avatars"
          :style="{ marginRight: `${-2 * (userAvatars.length - 1)}px` }"
        >
          <img-wrap
            v-for="(url, index) in userAvatars"
            :key="index"
            class="block-summary__avatar"
            :src="url"
            width="18px"
            height="18px"
            :style="{ left: `${-2 * (userAvatars.length - index - 1) * 2}px` }"
          />
        </div>
        <span>等人已参与考试</span>
      </div>

      <div class="block-summary__stats">
        <div
          v-for="stat in stats"
          :key="stat.label"
          class="block-summary__stat"
        >
          <div class="block-summary__stat__value">
            {{ stat.value }}
          </div>
          <div class="block-summary__stat__label">
            {{ stat.label }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ImgWrap } from '@youzan/vis-ui';
import GaussCover from 'components/gauss-cover';

export default {
  name: 'block-summary',

  components: {
    ImgWrap,
    GaussCover,
  },

  state: [
    'coverUrl',
    'title',
    'userAvatars',
    'duration',
    'questionCount',
    'score',
  ],

  computed: {
    stats() {
      return [
        {
          label: '考试时长(分钟)',
          value: this.duration === -1 ? '不限时' : this.duration / 60,
        },
        {
          label: '题目量',
          value: this.questionCount,
        },
        {
          label: '总分',
          value: this.score,
        },
      ];
    },
  },
};
</script>

<style lang="scss">
@import '~supv/examination/style/index';

.block-summary {
  &__intro {
    padding: 20px 16px 16px;
    background: $white;
  }

  &__title {
    @include text(26px, $black, 32px, 500);
  }

  &__users {
    @include text(14px, $deep-gray, 22px);

    margin-top: 12px;

    span {
      margin-left: 6px;
    }
  }

  &__avatars {
    display: inline-block;
    vertical-align: top;
  }

  &__avatar {
    float: right;
    width: 18px;
    height: 18px;
    border: 2px solid $white;
    border-radius: 50%;
  }

  &__stats {
    display: flex;
    padding: 16px;
    margin-top: 20px;
    align-items: center;
    background: $lighter-gray;
    border-radius: 4px;
  }

  &__stat {
    flex: 1 1 0;
    text-align: center;

    &__value {
      @include text(20px, $black, 27px, 500);
    }

    &__label {
      @include text(12px, $deeper-gray, 17px);
    }
  }
}
</style>
