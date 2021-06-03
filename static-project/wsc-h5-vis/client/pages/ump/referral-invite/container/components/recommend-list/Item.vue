<template>
  <div class="goods-item">
    <div class="goods-item_left">
      <vis-img-wrap
        :width="'110px'"
        :height="'62px'"
        :src="detail.imageUrl"
        :fullfill="'!110x0.jpg'"
        :cover="false"
      />
    </div>
    <div class="goods-item_right">
      <div class="goods-title">
        {{ detail.goodsName }}
      </div>
      <div class="invite-btn">
        <div class="left">
          <div class="price">
            ￥{{ currentPrice | moneyFormat }}
            {{ detail.multiSku ? '起' : '' }}
          </div>
          <div v-if="detail.sellCount" class="user-num">
            {{ detail.sellCount }}人学过
          </div>
        </div>
        <div class="right">
          {{ detail.commissionPrice ? `赚￥${format(detail.commissionPrice, true, false)}`: '赚奖励' }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ImgWrap } from '@youzan/vis-ui';
import format from '@youzan/utils/money/format';
import { getDisplayPrice } from '@/domain/recommend-gift/utils';

export default {
  filters: {
    moneyFormat: function(value) {
      return format(value, true, false);
    },
  },
  components: {
    'vis-img-wrap': ImgWrap,
  },
  props: {
    detail: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    currentPrice() {
      return getDisplayPrice(this.detail);
    },
  },
  methods: {
    format,
  },
};
</script>

<style lang="scss" scoped>
.goods-item {
  padding: 12px 16px;

  .goods-item_left {
    float: left;
    width: 110px;
    margin-right: 8px;
    overflow: hidden;
    border-radius: 3px;
  }

  .goods-item_right {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border-radius: 6px;
  }

  .goods-title {
    width: 100%;
    max-width: 200px;
    margin-bottom: 8px;
    overflow: hidden;
    font-size: .9em;
    font-weight: bold;
    line-height: 18px;
    color: #323233;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.invite-btn {
  display: flex;
  height: 36px;
  padding: 5px 8px;
  background-image: url('https://img01.yzcdn.cn/upload_files/2020/11/09/FhYh30KTjHxusSiY-SMhR9TPkW2v.png');
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  border-radius: 4px;
  box-sizing: border-box;
  align-items: center;
  justify-content: space-between;

  .left {
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .price {
      font-size: .9em;
      font-weight: bold;
      line-height: 13px;
      letter-spacing: -1px;
      color: #ba671f;
    }

    .user-num {
      margin-top: 2px;
      font-size: .7em;
      line-height: 12px;
      color: #ba671f;
    }
  }

  .right {
    font-size: 1em;
    font-weight: bold;
    line-height: 16px;
    letter-spacing: 0;
    color: #fff9d7;
  }
}
</style>
