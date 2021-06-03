<template>
  <qrcode-popup
    v-if="!isBdapp"
    v-model="showJoinGroup"
    :title="joinGroupSetting.qrCodeGuideText || joinGroupSetting.groupText"
    :img-src="joinGroupSetting.groupPicture"
    desc="识别二维码，或截图保存"
  />
</template>

<script>
import { ZNB } from '@youzan/wxsdk';
import YZLocalStorage from 'zan-utils/local_storage';
import QrcodePopup from './QrcodePopup';
import { PCT_TYPE } from 'pct/constants';

export default {
  name: 'join-group-popup',

  components: {
    QrcodePopup,
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

  computed: {
    // 类型 content column live等等
    pctType() {
      switch (this.$route.name) {
        case 'ContentShow':
          return PCT_TYPE.content;
        case 'ColumnShow':
          return PCT_TYPE.column;
        case 'LiveDetail':
          return PCT_TYPE.live;
        default:
          return null;
      }
    },
    // 是否能够访问完整信息，包含购买，免费，会员等各种情况都算
    canAccessFull() {
      // TODO 目前各种类型尚未统一判断字段，所以目前根据类型来做判断，需要优化
      switch (this.pctType) {
        case PCT_TYPE.content:
          return this.isPaid;
        case PCT_TYPE.column:
          return this.isPay;
        case PCT_TYPE.live:
          return this.isPaid || this.isFree;
        default:
          return false;
      }
    },
    // 是否配置拉群图片且用户已拥有商品
    isSetJoinGroup() {
      if (!this.isOwned) return false;
      // 设置了购买后弹窗提示
      return this.joinGroupSetting.popupAfterPurchasingOpen;
    },
  },

  watch: {
    // 如果配置了拉群，检查localstorage来判断是否显示拉群图片
    isSetJoinGroup(newValue) {
      if (newValue) {
        // 如果是从下单页重定向过来，确保一定展示，即使是退款后重新购买
        if (this.$route.query.notify) this.showJoinGroup = true;
        let joinGroupDisplayHistory = YZLocalStorage.getItem('pct:joinGroupDisplayHistory') || '[]';
        joinGroupDisplayHistory = JSON.parse(joinGroupDisplayHistory);
        const alias = this.$route.query.alias;
        if (joinGroupDisplayHistory.indexOf(alias) >= 0) return;
        joinGroupDisplayHistory.push(alias);
        this.showJoinGroup = true;
        YZLocalStorage.setItem('pct:joinGroupDisplayHistory', JSON.stringify(joinGroupDisplayHistory));
      }
    },
  },

  created() {
    ZNB.getEnv().then(env => {
      if (env.platform === 'swan') {
        this.isBdapp = true;
      }
    }).catch(() => { });
  },
};
</script>
