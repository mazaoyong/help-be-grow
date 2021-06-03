<template>
  <div v-theme.main="'background-color'" class="component-groupon">
    <div class="component-groupon__bgcover" />
    <!-- 邀请信息 -->
    <invite-info />

    <div class="component-groupon__center">
      <!-- 商品信息 -->
      <good-card
        :picture="picture"
        :title="title"
        :sales-num="salesNum"
        @card-click="toDetail"
      />

      <!-- 团信息 -->
      <detail />
    </div>

    <!-- 推广加粉 -->
    <vis-promote-card
      v-theme.main="{
        '.vis-promote-card__btn': 'background',
        '.vis-promote-card-qrcode-popup--new .close-btn': 'background',
      }"
      type="new"
      :group-open="isShowPromoteCard"
      :btn-text="joinSettingInfo.buttonCopy"
      :title="joinSettingInfo.guideTitle"
      :desc="joinSettingInfo.guideCopy"
      :qr-code-guide-copy="joinSettingInfo.qrCodeGuideText"
      :qrcode="joinSettingInfo.groupPicture"
    />

    <!-- 参团列表 -->
    <member-list />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { PromoteCard } from '@youzan/vis-ui';
import GoodCard from '../../../components/good-card';
import InviteInfo from './compnents/InviteInfo';
import Detail from './compnents/detail';
import MemberList from './compnents/memberList';

export default {
  name: 'component-groupon',

  components: {
    'vis-promote-card': PromoteCard,
    GoodCard,
    InviteInfo,
    Detail,
    MemberList,
  },

  computed: {
    ...mapState([
      'title',
      'picture',
      'salesNum',
      'isShowPromoteCard',
      'joinSettingInfo',
    ]),
  },
  mounted() {
    const joinCardBtn = document.querySelector('.vis-promote-card__btn');
    if (joinCardBtn) {
      joinCardBtn.click();
    }
  },

  methods: {
    toDetail() {
      this.$store.dispatch('toProductDetail');
    },
  },
};
</script>

<style lang="scss" scoped>
  .component-groupon {
    position: relative;
    min-height: 100vh;
    padding: 0 10px;
    padding-bottom: 10px;
    background-image: url('https://img01.yzcdn.cn/public_files/2019/04/03/group-bg-new.png!middle.webp');
    background-repeat: no-repeat;
    background-size: cover;

    &__bgcover {
      position: absolute;
      top: 0;
      left: 0;
      z-index: -1;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, .13);
    }

    ::v-deep .vis-promote-card {
      margin-top: 8px;

      .vis-promote-card-qrcode-popup--new .close-btn {
        width: 100%;
        height: 44px;
        line-height: 44px;
        color: #fff;
        border: none;
        border-radius: 22px;
      }
    }
  }
</style>
