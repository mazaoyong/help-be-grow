<template>
  <div class="list-wrap">
    <div class="header">
      <div class="header-title">
        <p>{{ headerTitle }}</p>
      </div>
    </div>
    <div class="list-item-wrap">
      <van-list
        v-model="loading"
        :finished="finished"
        :immediate-check="false"
        @load="onLoad">
        <receive-item
          v-for="(item, index) in list"
          :key="index"
          :item="item"
          :index="index"
        />
      </van-list>
    </div>
    <div class="rank-desc">
      <template>
        <p>
          已领{{ this.receiveResult.receivedCount }}个，还剩<span class="unreceive-count">
            {{ this.receiveResult.unreceivedCount }}
          </span>个名额
        </p>
      </template>
    </div>
    <div class="icon-wrap">
      <svg class="icon-close" @click="closePopup">
        <use class="abc" xlink:href="#icon_close" />
      </svg>
    </div>
  </div>
</template>

<script>
import { List } from 'vant';
import ReceiveItem from './ReceiveItem';
import apis from 'pct/api';
import { RECEIVE_GIFT_STATUS } from 'pct/constants';

export default {

  name: 'receive-rank-list',

  components: {
    ReceiveItem,
    'van-list': List,
  },

  props: {
    receiveResult: Object,
    alias: String,
    shareAlias: String,
    channelType: String,
    orderAlias: String,
    showList: Boolean,
  },

  data() {
    return {
      list: {},
      loading: false,
      finished: false,
      page: 1,
      pageSize: 10,
    };
  },

  computed: {
    headerTitle() {
      const status = this.receiveResult.shareStatus;
      if (RECEIVE_GIFT_STATUS.RECEIVED === status) {
        return `快人一步，你是第${this.receiveResult.rank}个抢到的`;
      }
      return '';
    },
  },

  created() {
    if (this.showList) {
      const params = this.getParams();
      this.getRankList(params);
    }
  },

  methods: {
    closePopup() {
      this.$emit('rank-list-popup');
    },
    getRankList(params) {
      apis.getShareRank(params).then(data => {
        this.list = data.content;
        this.finished = this.list.length < this.pageSize;
      });
    },
    getParams() {
      return {
        alias: this.alias,
        share_alias: this.shareAlias,
        channel_type: this.channelType,
        order_alias: this.orderAlias,
        pageSize: this.pageSize,
        page: this.page,
      };
    },
    onLoad() {
      this.page++;
      const params = this.getParams();
      apis.getShareRank(params)
        .then(data => {
          const rankList = data.content;
          this.list = this.list.concat(rankList);
          this.loading = false;
          this.finished = rankList.length < this.pageSize;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.list-wrap {
  width: 315px;
  height: 450px;
}

.van-list {
  margin-bottom: 50px;
}

.header {
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: url(/public_files/2018/05/11/530de156d458d69267cade58a2eea311.png);
  background-size: 315px 76px;
  width: 315px;
  height: 76px;
  border-radius: 4px 4px 0 0;

  .header-title {
    display: flex;
    justify-content: center;
    align-items: center;

    p {
      color: #fff;
      font-size: 16px;
      margin: 10px;
    }
  }

  .header-desc {
    font-size: 12px;
  }
}

.list-item-wrap {
  height: 360px;
  overflow: auto;
}

.icon-wrap {
  display: flex;
  justify-content: center;
}

.icon-close {
  width: 35px;
  height: 35px;
  position: relative;
  top: 30px;
}

.rank-desc {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 46px;
  border-radius: 4px;
  position: absolute;
  bottom: 0;
  background: #fff;
  font-size: 12px;
  color: #999;
  box-shadow: 0 0 .1px #d0cdcd;

  p {
    margin: 3px;
  }
}

.unreceive-count {
  color: red;
}

@media only screen and (max-width: 320px) {

  .header {
    width: 260px;
  }

  .list-wrap {
    width: 260px;
    height: 410px;
  }

  .icon-close {
    top: 20px;
  }

  .list-item-wrap {
    height: 322px;
  }
}

</style>
