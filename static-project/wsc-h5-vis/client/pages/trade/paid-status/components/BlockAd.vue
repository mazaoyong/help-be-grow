<template>
  <div class="block-vis-ad">
    <!-- 加粉推广 -->
    <vis-promote-card
      v-theme.main="{
        '.vis-promote-card__btn': 'background',
        '.vis-promote-card-qrcode-popup--new .close-btn': 'background',
      }"
      type="new"
      :group-open="joinGroupSetting && joinGroupSetting.enrollmentSuccessPageOpen"
      :qrcode="joinGroupSetting && joinGroupSetting.codePicture"
      :title="(joinGroupSetting && joinGroupSetting.guideTitle) || '添加老师微信'"
      :desc="(joinGroupSetting && joinGroupSetting.guideCopy) || '及时了解课程动向'"
      :btn-text="(joinGroupSetting && joinGroupSetting.buttonCopy) || '立即添加'"
      :qr-code-guide-copy="joinGroupSetting && joinGroupSetting.qrCodeGuideCopy"
      custom-tip="长按识别二维码"
      class="paid-info-promote-box"
      @open="onCardOpen"
      @close="onCardClose"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { PromoteCard } from '@youzan/vis-ui';
import {
  logAdJoinOpen,
  logAdJoinClose,
  logAdJoinRecognize,
} from '../track';

export default {
  name: 'block-ad',

  components: {
    'vis-promote-card': PromoteCard,
  },

  computed: {
    ...mapState([
      'joinGroupSetting',
    ]),
  },

  mounted() {
    const joinCardBtn = document.querySelector('.vis-promote-card__btn');
    if (joinCardBtn) {
      joinCardBtn.click();
      joinCardBtn.addEventListener('click', () => {
        logAdJoinOpen();
      });
    }
  },

  methods: {
    onCardOpen() {
      this.$nextTick(() => {
        const popup = document.querySelector('.vis-promote-card-canvas');
        if (popup) {
          popup.addEventListener('contextmenu', () => {
            logAdJoinRecognize();
          });
        }
      });
    },

    onCardClose() {
      logAdJoinClose();
    },
  },
};
</script>

<style lang="scss">
.block-vis-ad {
  margin: 12px;

  .vis-promote-card {
    border-radius: 8px;

    .vis-promote-card__btn {
      min-width: 60px;
      border-radius: 11px;
      box-sizing: border-box;
      font-size: 12px;
      text-align: center;
    }

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
