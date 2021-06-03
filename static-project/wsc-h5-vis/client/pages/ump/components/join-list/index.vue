<template>
  <div class="join-list">
    <common-list
      :request="fetchPromise"
      :params="params"
      :load="onLoad"
    >
      <section
        slot-scope="{item}"
        class="join-list__list-item"
      >
        <div class="join-list__list-item-avatar">
          <img
            :src="item.fansPicture"
            class="avatar-img"
          >
          <van-tag
            v-if="item.tag"
            class="head-tag activity-label"
            round
          >
            {{ item.tag }}
          </van-tag>
        </div>
        <div class="join-list__list-item-name">
          <p class="nick">
            {{ item.fansNickName }}
          </p>
          <p class="invite-text">
            {{ item.label }}：{{ item.payTime }}
          </p>
        </div>
      </section>
    </common-list>
  </div>
</template>

<script>
import { CommonList } from '@youzan/vis-ui';
import { Tag } from 'vant';

export default {
  name: 'join-list',

  components: {
    CommonList,
    'van-tag': Tag,
  },

  props: {
    fetchPromise: {
      type: Function,
      required: true, // 列表请求 promise
    },
    params: {
      type: Object,
      default() {
        return {};
      },
    },
  },

  methods: {
    onLoad(res, resData) {
      console.log('翻页数据返回', resData);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "var";
@import 'mixins/index.scss';

.join-list {
  padding: 15px;

  &__title {
    line-height: 20px;
    font-size: 14px;
    font-weight: 500;
    color: $c-black;
  }

  &__list {
    &-item {
      position: relative;
      display: flex;
      padding: 13px 0;

      &-avatar {
        position: relative;

        .avatar-img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
        }

        .head-tag {
          position: absolute;
          top: -3px;
          right: -12px;
          line-height: 1;
        }
      }

      &-name {
        display: inline-flex;
        flex-direction: column;
        justify-content: space-around;
        margin-left: 15px;
        font-size: 12px;
        color: #666;

        .nick {
          font-size: 13px;
          color: $c-black;
        }
      }

      &:not(:last-of-type):after {
        @include border-retina(bottom);

        border-color: #f2f2f2;
      }
    }
  }
}
</style>
