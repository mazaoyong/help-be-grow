<template>
  <div class="invite-card">
    <div class="invite-card__card-container">
      <div class="invite-card__card">
        <canvas
          v-show="!canvasUrl"
          ref="canvas"
          class="invite-card__card-canvas"
        />
        <img
          v-if="canvasUrl"
          class="invite-card__card-image"
          :src="canvasUrl"
          @click.stop>
      </div>
      <p>长按保存图片，或发送给朋友</p>
    </div>
    <p class="invite-card__info">
      <ul class="invite-card__info-list">
        <li
          v-for="(msg, idx) in info"
          :key="idx"
          class="invite-card__info-list-item">
          {{ `${idx + 1}. ${msg}` }}
        </li>
      </ul>
    </p>
  </div>
</template>

<script>
// import drawCard from './drawCard';
import drawInviteCard from './drawInviteCard';
import { getScreenRatio } from 'pct/utils';
const { drawCard, enhanceCtx, getCtxHeight } = drawInviteCard;

export default {
  name: 'invite-card',

  props: {
    liveTitle: String,
    adminName: String,
    adminAvatar: String,
    qrcode: String,
  },

  data() {
    return {
      info: [
        '一张邀请函仅能邀请1位讲师，邀请函发送出去后120分钟内有效',
        '成为讲师后，将可以在直播间作为讲师发言',
      ],
      imgURL: '',
      canvasUrl: '',
    };
  },

  methods: {
    drawCard(
      liveTitle = this.liveTitle,
      adminName = this.adminName,
      adminAvatar = this.adminAvatar,
      qrcode = this.qrcode
    ) {
      const canvas = this.$refs.canvas;
      const name = 'Dear,';

      const ctx = canvas.getContext('2d');
      enhanceCtx(ctx);
      const ratio = getScreenRatio(ctx);

      // 计算卡片高度
      // 因为样式统一性，其实没有必要动态调整卡片大小，所有屏幕保持一致即可
      // 但是宽度 <= 320 的，展示的时候需要等比缩小处理
      let cardWidth = 315;
      if (window.innerWidth < 375) {
        canvas.style.zoom = +(window.innerWidth / 375).toFixed(2);
      } else {
        canvas.style.width = '100%';
      }

      // 计算卡片高度
      let cardHeight = getCtxHeight(ctx, liveTitle);
      canvas.style.height = `${cardHeight}px`;

      // 绘制时，乘以像素比
      cardWidth = cardWidth * ratio;
      cardHeight = cardHeight * ratio;
      canvas.width = cardWidth;
      canvas.height = cardHeight;

      // 重置画布
      this.canvasUrl = '';
      ctx.clearRect(0, 0, cardWidth, cardHeight);

      this.$nextTick(() => {
        drawCard(ctx, name, liveTitle, adminName, adminAvatar, qrcode, ratio, () => {
          this.canvasUrl = canvas.toDataURL();
        });
      });
    },
  },
};
</script>

<style lang="scss">
.invite-card {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;

  &__card-container {
    margin: 0 auto;
    width: 315px;

    p {
      margin-top: 10px;
      line-height: 20px;
      color: #fff;
      font-size: 14px;
      text-align: center;
    }
  }

  &__card {
    position: relative;

    &-canvas {
      display: block;
      margin: 0 auto;
    }

    &-image {
      width: 100%;
      border-radius: 6px;
    }
  }

  &__info {
    margin: 40px auto 0;
    width: calc(100% - 60px);
    max-width: 315px;

    &-list {
      list-style: none;

      &-item {
        line-height: 20px;
        color: #fff;
        font-size: 12px;
      }
    }
  }
}

@media only screen and (max-width: 320px) {

  .invite-card {
    max-height: 450px;
    overflow-y: auto;
  }
}
</style>
