<template>
  <div class="action-button">
    <!-- 通过分享进入页面，商品已被购买 -->
    <a
      v-if="isCouldStudy"
      class="action-button__item"
      :href="contentUrl"
    >
      {{ contentText }}
    </a>

    <!-- 活动结束 -->
    <div
      v-if="isPromotionEnd"
      class="action-button__item"
      @click="onGoHome"
    >
      进店逛逛
    </div>
    <!-- 活动未结束 -->
    <template v-else>
      <!-- 好友通过分享进入，团失效或团已满但未支付 -->
      <div
        v-if="isNeedNewGroup"
        class="action-button__item"
        @click="onNewGroupon"
      >
        开个新团
      </div>
      <!-- 好友通过分享进入，团正常 -->
      <div
        v-if="isNeedJoinGroup"
        class="action-button__item"
        @click="onJoinGroupon(groupType)"
      >
        我要参团
      </div>
      <!-- 老带新 -->
      <div
        v-if="isNewOne"
        class="action-button__item"
        @click="onJoinGroupon(groupType)"
      >
        新人一键参团
      </div>

      <!-- 开团成功或团已满但支付成功 -->
      <template v-if="isNeedInvite">
        <div class="action-button__item" @click="onInvite">
          邀请好友参团
        </div>
        <div class="action-button__card" @click="onMakeCard">
          生成朋友圈邀请图片
        </div>
      </template>

      <!-- 通过分享进入页面，如果用户已参其他团，且团未成功，则显示查看我的团 -->
      <a
        v-if="isCheckGroup"
        class="action-button__item"
        :href="`#/grouponInvitation?alias=${userGrouponStatus.group_alias}`"
        @click="onGoGroup"
      >
        查看我的团
      </a>
    </template>

    <!-- 分享引导弹框 -->
    <van-popup v-model="showGuide" class="guide-popup">
      <div class="guide-popup__image" />
      <p class="guide-popup__text">
        快戳右上角，分享给好友
      </p>
    </van-popup>
  </div>
</template>

<script>
import { Popup, Dialog } from 'vant';
import { GROUP_STATUS, USER_JOIN_GROUPON_STATUS } from 'pct/constants';
import * as SafeLink from '@youzan/safe-link';
import buildUrl from '@youzan/utils/url/buildUrl';

