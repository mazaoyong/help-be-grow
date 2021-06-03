<template>
  <div class="reward-info">
    <div class="reward-info-title" v-if="!tipInfo">
      <template v-if="awardDesc.descriptionMode === 0">
        <div class="main-title">
          价值 <span class="price">{{ awardDesc.awardTotalValue }}</span> 元
        </div>
        <div class="sub-title">{{ awardDesc.awardValueDesc }}</div>
      </template>
      <template v-else-if="awardDesc.descriptionMode === 1">
        <div class="desc-title">{{ awardDesc.freestyleDesc }}</div>
      </template>
      <template v-else>
        <div class="desc-title">{{ newStuAwardDesc }}</div>
      </template>
    </div>
    <div class="reward-info-tip" v-else>
      {{ tipInfo }}
    </div>
    <div class="reward-info-progress" v-if="needBoost && progress < 100">
      <div class="progress-bar" :style="`width: ${progress}%`" />
      <img src="https://img01.yzcdn.cn/public_files/0536e71430040a239ff08f64cca5c6a1.png" />
    </div>
    <div class="reward-info-btn">
      <div class="action-btn-tip" v-if="buttonInfo.btnTip">
        {{ buttonInfo.btnTip }}
      </div>
      <main-button :type="mainBtnType" :text="buttonInfo.btnText" @handle-click="onButtonClick(buttonInfo.btnType)" />
      <div class="sub-btn" v-if="buttonInfo.subBtnText" @click="onButtonClick(buttonInfo.subBtnType)">
        <span>{{ `${buttonInfo.subBtnText}` }}</span>
        <van-icon class="sub-btn-icon" name="arrow" size="12" />
      </div>
    </div>
    <div class="reward-info-time">
      {{ timeStr }}
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';
import { Icon } from 'vant';
import MainButton from '../../../components/main-button';

export default {
  name: 'refere-reward',

  components: {
    'van-icon': Icon,
    MainButton,
  },

  computed: {
    ...mapState([
      'introductionInfo',
      'inviteUserInfo',
      'reward',
      'tipInfo',
      'buttonInfo',
      'gap',
      'rewardDetail',
      'count',
    ]),

    ...mapGetters(['pageStyle', 'awardDesc', 'timeStr', 'progress', 'needBoost', 'newStuAwardDesc', 'mainBtnType']),
  },

  methods: {
    ...mapActions(['onButtonClick']),
  },
};
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
