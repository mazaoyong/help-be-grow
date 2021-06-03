<template>
  <div v-if="joinGroupSetting.groupOpen && joinGroupSetting.courseDetailPageOpen && isOwned" class="qr-cell-wrapper">
    <div class="qr-cell">
      <label-van-icon
        left-content="加群"
        :right-content="joinGroupSetting.groupText"
        :show-arrow="true"
        @click="showPop"
      />
    </div>
    <qrcode-popup
      v-if="!isBdapp"
      v-model="showJoinGroup"
      :title="joinGroupSetting.qrCodeGuideText"
      :img-src="joinGroupSetting.groupPicture"
      desc="识别二维码，或截图保存"
    />
  </div>
</template>

<script>
import { ZNB } from '@youzan/wxsdk';
import QrcodePopup from 'pct/components/QrcodePopup';
import { LabelVanIcon } from '@/pages/edu/components/label';

export default {
  name: 'qr-group-alert-bar',

  components: {
    QrcodePopup,
    LabelVanIcon,
  },
  props: {
    joinGroupSetting: {
      type: Object,
      default() {
        return {};
      },
    },
    isOwned: Boolean,
  },
  data() {
    return {
      showJoinGroup: false, // 是否展示拉群图片
      isBdapp: false, // 是否百度智能小程序
    };
  },

  created() {
    ZNB.getEnv().then(env => {
      if (env.platform === 'swan') {
        this.isBdapp = true;
      }
    }).catch(() => { });
  },
  methods: {
    showPop() {
      this.showJoinGroup = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.qr-cell-wrapper {
  background: #ffffff;
  margin: 10px 0;
}
.qr-cell {
  display: flex;
  font-size: 13px;
  color: #323233;
  align-items: center;
  justify-content: space-between;
  padding-left: 16px;

  .icon-user {
    margin-right: 5px;
  }

  .van-icon-arrow {
    font-size: 12px;
    margin-left: 4px;
  }

  .divider {
    height: 1px;
    background-color: #f2f2f2;
  }
}
</style>
