<template>
  <div class="clue-item-wrap" @click="onItemClick">
    <div
      v-if="isMultiSelect"
      :class="['clue-item-wrap__check', isChecked ? '' : 'uncheck']"
    >
      <vis-icon
        v-if="isChecked"
        name="check"
        size="22px"
        color="#00b389"
      />
    </div>
    <div class="clue-item-wrap__left">
      <img :src="avatarSrc" alt="">
    </div>
    <div class="clue-item-wrap__right">
      <div class="clue-item-wrap__right-info">
        <p class="clue-item-wrap__right-info-phone">
          {{ telephone }}
        </p>
        <p class="clue-item-wrap__right-info-name">
          {{ name }}
        </p>
        <p v-if="revisitTime" class="clue-item-wrap__right-info-revisit">
          <vis-icon name="time" size="12px" color="#969799" />
          <span>{{ revisitTime | formatDate }}</span>
        </p>
        <div v-if="tags.length > 0" class="clue-item-wrap__right-info-tag">
          <van-tag
            v-for="tag in tags"
            :key="tag.tagId"
            plain
            class="clue-item-wrap__right-info-tag-item"
          >
            {{ tag.name }}
          </van-tag>
        </div>
      </div>
      <div class="clue-item-wrap__right-tool">
        <div class="clue-item-wrap__right-tool-phase">
          {{ phaseName }}
        </div>
        <a
          class="clue-item-wrap__right-tool-call"
          :href="`tel:${telephone}`"
          @click.stop
        >
          <vis-icon
            name="phonecall"
            size="21px"
            color="#00b389"
          />
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import { Tag } from 'vant';
import { Icon } from '@youzan/vis-ui';
import { format } from 'date-fns';

const phaseNames = {
  2: '待跟进',
  3: '待邀约',
  4: '待试听',
  5: '已试听',
  6: '已成交',
};

export default {
  name: 'clue-item',

  components: {
    'vis-icon': Icon,
    'van-tag': Tag,
  },

  filters: {
    formatDate(data) {
      return format(new Date(data), 'YYYY-MM-DD HH:mm:ss');
    },
  },

  props: {
    clueId: {
      type: Number,
      default: 0,
    },
    avatar: {
      type: String,
      default: 'https://b.yzcdn.cn/public_files/2019/05/25/58b1e66dc2413282ad4d7a61c8d3d6d7.png',
    },
    telephone: {
      type: String,
      default: '',
    },
    name: {
      type: String,
      default: '',
    },
    revisitTime: {
      type: Number,
      default: 0,
    },
    tags: {
      type: Array,
      default: () => {
        return [];
      },
    },
    phase: {
      type: Number,
      default: 0,
    },
    isMultiSelect: {
      type: Boolean,
      default: false,
    },
    selectedList: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },

  computed: {
    avatarSrc() {
      if (this.avatar) {
        return this.avatar;
      }

      return 'https://b.yzcdn.cn/public_files/2019/05/25/58b1e66dc2413282ad4d7a61c8d3d6d7.png';
    },

    phaseName() {
      return phaseNames[this.phase];
    },

    isChecked() {
      return this.selectedList.indexOf(this.clueId) > -1;
    },
  },

  methods: {
    onItemClick() {
      this.$emit('itemClick', this.clueId);
    },
  },
};
</script>

<style lang="postcss">
.clue-item-wrap {
  display: flex;
  margin-bottom: 15px;

  &__check {
    margin-right: 10px;
    margin-top: 10px;

    &.uncheck {
      width: 22px;
      height: 22px;
      border-radius: 50%;
      border: 1px solid #ecebed;
      line-height: 22px;
      vertical-align: middle;
    }
  }

  &__left {
    img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }
  }

  &__right {
    display: inline-flex;
    justify-content: space-between;
    flex: 1;
    position: relative;
    margin-left: 10px;
    padding-bottom: 15px;

    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 200%;
      height: 200%;
      transform: scale(.5);
      transform-origin: 0 0;
      pointer-events: none;
      box-sizing: border-box;
      border-bottom: 1px solid #d8d8d8;
    }

    &-info {
      &-phone {
        line-height: 22px;
        margin-bottom: 2px;
        font-size: 16px;
        color: #323233;
        font-weight: 500;
      }

      &-name {
        line-height: 18px;
        margin-bottom: 15px;
        font-size: 13px;
        color: #646566;
      }

      &-revisit {
        width: fit-content;
        height: 20px;
        line-height: 10px;
        padding: 0 5px;
        margin-bottom: 8px;
        background-color: #f2f3f5;
        border-radius: 2px;

        .vis-icon {
          margin-right: 5px;
          vertical-align: middle;
        }

        span {
          line-height: 20px;
          font-size: 12px;
          color: #323233;
        }
      }

      &-tag {
        height: 22px;
        overflow: hidden;

        &-item {
          height: 18px;
          line-height: 18px;
          margin-right: 10px;
          padding: 0 4px;
          font-size: 12px;
          color: #646566 !important;

        }
      }
    }

    &-tool {
      display: inline-flex;
      flex-direction: column;
      justify-content: space-between;
      min-width: 40px;
      text-align: right;

      &-phase {
        line-height: 18px;
        font-size: 13px;
        color: #323233;
      }
    }
  }
}
</style>
