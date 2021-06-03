<template>
  <div class="reward-info">
    <div class="reward-info-title">
      <template v-if="awardDesc.type === 0">
        <div class="main-title">
          价值 <span class="price">{{ awardDesc.price }}</span> 元
        </div>
        <div class="sub-title">{{ awardDesc.priceLabel }}</div>
      </template>
      <template v-else-if="awardDesc.type === 1">
        <div class="desc-title">{{ awardDesc.title }}</div>
      </template>
      <template v-else>
        <div class="desc-title">{{ data.newStudentRewardTip }}</div>
      </template>
    </div>
    <div class="reward-info-progress" v-if="newStudentRewardSetting.newStudentRewardSettingType === 3">
      <div class="progress-bar" :style="`width: 0%`" />
      <img src="https://img01.yzcdn.cn/public_files/0536e71430040a239ff08f64cca5c6a1.png" />
    </div>
    <div class="reward-info-btn">
      <div class="action-btn-tip" v-if="newStudentRewardSetting.newStudentRewardSettingType === 3">
        还需{{ newStudentRewardSetting.friendHelpTotalNum }}人助力
      </div>
      <main-button type="large" :text="btnText" />
    </div>
    <div class="reward-info-time">
      {{ timeStr }}
    </div>
  </div>
</template>

<script>
import formatDate from '@youzan/utils/date/formatDate';
import MainButton from '../../../components/main-button';

export default {
  name: 'refere-reward',

  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
  },

  components: {
    MainButton,
  },

  computed: {
    timeStr() {
      const { time = [] } = this.data;
      return `${time[0] ? formatDate(time[0], 'YYYY.MM.DD') : ''} - ${
        time[1] ? formatDate(time[1], 'YYYY.MM.DD') : ''
      }`;
    },
    awardDesc() {
      const { newStudentRewardDisplaySetting = {} } = this.data;
      return newStudentRewardDisplaySetting;
    },
    newStudentRewardSetting() {
      const { newStudentRewardSetting = {} } = this.data;
      return newStudentRewardSetting;
    },
    btnText() {
      const { newStudentRewardSetting } = this;
      switch (newStudentRewardSetting.newStudentRewardSettingType) {
        case 3:
          return '分享给好友';
        case 2:
          return '立即分享，领取奖励';
        case 1:
          return '立即领取';
        default:
          break;
      }
      return '';
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../../../new-student/blocks/reward-info/index.scss';
</style>
