<template>
  <div>
    <order-search @search="search" />
    <div class="order-list">
      <div v-if="isOrderEmpty" class="empty-tip">
        <div class="inner">
          <img
            class="img"
            src="https://b.yzcdn.cn/public_files/2018/11/19/bfc666f3eb05081b88d7353f43e18123.png"
          />
          <p>暂无订单</p>
        </div>
      </div>
      <van-list
        v-model="loading"
        :finished="finished"
        :immediate-check="false"
        @load="onLoadNext"
      >
        <van-radio-group v-model="selectedOrderNo">
          <order-item v-for="n in list" :key="n.orderNo" :data="n" />
        </van-radio-group>
      </van-list>
    </div>
    <bottom-bar fixed>
      <van-button
        type="default"
        style="width: 36%; color: #969799"
        :loading="skipBusy"
        @click="skip"
      >暂不关联</van-button>
      <van-button
        type="primary"
        style="width: 64%"
        :disabled="selectedOrderNo === null"
        :loading="confirmBusy"
        @click="confirm"
      >确定</van-button>
    </bottom-bar>
  </div>
</template>

<script>
import { Button, Toast, RadioGroup, List } from 'vant';
import formatDate from '@youzan/utils/date/formatDate';
import OrderSearch from './components/order-search';
import OrderItem from './components/order-item';
import BottomBar from './components/bottom-bar';

export default {
  name: 'select-order',
  components: {
    'van-button': Button,
    'van-radio-group': RadioGroup,
    'van-list': List,
    OrderSearch,
    BottomBar,
    OrderItem,
  },
  data() {
    return {
      clueId: null,
      list: [],
      loading: false,
      params: {
        text: '',
      },
      page: 1,
      totalPages: 1,
      selectedOrderNo: null,
      confirmBusy: false,
      skipBusy: false,
      finished: false,
    };
  },
  computed: {
    isOrderEmpty() {
      return this.list.length === 0 && !this.loading;
    },
  },
  methods: {
    search(params, page = 1) {
      const bookTime = {};
      if (params.startTime) {
        bookTime.startTime = formatDate(params.startTime, 'YYYY-MM-DD HH:mm:ss');
      }
      if (params.endTime) {
        bookTime.endTime = formatDate(params.endTime, 'YYYY-MM-DD HH:mm:ss');
      }

      const _query = {
        bookTime,
        clueId: this.$route.query.clueId,
        from: 'wap',
      };

      if (params.text) {
        _query.orderNo = params.text;
        _query.lessonName = params.text;
        _query.studentName = params.text;
      }

      const query = {
        params: {
          page: {
            pageNumber: page,
            pageSize: 10,
          },
          query: _query,
        },
      };

      if (page === 1) {
        this.list = [];
        this.page = 1;
        this.totalPages = 1;
      }

      if (page > this.totalPages) {
        this.finished = true;
        this.loading = false;
        return;
      }

      this.loading = true;
      this.finished = false;
      this.$store
        .dispatch('clueDetailModule/queryRelatedOrder', query)
        .then(data => {
          this.loading = false;
          this.params = params;
          this.page = page;
          this.totalPages = data.totalPages;

          if (data.length === 0) {
            this.finished = true;
          }

          if (page === 1) {
            this.list = data.content.filter(n => (params.onlySelectable ? n.selectable : true));
            this.selectedOrderNo = null;
          } else {
            this.list.push(
              ...data.content.filter(n => (params.onlySelectable ? n.selectable : true)),
            );
          }
        })
        .catch(err => {
          if (err) Toast(err);
          this.loading = false;
        });
    },
    onLoadNext() {
      this.search(this.params, this.page + 1);
    },
    skip() {
      const clueId = this.clueId;
      this.skipBusy = true;
      this.$store
        .dispatch('clueDetailModule/changeState', { clueId, targetStateCode: 6 })
        .then(res => {
          this.$router.replace({ name: 'clue-detail', query: { clueId } });
          Toast('修改成功');
        })
        .catch(err => {
          this.skipBusy = false;
          Toast(err);
        });
    },
    confirm() {
      const clueId = this.clueId;
      this.confirmBusy = true;
      this.$store
        .dispatch('clueDetailModule/changeState', {
          clueId,
          targetStateCode: 6,
          relatedOrderNo: this.selectedOrderNo,
        })
        .then(res => {
          this.$router.replace({ name: 'clue-detail', query: { clueId } });
          Toast('修改成功');
        })
        .catch(err => {
          this.confirmBusy = false;
          Toast(err);
        });
    },
  },
  created() {
    this.clueId = this.$route.query.clueId;
  },
  mounted() {
    document.title = '选择订单';
    this.search(this.params); // 手动加载第一页
  },
};
</script>

<style lang="postcss" scoped>
div.order-list {
  padding: 55px 10px 60px;
}

.van-button {
  font-size: 16px;
}

.order-list {
  overflow: hidden;
}

.empty-tip {
  margin-top: 160px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #999;
  text-align: center;
  font-size: 14px;

  .img {
    width: 80px;
    margin-bottom: 5px;
  }
}
</style>
