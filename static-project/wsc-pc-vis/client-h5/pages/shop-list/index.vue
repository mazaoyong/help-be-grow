<template>
  <div class="container">
    <!-- 店铺列表 开始 -->
    <div v-if="isHasShopList">
      <h1 class="title">
        选择机构
      </h1>
      <van-list
        v-if="shopList.length > 0"
        v-model="isShopListLoading"
        :finished="isFinished"
        :error.sync="isError"
        error-text="请求失败，点击重新加载"
        @load="onLoad"
      >
        <shop-item
          v-for="(shop, index) in shopList"
          :key="index"
          :logo="shop.logo"
          :shop-name="shop.shopName"
          :kdt-id="shop.kdtId"
        />
      </van-list>
    </div>
    <!-- 店铺列表 结束 -->

    <!-- 默认空状态 开始 -->
    <div
      v-else-if="isNotLoading && !isHasShopList"
      class="no-shop-list"
    >
      <span class="tip">目前还没加入过机构</span>
    </div>
    <!-- 默认空状态 结束 -->

    <!-- 底部退出登录按钮 -->
    <div class="footer">
      <a
        class="btn btn-logout"
        href="javascript: void(0)"
        @click="onLogout"
      >
        退出当前帐号
      </a>
    </div>
    <!-- 底部退出登录按钮 -->
  </div>
</template>

<script>
import { Toast, List } from 'vant';
import { login, shop } from 'pages-api';
import ZNB from '@youzan/znb';
import ShopItem from './components/shop-item.vue';

const global = window._global;
const visUserInfo = global.visUserInfo || {};

ZNB.init({ kdtId: global.kdtId || 371189 }); // 371189为有赞大号kdtId

export default {
  name: 'shop-list',
  components: {
    'shop-item': ShopItem,
    'van-list': List
  },
  data() {
    return {
      isNotLoading: false,
      isHasShopList: false,
      isFinished: false,
      isError: false,
      isShopListLoading: false,
      shopList: [],
      pageNumber: 1
    };
  },
  mounted() {
    this.getShopList();
  },
  methods: {
    getShopList() {
      shop.GetShopList({
        pageSize: 10,
        pageNumber: this.pageNumber,
        // accountId: _global.userId, // 敏感信息不要传
        shopTypeValues: 0,
        shopTopics: 1
      })
        .then(res => {
          if (res.content && res.content.length > 0) {
            // 额外逻辑，教育微课堂版本不显示
            this.shopList = this.shopList.concat(res.content.filter(item =>
              item.saasSolution !== 2001
            ));
            this.isHasShopList = true;
          }
          this.isFinished = !res.pageable;
          this.isNotLoading = true;
          this.isShopListLoading = false;
        })
        .catch(msg => {
          this.isError = true;
          this.isNotLoading = true;
          this.isShopListLoading = false;
          if (msg === 'login failed') {
            ZNB.navigate({
              type: 'reLaunch',
              weappUrl: '/pages/login/index?pageType=LOGOUT'
            });
          }
          Toast(msg || '获取店铺列表失败');
        });
    },
    onLoad() {
      if (this.isNotLoading) {
        this.isNotLoading = false;
        this.pageNumber++;
        if (this.pageNumber > 1) {
          this.getShopList();
        }
      }
    },
    onLogout() {
      const { mobile = '' } = global;
      // 退出登录的时候，小程序端做清除token的操作
      // wx.miniProgram.navigateTo({url: '/pages/login/index?pageType=LOGOUT'})
      login.Logout({
        mobileUser: {
          countryCode: visUserInfo.countryCode || '+86',
          mobile
        }
      })
        .then(() => {
          ZNB.navigate({
            type: 'reLaunch',
            weappUrl: '/pages/login/index?pageType=LOGOUT'
          });
        })
        .catch(msg => {
          Toast(msg || '退出登录失败');
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  padding: 40px 48px 100px;
  background-color: #fff;
  .title {
    margin-bottom: 20px;
    font-size: 22px;
    font-weight: bold;
    color: #333;
  }
  .no-shop-list {
    position: absolute;
    top: 130px;
    left: 50%;
    transform: translate(-50%, 0);
    width: 140px;
    height: 124px;
    text-align: center;
    background-image: url('https://b.yzcdn.cn/public_files/2019/03/12/9d9c065ca679da115f7b547c99dbf3d1.png');
    background-repeat: no-repeat;
    background-position: center center;
    background-size: 90px 90px;
    .tip {
      display: inline-block;
      position: absolute;
      left: 7px;
      bottom: 0;
      font-size: 14px;
      color: #999;
      line-height: 1;
    }
  }
  .footer {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 100px;
    padding: 0 48px;
    background-color: #fff;
    .btn {
      display: block;
      width: 100%;
      height: 44px;
      line-height: 44px;
      text-align: center;
      font-size: 16px;
      border-radius: 22px;
      &-logout {
        margin-top: 26px;
        border: 1px solid #00b389;
        color: #00b389;
      }
    }
  }
}
</style>
