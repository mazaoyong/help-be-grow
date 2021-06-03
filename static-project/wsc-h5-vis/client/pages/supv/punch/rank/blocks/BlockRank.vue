<template>
  <div class="block-rank">
    <div class="user-rank">
      <van-skeleton
        v-if="!userRank.avatar"
        title
        avatar
        :avatar-size="70"
        :row="2"
        :row-width="['100%','100%']"
      />
      <template v-else>
        <img
          class="user-rank__avatar"
          :src="userRank.avatar"
        >

        <main>
          <div class="user-rank__nickname">
            {{ userRank.nickname }}
          </div>
          <section>
            <div class="user-rank__rank">
              <vis-icon name="rank" size="14" />
              排名:{{ userRank.rank }}
            </div>
            <div class="user-rank__punch-days">
              <vis-icon name="note" size="14" />
              累计打卡:{{ userRank.cumulativeCount }}天
            </div>
          </section>
          <section>
            {{ rewardText }}
            <div v-if="showReward" class="btn-reward" @click="openRewardDialog">
              查看奖励
            </div>
          </section>
        </main>
      </template>
    </div>

    <div class="rank-list">
      <vis-common-list
        ref="list"
        :params="listParams"
        :request="getRankListWrap"
        immediate-check
        @error="onListError"
      >
        <div
          slot-scope="props"
          class="rank-item"
          :class="[`rank-item-${props.index+1}`]"
        >
          <div class="rank-item__no">
            {{ props.index + 1 }}
          </div>
          <img class="rank-item__avatar" :src="props.item.avatar">
          <div class="rank-item__nickname">
            {{ props.item.nickname }}
          </div>
          <div class="rank-item__days">
            <span>{{ props.item.cumulativeCount }}</span>天
          </div>
        </div>

        <div slot="empty" />
      </vis-common-list>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import { Dialog, Toast, Skeleton as VanSkeleton } from 'vant';
import { Icon as VisIcon, CommonList as VisCommonList } from '@youzan/vis-ui';
import { getRankList } from 'supv/punch/apis/rank';

const {
  mapState,
  mapGetters,
  mapActions,
} = createNamespacedHelpers('rank');

export default {
  name: 'block-rank',

  components: {
    VisIcon,
    VisCommonList,
    VanSkeleton,
  },

  data() {
    return {
    };
  },

  computed: {
    ...mapState([
      'alias',
      'userRank',
    ]),
    ...mapGetters([
      'showReward',
      'rewardText',
      'rewardDialogText',
    ]),
    listParams() {
      return {
        alias: this.alias,
        size: 30,
      };
    },
  },

  created() {
    try {
      this.fetchUserRank();
    } catch (errMsg) {
      Toast(errMsg || '获取用户打卡信息失败');
    }
  },

  methods: {
    getRankListWrap: (params) => {
      return getRankList(params)
        .then(res => ({
          list: res.content,
          hasNext: params.page < res.totalPages,
        }));
    },
    ...mapActions([
      'fetchUserRank',
    ]),
    openRewardDialog() {
      Dialog.alert({
        message: this.rewardDialogText,
        confirmButtonText: '知道了',
        confirmButtonColor: '#00b389',
      });
    },
    onListError(errMsg) {
      Toast(errMsg || '获取排行榜数据失败');
    },
  },
};
</script>

<style lang="scss" scoped>
.block-rank {
  padding: 24px 17px 20px 18px;

  .user-rank {
    display: flex;
    height: 113px;
    background: url(https://b.yzcdn.cn/public_files/b8261d3aafcf86b1fba2911512ec9e36.png) no-repeat top center / 100% 59px, #fff;
    border-radius: 6px;
    box-shadow: 0 2px 10px 0 rgba(0, 0, 0, .1);

    ::v-deep .van-skeleton {
      width: 100%;
      padding: 24px 20px 19px 22px;

      &__content {
        padding-top: 0;
      }

      &__row {
        margin-top: 12px !important;
      }
    }

    &__avatar {
      flex: 0 0 auto;
      width: 70px;
      height: 70px;
      margin: 24px 0 19px 22px;
      border-radius: 50%;

      &.hidden {
        visibility: hidden;
      }
    }

    main {
      margin-left: 20px;
    }

    &__nickname {
      margin-top: 24px;
      overflow: hidden;
      font-size: 16px;
      font-weight: 700;
      line-height: 22px;
      color: #333;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    section {
      font-size: 13px;
      line-height: 14px;
      color: #666;

      &:first-of-type {
        margin-top: 8px;
      }

      &:last-of-type {
        margin-top: 7px;
        line-height: 16px;
      }
    }

    &__rank {
      display: inline-block;

      ::v-deep .vis-icon {
        margin-right: 3px;
        vertical-align: top;
      }
    }

    &__punch-days {
      display: inline-block;
      margin-left: 24px;

      ::v-deep .vis-icon {
        margin-right: 4px;
      }
    }

    .btn-reward {
      display: inline-block;
      padding: 0 6px;
      margin-left: 1px;
      font-size: 11px;
      line-height: 16px;
      color: #fff;
      background: #00b389;
      border-radius: 8px;
    }
  }

  .rank-list {
    padding-right: 10px;
    margin-top: 30px;

    .rank-item {
      display: flex;
      margin: 10px 0;
      align-items: center;

      &__no {
        flex: 0 0 auto;
        width: 24px;
        margin: 0 7px;
        font-size: 14px;
        font-weight: 700;
        line-height: 24px;
        color: #333;
        text-align: center;
      }

      &__avatar {
        flex: 0 0 auto;
        width: 40px;
        height: 40px;
        margin: 0 10px;
        border: 2px solid transparent;
        border-radius: 50%;
      }

      &__nickname {
        flex: 1 1 auto;
        margin-left: 4px;
        overflow: hidden;
        font-size: 15px;
        line-height: 21px;
        color: #333;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      &__days {
        flex: 0 0 auto;
        font-size: 13px;
        line-height: 21px;
        color: #333;
        text-align: right;

        span {
          font-size: 15px;
          font-weight: 700;
          vertical-align: top;
        }
      }

      // 排行前三专属样式
      @mixin top3($bg, $borderColor) {
        .rank-item {
          &__no {
            color: #fff;
            background: url(#{$bg}) no-repeat;
            background-size: 24px 24px;
          }

          &__avatar {
            border-color: $borderColor;
          }
        }
      }

      &-1 {
        @include top3('https://b.yzcdn.cn/public_files/50ba24d5840f05e5424031c54045d02d.png', #ffc536);
      }

      &-2 {
        @include top3('https://b.yzcdn.cn/public_files/0271d7ee43a1381092fa51da14a7560e.png', #a5b9c2);
      }

      &-3 {
        @include top3('https://b.yzcdn.cn/public_files/c6e31701bb8090df7180deba5f7b60e5.png', #c08b6d);
      }
    }
  }
}
</style>
