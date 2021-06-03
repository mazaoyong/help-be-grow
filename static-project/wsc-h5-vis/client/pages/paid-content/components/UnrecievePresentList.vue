<template>
  <vis-popup
    :show-pop="show"
    class="unrecieve-present-pop"
    overlay-class="unrecieve-present-pop__overlay"
    @close-pop="onClosePop"
  >
    <div class="title-img" />
    <div class="unrecieved-present-list">
      <!-- <img src="https://b.yzcdn.cn/public_files/2019/19/10/title-img.png?imageView2/2/w/980/h/980/q/50" alt=""> -->

      <div class="unrecieved-present-list__title">
        <p class="title-num">
          你有{{ unrecievePresent.length }}个赠品待领取
        </p>
        <p class="title-desc">
          <span>数量有限，先到先得</span>
        </p>
      </div>
      <div class="unrecieved-present-list__list">
        <present-list
          :present-good-list="unrecievePresent"
          :is-show-num="false"
          bg-color="#f7f8fa"
        />
      </div>
      <div
        class="unrecieved-present-list__action"
        @click="onRecievePresent"
      >
        <van-button class="btn" round>
          立即领取
        </van-button>
      </div>
    </div>
  </vis-popup>
</template>

<script>
import { Button } from 'vant';
import { PopupClose } from '@youzan/vis-ui';
import PresentList from 'components/PresentList';
import * as SafeLink from '@youzan/safe-link';

const kdtId = window._global.kdt_id;

export default {
  name: 'unrecieved-present-list',

  components: {
    'van-button': Button,
    PresentList,
    'vis-popup': PopupClose,
  },

  props: {
    unrecievePresent: {
      type: Array,
      default: () => {
        return [];
      },
    },
    value: {
      type: Boolean,
      default: false,
    },
    alias: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      show: this.value,
    };
  },

  watch: {
    value(newValue) {
      this.show = newValue;
    },
    show(newValue) {
      this.$emit('input', newValue);
    },
  },

  methods: {
    onRecievePresent() {
      SafeLink.redirect({
        url: `/wscvis/ump/receive-present?alias=${this.alias}&kdtId=${kdtId}`,
        kdtId,
      });
    },

    onClosePop() {
      this.show = false;
    },
  },
};
</script>

<style lang="scss">
@import 'mixins/index.scss';

.unrecieve-present-pop {

  .cert-pop--close {
    width: 32px;
    height: 32px;
    background-image: url(https://b.yzcdn.cn/public_files/2018/08/08/492a8ac9ea4f8736e29c8ace3db6987a.png);
    background-size: contain;
    background-repeat: no-repeat;

    &::before {
      content: '';
    }
  }

  .vis-popup__content {
    margin-top: 0;
  }

  .title-img {
    background-image: url(https://b.yzcdn.cn/public_files/2019/19/10/hdj.png);
    height: 70px;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    margin-bottom: -15px;
  }
  .unrecieved-present-list {
    width: 300px;
    margin: 0 auto;
    background-color: #fff;
    border-radius: 16px;
    overflow: hidden;

    &__title {
      padding: 8px 0;
      text-align: center;
      background-image: linear-gradient(43deg, #00b389 0%, #07c183 100%);
      color: #fff;

      .title-num {
        font-size: 16px;
        line-height: 22px;
      }

      .title-desc {
        margin-top: 4px;
        text-align: center;

        span {
          width: 112px;
          padding: 2px 10px;
          border-radius: 10px;
          font-size: 10px;
          line-height: 14px;
          background-color: #01ad81;
        }
      }
    }

    &__list {
      height: 254px;
      overflow: auto;
    }

    &__action {
      height: 50px;
      padding: 8px 8px 0;

      .btn {
        width: 100%;
        color: #fff;
        font-size: 14px;
        background-image: linear-gradient(43deg, #00b389 0%, #07c183 100%);
        border: none;
      }
    }
  }

  &__overlay {
    background-image: url(https://b.yzcdn.cn/public_files/2019/19/10/dot-img.png);
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center 13%;
  }
}
</style>
