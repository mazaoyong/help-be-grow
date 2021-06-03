<template>
  <div class="groupon-pannel-container">
    <vis-wrap>
      <div v-if="isShowGroupList && groupList.length > 0" class="groupon-pannel-container__title">
        <span class="groupon-pannel-container__title-tag">
          拼团
        </span>
        <span>ta正在发起拼团，可直接参与</span>
      </div>
      <van-cell-group :border="false">
        <template v-if="isShowGroupList">
          <van-cell
            v-for="item in groupList"
            :key="item.id"
            :border="false"
          >
            <div class="groupon-pannel-container__list">
              <div class="groupon-pannel-container__list-item-thumb">
                <img-wrap
                  :width="'40px'"
                  :height="'40px'"
                  :src="getAvatar(item.avatar)"
                  :fullfill="'!80x0.jpg'"
                  :cover="false"
                />
              </div>
              <div
                class="groupon-pannel-container__list-item-go"
                @click="$emit('select', item.groupAlias)"
              >
                <a class="groupon-pannel-container__list-item-go-btn">去拼团</a>
              </div>
              <div class="groupon-pannel-container__list-item-detail">
                <div class="groupon-pannel-container__list-item-detail-user">
                  {{ getUserName(item.nickName) }}
                </div>
                <div class="groupon-pannel-container__list-item-detail-des">
                  <p class="groupon-pannel-container__list-item-detail-des-line-num">
                    <span>还差</span>
                    <span class="groupon-pannel-container__list-item-detail-des-num">{{ item.remainJoinNum }}</span>
                    <span>人成团</span>
                  </p>
                  <p class="groupon-pannel-container__list-item-detail-des-line-time">
                    <span>剩余</span>
                    <count-down
                      :end-at="Date.now() + item.remainTime * 1000"
                      :time-separator="[':', ':', ':', '', '']"
                      :hide-zero-day="true"
                    />
                    <span>结束</span>
                  </p>
                </div>
              </div>
            </div>
          </van-cell>
        </template>
        <van-cell
          class="groupon-pannel-container__vant-cell"
          is-link
          url="https://h5.youzan.com/v2/ump/groupon/guide"
        >
          <div class="groupon-pannel-container__cell">
            <span class="groupon-pannel-container__title-tag">
              玩法
            </span>
            <span class="groupon-pannel-container__title-tips">{{ grouponTips }}</span>
          </div>
        </van-cell>
      </van-cell-group>
    </vis-wrap>
  </div>
</template>

<script>
import { CellGroup, Cell, Tag } from 'vant';
import { ImgWrap } from '@youzan/vis-ui';
import format from '@youzan/utils/money/format';
import Wrap from '../container/wrap';
import CountDown from '../../components/CountDown';

export default {
  name: 'groupon-pannel',

  components: {
    [CellGroup.name]: CellGroup,
    [Cell.name]: Cell,
    [Tag.name]: Tag,
    'vis-wrap': Wrap,
    [CountDown.name]: CountDown,
    'img-wrap': ImgWrap,
  },

  props: {
    groupType: {
      type: Number,
      default: 0,
    },

    groupList: {
      type: Array,
      default() {
        return [];
      },
    },

    isShowGroupList: {
      type: Boolean,
      default: false,
    },
    alias: {
      type: String,
      default: '',
    },

    productId: {
      type: Number,
      default: 0,
    },

    conditionNum: {
      type: Number,
      default: 0,
    },

    ladderPrice: {
      type: Object,
      default: () => ({}),
    },
  },

  data() {
    return {
      ptText: '',
    };
  },

  computed: {
    grouponTips() {
      // 阶梯拼团
      if (this.groupType === 2) {
        const ladderList = Object.keys(this.ladderPrice).map(ladder => {
          let minPrice = this.ladderPrice[ladder][0].skuPrice;
          let maxPrice = 0;
          this.ladderPrice[ladder].forEach(sku => {
            if (sku.skuPrice < minPrice) {
              minPrice = sku.skuPrice;
            }
            if (sku.skuPrice > maxPrice) {
              maxPrice = sku.skuPrice;
            }
          });
          if (minPrice === maxPrice) {
            return `${ladder}人拼团${format(minPrice, true, false)}/件`;
          }
          return `${ladder}人拼团${format(minPrice, true, false)}起/件`;
        });
        return `${ladderList.join('，')}，开团前选择参团人数，支付后开团并邀请好友参团，人数不足自动退款`;
      }
      return `支付开团邀请${+this.conditionNum - 1}${this.groupType ? '名新用户' : '人'}参团，人数不足自动退款`;
    },
  },

  mounted() {
    this.ptText = this.isShowGroupList && this.groupList.length ? '以下伙伴正发起拼团，可直接参与！' : '快去发起拼团吧';
  },

  methods: {
    // 获取头像
    getAvatar(avatarSrc) {
      if (!avatarSrc) {
        return 'https://img01.yzcdn.cn/public_files/2017/10/23/1321da81aa84d0539b0d5af73fbbf53b.png';
      }
      return avatarSrc;
    },

    // 获取用户名
    getUserName(userName) {
      let _userName = userName;
      if (typeof userName !== 'string' || !userName) {
        _userName = '匿名小伙伴';
      }

      return _userName;
    },
  },
};
</script>

