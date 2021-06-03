<template>
  <popup-close :show-pop="show" @close-pop="onClose">
    <div class="share-success">
      <img src="https://img01.yzcdn.cn/public_files/0cb9dad0bb96570d7a96c8895eaf2ef3.png" class="share-success-top" />
      <div class="share-success-list">
        <div class="reward-item" v-for="(item, index) in list" :key="index">
          <div class="reward-item-icon">
            <img :src="item.icon" />
          </div>
          <div class="reward-item-info">
            <div class="reward-item-info-name">
              {{ item.title }}
            </div>
            <div class="reward-item-info-desc">
              {{ item.desc }}
            </div>
          </div>
        </div>
      </div>
      <div class="share-success-btn">
        <main-button text="开心收下" @handle-click="onClose" />
      </div>
    </div>
  </popup-close>
</template>

<script>
import { PopupClose } from '@youzan/vis-ui';
import { REWARD_TYPE_ICON } from '../../../constants';
import MainButton from '../../../components/main-button';

export default {
  name: 'share-success',
  data() {
    return {
      pointName: _global.visPointsName || '积分',
    };
  },
  components: {
    PopupClose,
    MainButton,
  },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    couponList: {
      type: Array,
      default: () => [],
    },
    presentList: {
      type: Array,
      default: () => [],
    },
    point: {
      type: Object,
      default: () => ({
        type: 1,
        awardAmount: 0,
      }),
    },
  },
  computed: {
    show: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      },
    },
    list() {
      const { couponList, presentList, point, pointName } = this;
      const list = [];
      if (presentList.length > 0) {
        let descArr = [];
        let totalCount = 0;
        presentList.map((item) => {
          descArr.push(`${item.awardCopywriting}x${item.awardAmount}`);
          totalCount += item.awardAmount;
        });
        list.push({
          icon: REWARD_TYPE_ICON['3'],
          title: `赠品 x ${totalCount}`,
          desc: descArr.join('、'),
        });
      }
      if (couponList.length > 0) {
        let descArr = [];
        let totalCount = 0;
        couponList.map((item) => {
          descArr.push(`${item.awardCopywriting}x${item.awardAmount}`);
          totalCount += item.awardAmount;
        });
        list.push({
          icon: REWARD_TYPE_ICON['2'],
          title: `优惠券 x ${totalCount}`,
          desc: descArr.join('、'),
        });
      }
      if (point.awardAmount > 0) {
        list.push({
          icon: REWARD_TYPE_ICON['1'],
          title: `${point.awardAmount}${pointName}`,
        });
      }
      return list;
    },
  },
  methods: {
    onClose() {
      this.show = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.share-success {
  position: relative;
  width: 311px;
  margin-top: 110px;
  padding-top: 10px;
  background-color: #fdf2e3;
  border-radius: 16px;

  &-top {
    position: absolute;
    top: -109px;
    width: 312px;
    pointer-events: none;
  }

  &-list {
    position: relative;
    margin: 0 12px;
    height: 215px;
    background-color: #fdf2e3;

    .reward-item {
      height: 65px;
      display: inline-flex;
      width: 100%;
      align-items: center;
      margin-bottom: 8px;
      justify-content: space-between;
      background: #fff;
      border-radius: 8px;

      &-icon {
        width: 44px;
        height: 44px;
        margin: 0 10px;

        img {
          width: 100%;
          height: 100%;
        }
      }

      &-info {
        flex: 1;
        margin-right: 18px;
        overflow: hidden;

        &-name {
          font-size: 14px;
          line-height: 20px;
          color: #39393a;
          font-weight: 500;
        }

        &-desc {
          margin-top: 4px;
          font-size: 12px;
          line-height: 17px;
          color: #aaabad;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  }

  &-btn {
    padding: 12px;
  }
}
</style>
