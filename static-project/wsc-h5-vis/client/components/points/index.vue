<template>
  <div v-theme.main class="points">
    <div class="points__flex">
      <van-icon
        v-if="showIcon"
        class="points__icon"
        name="points"
        :color="$theme.colors.main"
        size="16px"
      />
      <div>
        <div v-if="min && min.points" class="points--min">
          <span class="points--min__points">
            {{ min.points }}{{ pointsName }}
          </span>
          <span v-if="min.price" class="points--min__price">
            +{{ (min.price / 100).toFixed(2) }}元
          </span>
          <span v-if="parsedMax && parsedMax.points" class="points--min__dilimiter">
            &nbsp;~&nbsp;
          </span>
        </div>
        <div v-if="parsedMax && parsedMax.points" class="points--max">
          <span class="points--max__points">
            {{ parsedMax.points }}{{ pointsName }}
          </span>
          <span v-if="parsedMax.price" class="points--max__price">
            +{{ (parsedMax.price / 100).toFixed(2) }}元
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Icon } from 'vant';

export default {
  name: 'points',

  inject: {
    pointsName: {
      default: _global.visPointsName || '积分',
    },
  },

  components: {
    'van-icon': Icon,
  },

  props: {
    showIcon: {
      type: Boolean,
      default: true,
    },
    min: {
      type: Object,
      default() {
        return null;
      },
    },
    max: {
      type: Object,
      default() {
        return null;
      },
    },
  },

  computed: {
    _global() {
      return window._global;
    },

    parsedMax() {
      if (this.min && this.max) {
        if (this.min.points === this.max.points && this.min.price === this.max.price) {
          return null;
        }
      }
      return this.max;
    },
  },
};
</script>

<style lang="scss" styled>
.points {
  display: inline-block;
  vertical-align: top;
  max-width: 240px;

  &__flex {
    display: flex;
  }

  &__icon {
    flex: 0 0 auto;
    margin-right: 3px;
  }

  .van-icon {
    vertical-align: top;
  }

  &--min {
    display: inline-block;
    line-height: 18px;
    font-size: 13px;

    &__dilimiter {
      color: #c8c9cc;
    }
  }

  &--max {
    display: inline-block;
    line-height: 18px;
    font-size: 13px;
  }
}
</style>