<style lang="scss">
@import 'mixins/index.scss';
@import "var";

.groupon-pannel-container {
  .vis-wrap {
    padding: 0;
  }

  .cap-countdown__hour,
  .cap-countdown__minute,
  .cap-countdown__second {
    color: #646566;
  }

  &__title {
    padding: 0 16px;
    font-size: 13px;
    line-height: 44px;
    color: #323233;

    &-tag {
      margin-right: 16px;
      color: #969799;
      flex: 0 0 auto;
    }

    &-tips {
      @include multi-ellipsis(3);
    }
  }

  &__vant-cell {
    .van-cell__right-icon {
      align-self: center;
    }
  }

  &__cell {
    display: flex;
    font-size: 13px;
  }

  &__old {
    font-size: 12px;
    color: #333;

    .tip {
      font-size: 13px;
    }
  }

  &__text {
    font-size: 13px;
    color: #333;
  }

  &__desc {
    float: right;
    font-size: 12px;
    color: #666;
  }

  &__list {
    height: 100%;
    padding: 2px 0;

    &-item {
      padding: 15px;

      &-thumb {
        float: left;
        width: 40px;
        height: 40px;
        overflow: hidden;
        border-radius: 100%;

        img {
          width: 100%;
          height: 100%;
        }
      }

      &-detail {
        display: flex;
        height: 100%;
        margin-right: 79px;
        margin-left: 59px;
        font-size: 12px;
        line-height: 17px;
        justify-content: space-between;
        align-items: center;

        &-user {
          margin-bottom: 4px;
          font-size: 13px;
          font-weight: 500;
          color: #111;
        }

        &-des {
          display: flex;
          color: #666;
          flex-direction: column;
          align-items: flex-end;

          &-line {
            &-num {
              font-size: 13px;
              color: #323233;
              text-align: right;
            }

            &-time {
              font-size: 12px;
              color: #646566;
              transform: scale(.83);
              transform-origin: right;
            }
          }

          &-num {
            padding: 0 2px;
            color: #fc2a35;
          }

          &-countdown {
            .cap-countdown__day,
            .cap-countdown__hour,
            .cap-countdown__minute,
            .cap-countdown__second,
            .cap-countdown__time-text {
              padding: 0;
              margin: 0;
              color: #878787 !important;
              background-color: $c-white !important;
            }
          }
        }
      }

      &-go {
        float: right;

        &-btn {
          position: relative;
          display: block;
          width: 70px;
          height: 30px;
          margin-top: 4px;
          font-size: 14px;
          line-height: 30px;
          color: #f44;
          text-align: center;

          &::after {
            @include border-retina(surround);

            border-color: #f44;
            border-radius: 30px;
          }
        }
      }
    }
  }

  .cap-countdown__time-text {
    color: #666;
  }
}
</style>
