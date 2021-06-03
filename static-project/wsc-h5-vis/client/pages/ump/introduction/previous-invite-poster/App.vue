<template>
  <vis-page-container class="invite-poster">
    <p class="invite-poster__header">
      <span @click="onRulePopupOpen">活动规则</span>
      <span @click="onIntroduceRecordOpen">我的邀请记录</span>
    </p>
    <h3 class="invite-poster__title">
      分享海报邀请好友上课，一起赢奖励！
    </h3>
    <Swiper
      v-if="fetched"
      @change="onPosterChange"
    >
      <swiper-item
        v-for="(item, index) in posterBgList"
        :key="index"
        :index="index"
      >
        <poster-card
          :poster-bg="item.bg"
          :is-custom="item.type === 'custom'"
          :poster-info="posterInfo"
          :is-start="item.isStart"
          :poster-theme="posterTheme"
          @upload-change="onImgChange"
          @finished="onPosterLoaded"
          @track-log="makeLog"
        />
      </swiper-item>
    </Swiper>

    <p
      v-if="!isCustom"
      class="invite-poster__tip"
    >
      长按图片保存到相册
    </p>

    <van-button
      v-else
      size="large"
      text="生成海报"
      round
      :class="canMakePoster ? '' : 'disabled'"
      class="invite-poster__make"
      @click="onCustomPosterDraw"
    />

    <!-- 活动规则 -->
    <vis-popup-confirm
      v-model="showRulePopup"
      title="活动规则"
      :is-show-cancel-btn="false"
      confirm-btn-text="我知道了"
      class="invite-poster__rule"
    >
      <p v-html="activityInfo.introducerRewardRule" />
    </vis-popup-confirm>

    <!-- 海报弹窗 -->
    <poster-popup
      v-model="showPosterPopup"
      :url="previewUrl"
    />

    <!-- 邀请记录 -->
    <introduce-records
      v-model="showIntroduceRecords"
      :alias="activityInfo.alias"
      :status="activityInfo.status"
    />
  </vis-page-container>
</template>
<script>
import { Button } from 'vant';
import { PopupConfirm } from '@youzan/vis-ui';
import PageContainer from '@/pages/edu/components/page-container';
import Swiper from './components/swiper';
import SwiperItem from './components/swiper-item';
import PosterCard from './components/poster-card';
import IntroduceRecords from '../previous-old-student/blocks/introduce-records';
import PosterPopup from './components/poster-popup';

import get from 'lodash/get';
import Args from 'zan-utils/url/args';
import { getCommonWeappCode, getCommonSwanCode } from '@/common-api/utils';
import { getQrCode } from '@/common-api/qr-code';
import * as customSafeLink from '@/common/utils/custom-safe-link';
import { getIntroductionActivity } from '../apis/old-student';
import { POSTER_CUSTOM_BG, POSTER_DEFAULT_BG, POSTER_DEFINITION_BG, POSTER_SETTING_TYPE } from '../previous-old-student/constants';
import { formatTrackParam, makePointLog, OLD_EVENT_NAME } from '../log';
import { openActivityRulePopup } from '../previous-old-student/components/activity-rule';

const { mp_data: mpData = {}, miniprogram = {}, visBuyer = {}, kdt_id: kdtId } = window._global || {};
const defaultAvatar = visBuyer.finalAvatar || 'https://img01.yzcdn.cn/public_files/2017/10/23/1321da81aa84d0539b0d5af73fbbf53b.png';
const defaultName = visBuyer.finalUsername || '小伙伴';

const alias = Args.get('alias') || '';
const from = Args.get('from') || '';

