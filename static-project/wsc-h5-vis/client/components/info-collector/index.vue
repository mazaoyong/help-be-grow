<template>
  <div class="info">
    <van-cell
      is-link
      title="报名信息"
      :value="placeholder"
      @click="handleOpenPopup"
    />
  </div>
</template>

<script>
/* eslint-disable camelcase */
import { Cell } from 'vant';
import { isEduShop } from '@youzan/utils-shop';
import { openCollectInfoPopup } from '../info-collect-popup';

export default {
  name: 'info-collector',

  components: {
    'van-cell': Cell,
  },

  props: {
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

  data() {
    return {
      placeholder: '请准确填写你的信息', // 填写完成之后删除placeholder
    };
  },

  methods: {
    handleOpenPopup() {
      // 是否展示“（必填）”样式，默认根据是否是教育店铺来展示，教育店铺展示，微商城不展示（微商城信息采集默认必填）
      const defaultNoRequiredText = !isEduShop;
      openCollectInfoPopup({
        props: {
          infoCollectionItems: this.infoCollectionItems,
          infoCollectDto: this.formatInfoCollectDTO(this.infoCollectDto),
          noRequiredText: this.noRequiredText !== undefined ? this.noRequiredText : defaultNoRequiredText,
          needVerifyCode: this.needVerifyCode,
        },
      }).then(data => {
        const { values } = data;
        this.placeholder = '已填写，点此修改';
        this.$emit('submit', values);
      });
    },
    formatInfoCollectDTO(data) {
      const res = {};
      const { customizeItems } = data || {};
      if (Array.isArray(customizeItems)) {
        if (customizeItems.length) {
          customizeItems.forEach(item => {
            const { attributeId, attributekey, value } = item;
            res[attributekey || attributeId] = value;
          });
        }
      }
      return res;
    },
  },
};
</script>

<style lang="scss">
.is-iphonex .info__action {
  padding-bottom: 34px;
}

.info {
  padding-top: 10px;

  .van-cell__title {
    max-width: 90px;
    width: 90px;
  }

  .van-radio-group {
    text-align: left;
    height: 24px;
    display: flex;
  }

  .van-radio {
    padding-right: 10px;
  }

  .van-cell:not(:last-child)::after {
    left: 0;
  }

  &__form-group {
    .van-cell__title {
      font-size: 12px;
    }

    .van-cell__value {
      font-size: 12px;
      color: #b0b0b0;
    }

    .van-field__control {
      font-size: 12px;
    }
  }
}
</style>
