<template>
  <info-cell-group class="activity-item">
    <info-cell
      class="activity-item__info"
      is-link
      @click="handleClick"
    >
      <div class="info">
        <!-- <img :src="activityIcon" class="info-icon"> -->
        <img-wrap
          :width="'40px'"
          :height="'40px'"
          :src="icon"
          class="info-icon"
        />
        <div class="info-desc">
          <p class="name">
            {{ name }}
          </p>
          <p class="desc">
            {{ desc }}
          </p>
        </div>
      </div>
    </info-cell>
  </info-cell-group>
</template>

<script>
import { ImgWrap } from '@youzan/vis-ui';
import { InfoCell, InfoCellGroup } from '@/pages/course/detail/components/info-cell';

export default {
  name: 'activity-item',

  components: {
    InfoCellGroup,
    InfoCell,
    ImgWrap,
  },

  props: {
    icon: {
      type: String,
      default: '',
    },

    name: {
      type: String,
      default: '',
    },

    desc: {
      type: String,
      default: '',
    },

    path: {
      type: String,
      default: '',
    },
  },

  methods: {
    handleClick() {
      this.$emit('click');
    },
  },
};
</script>

<style lang="scss" scoped>
  @import 'mixins/index.scss';

  .activity-item {
    margin-bottom: 12px;
    border-radius: 8px;

    &__info {
      padding: 16px;
      border-radius: 8px;

      .info {
        display: flex;

        &-icon {
          margin-right: 12px;
        }

        &-desc {
          .name {
            font-size: 16px;
            line-height: 20px;
            color: $main-text-color;
          }

          .desc {
            margin-top: 6px;
            font-size: 14px;
            line-height: 18px;
            color: $disabled-color;
          }
        }
      }
    }
  }
</style>
