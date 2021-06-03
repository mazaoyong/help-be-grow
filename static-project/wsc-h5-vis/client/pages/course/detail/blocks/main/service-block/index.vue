<template>
  <info-cell-group v-if="show" v-tab="tab" class="service-block">
    <info-cell title="服务" is-link @click="openPopup">
      <div class="info">
        <p v-for="item in list" :key="item.tag" class="info-item">
          <mini-font-tag
            :text="item.tag"
            :color="mainColor"
            :background-color="backgroundColor"
            class="tag"
          />
          <span>{{ item.tip }}</span>
        </p>
      </div>
    </info-cell>
  </info-cell-group>
</template>

<script>
import { fns } from '@youzan/vue-theme-plugin';
import { InfoCell, InfoCellGroup } from '@/pages/course/detail/components/info-cell';
import MiniFontTag from '@/components/mini-font-tag';
import rootStore from '@/pages/course/detail/store';
import openPopup from './components/content/index.js';
import storeName from './name';
import store from './store';

rootStore.registerModule(storeName, store);

export default {
  storeName,

  components: {
    InfoCell,
    InfoCellGroup,
    MiniFontTag,
  },

  getters: ['list'],
  rootState: ['goodsData'],
  rootGetters: ['isColumn'],

  computed: {
    examTip() {
      return this.$store.getters['service-block/examTip'];
    },

    show() {
      if (this.goodsData.certType) {
        return true;
      }
      if (this.goodsData.rewards && this.goodsData.rewards.length) {
        return true;
      }
      if (this.examTip) {
        return true;
      }
      return false;
    },

    mainColor() {
      return this.$theme.colors.main;
    },

    backgroundColor() {
      return fns.hexToRgba(this.mainColor, 0.1);
    },

    tab() {
      if (this.isColumn) {
        return {
          index: 1,
          title: '专栏介绍',
        };
      }
      return null;
    },
  },

  methods: {
    openPopup() {
      openPopup({
        props: {
          alias: this.goodsData.alias,
          list: this.list,
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'mixins/index.scss';

.service-block {
  margin-bottom: 8px;
  ::v-deep .van-cell__right-icon {
    align-self: flex-start;
  }

  ::v-deep .tag {
    @include mini-tag;
  }

  .info {
    overflow: hidden;

    .info-item {
      @include ellipsis;

      .tag {
        padding: 0 2px;
        margin-right: 8px;
      }
    }
  }
}
</style>
