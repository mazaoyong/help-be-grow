<template>
  <div v-if="data" class="fans-benefit" :class="{ followed: data.isFans }">
    <template v-if="!goodsData.isOwnAsset">
      <div v-if="data.isFans" class="benefit-content">
        <p class="tip">
          你已添加好友，{{ text[0] }}<span class="red">{{ text[1] }}</span>
        </p>
      </div>
      <div v-else class="benefit-content" @click="addFriends">
        <div class="icon">
          加好友
        </div>
        <p class="tip">
          {{ text[0] }}<span class="red">{{ text[1] }}</span>
        </p>
        <p class="join">
          去添加
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
import { reportLatestViewedGoods, checkUnionId } from './service';
import * as SafeLink from '@youzan/safe-link';

export default {
  name: 'wecom-fans-benefit',
  components: {
    'van-icon': Icon,
  },

  rootState: ['activityData', 'goodsData', 'mpData', 'env'],

  computed: {
    data() {
      return this.activityData.wecomFansBenefit;
    },

    text() {
      const { preferentialType, description = '' } = this.data;
      let redText = '';
      if (preferentialType === PREFERENTIAL_TYPE.FANS_PRICE) {
        redText = /\d+(\.\d+)?\S*$/.exec(description)[0];
      }
      if (preferentialType === PREFERENTIAL_TYPE.FIRST_FOLLOW_GIFT) {
        redText = description.substring(1);
      }
      return [description.replace(redText, ''), redText];
    },
  },

  methods: {
    showGuidePop() {
      openQrcodePop({
        props: {
          title: '添加微信好友',
          qrCode: this.data.contactWay?.qrCodeUrl,
          tip: this.env.isWeapp ? '长按保存图片，扫码添加好友' : '长按识别二维码添加好友',
        },
      });
    },

    _checkUnionId() {
      if (this._checked) {
        return Promise.resolve();
      }
      return checkUnionId().then(({ hasUnionId, authRedirectUrl }) => {
        if (!hasUnionId) {
          SafeLink.redirect({
            url: authRedirectUrl,
            kdtId: window._global.kdt_id,
          });
          return Promise.reject();
        }
        this._checked = true;
      });
    },

    _reportedLatestViewedGoods() {
      // 记录是否上报过
      if (this._reported) {
        return;
      }

      reportLatestViewedGoods(this.goodsData.alias)
        .then((isSuccess) => {
          if (isSuccess) {
            this._reported = true;
          }
        })
        .catch(() => {});
    },

    addFriends() {
      // 登录
      checkAndLogin((_, __, doLogin) => {
        if (doLogin) {
          return window.location.reload();
        }

        this._checkUnionId()
          .then(this._reportedLatestViewedGoods)
          .then(() => {
            this.showGuidePop();
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
      margin-right: 8px;
      background-color: #fe2152;
      border-radius: 3px;
      font-size: 12px;
      line-height: 16px;
      font-weight: 500;
      color: #ffffff;
      padding: 0 4px;
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
