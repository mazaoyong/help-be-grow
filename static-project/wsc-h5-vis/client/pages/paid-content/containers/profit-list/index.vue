<template>
  <div class="profit-list">
    <template v-if="itemList.length > 0">
      <van-list
        v-model="isLoading"
        :finished="isFinished"
        @load="onGetProfitList">
        <profit-item
          v-for="(item, index) in itemList"
          :key="index"
          :item="item"
        />
      </van-list>

      <div v-if="isFinished && pageNo > 1" class="no-more">
        没有更多了
      </div>
    </template>
    <div v-else class="profit-list__empty" />
  </div>
</template>

<script>
import { List } from 'vant';
import format from 'zan-utils/money/format';
import formatDate from '@youzan/utils/date/formatDate';
import apis from 'pct/api';
import ProfitItem from 'pct/components/ProfitItem';
import { FEE_TYPE } from 'pct/constants';
import mixinVisPage from 'common/mixins/mixin-vis-page';

export default {
  name: 'profit-list',

  config: {
    title: '收益明细',
  },

  components: {
    'van-list': List,
    ProfitItem,
  },

  mixins: [mixinVisPage],

  data() {
    return {
      isLoading: false,
      isFinished: false,
      pageNo: 1,
      pageSize: 5,
      itemList: [],
    };
  },

  created() {
    this.onGetProfitList();
  },

  methods: {
    onGetProfitList() {
      this.isLoading = true;
      const params = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
      };
      apis.getProfitDetail(params)
        .then((data) => {
          this.parseItems(data);
        })
        .catch(err => {
          console.warn('Error:', err);
          this.isLoading = false;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },

    parseItems(list = []) {
      if (list.length < this.pageSize) {
        this.isFinished = true;
      } else {
        this.pageNo++;
      }
      list.forEach(item => {
        item.label = FEE_TYPE[item.feeType];
        item.createTime = formatDate(item.createTime, 'YYYY-MM-DD HH:mm:ss');
        item.amount = format(item.amount, true, false);
        item.nickName = item.extra.fansNickName || '匿名小伙伴';
      });

      this.itemList = this.itemList.concat(list);
      this.isLoading = false;
    },
  },
};
</script>

<style lang="scss">
.profit-list {
  height: 100vh;
  .no-more {
    text-align: center;
    font-size: 14px;
    color: #ccc;
  }

  &__empty {
    font-size: 14px;
    color: #939393;
    background: #fff;

    &::before {
      content: '暂无收益记录';
      position: absolute;
      top: 40%;
      left: 50%;
      transform: translate(-50%, -40%);
    }
  }
}
</style>
