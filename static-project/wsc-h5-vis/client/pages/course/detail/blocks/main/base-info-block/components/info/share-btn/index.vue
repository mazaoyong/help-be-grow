<template>
  <div>
    <template v-if="supportRecommendGift">
      <recommend-share-btn />
    </template>
    <template v-if="showInviteCard">
      <a
        v-if="shareUrl"
        v-log="['click_share', '点击分享']"
        @click="handleShare"
      >
        <div class="share">
          <van-icon class="share-icon" name="share" size="18" />
          <p>分享</p>
        </div>
      </a>
    </template>
  </div>
</template>

<script>
import { Icon } from 'vant';
import { mapGetters } from 'vuex';
import { GOODS_TYPE_TO_OWL_TYPE } from '@/constants/course/goods-type';
import { RecommendShareBtn } from '../../../../../slots/recommend-gift';
import { forcePhoneLogin } from '@/common/utils/login';
import * as SafeLink from '@youzan/safe-link';
import Args from '@youzan/utils/url/args';
import log from '@/pages/course/detail/utils/log';
import { getEnvH5OrMiniprogramType } from '@/common/utils/log-params';

export default {
  components: {
    'van-icon': Icon,
    RecommendShareBtn,
  },
  data() {
    return {
      showSalesMan: true,
    };
  },
  rootState: ['kdtId', 'goodsType', 'goodsData', 'umpType', 'umpAlias', 'activityData'],
  computed: {
    ...mapGetters(['supportRecommendGift']),
    showInviteCard() {
      // 既没有推荐有奖也没有销售员的时候
      return !this.supportRecommendGift && !this.showSalesMan;
    },
    shareUrl() {
      const goodsType = this.goodsType;
      const alias = this.goodsData.alias;
      const kdtId = this.kdtId;

      const seckillQuery = {};
      if (this.umpType) {
        seckillQuery.ump_type = this.umpType;
        seckillQuery.ump_alias = this.umpAlias;
      }

      if (goodsType && alias) {
        return Args.add('/wscvis/ump/invite-card', {
          alias,
          kdt_id: kdtId,
          owlType: GOODS_TYPE_TO_OWL_TYPE[goodsType],
          entry: 'normal',
          ...seckillQuery,
        });
      }
      return '';
    },
  },
  mounted() {
    this.recommendGiftVisitLog();
    // hack方法，没法获取到动态注册模块的状态
    document.addEventListener('shareBlockMounted', () => {
      this.showSalesMan = !!document.querySelector('.share-block');
    });
  },
  methods: {
    handleShare() {
      forcePhoneLogin((sessionId, userId, doLogin) => {
        if (doLogin) {
          return window.location.reload();
        }
        SafeLink.redirect({ url: this.shareUrl });
      });
    },
    recommendGiftVisitLog() {
      try {
        const fromType = Args.get('recommendGiftShareFromType');
        const bid = Args.get('bid');
        const { recommendGift } = this.activityData;
        if (recommendGift && bid) {
          const { refereeType, referrerType } = recommendGift;
          log({
            et: 'custom',
            ei: 'recommend_gift_referee_visit_course',
            en: '被推荐人-访问页面',
            params: {
              alias: this.goodsData.alias,
              referrerType,
              refereeType,
              from: fromType === 'poster' ? 1 : 2,
              env: getEnvH5OrMiniprogramType(),
            },
          });
        }
      } catch (e) {
        console.log('推荐有奖埋点报错', e);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'mixins/index.scss';

.share {
  font-size: 12px;
  color: $disabled-color;
  text-align: center;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
}
</style>
