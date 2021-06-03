<template>
  <div class="friend-list">
    <common-list :request="getFriendList" :params="params">
      <div class="friend-list-item" slot-scope="props">
        <div class="user-info">
          <img :src="props.item.avatar || defaultAvatar" class="user-info-img" />
          <div class="user-info-name">{{ props.item.refereeName }}</div>
        </div>
        <div class="step">
          <div :class="['step-top', props.item.refereeStatus === 4 ? 'finished' : '']">
            <div
              :class="[
                'step-item',
                props.item.refereeStatus >= 3 ? 'finished' : props.item.refereeStatus >= 1 ? 'ongoing' : '',
              ]"
            ></div>
            <div
              :class="[
                'step-item',
                props.item.refereeStatus >= 4 ? 'finished' : props.item.refereeStatus >= 3 ? 'ongoing' : '',
              ]"
            ></div>
          </div>
          <div class="step-bottom">
            <div class="step-info left">
              <div
                :class="['info-label', props.item.refereeStatus === 1 || props.item.refereeStatus === 2 ?
                'active' : '']"
              >
                领取奖励
              </div>
              <div class="info-time" v-if="props.item.refereeStatus === 1 || props.item.refereeStatus === 2">
                {{ props.item.introduceAt | timeStr }}
              </div>
            </div>
            <div class="step-info center">
              <div :class="['info-label', props.item.refereeStatus === 3 ? 'active' : '']">
                试听
              </div>
              <div class="info-time" v-if="props.item.refereeStatus === 3">
                {{ props.item.introduceAt | timeStr }}
              </div>
            </div>
            <div class="step-info right">
              <div :class="['info-label', props.item.refereeStatus === 4 ? 'active' : '']">
                报名
              </div>
              <div class="info-time" v-if="props.item.refereeStatus === 4">
                {{ props.item.introduceAt | timeStr }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div slot="empty" class="friend-list-empty">
        <van-empty description="暂无记录，赶紧去邀请好友吧" :image="emptyImg" />
      </div>
    </common-list>
  </div>
</template>

<script>
import { Empty } from 'vant';
import { CommonList } from '@youzan/vis-ui';
import formatDate from '@youzan/utils/date/formatDate';
import { findIntroduceRecord } from '../../../apis/old-student';
import { LIST_EMPTY_IMG, DEFAULT_AVATAR } from '../../../constants';

const pageSize = 10;

export default {
  name: 'friend-list',
  data() {
    return {
      pageNumber: 1,
    };
  },
  props: {
    alias: {
      type: String,
    },
  },
  computed: {
    emptyImg() {
      return LIST_EMPTY_IMG;
    },
    defaultAvatar() {
      return DEFAULT_AVATAR;
    },
    params() {
      return {
        alias: this.alias,
        page: this.pageNumber,
      };
    },
  },
  filters: {
    timeStr(val) {
      return formatDate(val, 'MM-DD');
    },
  },
  components: {
    CommonList,
    'van-empty': Empty,
  },
  methods: {
    getFriendList({ alias, page }) {
      return findIntroduceRecord({
        alias,
        pageSize,
        pageNumber: page,
      }).then((res) => {
        return {
          list: res.content,
          hasNext: res.content.length === pageSize,
        };
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.friend-list {
  padding: 0 16px 16px;

  &-item {
    display: inline-flex;
    margin-top: 16px;
    width: 100%;
    flex-flow: row nowrap;
    align-items: center;
    height: 60px;

    .user-info {
      display: flex;
      width: 56px;
      margin-right: 10px;
      flex-flow: column wrap;
      align-items: center;

      &-img {
        width: 36px;
        height: 36px;
        border-radius: 50%;
      }

      &-name {
        width: 100%;
        margin-top: 2px;
        font-size: 14px;
        line-height: 20px;
        color: #323233;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        text-align: center;
      }
    }

    .step {
      flex: 1;
      &-top {
        position: relative;
        width: 100%;
        height: 5px;
        display: inline-flex;
        align-items: center;
        justify-content: space-around;
        background: #fdddc3;
        border-radius: 4px;

        &.finished {
          &:after {
            background: #ff5100;
          }
        }

        &:after {
          position: absolute;
          display: block;
          content: '';
          top: -2px;
          right: -3px;
          background: #fdddc3;
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }
      }

      &-item {
        flex: 1;
        height: 100%;
        position: relative;
        border-radius: 4px;

        &.ongoing {
          background-image: linear-gradient(#ff5100, #ff5100);
          background-size: 85% 100%;
          background-repeat: no-repeat;

          &:before {
            background: #ff5100;
          }
        }

        &.finished {
          background: #ff5100;

          &:before {
            background: #ff5100;
          }
        }

        &:before {
          position: absolute;
          top: -2px;
          left: -3px;
          display: block;
          content: '';
          background: #fdddc3;
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }
      }

      &-bottom {
        width: 100%;
        display: inline-flex;
        align-items: center;
        justify-content: space-around;
        flex-flow: row nowrap;
        margin-top: 10px;
      }

      &-info {
        flex: 1;

        &.center {
          margin-right: -10px;
          text-align: center;
        }

        &.right {
          text-align: right;
        }

        .info-label {
          color: #969799;
          font-size: 12px;
          line-height: 18px;

          &.active {
            color: #ff5100;
          }
        }

        .info-time {
          color: #969799;
          font-size: 10px;
          line-height: 14px;
        }
      }
    }
  }

  &-empty {
    min-height: 320px;
  }
}
</style>