export default {
  name: 'action-button',

  components: {
    'van-popup': Popup,
  },

  props: {
    // 团状态
    tuanStatus: Number,
    // 当前团alias
    tuanAlias: String,
    // 活动状态
    promotionStatus: Number,
    // 用户对于团的状态
    userGroupStatus: Object,
    // 用户对于拼团活动的状态
    userGrouponStatus: Object,
    // 用户身份，0->老用户 1->新用户
    userIdentity: Number,
    // 活动类型, 0->普通团， 1->老带新
    groupType: Number,
    isColumn: Boolean,
    contentAlias: String,
    grouponAlias: String,
    mediaType: Number,
    // 内容是否被购买
    contentIsPaid: Boolean,
  },

  data() {
    return {
      showGuide: false,
    };
  },

  computed: {
    // 活动是否结束
    isPromotionEnd() {
      return !this.contentIsPaid && this.promotionStatus === 2;
    },
    // 是否要开新团
    isNeedNewGroup() {
      if (!this.contentIsPaid) {
        // 团失效
        if (this.tuanStatus === GROUP_STATUS.GROUPON_FAILURE) {
          // 用户未参加活动或者参加了当前团
          // return this.userGrouponStatus.status === 0 || this.userGroupStatus.status === USER_JOIN_GROUPON_STATUS.JOINED;
          return this.userGrouponStatus.status === 0;
        } else if (this.tuanStatus === GROUP_STATUS.GROUPONED) {
          // 团已满时，用户未参加活动且未参加当前团
          return this.userGrouponStatus.status === 0 &&
            this.userGroupStatus.status === USER_JOIN_GROUPON_STATUS.NOT_JOIN;
        }
      }
      return false;
    },

    // 是否要参团,普通团
    isNeedJoinGroup() {
      // 普通拼团，且用户未参加活动
      return !this.contentIsPaid &&
        this.tuanStatus === GROUP_STATUS.GROUPON_WAITING &&
        this.userGrouponStatus.status === 0 &&
        this.groupType === 0;
    },

    // 是否要邀请好友参团
    isNeedInvite() {
      return !this.contentIsPaid &&
        this.tuanStatus === GROUP_STATUS.GROUPON_WAITING &&
        this.userGroupStatus.status === USER_JOIN_GROUPON_STATUS.JOINED;
    },

    // 是否为新客一键开团，老带新
    isNewOne() {
      if (this.groupType === 1) {
        return !this.contentIsPaid &&
          this.tuanStatus === GROUP_STATUS.GROUPON_WAITING &&
          this.userGroupStatus.status === USER_JOIN_GROUPON_STATUS.NOT_JOIN &&
          this.userGrouponStatus.status === 0;
      }
      return false;
    },
    // 已购买内容，可以直接查看
    isCouldStudy() {
      return this.contentIsPaid;
    },
    // 用户参加了活动，且参加的团alias不等于当前团alias
    isCheckGroup() {
      return !this.contentIsPaid &&
        this.userGrouponStatus.status === 1 &&
        this.userGrouponStatus.group_alias !== this.tuanAlias;
    },

    contentUrl() {
      const type = this.isColumn ? 'columnshow' : 'contentshow';
      // return `#/${type}?alias=${this.contentAlias}`;
      // node路由走进店逻辑
      return `/wscvis/knowledge/index?page=${type}&alias=${this.contentAlias}`;
    },

    contentText() {
      if (this.isColumn) {
        return '查看专栏';
      } else {
        if (this.mediaType === 1) {
          return '查看图文';
        } else if (this.mediaType === 2) {
          return '查看音频';
        } else if (this.mediaType === 3) {
          return '查看视频';
        }
      }
      return '';
    },
  },

  methods: {
    onNewGroupon() {
      this.$emit('startOrder', 'new');
    },

    onJoinGroupon(groupType) {
      if (groupType === 0) {
        // 普通团直接参团
        this.$emit('startOrder', 'join');
      } else {
        // 老带新团
        if (this.userIdentity) {
          this.$emit('startOrder', 'join');
        } else {
          this.showOldWithNewDlg();
        }
      }
    },

    onInvite() {
      this.showGuide = true;
    },

    onMakeCard() {
      this.$emit('makeCard');
    },

    onGoHome() {
      SafeLink.redirect({
        url: `${window._global.wap_url.wap}/showcase/homepage?kdt_id=${window._global.kdt_id}`,
        kdtId: window._global.kdt_id,
      });
    },

    onGoGroup() {
      this.$emit('refreshGroup', this.userGrouponStatus.group_alias);
    },

    onGoDetail() {
      const type = this.isColumn ? 'columnshow' : 'contentshow';
      window.location.url = buildUrl(`/wscvis/knowledge/index?kdt_id=${window._global.kdt_id}&p=${type}&alias=${this.contentAlias}`, '', window._global.kdt_id);
    },

    showOldWithNewDlg() {
      Dialog.confirm({
        message: `<div class="paid-content__dialog--no-title">
                    <p>您是我们的老客户了</p>
                    <p>可以去开个新团,立享优惠哦</p>
                  </div>`,
        cancelButtonText: '知道了',
        confirmButtonText: '去开团',
      }).then(() => {
        this.$emit('startOrder', 'new');
      });
    },
  },
};
</script>

<style lang="scss">
@import "var";

.action-button {
  margin-top: 20px;
  text-align: center;

  &__item {
    display: block;
    width: 100%;
    height: 45px;
    line-height: 45px;
    border-radius: 2px;
    background-color: $c-red-light;
    color: $c-white;
    font-weight: 500;
  }

  &__card {
    margin-top: 20px;
    font-size: 12px;
    color: #3283fa;
  }

  .guide-popup {
    width: 100%;
    top: 0;
    right: 0;
    left: 0;
    transform: none;

    &__image {
      height: 230px;
      margin-top: 20px;
      margin-right: 20px;
      background-image: url(/public_files/2018/04/08/share-guide-book@2x.png);
      background-repeat: no-repeat;
      background-size: contain;
      background-position: right;
    }

    &__text {
      margin-top: 30px;
      text-align: center;
      font-size: 14px;
      color: $c-white;
    }
  }
}
</style>
