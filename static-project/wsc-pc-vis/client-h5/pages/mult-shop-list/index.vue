<template>
  <div class="container">
    <van-list
      v-model="isLoading"
      :loading="isOnLoad"
      :finished="isFinished"
      :error.sync="isError"
      @load="onLoadMore"
    >
      <mult-shop-item
        v-for="(item, index) in multShopList"
        :key="index"
        :mult-shop-name="item.shopName"
        :tag-type="item.joinType"
        :is-active="item.isActive"
        :kdtid="item.kdtId"
        :shop-role="item.shopRole"
        @selected-info="onReceiveInfo"
      />
    </van-list>
    <div v-if="total > 1" class="footer">
      <a
        class="btn btn-logout"
        href="javascript: void(0)"
        @click="onToWorkingTable"
      >
        确定
      </a>
    </div>
  </div>
</template>

<script>
import { List, Toast } from 'vant';
// import { get } from 'lodash';
import Args from 'zan-utils/url/args';
import { shop } from 'pages-api';
import MultShopItem from './components/mult-shop-item';

// const global = window._global;

export default {
  name: 'mult-shop-list',
  components: {
    'van-list': List,
    MultShopItem
  },
  data() {
    return {
      multShopList: [],
      total: 0,
      pageNumber: 1,
      pageSize: 10,
      isLoading: false,
      isFinished: false,
      isOnLoad: false,
      // 选择的店铺
      currentKdtId: 0,
      isError: false
    };
  },
  mounted() {
    // this.findPageAllCampus();
  },
  methods: {
    searchShopForSwitch() {
      shop.searchShopForSwitch({
        hqKdtId: Args.get('kdtId') || 0,
        pageNumber: this.pageNumber,
        pageSize: this.pageSize
      })
        .then((data) => {
          // 一个连锁校区直接跳转
          if (data.total === 1) {
            this.authBeforeEntryShop(data.data[0].kdtId)
              .then(() => {
                window.location.href = '/v4/vis/h5/edu/work-table';
              });
          }
          this.multShopList = this.multShopList.concat(data.data);
          this.total = data.total;
          if (this.multShopList.length >= data.total) {
            this.isFinished = true;
          }
          this.pageNumber = this.pageNumber + 1;
          this.isLoading = false;
          this.isOnLoad = false;
        })
        .catch(msg => {
          this.isError = true;
          this.isLoading = false;
          this.isOnLoad = false;
          Toast(msg);
        });
    },
    authBeforeEntryShop(kdtId) {
      return new Promise((resolve, reject) => {
        shop.AuthBeforeEntryShop({
          kdtId
        })
          .then(() => {
            resolve();
          })
          .catch(msg => {
            Toast(msg || '请重试');
            reject();
          });
      });
    },
    onLoadMore() {
      if (!this.isOnLoad) this.searchShopForSwitch();
    },
    onReceiveInfo(ev) {
      if (ev.kdtid) {
        this.multShopList =
          this.multShopList.map((item) => {
            if (item.kdtId === ev.kdtid) return { ...item, isActive: true };
            return { ...item, isActive: false };
          });
        this.currentKdtId = ev.kdtid;
      }
    },
    onToWorkingTable() {
      this.authBeforeEntryShop(this.currentKdtId)
        .then(() => {
          window.location.href = '/v4/vis/h5/edu/work-table';
        });
    }
  }
};
</script>
<style lang="scss">
body {
  padding: 10px;
  background-color: #f7f8fa;
}
</style>
<style lang="scss" scoped>
.container {
  background-color: #fff;
  border-radius: 4px;

  .footer {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 100px;
    padding: 0 10px;

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
        color: #fff;
        background-color: #00b389;
      }
    }
  }
}
</style>
