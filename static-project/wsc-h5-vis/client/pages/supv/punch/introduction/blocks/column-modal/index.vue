<template>
  <modal
    :is-show="isShowColumnModal"
    :title="title"
    :is-can-click-mask="isCanClickMask"
    :show-close-button="showCloseButton"
    :show-confirm-button="showConfirmButton"
    :close-button-text="closeButtonText"
    :confirm-button-text="confirmButtonText"
    @closeModal="onCloseModal"
  >
    <div class="m-column-content">
      <img-wrap
        v-if="coverUrl"
        class="u-img"
        :src="coverUrl"
      />
      <div class="u-desc">
        {{ name }}
      </div>
      <div class="u-detail">
        已更新{{ contentsCount || 0 }}期 | {{ subscriptionsCount || 0 }}人已购
      </div>
    </div>
  </modal>
</template>

<script>
import Modal from '../../components/modal';
import { ImgWrap } from '@youzan/vis-ui';

export default {
  name: 'column-modal',
  components: {
    'modal': Modal,
    'img-wrap': ImgWrap,
  },
  props: {
    isShowColumnModal: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '购买专栏后可参加打卡课程',
    },
    isCanClickMask: {
      type: Boolean,
      default: false,
    },
    showCloseButton: {
      type: Boolean,
      default: true,
    },
    showConfirmButton: {
      type: Boolean,
      default: true,
    },
    closeButtonText: {
      type: String,
      default: '再看看',
    },
    confirmButtonText: {
      type: String,
      default: '去购买',
    },
    coverUrl: {
      type: String,
      default: '',
    },
    name: {
      type: String,
      default: '',
    },
    contentsCount: {
      type: [Number, String],
      default: 0,
    },
    subscriptionsCount: {
      type: [Number, String],
      default: 0,
    },
  },
  methods: {
    onCloseModal(type) {
      this.$emit('closeModal', type);
    },
  },
};
</script>

<style lang="scss" scoped>
/* 专栏弹窗 */
.m-column-content {
  padding-bottom: 10px;
  margin: 5px 24px 20px;
  overflow: hidden;
  background-color: #f9f9f9;
  border: 1px solid #ebebeb;
  border-radius: 4px;
}

.m-column-content .u-desc {
  padding: 10px 10px 0;
  font-size: 14px;
  font-weight: bold;
  line-height: 25px;
  color: #333;
  box-sizing: border-box;
}

.m-column-content .u-detail {
  padding: 0 10px;
  font-size: 12px;
  line-height: 15px;
  color: #999;
  box-sizing: border-box;
}

.m-column-content .u-img ::v-deep img {
  width: 236px;
  max-height: 236px;
}
</style>
