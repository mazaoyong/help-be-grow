<template>
  <div v-if="show" class="gift-wrap">
    <div
      v-theme:border-color.main
      v-theme:color.main
      class="gift"
      @click="handleClick"
    >
      <van-icon name="point-gift-o" class="icon" size="14px" />
      送好友
    </div>
  </div>
</template>

<script>
import { Icon } from 'vant';
import { ZNB, getShareLink } from '@youzan/wxsdk';
import { add } from '@youzan/utils/url/args';
import buildUrl from '@youzan/utils/url/buildUrl';
import { appendLogParamsTo } from 'pct/utils';
import { MEDIA_TYPE_SHARE_PREFIX } from '@/constants/course/media-type';
import { ACTIVITY_TYPE } from '@/constants/ump/activity-type';
import pay from '@/pages/course/detail/store/pay';
import openShare from './share';
import openGiftPay from './gift-pay';
import { getShareAlias } from './api';
import { redirectToShop } from './utils';
import { isRetailMinimalistPartnerStore, isUnifiedPartnerStore } from '@youzan/utils-shop';

export default {
  components: {
    'van-icon': Icon,
  },

  rootState: ['goodsData', 'activityTypes', 'activityData', 'activityDataMap', 'kdtId', 'env'],
  rootGetters: ['isOnlineCourse', 'isColumn', 'isContent', 'isFree'],

  computed: {
    show() {
      if (this.isOnlineCourse && this.env.isIOSWeapp) {
        return false;
      }
      if (this.canShare || this.canGift) {
        return true;
      }
      return false;
    },

    // 请好友看展示条件
    canShare() {
      if (this.isContent) {
        if (this.activityTypes.includes(ACTIVITY_TYPE.SHARE)) {
          return true;
        }
      }
      return false;
    },

    // 送礼展示条件
    canGift() {
      if (this.isColumn || this.isContent) {
        if (this.activityTypes.includes(ACTIVITY_TYPE.GIFT) && !this.isFree) {
          if (this.activityTypes.includes(ACTIVITY_TYPE.POINTS_EXCHANGE) && this.activityData.buyLimit) {
            return false;
          }
          return true;
        }
      }
      return false;
    },
  },

  created() {
    if (this.canShare) {
      getShareAlias(this.goodsData.alias)
        .then(res => {
          const link = add(buildUrl('/wscvis/knowledge/index', 'h5', this.kdtId), {
            gift_type: 2,
            channel_type: this.activityData.channelType,
            share_alias: res,
            p: 'giftshow',
            alias: this.goodsData.alias,
            kdt_id: this.kdtId,
          });
          ZNB.configShare({
            title: `${MEDIA_TYPE_SHARE_PREFIX[this.goodsData.mediaType]}【${this.goodsData.author && `${this.goodsData.author}：`}${this.goodsData.title}】`,
            desc: this.goodsData.summary,
            imgUrl: this.goodsData.pictures[0].url,
            link: getShareLink(appendLogParamsTo(link)),
          });
        });
    }
  },

  methods: {
    handleClick() {
      if (isRetailMinimalistPartnerStore || isUnifiedPartnerStore) {
        redirectToShop(this.kdtId);
      } else {
        if (this.canShare) {
          this.handleShare();
          return;
        }
        this.handleGift();
      }
    },

    handleShare() {
      openShare({
        props: {
          everyContentFriendCount: this.activityData.everyContentFriendCount,
          receivedCount: this.activityData.receivedCount,
        },
      });
    },

    handleGift() {
      openGiftPay({
        props: {
          goodsData: this.goodsData,
          activityTypes: this.activityTypes,
          activityData: this.activityData,
          activityDataMap: this.activityDataMap,
        },
      }).then(count => {
        pay(ACTIVITY_TYPE.GIFT, count, 'gift-buy');
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.gift-wrap {
  display: flex;
  justify-content: flex-end;
  flex-grow: 1;
  flex-shrink: 0;
}

.gift {
  padding: 0 8px;
  margin-top: 8px;
  font-size: 12px;
  line-height: 22px;
  border-style: solid;
  border-width: 1px;
  border-radius: 12px;

  .icon {
    vertical-align: text-bottom;
  }
}
</style>
