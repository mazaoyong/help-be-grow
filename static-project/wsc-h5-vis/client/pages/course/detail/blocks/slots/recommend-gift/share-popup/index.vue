<template>
  <vis-standard-popup
    v-model="show"
    :closeable="false"
    close-on-click-overlay
  >
    <div slot="title" class="title-wrap">
      <div class="main-title">
        好友下单有礼
      </div>
      <div class="detail-link" @click="handleLinkDetail">
        查看活动详情
        <van-icon name="arrow" />
      </div>
      <van-icon
        class="share-popup_close"
        name="close"
        size="24px"
        color="#fff"
        @click="show=false"
      />
      <div
        class="act-bg"
        :style="{top: `${bgTop}`}"
      />
    </div>
    <template v-if="recommendGift.commissionPrice">
      <recommend-bonus
        :multi-sku="showHighest"
        :main-price="format(recommendGift.commissionPrice, true, false)"
        :sub-price="format(recommendGift.decreasePrice, true, false)"
      />
    </template>
    <div v-if="showPhaseRward" class="invite-task" :style="{marginTop: `${onlyPhaseReward ? '0': '16px'}`}">
      <div class="invite-user-tip">
        {{ recommendGift.helpedCount ? '再' : '' }}邀请<span>{{ remianHelpCount }}</span>位好友获得
      </div>
      <p class="invite-task-name" :style="{color: `${onlyPhaseReward ? '#FF5100': '#323233'}`}">
        {{ nextPhaseReward.rewardName || '课程大礼包' }}
      </p>
      <ul class="invite-task-awards">
        <li v-for="(item, index) in rewardList" :key="index">
          {{ item }}
        </li>
      </ul>
    </div>
    <div v-if="lowIOSVersion" class="btn-wrap_lowIOS">
      <div class="wechat-share-btn sub-btn" @click="handleShareWechat">
        <vis-icon name="wechat" size="16px" color="#646566" />
        分享给朋友
      </div>
      <div class="main-btn" @click="handleSharePoster">
        <vis-icon name="pic" size="16px" />
        分享海报
      </div>
    </div>
    <div v-else class="btn-wrap">
      <div class="main-btn" @click="handleSharePoster">
        <vis-icon name="pic" size="16px" />
        分享海报
      </div>
      <div class="sub-btn-wrap">
        <div class="wechat-share-btn sub-btn" @click="handleShareWechat">
          <vis-icon name="wechat" size="16px" color="#646566" />
          分享给朋友
        </div>
        <div class="link-share-btn sub-btn" @click="handleShareLink">
          <vis-icon name="link" size="16px" color="#646566" />
          复制链接
        </div>
      </div>
    </div>
  </vis-standard-popup>
</template>

<script>
import { Popup, Icon as VisIcon } from '@youzan/vis-ui';
import Clipboard from 'clipboard';
import { Icon, Toast } from 'vant';
import { mapGetters, mapActions, mapState } from 'vuex';
import { RecommendBonus } from '@/domain/recommend-gift/components';
import format from '@youzan/utils/money/format';
import API from '@/domain/recommend-gift/api';
import UA from 'zan-utils/browser/ua_browser';
import { versionCompare } from '@/common/utils';
import { getSuffixCouponName, getCouponName } from '@/domain/recommend-gift/utils';
import { CommissionRewardType } from '@/constants/ump/recommend-gift';

