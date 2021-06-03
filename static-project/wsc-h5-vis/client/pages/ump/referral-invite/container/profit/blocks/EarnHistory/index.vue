<template>
  <view-wrapper title="收益历史" :show-padding="false">
    <div v-if="myProfitDetail.list.length" class="detail-list">
      <van-collapse
        v-for="(detail,index) in myProfitDetail.list"
        :key="index"
        v-model="activeNames"
        :border="false"
      >
        <van-collapse-item
          :name="index"
          :border="false"
          :is-link="detail.hasContent"
          :disabled="!detail.hasContent"
        >
          <template slot="title">
            <custom-title
              :title="detail.title"
              :time="detail.time"
              :status="detail.status"
            />
          </template>
          <div class="rewards-content">
            <template v-if="detail.presentData.length">
              <p
                v-for="(present, preIndex) in detail.presentData"
                :key="`present-${preIndex}`"
              >
                {{ present.name }} × {{ present.num }}
              </p>
            </template>
            <template v-if="detail.couponData.length">
              <p
                v-for="(coupon, copIndex) in detail.couponData"
                :key="`coupon-${copIndex}`"
              >
                {{ coupon | formatCoupon }}  x {{ coupon.num }}
              </p>
            </template>
            <template v-if="detail.pointsNum">
              <p>{{ detail.pointsNum }} {{ pointName }}</p>
            </template>
          </div>
        </van-collapse-item>
      </van-collapse>
    </div>
    <div v-else>
      <empty />
    </div>
  </view-wrapper>
</template>

<script>
import { Collapse, CollapseItem } from 'vant';
import { mapState } from 'vuex';
import { getSuffixCouponName, getCouponName } from '@/domain/recommend-gift/utils';
import ViewWrapper from '../../../components/view-wrapper';
import CustomTitle from './CustomTitle';
import Empty from './EarnEmpty';

export default {
  components: {
    ViewWrapper,
    CustomTitle,
    Empty,
    'van-collapse': Collapse,
    'van-collapse-item': CollapseItem,
  },
  filters: {
    formatCoupon(coupon) {
      return `${getCouponName(coupon)}${getSuffixCouponName(coupon.type)}`;
    },
  },
  data: () => {
    return {
      activeNames: [],
    };
  },
  computed: {
    ...mapState('recommend-gift', ['myProfitDetail', 'pointName']),
  },
};
</script>

<style lang="scss" scoped>
// 去掉划线
.van-hairline--top::after {
  display: none;
}
.detail-list {
  padding: 16px;
}
.rewards-content {
  padding-bottom: 8px;
}
</style>

<style lang="scss">
// 覆盖组件默认样式
.van-cell {
  padding: 8px 0;
}
.van-collapse-item__content {
  padding: 0;
  font-size: 14px;
  color: #323233;
}
</style>
