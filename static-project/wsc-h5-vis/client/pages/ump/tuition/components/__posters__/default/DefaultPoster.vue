<template>
  <div class="share">
    <h2>
      最高可攒 <span class="max-amount">{{ maxTuition }}</span> 元
    </h2>

    <user :avatar="avatar" :name="name" class="user-block" />

    <div class="amount">
      <div class="tag">
        <span>最</span>
        <span>高</span>
      </div>
      <span>
        <span class="number" :style="{fontSize: `${amountFontSize}px`}">{{ maxTuition }}</span>元
      </span>
    </div>

    <message :qr-code="qrCode" :shop-name="shopName" class="qrcode-block" />
  </div>
</template>

<script>
import { DEFAULT_AVATAR, DEFAULT_USERNAME } from '../../../constants';
import User from '../components/User.vue';
import Message from '../components/Message.vue';
export default {
  components: {
    User,
    Message,
  },
  props: {
    avatar: {
      type: String,
      default: DEFAULT_AVATAR,
    },

    name: {
      type: String,
      default: DEFAULT_USERNAME,
    },
    shopName: {
      type: String,
      default: '',
    },

    qrCode: {
      type: String,
      default: '',
    },

    maxTuition: {
      type: Number,
      default: 100,
    },
  },
  computed: {
    amountFontSize() {
      const amountStr = String(this.maxTuition).replace('.', '');
      switch (amountStr.length) {
        case 7:
          return 30;
        case 6:
          return 36;
        case 5:
          return 40;
        default:
          return 44;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.share {
  position: relative;
  width: 300px;
  height: 418px;
  background-image: url(https://img01.yzcdn.cn/upload_files/2020/11/17/FiKFgV-YvPR8esLJmdHy8h3VQEof.png);
  background-repeat: no-repeat;
  background-size: 100%;

  h2 {
    position: absolute;
    top: 65px;
    right: 0;
    left: 0;
    padding: 0;
    margin: 0;
    font-size: 16px;
    color: #fff;
    text-align: center;

    .max-amount {
      color: #fff765;
    }
  }

  .user-block {
    position: absolute;
    top: 113px;
    right: 0;
    left: 0;
  }

  .amount {
    position: absolute;
    top: 216px;
    right: 0;
    left: 0;
    display: flex;
    font-size: 26px;
    font-weight: 500;
    line-height: 44px;
    color: #ff4a00;
    text-align: center;
    align-items: center;
    justify-content: center;

    .tag {
      display: flex;
      width: 16px;
      height: 30px;
      margin-right: 4px;
      font-size: 10px;
      line-height: 1.2;
      color: #fff;
      background: rgba($color: #ff4a00, $alpha: .6);
      border-radius: 999px;
      box-sizing: border-box;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .number {
      margin-right: 2px;
      font-size: 44px;
      font-weight: 600;
      line-height: 44px;
    }
  }

  .qrcode-block {
    position: absolute;
    top: 328px;
    right: 0;
    left: 0;
  }
}
</style>
