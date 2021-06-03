<template>
  <card title="完善信息">
    <card-cell
      class="info-collect-cell"
      title="报名信息"
      tip="请准确填写你的信息"
      :is-editable="isEditable"
      :value="value"
      @click="onClickCell"
    />
  </card>
</template>

<script>
import { isEmpty } from 'lodash';
import { isEduShop } from '@youzan/utils-shop';
import { mapActions } from 'vuex';

import { Card, CardCell } from '@/pages/trade/buy/components/card';
import { openCollectInfoPopup } from '@/components/info-collect-popup';

export default {
  name: 'info-collect-card',

  components: {
    Card,
    CardCell,
  },

  props: {
    isEditable: {
      type: Boolean,
      default: true,
    },

    infoCollectionItems: {
      type: Array,
      default: () => [],
    },

    noRequiredText: {
      type: Boolean,
      default: undefined,
    },

    infoCollectDto: {
      type: Object,
      default: () => ({}),
    },

    needVerifyCode: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    value() {
      if (!isEmpty(this.infoCollectDto)) {
        return this.isEditable ? '已填写，点此修改' : '已填写';
      }

      return '';
    },
  },

  methods: {
    ...mapActions({
      sendCaptcha: 'SEND_CAPTCHA',
    }),
    onClickCell() {
      // 是否展示“（必填）”样式
      // 默认根据是否是教育店铺来展示，教育店铺展示，微商城不展示（微商城信息采集默认必填）
      const defaultNoRequiredText = !isEduShop;
      openCollectInfoPopup({
        props: {
          infoCollectionItems: this.infoCollectionItems,
          infoCollectDto: this.infoCollectDto,
          noRequiredText:
            this.noRequiredText !== undefined
              ? this.noRequiredText
              : defaultNoRequiredText,
          needVerifyCode: this.needVerifyCode,
        },
        on: {
          sendCaptcha: (mobile, callBack) => this.sendCaptcha({ mobile, callBack }),
        },
      }).then(data => {
        const { values } = data;
        this.$emit('change', values);
      });
    },
  },
};
</script>

<style lang="scss">
.info-collect-cell {
  .vis-biz-card-cell__value {
    font-weight: normal;
  }
}
</style>
