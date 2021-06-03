<template>
  <div v-if="fansBenefitData.content">
    <!-- 关注前 -->
    <section v-if="!fansBenefitData.isFans" class="fans-benefit" @click="onBecomeFans">
      <div class="fans-benefit__content">
        <img class="fans-benefit__img" alt="公众号粉丝" src="https://b.yzcdn.cn/images/mp_fans@2x.png">
        <span class="fans-benefit__text" v-html="fansBenefitData.content" />
      </div>
      <div class="fans-benefit__action">
        <span class="fans-benefit__action-text">成为粉丝</span>
        <van-icon name="arrow" size="12" />
      </div>
    </section>

    <!-- 关注后 -->
    <section v-else class="fans-benefit__followed">
      <p>你已成为公众号粉丝，</p>
      <p v-html="fansBenefitData.content" />
    </section>

    <fans-follow
      v-model="isShowFollowPop"
      :qrcode-url="qrcodeUrl"
      @close="onClose"
    />
  </div>
</template>

<script>
import { Icon } from 'vant';
import UA from '@youzan/utils/browser/ua_browser';
import { checkAndLogin } from 'common/utils/login';
import { getMpQrWithGoodInfo } from 'common-api/activity/index';
import fansFollow from './fansFollow';

const _global = window._global;
const mpData = _global.mp_data || {};
const { miniprogram = {} } = _global;
const isWeapp = miniprogram.isWeapp;
const clientType = isWeapp ? 1 : UA.isWeixin() ? 2 : null;

export default {
  name: 'fans-benefit',

  components: {
    'van-icon': Icon,
    fansFollow,
  },

  props: {
    fansBenefitData: {
      type: Object,
      default: () => {
        return {};
      },
    },

    goodsAlias: {
      type: String,
      default: '',
    },

    goodsName: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      shopName: mpData.shop_name,
      qrcodeUrl: '',
      isShowFollowPop: false,
    };
  },

  methods: {
    onBecomeFans() {
      checkAndLogin((_, userId, doLogin) => {
        if (doLogin) {
          return window.location.reload();
        }
        this.handleFollowMp();
      });
    },

    handleFollowMp() {
      if (this.qrcodeUrl) {
        this.isShowFollowPop = true;
      } else {
        const {
          preferentialType,
          description,
          activityAlias,
        } = this.fansBenefitData;
        const params = {
          activityAlias,
          preferentialType,
          activityDesc: description,
          goodsAlias: this.goodsAlias,
          goodsName: this.goodsName,
          clientType,
          shopName: this.shopName,
        };
        getMpQrWithGoodInfo(params)
          .then(res => {
            this.qrcodeUrl = res;
          })
          .finally(() => {
            this.isShowFollowPop = true;
          });
      }
    },

    onClose() {
      this.isShowFollowPop = false;
    },
  },
};
</script>

<style lang="scss">
@import 'mixins/index.scss';

  .fans-benefit {
    @include flex-row(space-between, center);

    height: 36px;
    padding: 0 8px 0 13px;
    margin-bottom: 12px;
    box-sizing: border-box;
    background: #fbe7e7;
    font-size: 13px;
    border-radius: 4px;

    &__content {
      @include flex-row();

      width: calc(100% - 81px);
    }

    &__img {
      display: inline-block;
      width: 63px;
      height: 18px;
      margin-right: 8px;
    }

    &__text {
      @include flex-row();

      width: calc(100% - 70px);
    }

    &__text-red {
      flex: 1;
      color: $red;

      @include ellipsis;
    }

    &__action {
      display: flex;
      align-items: center;
      color: $red;
    }

    &__action-text {
      margin-right: 4px;
    }

    &__followed {
      @include flex-row();

      height: 36px;
      padding: 0 12px;
      margin-bottom: 12px;
      box-sizing: border-box;
      background: #f7f8fa;
      font-size: 13px;
      border-radius: 4px;

      p:last-child {
        display: flex;
        max-width: calc(100% - 130px);
      }
    }
  }
</style>
