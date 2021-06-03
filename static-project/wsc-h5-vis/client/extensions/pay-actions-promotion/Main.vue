<template>
  <div class="block-vis-ad">
    <!-- 加粉推广 -->
    <vis-promote-card
      v-theme.main="{
        '.vis-promote-card__btn': 'background',
        '.van-button--primary': 'border',
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
      :is-link="true"
      @jump="handleJump"
      @open="onCardOpen"
      @close="onCardClose"
    />
  </div>
</template>

<script>
import PromoteCard from './components/PromoteCard';
import { mapData } from '@youzan/ranta-helper-vue';
import { getThemeHook } from '@/common/global/common-run/theme';

const themeHook = getThemeHook();

export default {
  name: 'block-ad',

  components: {
    'vis-promote-card': PromoteCard,
  },

  directives: {
    'theme': {
      inserted: themeHook,
      update: themeHook,
    },
  },

  data() {
    return {
      joinGroupSetting: {},
      resultUrl: '',
    };
  },

  created() {
    mapData(this, ['joinGroupSetting', 'resultUrl']);
  },

  methods: {
    onCardOpen() {
      this.$nextTick(() => {
        const popup = document.querySelector('.vis-promote-card-canvas');
        if (popup) {
          this.ctx.process.invoke('logAction', {
            et: 'click',
            ei: 'ad_join_open',
            en: '粉丝推广-打开弹层',
            pt: 'paidReceipt',
          });
          popup.addEventListener('contextmenu', () => {
            this.ctx.process.invoke('logAction', {
              et: 'click',
              ei: 'ad_join_recognize',
              en: '粉丝推广-识别',
              pt: 'paidReceipt',
            });
          });
        }
      });
    },

    onCardClose() {
      this.ctx.process.invoke('logAction', {
        et: 'click',
        ei: 'ad_join_close',
        en: '粉丝推广-我知道了',
        pt: 'paidReceipt',
      });
    },

    handleJump() {
      this.ctx.process.invoke('navigateGo', {
        url: this.resultUrl,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.block-vis-ad {
  margin: 12px;

  .vis-promote-card {
    border-radius: 8px;

    .vis-promote-card__btn {
      width: initial;
      min-width: 60px;
      padding: 0 6px;
      border-radius: 12px;
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
