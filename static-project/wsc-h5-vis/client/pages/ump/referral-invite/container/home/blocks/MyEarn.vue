<template>
  <view-wrapper :show-padding="false">
    <div class="header">
      <div v-if="isCourseEntry" class="title">
        我的收益
        <van-icon name="question-o" class="icon" @click="$emit('show-profit-modal')" />
      </div>
      <div class="detail" :style="{top: `${isCourseEntry ? '8px': '13px'}`}" @click="goProfitDetail">
        查看明细
        <van-icon name="arrow" size="12px" class="icon" />
      </div>
    </div>
    <div class="earn-info-wrap">
      <earn-info />
    </div>
  </view-wrapper>
</template>

<script>
import { Icon } from 'vant';
import { mapGetters, mapActions } from 'vuex';
import ViewWrapper from '../../components/view-wrapper';
import EarnInfo from '../../components/earn-info';

export default {
  components: {
    EarnInfo,
    ViewWrapper,
    'van-icon': Icon,
  },
  computed: {
    ...mapGetters(['isCourseEntry']),
  },
  methods: {
    ...mapActions(['goProfitDetail']),
  },
};
</script>

<style lang="scss" scoped>
.header {
  position: relative;
}

.title {
  display: flex;
  width: 170px;
  height: 36px;
  margin: 0 auto;
  font-size: 14px;
  font-weight: bold;
  line-height: 36px;
  color: #ff5100;
  background-image: url('https://img01.yzcdn.cn/upload_files/2020/11/09/FqVOR16PYvarC2ybSAF4VdvcHrwp.png');
  background-repeat: no-repeat;
  background-size: contain;
  align-items: center;
  justify-content: center;
}

.detail {
  position: absolute;
  top: 6px;
  right: 12px;
  display: flex;
  font-size: 12px;
  line-height: 20px;
  color: #959799;
  align-items: center;
}

.earn-info-wrap {
  padding: 16px 36px;
}

.icon {
  margin-left: 5px;
}
</style>
