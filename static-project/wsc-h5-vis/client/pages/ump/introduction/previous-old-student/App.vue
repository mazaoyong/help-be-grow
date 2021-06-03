<template>
  <vis-page-container v-if="isInited" class="old-student">
    <section
      v-if="hasActivity && activityInfo.status !== 3"
      :class="['old-student__content', `style-${activityInfo.pageStyle || 1}`]"
    >
      <old-header
        :count="peopleCount"
        :end-at="endAt"
        :status="activityInfo.status"
        :page-style="activityInfo.pageStyle"
        :show-join-num="activityInfo.showJoinNum"
        @clickRecord="onIntroduceRecordsOpen"
        @clickRule="onRuleOpen"
      />

      <!-- 奖励详情 -->
      <reward-detail
        :old-rewards="activityInfo.introducerAwards"
        :page-style="activityInfo.pageStyle"
        :new-rewards="activityInfo.refereeRewardRule"
        :rule-list="ruleList"
        :status="activityInfo.status"
        @action="onActionClick"
      />
    </section>
    <section v-else>
      <!-- 活动失效或者异常 -->
      <no-course
        :desc="noActivityDesc"
        class="old-student__no-activity"
      >
        <van-button
          text="进店逛逛"
          color="#fc4952"
          round
          @click="onJumpToShop"
        />
      </no-course>
    </section>
    <!-- 课程推荐 -->
    <recommend-list v-if="showRecommendGoods" />
    <!-- 邀请记录 -->
    <introduce-records
      v-model="showIntroduceRecords"
      :alias="alias"
      :status="activityInfo.status"
    />
    <!-- 分享引导 -->
    <share-mask :value="showShareGuide" @close="onShareGuideClose" />
  </vis-page-container>
</template>
<script>
import { Button, Dialog } from 'vant';
import NoCourse from '@/pages/edu/components/no-course';
import PageContainer from '@/pages/edu/components/page-container';

import IntroduceRecords from './blocks/introduce-records';
import RecommendList from '../blocks/recommend-list';
import ShareMask from '@/components/share-mask';

import OldHeader from './components/old-header';
import RewardDetail from './components/reward-detail';

import { openActivityRulePopup } from './components/activity-rule';

import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import Args from 'zan-utils/url/args';
import { setShareData } from '@youzan/wxsdk';
import isFunction from 'lodash/isFunction';
import { navigateEnv } from '@/common/utils/env';
import { checkAndLogin } from '@/common/utils/login';
import * as customSafeLink from '@/common/utils/custom-safe-link';
import { getActivityParticipatePeople } from '../apis/index';
import { getIntroductionActivity, checkActivityThreshold } from '../apis/old-student';
import { formatTrackParam, makePointLog, OLD_EVENT_NAME } from '../log';
import { ACTIVITY_STATUS, SHOWJOINNUM, REFEREE_SHARE_IMG, SHARE_H5_ICON } from './constants';

const { kdt_id: kdtId, miniprogram = {}, buyer_id: userId, hasThreshold } = window._global || {};
const alias = Args.get('alias') || '';
const from = Args.get('from') || '';
const isMiniProgram = miniprogram.isMiniProgram;