export default {
  name: 'invite-poster',

  components: {
    'van-button': Button,
    'vis-popup-confirm': PopupConfirm,
    'vis-page-container': PageContainer,
    Swiper,
    SwiperItem,
    PosterCard,
    IntroduceRecords,
    PosterPopup,
  },

  data() {
    return {
      fetched: false,
      posterBgList: [POSTER_CUSTOM_BG],
      posterDefinitionBg: POSTER_DEFINITION_BG,
      showRulePopup: false,
      showPosterPopup: false,
      currentIndex: 0,
      previewUrl: '',
      activityInfo: {},
      baseInfo: {
        name: defaultName,
        avatar: defaultAvatar,
        shopName: mpData.shop_name,
        shopLogo: mpData.logo,
        qrCode: '',
        content: `“HI！一起来${mpData.shop_name}学习吧”`,
        label: '“一起来学习吧，还有奖励等着你！”',
        reward: '',
      },
      showIntroduceRecords: false,
      canMakePoster: false,
      trackParams: {},
      from,
    };
  },

  computed: {
    isCustom() {
      return this.posterBgList[this.currentIndex].type === 'custom';
    },

    posterInfo() {
      let type;
      let tip;
      let baseLabel = this.baseInfo.label;
      const posterType = this.posterBgList[this.currentIndex].type;
      if (posterType === 'custom') {
        type = 'custom';
        tip = '扫描或长按识别二维码';
      } else if (posterType === 'definition') {
        type = 'definition';
        tip = '扫描或长按识别二维码，一起加入学习';
      } else {
        baseLabel = '“送你一份大礼包，一起来学习吧！”';
        type = 'default';
        tip = '长按识别二维码';
      }
      return {
        ...Object.assign(this.baseInfo, { label: baseLabel }),
        type,
        tip,
      };
    },

    posterTheme() {
      return this.posterBgList[this.currentIndex].theme || '';
    },
  },

  created() {
    this.fetchLatestActivity();
    this.fetchQrcode()
      .then(qrCode => {
        this.baseInfo.qrCode = qrCode;
      });
  },

  methods: {
    fetchLatestActivity() {
      getIntroductionActivity({
        alias,
      })
        .then(data => {
          const { activity, introducerDTO } = data || {};
          this.activityInfo = activity || {};
          this.baseInfo = Object.assign(this.baseInfo, introducerDTO || {
            name: defaultName,
            avatar: defaultAvatar,
          }, {
            reward: this.activityInfo.refereeRewardRule || '',
          });
          this.formatPosterBgList();
          this.fetched = true;
          this.trackParams = formatTrackParam(activity, get(activity, 'rewardSettingType'));
          this.makeLog('enterpage');
        });
    },

    formatPosterBgList() {
      const { introducerPosterSetting = [], customizePosters = [] } = this.activityInfo;
      let definitionBg = '';
      let defaultPosters = [];
      introducerPosterSetting.forEach(setting => {
        if (setting === POSTER_SETTING_TYPE.DEFINITION && customizePosters[0]) {
          definitionBg = customizePosters[0];
        } else {
          defaultPosters = POSTER_DEFAULT_BG;
        }
      });

      if (definitionBg) {
        this.posterDefinitionBg.bg = definitionBg;
        this.posterBgList.push(this.posterDefinitionBg);
      }

      if (defaultPosters.length > 0) {
        this.posterBgList = this.posterBgList.concat(defaultPosters);
      }
    },

    fetchQrcode() {
      const { isWeapp, isSwanApp } = miniprogram;
      const shareUrl = customSafeLink.getSafeUrl({
        url: '/wscvis/ump/introduction/new-student',
        kdtId,
        query: {
          kdt_id: kdtId,
          alias,
          introducerUserId: visBuyer.buyerId,
        },
      });
      if (isWeapp) {
        return getCommonWeappCode({
          page: `/packages/edu/webview/index`,
          targetUrl: encodeURIComponent(shareUrl),
        });
      } else if (isSwanApp) {
        return getCommonSwanCode({
          targetUrl: `/packages/edu/webview/index?targetUrl=${encodeURIComponent(shareUrl)}`,
        });
      } else {
        return getQrCode({
          url: shareUrl,
          isShortenUrl: true,
        })
          .then(res => {
            return res.data;
          });
      }
    },

    // 规则弹窗
    onRulePopupOpen() {
      openActivityRulePopup({
        props: {
          oldRewards: this.activityInfo.introducerAwards,
        },
      });
    },

    // 切换海报
    onPosterChange(index) {
      this.currentIndex = index;
      const currentItem = this.posterBgList[this.currentIndex];
      const { type, isLoaded } = currentItem;
      if (type === 'custom' || isLoaded) {
        return;
      }
      currentItem.isStart = true;
      this.$set(this.posterBgList, this.currentIndex, currentItem);
    },

    // 关闭海报弹窗
    onPosterClose() {
      this.showPosterPopup = false;
    },

    // 自定义海报绘制
    onCustomPosterDraw() {
      if (this.canMakePoster) {
        const currentItem = this.posterBgList[this.currentIndex];
        currentItem.isStart = true;
        this.$set(this.posterBgList, this.currentIndex, currentItem);
      }
    },

    // 邀请记录
    onIntroduceRecordOpen() {
      this.showIntroduceRecords = true;
    },

    // 更换图片
    onImgChange(img) {
      this.canMakePoster = !!img;
      this.makeLog('choose_picture');
    },

    // 海报绘制完成
    onPosterLoaded(img) {
      const currentItem = this.posterBgList[this.currentIndex];
      if (img && currentItem.type === 'custom') {
        this.previewUrl = img;
        this.showPosterPopup = true;
      }
      currentItem.isLoaded = !!img;
      currentItem.isStart = false;
      this.$set(this.posterBgList, this.currentIndex, currentItem);
    },

    makeLog(eventType, isSuccess = 0, msg = '') {
      if (eventType === 'enterpage') {
        this.trackParams.from = this.from;
        makePointLog('display', eventType, OLD_EVENT_NAME[eventType], 'introductionOldDetail', this.trackParams);
      } else if (eventType === 'permission_check') {
        this.trackParams.isSuccess = isSuccess;
        makePointLog('custome', eventType, OLD_EVENT_NAME[eventType], 'introductionOldDetail', this.trackParams);
      } else if (eventType === 'make_poster') {
        this.trackParams.isSuccess = isSuccess;
        this.trackParams.error = msg;
        makePointLog('click', eventType, OLD_EVENT_NAME[eventType], 'introductionOldDetail', this.trackParams);
      } else {
        makePointLog('click', eventType, OLD_EVENT_NAME[eventType], 'introductionOldDetail', this.trackParams);
      }
    },
  },

};
</script>
<style lang="scss" scoped>
@import 'mixins/index.scss';

.invite-poster {
  padding-bottom: 60px;
  font-size: 14px;
  color: #323233;
  user-select: none;

  &__header {
    padding: 16px 16px 0 16px;

    @include flex-row();

    > span {
      flex: 1;

      &:last-child {
        text-align: right;
      }
    }
  }

  &__title {
    margin: 56px auto 16px auto;
    font-size: 16px;
    font-weight: 500;
    text-align: center;
  }

  &__tip {
    margin-top: 30px;
    text-align: center;
  }

  &__make {
    position: fixed;
    bottom: 8px;
    left: 50%;
    width: calc(100% - 48px);
    height: 44px;
    font-size: 16px;
    line-height: 44px;
    color: #fff;
    background-color: #fc4952;
    transform: translateX(-50%);

    &.disabled {
      color: #646566;
      background-color: #dcdee0;
    }

    &::before {
      background-color: transparent;
      border-color: transparent;
    }
  }

  &__rule {
    p {
      line-height: 22px;
      color: #39393a;
    }

    ::v-deep .vis-standard-popup__content {
      min-height: 180px !important;
    }
  }

  ::v-deep .vis-popup-confirm__button--confrim {
    background-color: #fc4952 !important;
    border-color: #fc4952 !important;
  }
}
</style>
