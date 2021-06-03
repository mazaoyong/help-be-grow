<template>
  <div v-if="show">
    <message class="message" :style="{ width: `${pageWidth}px` }" />
    <group class="group" :style="{ width: `${pageWidth}px` }" />
    <tuition />
    <van-goods-action class="submit" :style="{ width: `${pageWidth}px` }" safe-area-inset-bottom>
      <icons />
      <buttons />
    </van-goods-action>
  </div>
  <van-goods-action v-else-if="IOSWeappShow" class="submit">
    <buttons />
  </van-goods-action>
</template>

<script>
import { GoodsAction } from 'vant';
import { ACTIVITY_TYPE } from '@/constants/ump/activity-type';
import { ACTIVITY_STATUS } from '@/constants/ump/activity-status';
import rootStore from '@/pages/course/detail/store';
import Message from './components/message';
import Group from './components/group';
import Icons from './components/icons';
import Buttons from './components/buttons';
import Tuition from './components/tuition';
import storeName from './name';
import store from './store';

rootStore.registerModule(storeName, store);

export default {
  storeName,

  components: {
    'van-goods-action': GoodsAction,
    Message,
    Group,
    Icons,
    Buttons,
    Tuition,
  },

  rootState: ['activityDataMap', 'goodsData', 'activityTypes', 'env', 'isShopRest'],
  rootGetters: ['isOnlineCourse', 'isContent', 'isColumn', 'pageWidth', 'needCollectInfo'],

  computed: {
    show() {
      const { isOwnAsset, needOrder } = this.goodsData;
      // 未购买且店铺休息中，异常底部动作栏
      if (!isOwnAsset && this.isShopRest) {
        return false;
      }

      if (this.isOnlineCourse && this.env.isIOSWeapp) {
        return false;
      }

      if (this.isContent && isOwnAsset && !needOrder) {
        return false;
      }

      if (this.isColumn && isOwnAsset && !this.needCollectInfo) {
        return false;
      }
      return true;
    },

    IOSWeappShow() {
      if (this.isOnlineCourse && this.env.isIOSWeapp) {
        if (this.activityTypes.includes(ACTIVITY_TYPE.COLLECT_ZAN)) {
          const { status } = this.activityDataMap[ACTIVITY_TYPE.COLLECT_ZAN];
          return status === ACTIVITY_STATUS.GOING;
        }
        if (this.goodsData.sku.minPrice === 0) {
          return true;
        }
      }
      return false;
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'mixins/index.scss';

.message,
.group,
.submit {
  margin: 0 auto;
}

.submit {
  z-index: 2;
  box-shadow: 0 -2px 10px 0 $shadow-color;
}
</style>
