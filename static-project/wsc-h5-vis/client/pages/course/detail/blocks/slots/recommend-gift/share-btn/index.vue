<template>
  <div>
    <div
      class="recommend-share-btn"
      :style="{backgroundImage:`url(${shareBtnTheme})`}"
      @click="clickShareBtn"
    >
      <div class="max-profit">
        <template v-if="recommendGift.commissionPrice">
          赚 <span>￥{{ format(recommendGift.commissionPrice) }}</span>
        </template>
        <template v-else>
          赚奖励
        </template>
      </div>
    </div>
    <share-popup v-model="showSharePopup" />
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex';
import SharePopup from '../share-popup/index';
import { getShareBtnTheme } from './constant';

export default {
  components: {
    SharePopup,
  },
  data() {
    return {
      showSharePopup: false,
    };
  },
  computed: {
    ...mapState('recommend-gift', ['recommendGift']),
    ...mapGetters('recommend-gift', ['getHighestPhase', 'goodsData']),
    shareBtnTheme() {
      return getShareBtnTheme(_global.themeType);
    },
  },
  methods: {
    ...mapActions('recommend-gift', ['goActivityDetail']),
    format(value) {
      if (value > 1000) {
        return parseInt(value / 100);
      } else {
        return Number(value / 100).toFixed(2);
      }
    },
    clickShareBtn() {
      this.$track.runTask('recommendShareBtn');
      // 如果没有佣金且已达到最高奖励，则跳至活动详情
      if (!this.recommendGift.commissionPrice && this.getHighestPhase) {
        this.goActivityDetail({
          alias: this.goodsData.alias,
          fromPage: 'course',
        });
      } else {
        this.$track.runTask('recommendSharePopup');
        this.showSharePopup = true;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.recommend-share-btn {
  height: 58px;
  background-repeat: no-repeat;
  position: relative;
  background-size: contain;
}
.max-profit {
  span {
    font-family: Avenir;
  }
  font-size: 12px;
  color: #FFF4D2;
  text-align: center;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 4px;
  width: 60px;
  font-weight: bold;
  letter-spacing: -1px;
}
</style>
