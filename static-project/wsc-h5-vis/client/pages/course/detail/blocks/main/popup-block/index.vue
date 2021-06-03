<template>
  <recommend-popup
    :value="innerShow && !closePopup"
    @close="handleClose"
  />
</template>

<script>
import { RecommendPopup } from '../../slots/recommend-gift';
import { mapGetters, mapState } from 'vuex';
import YZLocalStorage from '@youzan/utils/local_storage';
import { get } from 'lodash';

let showPopupHistory = [];
try {
  showPopupHistory = JSON.parse(YZLocalStorage.getItem('recommend-gift/free-popup-close')) || [];
} catch (e) {}

export default {
  components: {
    RecommendPopup,
  },
  data() {
    return {
      closePopup: false,
    };
  },
  computed: {
    ...mapState(['goodsData']),
    ...mapGetters(['supportRecommendGift']),
    ...mapState('recommend-gift', ['recommendGift']),
    ...mapGetters('recommend-gift', ['getHighestPhase']),
    popKey() {
      const userId = get(_global, 'buyer_id');
      return `${this.goodsData.alias}${userId}`;
    },
    innerShow() {
      const { sku: { maxPrice } } = this.goodsData;
      const hasShowPopup = showPopupHistory.includes(this.popKey);

      if (this.recommendGift && this.recommendGift.phasedRewardDetails.length) {
        return !this.getHighestPhase && this.supportRecommendGift &&
          maxPrice === 0 && !hasShowPopup;
      } else {
        return false;
      }
    },
  },
  watch: {
    'innerShow': function(value) {
      if (value) {
        // 展示一次就加入Storage
        YZLocalStorage.setItem('recommend-gift/free-popup-close', JSON.stringify([...showPopupHistory, this.popKey]));
      }
    },
  },
  methods: {
    handleClose() {
      this.closePopup = true;
    },
  },
};
</script>
