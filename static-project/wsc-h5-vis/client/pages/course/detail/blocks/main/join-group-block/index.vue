<template>
  <info-cell-group
    v-if="show"
    v-tab="tab"
    class="join-group-block"
  >
    <info-cell title="加群" is-link @click="click">
      {{ joinGroupSetting.groupText }}
    </info-cell>
  </info-cell-group>
</template>

<script>
import YZLocalStorage from '@youzan/utils/local_storage';
import { InfoCell, InfoCellGroup } from '@/pages/course/detail/components/info-cell';
import openQrcodePop from '@/pages/course/detail/components/qrcode-pop';

export default {
  components: {
    InfoCell,
    InfoCellGroup,
  },

  rootState: ['goodsType', 'goodsData'],
  rootGetters: ['isColumn'],

  computed: {
    show() {
      return this.joinGroupSetting.groupOpen && this.joinGroupSetting.courseDetailPageOpen && this.goodsData.isOwnAsset;
    },

    tab() {
      if (this.isColumn) {
        return {
          index: 1,
          title: '专栏介绍',
        };
      }
      return null;
    },

    joinGroupSetting() {
      return this.goodsData.joinGroupSetting || {};
    },
  },

  created() {
    if (this.show) {
      if (this.joinGroupSetting.popupAfterPurchasingOpen) {
        const KEY = 'pct:joinGroupDisplayHistory';
        let historyList = [];
        try {
          historyList = JSON.parse(YZLocalStorage.getItem(KEY)) || [];
        } catch (error) {}
        if (!historyList.includes(this.goodsData.alias)) {
          openQrcodePop({
            props: {
              title: this.joinGroupSetting.qrCodeGuideText,
              qrCode: this.joinGroupSetting.groupPicture,
            },
          });
          historyList.push(this.goodsData.alias);
          YZLocalStorage.setItem(KEY, JSON.stringify(historyList));
        }
      }
    }
  },

  methods: {
    click() {
      openQrcodePop({
        props: {
          title: this.joinGroupSetting.qrCodeGuideText,
          qrCode: this.joinGroupSetting.groupPicture,
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.join-group-block {
  margin-bottom: 8px;
}
</style>
