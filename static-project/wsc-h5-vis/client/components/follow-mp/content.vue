<template>
  <div class="wrapper">
    <h3 class="title">
      关注店铺
    </h3>
    <img class="shop-logo" :src="logo">
    <h4 class="shop-name">
      {{ shopName }}
    </h4>
    <template v-if="hasAccount">
      <van-loading v-if="loading" class="loading" />
      <img v-else class="qrcode" :src="qrcodeUrl">
      <div class="tip">
        长按识别二维码关注店铺
      </div>
    </template>
    <template v-else>
      <div class="no-account-img-wrap">
        <img class="no-account-img" :src="noAccountImg">
      </div>
      <div class="tip">
        商家二维码失效
        <br>
        公众号暂时无法关注
      </div>
    </template>
  </div>
</template>

<script>
import { Toast, Loading } from 'vant';
import { getMpQrcode } from '../../common-api/utils/index';

export default {
  components: {
    [Loading.name]: Loading,
  },

  data() {
    return {
      loading: true,
      qrcodeUrl: '',
    };
  },

  computed: {
    logo() {
      return _global.mp_data.logo;
    },

    shopName() {
      return _global.mp_data.shopName || _global.mp_data.shop_name;
    },

    accountId() {
      return _global.mp_account.id;
    },

    hasAccount() {
      return !!this.accountId;
    },

    noAccountImg() {
      return `${_global.url.imgqn}/public_files/2018/11/19/bfc666f3eb05081b88d7353f43e18123.png`;
    },
  },

  mounted() {
    this.onOpen();
  },

  methods: {
    onOpen() {
      if (!this.qrcodeUrl && this.accountId) {
        this.loading = true;
        getMpQrcode({
          mp_id: this.accountId,
        })
          .then(res => {
            if (res.qrcodeUrl) {
              this.qrcodeUrl = res.qrcodeUrl;
            }
          })
          .catch(() => {
            Toast('获取公众号二维码失败');
          })
          .finally(() => {
            this.loading = false;
          });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.wrapper {
  text-align: center;
}

.title {
  height: 44px;
  line-height: 44px;
  font-size: 16px;
  color: #333;
}

.shop-logo {
  margin-top: 32px;
  width: 56px;
  height: 56px;
}

.shop-name {
  margin: 16px 0 24px;
  font-size: 16px;
  color: #111;
}

.no-account-img-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  width: 220px;
  height: 220px;
  border: 1px solid #dcdee0;
}

.no-account-img {
  width: 100px;
  height: 100px;
}

.loading {
  margin: 0 auto;
  height: 220px;
}

.qrcode {
  width: 220px;
  height: 220px;
}

.tip {
  margin: 24px 0;
  line-height: 16px;
  font-size: 12px;
  color: #333;
}
</style>
