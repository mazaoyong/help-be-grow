<template>
  <div class="redbag-wrap">
    <div class="response-wrap">
      <recommend-bonus
        :multi-sku="showHighest"
        :main-price="format(recommendGift.commissionPrice, true, false)"
        :sub-price="format(recommendGift.decreasePrice, true, false)"
      />
      <div class="share-btn" @click="handleSharePoster">
        分享海报
      </div>
      <div class="share-link" @click="handleShareWechat">
        分享链接
        <van-icon name="arrow" />
      </div>
    </div>
  </div>
</template>

<script>
import { Icon } from 'vant';
import { RecommendBonus } from '@/domain/recommend-gift/components';
import { mapState, mapActions } from 'vuex';
import format from '@youzan/utils/money/format';
import { CommissionRewardType } from '@/constants/ump/recommend-gift';

export default {
  components: {
    'van-icon': Icon,
    RecommendBonus,
  },
  computed: {
    ...mapState('recommend-gift', ['recommendGift']),
    showHighest() {
      const { multiSku, commissionRewardType } = this.recommendGift || {};
      return multiSku && commissionRewardType === CommissionRewardType.FIXED_RATIO; // 固定金额分佣奖励
    },
  },
  methods: {
    format,
    ...mapActions('recommend-gift', ['openSharePoster', 'openShareWechat']),
    handleSharePoster() {
      this.$track.collect('course_recommend_click:clickName', 'red_bag_poster');
      this.$track.runTask('courseActivityPageClick');
      this.openSharePoster();
    },
    handleShareWechat() {
      this.$track.collect('course_recommend_click:clickName', 'red_bag_wechat');
      this.$track.runTask('courseActivityPageClick');
      this.openShareWechat();
    },
  },
};
</script>

<style lang="scss" scoped>
.redbag-wrap {
  height: 41vh;
  margin: 16px 12px;
  background-image: url('https://img01.yzcdn.cn/upload_files/2020/11/09/FjTtmbls9I6ZclAKAJWm6tgDTIW8.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

.share-btn {
  width: 263px;
  height: 64px;
  margin-top: 35px;
  font-size: 22px;
  font-weight: bold;
  line-height: 64px;
  color: #fff;
  text-align: center;
  background-image: linear-gradient(139deg, #ff7b17 0%, #ff2b00 100%);
  border-radius: 32px;
  animation: breath 1.5s linear 1.5s infinite;
}

@keyframes breath {
  from {
    transform: scale(1);
  }

  50% {
    transform: scale(.9);
  }

  to {
    transform: scale(1);
  }
}

.share-link {
  display: flex;
  margin-top: 12px;
  font-size: 14px;
  font-weight: bold;
  color: #ff5b00;
  align-items: center;

  .van-icon-arrow {
    margin-left: 5px;
  }
}

.response-wrap {
  display: flex;
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* 小于375的设备，进行缩放 */
@media (max-width: 374px) {
  .response-wrap {
    transform: scale(.9);
  }
}

/* 大于414的设备，进行放大 */
@media screen and (min-width: 413px), screen and (min-height: 735px) {
  .response-wrap {
    transform: scale(1.1);
  }
}
</style>

<style lang="scss">
// 覆盖样式
.invite-bonus {
  .invite-tip {
    color: #ff5100;
  }

  .invite-profit {
    color: #ff5100;
  }

  .friend-tip {
    .tip-text {
      color: #ba8849;
    }

    .tip-amount {
      color: #ff5100;
    }
  }
}
</style>
