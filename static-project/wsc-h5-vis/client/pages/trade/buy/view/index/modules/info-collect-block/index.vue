<template>
  <info-collect-card
    v-if="isNeedInfoCollect"
    ref="infoCollectCard"
    v-log:click.inner="{
      '.info-collect-cell': {
        ei: 'edu_click_btn',
        en: '教育下单点击页面按钮',
        pt: 'trade',
        params: {
          btn_name: 'edu_info_collect_cell'
        }
      }
    }"
    :is-editable="!isOrderCreated"
    :info-collect-dto="infoCollect.data"
    :info-collection-items="infoCollect.settings"
    :need-verify-code="infoCollect.needVerifyCode"
    :open-popup="infoCollect.isOpenPopup"
    @change="onChange"
  />
</template>

<script>
import { InfoCollectCard } from '@/pages/trade/buy/components/info-collect-card';

export default {
  name: 'info-collect-block',

  components: {
    InfoCollectCard,
  },

  state: ['infoCollect', 'view'],

  getters: ['isNeedInfoCollect', 'isOrderCreated'],

  watch: {
    'view.infoCollectPopup'() {
      if (this.$refs.infoCollectCard) {
        this.$refs.infoCollectCard.onClickCell();
      }
    },
  },

  methods: {
    onChange(data) {
      this.$commit('SET_INFO_COLLECT_DATA', data);
    },
  },
};
</script>
