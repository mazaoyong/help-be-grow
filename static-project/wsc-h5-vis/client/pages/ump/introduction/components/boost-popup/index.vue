<template>
  <vis-popup-close :show-pop="show" class="boost-popup-container" @close-pop="onPopupClose">
    <div class="boost-popup">
      <div class="boost-popup-title">
        <template v-if="awardDesc.descriptionMode === 0">
          <div class="main-title">
            价值 <span class="price">{{ awardDesc.awardTotalValue }}</span> 元
          </div>
          <div class="sub-title">{{ awardDesc.awardValueDesc }}</div>
        </template>
        <template v-else-if="awardDesc.descriptionMode === 1">
          <div class="desc-title">
            {{ awardDesc.freestyleDesc }}
          </div>
        </template>
        <template v-else-if="awardDesc.descriptionMode === 2">
          <div class="desc-title">
            {{ newStuRewardDesc }}
          </div>
        </template>
      </div>
      <div class="boost-popup-btn">
        <main-button type="large" text="立即助力" @handle-click="handleBoost" />
      </div>
    </div>
  </vis-popup-close>
</template>
<script>
import { PopupClose } from '@youzan/vis-ui';
import { Toast } from 'vant';
import * as SafeLink from '@youzan/safe-link';
import api from '../../apis/new-student';
import MainButton from '../main-button';

export default {
  components: {
    'vis-popup-close': PopupClose,
    MainButton,
  },

  props: {
    value: {
      type: Boolean,
      default: false,
    },
    awardDesc: {
      type: Object,
      default: () => ({
        descriptionMode: 0,
        awardTotalValue: 0,
        awardValueDesc: '',
        freestyleDesc: '',
      }),
    },
    refereeUserId: {
      type: String,
    },
    alias: {
      type: String,
    },
    newStuRewardDesc: {
      type: String,
    },
  },

  computed: {
    show: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      },
    },
  },

  methods: {
    onPopupClose() {
      this.show = false;
      this.removeUrlQuery();
    },

    handleBoost() {
      const { alias, refereeUserId } = this;
      api
        .collectZan({ alias, refereeUserId })
        .then(() => {
          Toast.success('助力成功');
        })
        .catch((err) => {
          Toast(err);
        })
        .finally(() => {
          this.show = false;
          this.removeUrlQuery();
        });
    },

    removeUrlQuery() {
      SafeLink.redirect({
        url: location.href.replace('&refereeUserId=', '&refereeUserIdOld='),
        redirectType: 'replace',
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.boost-popup {
  padding: 0 27px 32px;
  background: linear-gradient(180deg, #fff 0%, #fff7ec 100%);
  border-radius: 16px;
  text-align: center;

  &-container {
    min-width: 367px;
    margin-top: -14px;
  }

  &-title {
    padding-top: 20px;
    color: #ff5100;
    font-weight: 500;

    .main-title {
      font-size: 18px;
      white-space: nowrap;

      .price {
        font-size: 60px;
        font-family: Avenir;
      }
    }

    .sub-title {
      color: #875a21;
      font-size: 14px;
      line-height: 20px;
    }

    .desc-title {
      font-size: 24px;
      line-height: 36px;
      white-space: pre-wrap;
      word-break: break-all;
    }
  }

  &-btn {
    margin-top: 32px;
  }
}
</style>
