<template>
  <div
    v-if="data"
    class="fans-benefit"
    :class="{ followed: data.isFans }"
  >
    <template v-if="!goodsData.isOwnAsset">
      <div v-if="data.isFans" class="benefit-content">
        <p class="tip">
          你已成为公众号粉丝，{{ text[0] }}<span class="red">{{ text[1] }}</span>
        </p>
      </div>
      <div v-else class="benefit-content" @click="follow">
        <img class="icon" alt="公众号粉丝" src="https://b.yzcdn.cn/wsc-h5-vis/course/detail/fans-benefit-logo.png">
        <p class="tip">
          {{ text[0] }}<span class="red">{{ text[1] }}</span>
        </p>
        <p class="join">
          成为粉丝
          <van-icon class="arrow" name="arrow" size="12" />
        </p>
      </div>
    </template>
  </div>
</template>

<script>
import { Icon } from 'vant';
import { checkAndLogin } from 'common/utils/login';
import { PREFERENTIAL_TYPE } from '@/constants/ump/preferential-type';
import openQrcodePop from '@/pages/course/detail/components/qrcode-pop';
import { getMpQrWithGoodInfo } from './api';

export default {
  components: {
    'van-icon': Icon,
  },

  data() {
    return {
      qrcode: '',
    };
  },

  rootState: ['activityData', 'goodsData', 'mpData', 'env'],

  computed: {
    data() {
      return this.activityData.fansBenefit;
    },

    text() {
      const { preferentialType, description = '' } = this.data;
      let redText = '';
      if (preferentialType === PREFERENTIAL_TYPE.FANS_PRICE) {
        redText = /\d+(\.\d+)?\S*$/.exec(description)[0];
      }
      if (preferentialType === PREFERENTIAL_TYPE.FIRST_FOLLOW_GIFT) {
        redText = /^(\S)(\S+)$/.exec(description)[2];
      }
      return [description.replace(redText, ''), redText];
    },
  },

  created() {
    if (this.data) {
      getMpQrWithGoodInfo({
        activityAlias: this.data.activityAlias,
        preferentialType: this.data.preferentialType,
        activityDesc: this.data.description,
        goodsAlias: this.goodsData.alias,
        goodsName: this.goodsData.title,
        clientType: this.env.isWeapp ? 1 : this.env.isWeixin ? 2 : null,
        shopName: this.mpData.shopName,
      }).then(res => {
        this.qrcode = res;
      });
    }
  },

  methods: {
    follow() {
      checkAndLogin((_, userId, doLogin) => {
        if (doLogin) {
          return window.location.reload();
        }
        openQrcodePop({
          props: {
            title: '关注店铺',
            qrCode: this.qrcode,
            tip: this.env.isWeapp ? '长按保存图片识别或扫一扫关注品牌官网微信公众号' : '长按识别二维码关注店铺',
            shopData: {
              logo: this.mpData.logo,
              name: this.mpData.shopName,
            },
          },
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'mixins/index.scss';

.fans-benefit {
  margin-bottom: 12px;
  background-color: #fbe7e7;
  border-radius: 4px;

  &.followed {
    background-color: #f7f8fa;
  }

  .benefit-content {
    display: flex;
    align-items: center;
    height: 36px;
    padding: 0 8px 0 12px;
    font-size: 12px;

    .icon {
      flex-shrink: 0;
      height: 18px;
      margin-right: 8px;
    }

    .tip {
      @include ellipsis;

      width: 100%;

      .red {
        color: $red;
      }
    }

    .join {
      display: flex;
      align-items: center;
      flex-shrink: 0;
      justify-self: flex-end;
      color: $red;

      .arrow {
        margin-left: 4px;
      }
    }
  }
}
</style>
