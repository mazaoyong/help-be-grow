<template>
  <div v-if="showEntry" class="introduce-promotion">
    <!-- 老学员浮动按钮 -->
    <div v-if="hasActivity" class="introduce-promotion__float" @click="onSharePopup">
      <img-wrap src="https://b.yzcdn.cn/public_files/57c28159ad420ebf21c31de55ce2332a.png" width="79px" height="66px" />
    </div>
    <!-- 新学员领取奖励卡片 -->
    <promotion-card
      v-if="hasReward && showPromotionCard"
      :card-info="rewardInfo"
      :alias="alias"
      :from="from"
      :new-stu-reward-tip="newStuRewardTip"
      @close="onPromotionCardClose"
    />
    <!-- 分享弹窗 -->
    <multi-share-pop
      v-model="showSharePopup"
      :share-options="shareOptions"
      @link="onShareGuide"
      @poster="onInvitePotserLink"
    >
      <p slot="header" class="introduce-promotion__desc">
        分享家校圈动态或制作自己的邀请海报并分享给好友均有机会赢机构大礼。
        <a :href="oldStudentLink">
          查看活动详情规则
        </a>
      </p>
    </multi-share-pop>

    <!-- 分享引导 -->
    <share-mask :value="showShareGuide" @close="onShareGuideClose" />
  </div>
</template>
<script>
import { Dialog } from 'vant';
import { ImgWrap } from '@youzan/vis-ui';
import PromotionCard from './components/promotion-card';
import shareMask from '@/components/share-mask';
import MultiSharePop from '@/components/multi-share-pop';

import isEmpty from 'lodash/isEmpty';
import isFunction from 'lodash/isFunction';
import { get } from 'lodash';
import { isEduSingleStore, isEduChainStore } from '@youzan/utils-shop';
import { initWXSdk } from '@youzan/wxsdk';
import YZLocalStorage from 'zan-utils/local_storage';
import Args from 'zan-utils/url/args';
import { navigateEnv } from '@/common/utils/env';
import * as customSafeLink from '@/common/utils/custom-safe-link';
import { getAwardTip } from '@/pages/ump/introduction/utils';
import { SHARE_OPTIONS } from './constants';
import { getRefereeActivityDetail, getIntroductionActivity, checkActivityThreshold } from './api';

const { buyer_id: userId, kdt_id: kdtId } = window._global || {};
const alias = Args.get('alias') || '';
const introducerUserId = Args.get('introducerUserId');

export default {
  name: 'introduce-promotion',

  components: {
    ImgWrap,
    PromotionCard,
    MultiSharePop,
    shareMask,
  },

  props: {
    // 分享链接
    shareUrl: {
      type: String,
      default: location.href,
    },
  },

  data() {
    return {
      shareOptions: SHARE_OPTIONS,
      showSharePopup: false,
      showPromotionCard: false,
      showShareGuide: false,
      activityInfo: {}, // 进行中的活动信息
      rewardInfo: {}, // 新学员奖励信息
      hasActivity: false, // 有没有进行中的活动信息
      hasReward: false, // 有没有奖励信息
      alias,
      introducerDTO: {},
      isOldStruct: false,
      showEntry: isEduSingleStore || isEduChainStore,
      newStuRewardTip: '',
    };
  },

  computed: {
    from() {
      return Args.get('from', this.shareUrl) || '';
    },

    oldStudentLink() {
      let url = this.isOldStruct
        ? '/wscvis/ump/introduction/previous-old-student'
        : '/wscvis/ump/introduction/old-student';
      return customSafeLink.getSafeUrl({
        url,
        kdtId,
        query: {
          kdt_id: kdtId,
          alias: this.alias,
          from: this.from,
        },
      });
    },
  },

  created() {
    if (!this.showEntry) {
      return;
    }

    if (introducerUserId) {
      this.fetchRefereeActivityDetail();
    } else {
      this.fetIntroductionActivity();
    }
    this.showPromotionCard = YZLocalStorage.getItem('invite_promotion_alias') !== this.alias;
  },

  methods: {
    // 新学员活动
    fetchRefereeActivityDetail() {
      getRefereeActivityDetail({
        introducerUserId,
        alias: this.alias,
      }).then((data) => {
        const { activityInfo = {}, introducer = {}, reward = {}, isOldStruct = false } = data || {};
        this.rewardInfo = { ...introducer, ...reward };
        this.activityInfo = activityInfo;
        this.isOldStruct = isOldStruct;
        this.hasReward = !isEmpty(reward);
        const awards = get(activityInfo, 'refereeAward.awards', []);
        this.newStuRewardTip = getAwardTip(awards);
        if (this.hasReward && this.showPromotionCard) {
          this.$emit('hasIntroduction');
        }
      });
    },

    // 老学员活动
    fetIntroductionActivity() {
      getIntroductionActivity().then((data) => {
        const { activity = {}, introducerDTO = {} } = data || {};
        this.activityInfo = activity;
        this.introducerDTO = introducerDTO;
        this.hasActivity = !isEmpty(activity);
        this.alias = activity.alias || alias;
      });
    },

    onSharePopup() {
      this.showSharePopup = true;
    },

    onPromotionCardClose() {
      this.showPromotionCard = false;
      YZLocalStorage.setItem('invite_promotion_alias', this.alias);
    },

    onShareGuideClose() {
      this.showShareGuide = false;
    },

    // 老学员分享
    onShareGuide() {
      this.onActivityThreshold(() => {
        this.showShareGuide = true;
        this.setShareConfig();
      });
    },

    onInvitePotserLink() {
      this.onActivityThreshold(() => {
        if (this.isOldStruct) {
          customSafeLink.redirect({
            url: '/wscvis/ump/introduction/invite-poster',
            kdtId,
            query: {
              kdt_id: kdtId,
              alias: this.alias,
              from: this.from,
            },
          });
        } else {
          customSafeLink.redirect({
            url: this.oldStudentLink,
          });
        }
      });
    },

    // 越权验证
    onActivityThreshold(callback) {
      checkActivityThreshold({
        alias: this.alias,
      })
        .then((data) => {
          if (data) {
            isFunction(callback) && callback.call(this);
          } else {
            this.onDialogTip();
          }
        })
        .catch((msg) => {
          this.onDialogTip(msg);
        });
    },

    onDialogTip(msg = '仅老学员才能参加活动，快去报名上课吧') {
      Dialog.confirm({
        message: msg,
        confirmButtonText: '去店铺逛逛',
      }).then(() => {
        navigateEnv();
      });
    },

    setShareConfig() {
      const shareUrl = customSafeLink.getSafeUrl({
        url: this.shareUrl,
        query: introducerUserId
          ? {}
          : {
            alias: this.alias,
            introducerUserId: this.introducerDTO.id || userId,
          },
      });

      let shareConfig = {
        link: shareUrl,
        weappPath: `/packages/edu/webview/index?targetUrl=${encodeURIComponent(shareUrl)}`,
      };

      initWXSdk({
        shareConfig,
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.introduce-promotion {
  &__float {
    position: fixed;
    right: 13px;
    bottom: 110px;
  }

  &__desc {
    margin: 12px 42px 0 24px;
    line-height: 20px;
    font-size: 14px;
    color: #606060;

    a {
      color: #00b389;
    }
  }
}
</style>
