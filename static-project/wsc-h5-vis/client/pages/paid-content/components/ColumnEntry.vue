<template>
  <div @click="onClick">
    <div class="entry-bar">
      <div class="entry-card">
        <vis-img-wrap
          class="entry-card__thumbnail"
          width="80px"
          height="46px"
          :src="thumbnail || ''"
          :fullfill="'!160x0q75.png'"
          disable-lazyload
          :cover="false"
        />
        <div class="entry-card__button">
          {{ actionBtnStr }}
          <vant-icon
            v-if="entryType === 'column' || entryType === 'benefit'"
            class="entry-card__button-arrow"
            name="arrow"
          />
        </div>
        <div class="entry-card__info">
          <p class="entry-card__info-title">
            {{ title }}
          </p>
          <p class="entry-card__info-status">
            {{ updateDesc }}
            <span v-if="updateDesc && subCount" class="content-separator" />
            {{ subCount ? `${subCount}人${isIOSWeapp ? '订阅提示' : '已购'}` : '' }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Icon } from 'vant';
import { ImgWrap } from '@youzan/vis-ui';
import UA from '@youzan/utils/browser/ua_browser';
import * as customSafeLink from 'common/utils/custom-safe-link';

const _global = window._global;
const { miniprogram = {} } = _global;
const isWeapp = miniprogram.isWeapp;

export default {
  name: 'column-entry',

  components: {
    'vis-img-wrap': ImgWrap,
    'vant-icon': Icon,
  },

  props: {
    entryType: String,
    title: String,
    alias: String,
    thumbnail: String,
    updateDesc: String,
    subCount: [Number, String],
  },

  data() {
    return {
      isIOSWeapp: UA.isIOS() && isWeapp,
    };
  },

  computed: {
    actionBtnStr() {
      switch (this.entryType) {
        case 'column':
          return '查看专栏';
        case 'benefit':
          return '查看会员';
        default:
          return '';
      }
    },
    routeName() {
      switch (this.entryType) {
        case 'column':
          return 'columnshow';
        case 'benefit':
          return 'vipbenefit';
        default:
          return '';
      }
    },
  },

  methods: {
    onClick() {
      const url = `/wscvis/knowledge/index?kdt_id=${window._global.kdt_id}&p=${this.routeName}&alias=${this.alias}`;
      customSafeLink.redirect({
        url,
      });
    },
  },
};
</script>

<style lang="scss">
@import 'var';
@import 'mixins/index.scss';

.entry-bar {
  padding: 12px 16px;
  background: $c-white;
  margin-top: 10px;
  margin-bottom: 10px;

  .entry-card {
    position: relative;
    border-radius: 2px;
    background: $c-white;

    a {
      display: block;
    }

    &__thumbnail {
      display: block;
      float: left;
      border-radius: 4px;
    }

    &__info {
      margin-left: 90px;
      width: calc(100% - 90px);
      overflow: hidden;

      .entry-card__info-title {
        max-width: 100%;
        color: $c-black;
        font-size: 14px;
        font-weight: bold;
        line-height: 20px;

        @include ellipsis;
      }

      .entry-card__info-status {
        margin-top: 10px;
        color: $c-gray-dark;
        font-size: 12px;
        line-height: 16px;
        height: 16px;
      }
    }

    &__button {
      position: absolute;
      right: 0;
      bottom: 0;
      line-height: 16px;
      color: #969799;
      font-size: 12px;
      display: flex;
      align-items: center;

      &-arrow {
        width: 8px;
        height: 12px;
        margin-left: 5px;
      }
    }
  }
}
</style>
