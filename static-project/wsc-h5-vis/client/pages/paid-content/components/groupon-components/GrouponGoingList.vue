<template>
  <div class="groupon-going-list">
    <div class="groupon-going-list__title">
      <span class="groupon-going-list__title-tag">
        拼团
      </span>
      <span>ta正在发起拼团，可直接参与</span>
    </div>
    <div v-for="item in grouponList" :key="item.buyerId">
      <div class="groupon-going-list__item">
        <div class="groupon-going-list__item-thumb">
          <div class="groupon-going-list__item-thumb-avatar">
            <img :src="getAvatar(item.avatar)">
          </div>
          <div class="groupon-going-list__item-thumb-user">
            {{ getUserName(item.nickName) }}
          </div>
        </div>
        <div class="groupon-going-list__item-detail">
          <div class="groupon-going-list__item-detail-des">
            <p class="groupon-going-list__item-detail-des-remain">
              还差<span class="groupon-going-list__item-detail-des-remain-num">
                {{ item.remainJoinNum }}
              </span>人成团
            </p>
            <div class="groupon-going-list__item-detail-des-time">
              剩余
              <cap-countdown
                class="groupon-going-list__item-detail-des-time-countdown"
                :start="item.startAt"
                :end="Date.now() + item.remainTime * 1000"
                :hide-zero-day="true"
              />
              结束
            </div>
          </div>
          <div class="groupon-going-list__item-detail-go">
            <div class="groupon-going-list__item-detail-go-btn theme_plain" @click="$emit('select', item.groupAlias)">
              去参团
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Countdown } from 'captain-ui';

export default {
  name: 'groupon-going-list',

  components: {
    'cap-countdown': Countdown,
  },

  props: {
    /*
    * 凑团列表
    */
    grouponList: {
      type: Array,
      default: () => [],
    },

    productId: {
      type: Number,
      default: 0,
    },
  },

  methods: {
    /**
     * 获取头像
     */
    getAvatar(avatarSrc) {
      if (!avatarSrc) {
        return 'https://img01.yzcdn.cn/public_files/2017/10/23/1321da81aa84d0539b0d5af73fbbf53b.png';
      }
      return avatarSrc;
    },

    /**
     * 获取用户名
     */
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

.groupon-going-list {
  &__title {
    font-size: 13px;
    line-height: 44px;
    color: #323233;

    &-tag {
      margin-right: 16px;
      color: #969799;
    }
  }

  &__item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 64px;

    &-thumb {
      display: flex;
      align-items: center;

      &-avatar {
        width: 44px;
        height: 44px;
        margin-right: 15px;
        overflow: hidden;
        border-radius: 100%;

        img {
          width: 100%;
          height: 100%;
        }
      }

      &-user {
        font-size: 13px;
        color: #323233;
      }
    }

    &-detail {
      display: flex;
      align-items: center;

      &-des {
        margin-right: 10px;
        text-align: right;

        &-remain {
          font-size: 13px;
          line-height: 18px;
          color: #323333;

          &-num {
            color: #00b389;
          }
        }

        &-time {
          margin-top: 2px;
          font-size: 12px;
          line-height: 14px;
          color: #646566;
          transform: scale(.83);
          transform-origin: right;

          &-countdown {
            .cap-countdown__day,
            .cap-countdown__hour,
            .cap-countdown__minute,
            .cap-countdown__second,
            .cap-countdown__time-text {
              padding: 0;
              margin: 0;
              color: #646566 !important;
              background-color: $c-white !important;
            }
          }
        }
      }

      &-go {
        &-btn {
          display: block;
          width: 70px;
          height: 28px;
          font-size: 13px;
          line-height: 28px;
          color: #fff;
          text-align: center;
          background-color: #00b389;
          border-radius: 16px;

          &::after {
            @include border-retina(surround);

            border-radius: 2px;
          }
        }
      }
    }
  }
}
</style>