export default {
  components: {
    'vis-standard-popup': Popup,
    'van-icon': Icon,
    VisIcon,
    RecommendBonus,
  },
  props: {
    value: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      shareLink: '',
      bgTop: '-130px',
    };
  },
  computed: {
    ...mapState('recommend-gift', ['recommendGift', 'pointName']),
    ...mapGetters('recommend-gift', ['goodsData', 'nextPhaseReward', 'onlyPhaseReward']),
    lowIOSVersion() {
      // iOS10 以下，不支持复制到剪贴板
      const iosVersion = UA.getIOSVersion();
      return versionCompare(`${iosVersion}`, '10.0.0');
    },
    showPhaseRward() {
      const { helpedCount = 0 } = this.recommendGift;
      return this.nextPhaseReward && helpedCount < this.nextPhaseReward.helpCount;
    },
    remianHelpCount() {
      const { helpedCount = 0 } = this.recommendGift;
      return this.nextPhaseReward.helpCount - helpedCount;
    },
    rewardList() {
      const list = [];
      const { bonusPoint, couponList, presentList } = this.nextPhaseReward;
      if (presentList.length) {
        // 赠品
        list.push(`${presentList[0].name} 等${this.countTotal(presentList)}件赠品`);
      }
      if (couponList.length) {
        // 优惠券
        list.push(`${getCouponName(couponList[0])}${getSuffixCouponName(couponList[0].type)} 等${this.countTotal(couponList)}张优惠券`);
      }
      if (bonusPoint) {
        // 积分
        list.push(`${bonusPoint}${this.pointName}`);
      }

      return list;
    },
    show: {
      get() {
        return this.value;
      },
      set(value) {
        if (!value) {
          this.$emit('input', value);
        }
      },
    },
    showHighest() {
      const { multiSku, commissionRewardType } = this.recommendGift || {};
      return multiSku && commissionRewardType === CommissionRewardType.FIXED_RATIO; // 固定金额分佣奖励
    },
  },
  async mounted() {
    this.bgTop = `-${window.innerWidth * 0.36}px`;
    const goodsAlias = this.goodsData.alias;
    await this.getActivityDetail({ goodsAlias });
  },
  methods: {
    format,
    getSuffixCouponName,
    getCouponName,
    ...mapActions('recommend-gift', ['openShareWechat', 'openSharePoster', 'getActivityDetail', 'goActivityDetail']),
    /* 跳转至活动详情 */
    handleLinkDetail: function() {
      this.$track.collect('recommend_share_popup_click:clickName', 'goActivityDetail');
      this.$track.runTask('recommendSharePopupClick');
      const { alias } = this.goodsData;
      this.goActivityDetail({ alias, fromPage: 'course' });
    },
    /* 分享至朋友圈 */
    handleShareWechat() {
      this.$track.collect('recommend_share_popup_click:clickName', 'shareWechat');
      this.$track.runTask('recommendSharePopupClick');
      this.openShareWechat();
      this.show = false;
    },
    /* 分享海报 */
    handleSharePoster() {
      this.$track.collect('recommend_share_popup_click:clickName', 'sharePoster');
      this.$track.runTask('recommendSharePopupClick');
      this.openSharePoster();
      this.show = false;
    },
    /* 分享链接 */
    async handleShareLink() {
      this.$track.collect('recommend_share_popup_click:clickName', 'shareLink');
      this.$track.runTask('recommendSharePopupClick');
      const goodsAlias = this.goodsData.alias;
      const { hasDistributorAddOn, activityId } = this.recommendGift;
      this.shareLink = await API.getGoodsActivityDetail(goodsAlias, hasDistributorAddOn, activityId);

      const clipboard = new Clipboard('.link-share-btn', {
        text: (value) => {
          return this.shareLink;
        },
      });
      clipboard.on('success', e => {
        Toast('复制成功');
        // 释放内存
        clipboard.destroy();
      });
      clipboard.on('error', e => {
        // 不支持复制
        Toast('复制失败，请选择其他分享方式~');
        // 释放内存
        clipboard.destroy();
      });
    },
    countTotal(list) {
      return list.reduce((total, item) => {
        return total + item.quantity;
      }, 0);
    },
  },
};
</script>

<style lang="scss" scoped>
.title-wrap {
  position: relative;
  display: flex;
  padding: 20px 16px;
  align-items: center;
  justify-content: space-between;

  .main-title {
    font-size: 16px;
    line-height: 22px;
    color: #333;
  }

  .detail-link {
    display: flex;
    font-size: 14px;
    line-height: 22px;
    color: #969799;
    align-items: center;

    .van-icon {
      margin-left: 5px;
    }
  }
}

.van-popup {
  overflow-y: initial;
}

.share-popup_close {
  position: absolute;
  top: -60px;
  right: 20px;
}

.act-bg {
  position: absolute;
  right: -1px;
  left: 0;
  z-index: -2;
  height: 200px;
  background-image: url('https://img01.yzcdn.cn/upload_files/2020/11/12/Fm4dlHR9BjqHWFtqgXot_IdXDsLF.png');
  background-repeat: no-repeat;
  background-size: contain;
}

// 推荐有奖任务
.invite-task {
  position: relative;
  padding: 16px 12px;
  margin: 16px;
  text-align: left;
  background: #f7f8fa;
  border-radius: 8px;

  .invite-user-tip {
    position: absolute;
    top: 0;
    left: 0;
    padding: 5px 10px;
    font-size: 12px;
    color: #b9440e;
    background: #ffe9d9;
    border-radius: 8px 0 8px 0;

    span {
      padding: 0 4px;
      font-size: 14px;
      font-weight: bold;
    }
  }

  .invite-task-name {
    margin-top: 20px;
    font-size: 14px;
    font-weight: bold;
    color: #323233;
  }

  ul.invite-task-awards {
    padding-left: 20px;
    margin-top: 12px;
    list-style: disc;

    li {
      font-size: 12px;
      color: #969799;
    }

    li + li {
      margin-top: 8px;
    }
  }
}

.btn-wrap_lowIOS {
  display: flex;
  align-items: center;

  .main-btn {
    margin-left: 8px;
  }
}

.btn-wrap,
.btn-wrap_lowIOS {
  margin: 16px 12px;
  font-weight: bold;

  .vis-icon {
    margin-right: 6px;
  }

  .main-btn,
  .sub-btn {
    height: 48px;
    line-height: 48px;
    text-align: center;
  }

  .main-btn {
    font-size: 18px;
    color: #fff;
    background-image: linear-gradient(139deg, #ff7b17 0%, #ff2b00 100%);
    border-radius: 24px;
    flex: 1;

    &:active {
      background-image: linear-gradient(139deg, #ff7b17 0%, #ff2b00 100%);
    }
  }

  .sub-btn-wrap {
    display: flex;
    justify-content: space-between;
    margin-top: 12px;
  }

  .sub-btn {
    display: flex;
    font-size: 14px;
    color: #323233;
    background: #fff;
    border: 2px solid #ebedf0;
    border-radius: 24px;
    box-sizing: border-box;
    flex: 1;
    align-items: center;
    justify-content: center;
  }

  .sub-btn + .sub-btn {
    margin-left: 8px;
  }
}

</style>

<style lang="scss">
/* 组件为什么要设定最小高度？ */
.vis-standard-popup__content {
  min-height: 100px !important;
}

.invite-bonus {
  .invite-profit {
    margin: 8px 0;

    .amount {
      font-size: 48px;
    }
  }
}
</style>
