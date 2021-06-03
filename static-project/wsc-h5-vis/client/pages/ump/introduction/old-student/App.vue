<template>
  <vis-page-container v-if="isInited" class="old-student">
    <section v-if="activityIsNormal" :class="['old-student__content', `style-${posterStyle}`]">
      <header-info
        :old-stu-reward-tip="oldStuRewardTip"
        :new-stu-reward-tip="newStuRewardTip"
        :count="peopleCount"
        :show-join-num="activityInfo.showJoinNum"
        @clickRecord="onAchievementOpen"
        @clickRule="onRuleOpen"
      />

      <poster-swiper
        :customize-posters="activityInfo.customizePosters"
        :introducer-poster-setting="activityInfo.introducerPosterSetting"
        :new-stu-reward-tip="newStuPosterRewardTip"
        :new-stu-reward-tip-simple="newStuRewardTip"
        :introducer="introducer"
        :poster-style="posterStyle"
        :alias="alias"
        @share="onActionClick('poster')"
      />

      <div class="old-student__content-footer">
        <div class="share-btn" @click="onActionClick('share')">
          分享链接给好友
        </div>
        <div class="copy-link" @click="onActionClick('copy')">
          复制活动链接
        </div>
        <div class="time">
          {{ timeStr }}
        </div>
      </div>
    </section>
    <section v-else>
      <activity-error
        :tip="noActivityDesc"
        :time="activityInfo.status === 0 ? [activityInfo.startAt, activityInfo.endAt] : []"
      >
        <p
          v-if="!activityIsNormal"
          slot="bottom"
          class="view-achievement"
          @click="onAchievementOpen"
        >
          查看我的成就
          <van-icon name="arrow" />
        </p>
      </activity-error>
    </section>
    <!-- 课程推荐 -->
    <recommend-list v-if="showRecommendGoods" />

    <achievement
      v-model="showAchievement"
      :id="activityInfo.id"
      :alias="activityInfo.alias"
      :can-share="activityIsNormal"
    />
    <!-- 分享引导 -->
    <share-mask v-if="!isShowBoost && !showShareSuccess" :value="showShareGuide" @close="onShareGuideClose" />

    <share-success
      v-if="enableShowShareTip"
      v-model="showShareSuccess"
      :coupon-list="shareReward.couponList"
      :present-list="shareReward.presentList"
      :point="shareReward.point"
    />
    <boost-popup
      v-model="isShowBoost"
      :award-desc="refereeAwardDesc"
      :alias="alias"
      :new-stu-reward-desc="newStuRewardDesc"
      :referee-user-id="refereeUserId"
    />
    <swiper-guide v-if="activityIsNormal" />
  </vis-page-container>
</template>
<script>
import { Dialog, Toast, Icon } from 'vant';
import PageContainer from '@/pages/edu/components/page-container';
import ShareMask from '@/components/share-mask';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import Args from 'zan-utils/url/args';
import { setShareData } from '@youzan/wxsdk';
import isFunction from 'lodash/isFunction';
import { navigateEnv } from '@/common/utils/env';
import formatDate from '@youzan/utils/date/formatDate';
import * as customSafeLink from '@/common/utils/custom-safe-link';
import { getVuePoster } from '@/common/apis/poster';

import RecommendList from '../blocks/recommend-list';

import HeaderInfo from './blocks/header-info';
import Achievement from './blocks/achievement';
import ShareSuccess from './blocks/share-success';
import PosterSwiper from './blocks/poster-swiper';
import SwiperGuide from './blocks/swiper-guide';

import { openActivityRulePopup } from '../components/activity-rule';
import BoostPopup from '../components/boost-popup';
import ActivityError from '../../components/activity-error';

import { getActivityParticipatePeople, getCollectZanUserStatus } from '../apis/index';
import {
  getIntroductionActivity,
  checkActivityThreshold,
  refererShareActivity,
} from '../apis/old-student';
import { formatTrackParam, makePointLog, OLD_EVENT_NAME } from '../log';
import {
  ACTIVITY_STATUS,
  SHOWJOINNUM,
  REFEREE_SHARE_IMG,
  SHARE_H5_ICON,
  NODE_LABEL,
  AWARD_NODE,
  DEFAULT_AVATAR,
  DEFAULT_NAME,
} from '../constants';
import { getAwardTip, classifyAwards, getCurrentUserInfo, copyLink, getRewardDesc } from '../utils';