export default {
  name: 'old-student',

  components: {
    'van-button': Button,
    NoCourse,
    'vis-page-container': PageContainer,
    RewardDetail,
    RecommendList,
    IntroduceRecords,
    ShareMask,
    OldHeader,
  },

  data() {
    return {
      showIntroduceRecords: false,
      showShareGuide: false,
      activityInfo: {},
      peopleCount: 0,
      hasActivity: false,
      noActivityDesc: '机构暂无活动，去看看其他课程',
      isInited: false,
      alias,
      showRecommendGoods: 0,
      from,
      userId,
      trackParams: {},
    };
  },

  computed: {
    ruleList() {
      const { introducerRewardRule = '' } = this.activityInfo;
      return [
        {
          title: '活动规则:',
          content: introducerRewardRule.replace(/\n/g, '<br/>') || '暂无',
        },
        {
          title: '参与条件:',
          content: '能参与转介绍活动的学员必须是在机构购买过线下课程的学员，无论是购买的体验课还是正式课都可以.',
        },
        {
          title: '如何参与:',
          content: '学员可以上传自己的图片生成带有自己特色的海报或者直接保存机构的海报模板，分享给自己的好友.',
        },
      ];
    },

    endAt() {
      const { status, startAt, endAt } = this.activityInfo;
      if (status === ACTIVITY_STATUS.NOT_START) {
        return startAt;
      } else if (status === ACTIVITY_STATUS.STARTED) {
        return endAt;
      }
      return 0;
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
        .then(data => {
          const { activity = {}, introducerDTO = {} } = data || {};
          this.activityInfo = activity;
          this.alias = get(activity, 'alias', alias);
          this.showRecommendGoods = get(activity, 'showRecommendGoods');
          this.userId = get(introducerDTO, 'id', userId);
          this.hasActivity = !isEmpty(activity);

          if (hasThreshold) {
            this.setShareConfig();
          }

          if (get(activity, 'status') === ACTIVITY_STATUS.INVALID) {
            this.noActivityDesc = '活动已失效';
          }

          if (get(activity, 'showJoinNum') === SHOWJOINNUM.YES) {
            this.fetchCurrentActivityPeopleNum();
          }
          this.trackParams = formatTrackParam(activity, get(activity, 'rewardSettingType'));
        })
        .catch((err) => {
          this.hasActivity = false;
          this.noActivityDesc = err || '获取店铺活动信息失败，请刷新页面';
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
      })
        .then(data => {
          this.peopleCount = data || 0;
        });
    },

    onActionClick(type) {
      if (type === 'link') {
        this.onShareGuideOpen();
      } else if (type === 'card') {
        this.onJumpLink(this.activityInfo.status);
      } else {
        this.onJumpToShop();
      }
    },

    onIntroduceRecordsOpen() {
      checkAndLogin((_, userId, doLogin) => {
        if (doLogin) {
          return window.location.reload();
        }
        this.showIntroduceRecords = true;
      });
    },

    onRuleOpen() {
      openActivityRulePopup({
        props: {
          oldRewards: this.activityInfo.introducerAwards,
          introducerRule: this.activityInfo.introducerRule,
        },
      });
    },

    onJumpLink(status) {
      this.onCheck(() => {
        if (status === 1) {
          // 分享海报
          customSafeLink.redirect({
            url: '/wscvis/ump/introduction/previous-invite-poster',
            kdtId,
            query: {
              kdt_id: kdtId,
              alias: this.alias,
              from: 'introduction_old_student',
            },
          });
        } else {
          // 跳转店铺首页
          this.onJumpToShop();
        }
      });
      this.makeLog('share_poster');
    },

    onCheck(callback) {
      checkAndLogin((_, userId, doLogin) => {
        if (doLogin) {
          return window.location.reload();
        }
        checkActivityThreshold({
          alias: this.alias,
        })
          .then(data => {
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
      });
    },

    onDialogTip(msg = '仅老学员才能参加活动，快去报名上课吧') {
      Dialog.confirm({
        message: msg,
        confirmButtonText: '去店铺逛逛',
      })
        .then(() => {
          this.onJumpToShop();
        })
        .catch(() => {
          this.makeLog('permission_dialog_know');
        });
    },

    onShareGuideOpen() {
      this.onCheck(() => {
        this.showShareGuide = true;
        this.setShareConfig();
      });
      this.makeLog('share_link');
    },

    onShareGuideClose() {
      this.showShareGuide = false;
    },

    onJumpToShop() {
      this.makeLog('home');
      navigateEnv();
    },

    setShareConfig() {
      const { pageStyle } = this.activityInfo;
      const cover = isMiniProgram
        ? REFEREE_SHARE_IMG[pageStyle].SHARE
        : SHARE_H5_ICON[pageStyle];
      const shareUrl = customSafeLink.getSafeUrl({
        url: '/wscvis/ump/introduction/new-student',
        kdtId,
        query: {
          kdt_id: kdtId,
          introducerUserId: this.userId,
          alias: this.alias,
          from: 'old',
        },
      });

      setShareData({
        title: '快来领取奖励，和我一起上课吧',
        desc: '立即领取 >',
        cover,
        link: shareUrl,
        weappPath: `/packages/edu/webview/index?targetUrl=${encodeURIComponent(shareUrl)}`,
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
  font-size: 14px;
  background-color: #fff;

  &__content {
    background-position: top;
    background-repeat: no-repeat;
    background-size: contain;

    &.style {
      &-1 {
        background-color: #fd6113;
        background-image: url(https://img01.yzcdn.cn/upload_files/2020/08/12/FthV-LIkK64HmhGY47vLX_UifQSZ.png);
      }

      &-2 {
        background-color: #377ffe;
        background-image: url(https://img01.yzcdn.cn/upload_files/2020/08/11/Fg54OyY5u_XUTQ1VH4NzYeg9qK4i.png);
      }

      &-3 {
        background-color: #4245ed;
        background-image: url(https://img01.yzcdn.cn/upload_files/2020/08/17/FvMy8xiNpFrgbRluvy3s7m3gM6Ry.png);
      }
    }
  }

  &__title {
    font-size: 20px;
    font-weight: 900;
    line-height: 50px;
  }

  &__sharelink {
    display: block;
    margin-top: 3px;
    color: #fff;
  }

  &__no-activity {
    padding: 128px 0;

    .van-button {
      height: 36px;
      padding: 0 20px;
      line-height: 36px;
    }
  }

  .reward-card__coupon-card {
    height: 230px;
  }

  ::v-deep .reward-card__coupon-footer {
    padding-bottom: 0;
  }
}
</style>
