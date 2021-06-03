<template>
  <div v-if="recommendGoodsList.length">
    <view-wrapper title="推荐以下商品赚奖励" :show-padding="false">
      <recommend-list :items="recommendGoodsList.slice(0, 10)" />
    </view-wrapper>
  </div>
  <div v-else>
    <view-wrapper>
      <div class="empty-content">
        <img class="empty-img" src="https://img01.yzcdn.cn/upload_files/2020/10/22/FmmZ-ac8GPY757skKgFF_kuXOGGb.png">
        <p class="empty-tips">
          当前暂无活动，进店逛逛吧
        </p>
        <invite-button
          width="100%"
          height="48px"
          border-radius="24px"
        >
          <div class="btn-text" @click="goHome">
            进店逛逛
          </div>
        </invite-button>
      </div>
    </view-wrapper>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { navigateEnv } from 'common/utils/env';

import RecommendList from '../../components/recommend-list';
import ViewWrapper from '../../components/view-wrapper';
import InviteButton from '../../components/invite-button';

export default {
  components: {
    RecommendList,
    ViewWrapper,
    InviteButton,
  },
  computed: {
    ...mapState('recommend-gift', ['recommendGoodsList']),
  },
  methods: {
    goHome() {
      navigateEnv();
    },
  },
};
</script>

<style lang="scss" scoped>
.empty-img {
  display: block;
  width: 128px;
  height: 128px;
  margin: 0 auto;
  margin-top: 24px;
  margin-bottom: 16px;
}

.empty-tips {
  margin-bottom: 16px;
  font-size: 14px;
  color: #969799;
  text-align: center;
}

.btn-text {
  font-size: 18px;
}
</style>