const { kdt_id: kdtId, miniprogram = {}, hasThreshold } = window._global || {};
const alias = Args.get('alias') || '';
const from = Args.get('from') || '';
const refereeUserId = Args.get('refereeUserId') || '';
const isMiniProgram = miniprogram.isMiniProgram;
const successTipKey = 'INTRODUCTION_SHARE_SUCCESS_';

export default {
  name: 'old-student',

  components: {
    'van-icon': Icon,
    ActivityError,
    'vis-page-container': PageContainer,
    RecommendList,
    ShareMask,
    HeaderInfo,
    PosterSwiper,
    Achievement,
    ShareSuccess,
    BoostPopup,
    SwiperGuide,
  },

  data() {
    return {
      showAchievement: false,
      showShareGuide: false,
      showShareSuccess: false,
      activityInfo: {},
      peopleCount: 0,
      hasActivity: false,
      noActivityDesc: '',
      isInited: false,
      alias,
      showRecommendGoods: 0,
      from,
      introducer: {},
      refereeUserId,
      trackParams: {},
      posterStyle: 1,
      isShowBoost: false,
      shareCover: '',
      hasOldStudentInstance: get(_global, 'introStuCheck.hasOldStudentInstance', false),
    };
  },

  computed: {
    timeStr() {
      const { activityInfo } = this;
      return `${formatDate(activityInfo.startAt, 'YYYY.MM.DD')} - ${formatDate(activityInfo.endAt, 'YYYY.MM.DD')}`;
    },
    oldStuRewardTip() {
      const oldStuAward = get(this.activityInfo, 'introducerAwards', []);
      const { awardDesc = {}, awardNode = 1, awards = [] } = oldStuAward[0] || {};
      let nodeLabel = NODE_LABEL[awardNode];
      let { freestyleDesc = '' } = awardDesc;
      if (freestyleDesc === '') {
        freestyleDesc = getAwardTip(awards);
      }
      return nodeLabel + '可得' + freestyleDesc;
    },
    newStuRewardTip() {
      const { refereeAwardDesc } = this;
      const awards = get(this.activityInfo, 'refereeAward.awards', []);
      return getRewardDesc({ awardDesc: refereeAwardDesc, awards });
    },
    newStuRewardDesc() {
      const awards = get(this.activityInfo, 'refereeAward.awards', []);
      return getAwardTip(awards);
    },
    newStuPosterRewardTip() {
      const tip = 'Hi！快来和我一起学习吧！送你';
      return `${tip}${this.newStuRewardTip}`;
    },
    shareReward() {
      const oldStuAward = get(this.activityInfo, 'introducerAwards', []);
      const shareReward = oldStuAward.find((item) => item.awardNode === AWARD_NODE.STEP1);
      if (!shareReward) return {};
      const { awards = [] } = shareReward;
      return classifyAwards(awards);
    },
    refereeAwardDesc() {
      return get(this.activityInfo, 'refereeAward.awardDesc', {});
    },
    activityIsNormal() {
      return this.hasActivity && this.activityInfo.status === 1;
    },
    enableShowShareTip() {
      const { isShowBoost, shareReward } = this;
      const { couponList = [], presentList = [], point = {} } = shareReward;
      return !isShowBoost && (couponList.length > 0 || presentList.length > 0 || point.awardAmount > 0);
    },
  },

  created() {
    this.fetchLastActivity();
  },

  methods: {
    fetchLastActivity() {
      getIntroductionActivity({
        alias: this.alias,
      })
        .then((data) => {
          const { activity = {}, introducerDTO = {} } = data || {};
          const { avatar = DEFAULT_AVATAR, name = DEFAULT_NAME, id } = introducerDTO;
          this.activityInfo = activity;
          this.alias = get(activity, 'alias', alias);
          this.showRecommendGoods = get(activity, 'showRecommendGoods');
          this.introducer = {
            avatar,
            name,
            id,
          };
          this.posterStyle = get(activity, 'pageStyle', 1);
          this.hasActivity = !isEmpty(activity);

          if (hasThreshold) {
            this.setShareCover();
          }

          if (!this.hasActivity) {
            this.noActivityDesc = '机构暂无活动，去看看其他课程';
          }
          switch (get(activity, 'status')) {
            case ACTIVITY_STATUS.NOT_START:
              this.noActivityDesc = '活动未开始';
              break;
            case ACTIVITY_STATUS.INVALID:
              this.noActivityDesc = '活动已失效';
              break;
            case ACTIVITY_STATUS.END:
              this.noActivityDesc = '你来晚了，活动结束啦！';
              break;
            default:
              break;
          }

          if (!this.noActivityDesc) {
            this.onCheck(() => {});
            this.copyLink();
            this.checkShareSuccessTip();
          }

          if (get(activity, 'showJoinNum') === SHOWJOINNUM.YES) {
            this.fetchCurrentActivityPeopleNum();
          }

          if (this.refereeUserId) {
            this.checkBoost();
          }
          this.trackParams = formatTrackParam(activity, get(activity, 'rewardSettingType'));
        })
        .catch((err) => {
          this.hasActivity = false;
          this.noActivityDesc = typeof err === 'string' ? err : '获取店铺活动信息失败，请刷新页面';
        })
        .finally(() => {
          this.isInited = true;
          this.makeLog('enterpage');
        });
    },

    fetchCurrentActivityPeopleNum() {
      getActivityParticipatePeople({
        alias: this.alias,
        bizScene: 0,
      }).then((data) => {
        this.peopleCount = data || 0;
      });
    },

    checkBoost() {
      getCollectZanUserStatus({
        alias: this.alias,
        refereeUserId: this.refereeUserId,
      }).then((res) => {
        const { isAchieve = false, status = false } = res;
        if (status) {
          setTimeout(() => {
            Toast.success({
              message: '你已经助力过了',
              overlay: true,
            });
          }, 1000);
        } else if (isAchieve) {
          setTimeout(() => {
            Toast.success({
              message: '好友已无需助力',
              overlay: true,
            });
          }, 1000);
        } else {
          this.isShowBoost = true;
        }
      });
    },

    checkShareSuccessTip() {
      const { activityInfo, hasOldStudentInstance } = this;
      const storageKey = `${successTipKey}${activityInfo.id}`;
      const hasTip = localStorage.getItem(storageKey);
      if (!hasTip && hasOldStudentInstance) {
        this.showShareSuccess = true;
        localStorage.setItem(storageKey, 1);
      }
    },

    setShareCover() {
      const { pageStyle = 1 } = this.activityInfo;
      if (!isMiniProgram) {
        this.shareCover = SHARE_H5_ICON;
        this.setShareConfig();
      } else {
        const currentUserInfo = getCurrentUserInfo();
        getVuePoster({
          pathname: 'ump/introduction/share',
          data: {
            name: currentUserInfo.name,
            avatar: currentUserInfo.avatar,
            img: REFEREE_SHARE_IMG[pageStyle],
          },
          snapshotConfig: {
            width: 250,
            height: 200,
            quality: 100,
            type: 'png',
          },
        }).then((res) => {
          let url = res.img;
          this.shareCover = url;
          this.setShareConfig();
        });
      }
    },

    getShareReward() {
      if (this.hasOldStudentInstance) return;
      refererShareActivity({
        alias: this.alias,
      }).then((res) => {
        if (res === true) {
          this.hasOldStudentInstance = true;
        } else {
          Toast(res.message || '奖励领取失败');
        }
      });
    },

    onAchievementOpen() {
      this.showAchievement = true;
    },

    onRuleOpen() {
      openActivityRulePopup({
        props: {
          oldRewards: this.activityInfo.introducerAwards,
          newRewards: this.activityInfo.refereeAward,
          ruleDesc: this.activityInfo.activityRuleDesc,
        },
      });
    },

    onActionClick(type) {
      this.onCheck(() => {
        switch (type) {
          case 'share':
            this.onShareGuideOpen();
            break;
          case 'copy':
            this.copyLink();
            break;
          case 'poster':
            this.getShareReward();
            break;
          default:
            break;
        }
      });
    },

    onCheck(callback) {
      checkActivityThreshold({
        alias: this.alias,
      })
        .then((data) => {
          if (data) {
            isFunction(callback) && callback.call(this);
            this.makeLog('permission_check', 1);
          } else {
            this.onDialogTip();
          }
          this.makeLog('permission_check', 0);
        })
        .catch((msg) => {
          this.onDialogTip(msg);
          this.makeLog('permission_check', 0);
        });
    },

    onDialogTip(msg = '老学员才能参加活动得奖励，快去报名上课吧') {
      Dialog.confirm({
        message: msg,
        showCancelButton: false,
        confirmButtonText: '进店逛逛',
      })
        .then(() => {
          this.onJumpToShop();
        })
        .catch(() => {
          this.makeLog('permission_dialog_know');
        });
    },

    onShareGuideOpen() {
      this.showShareGuide = true;
      this.makeLog('share_link');
    },

    onShareGuideClose() {
      this.showShareGuide = false;
      this.getShareReward();
    },

    onJumpToShop() {
      this.makeLog('home');
      navigateEnv('', 'replace');
    },

    getShareUrl() {
      const shareUrl = customSafeLink.getSafeUrl({
        url: '/wscvis/ump/introduction/new-student',
        kdtId,
        query: {
          kdt_id: kdtId,
          introducerUserId: this.introducer.id,
          alias: this.alias,
          from: 'old',
        },
      });
      return shareUrl;
    },

    setShareConfig() {
      const shareUrl = this.getShareUrl();
      setShareData({
        title: '快来领取奖励，和我一起上课吧',
        desc: '立即领取 >',
        cover: this.shareCover,
        link: shareUrl,
        weappPath: `/packages/edu/webview/index?targetUrl=${encodeURIComponent(shareUrl)}`,
      });
    },

    copyLink() {
      const shareUrl = this.getShareUrl();
      copyLink('.copy-link', shareUrl, () => {
        this.getShareReward();
      });
    },

    makeLog(eventType, isSuccess) {
      if (eventType === 'enterpage') {
        this.trackParams.from = this.from;
        makePointLog('display', eventType, OLD_EVENT_NAME[eventType], 'introductionOldDetail', this.trackParams);
      } else if (eventType === 'permission_check') {
        this.trackParams.isSuccess = isSuccess;
        makePointLog('custom', eventType, OLD_EVENT_NAME[eventType], 'introductionOldDetail', this.trackParams);
      } else {
        makePointLog('click', eventType, OLD_EVENT_NAME[eventType], 'introductionOldDetail', this.trackParams);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.old-student {
  min-height: inherit !important;
  font-size: 14px;
  background-color: #fff;
  overflow-x: hidden;

  &__content {
    background-position: top;
    background-repeat: no-repeat;
    background-size: cover;

    &.style {
      &-1 {
        background-image: url(https://b.yzcdn.cn/public_files/ef1a5a5d4ca11aab6684742098619399.png);
      }

      &-2 {
        background-image: url(https://b.yzcdn.cn/public_files/2833aa4be76bf28dc1f49f3a9ae5a396.png);
      }

      &-3 {
        background-image: url(https://b.yzcdn.cn/public_files/3c8c3ed5b0ec8ad1c9e4be3d5ca2e78e.png);
      }
    }

    &-footer {
      text-align: center;

      .share-btn {
        margin: 0 auto;
        width: 300px;
        height: 44px;
        line-height: 44px;
        background: #fff;
        border-radius: 20px;
        color: #323233;
        font-size: 16px;
        font-weight: 500;
      }

      .copy-link {
        margin-top: 12px;
        font-size: 14px;
        line-height: 20px;
        color: #fff;
      }

      .time {
        padding: 30px 0 16px;
        font-size: 12px;
        line-height: 17px;
        color: rgba(255, 255, 255, 0.5);
      }
    }
  }

  .view-achievement {
    display: inline-flex;
    align-items: center;
    font-size: 14px;
    color: #ff6711;
  }
}
</style>
