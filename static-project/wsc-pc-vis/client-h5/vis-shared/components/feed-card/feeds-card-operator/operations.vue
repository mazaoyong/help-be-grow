<template>
  <div class="feeds-card-operator__edit">
    <div class="feeds-card-operator__edit-time">
      <span style="display: inline-block;">{{ feedTime }}</span>
      <span
        v-if="hasPrivilege"
        @click="$emit('handleEdit')"
      >
        修改
      </span>
      <span
        v-if="hasPrivilege"
        @click="$emit('handleDelete')"
      >
        删除
      </span>
    </div>
    <div
      v-if="showEditMore"
      class="feeds-card-operator__edit-operations"
    >
      <ul>
        <li @click="$emit('clickShare')">
          <van-icon size="14px" class-name="operator-icons" name="fenxiang" />转发
        </li>
        <li @click="$emit('clickLike')">
          <van-icon size="16px" class-name="operator-icons" name="dianzan" />
          {{ feed.isLiked ? '取消' : '赞' }}
        </li>
        <li @click="$emit('clickComment')">
          <van-icon size="14px" class-name="operator-icons" name="pinglun" />评论
        </li>
      </ul>
    </div>
    <div
      class="feeds-card-operator__edit-more"
      @click="clickEditMore"
    >
      <img src="https://b.yzcdn.cn/cdn/share-btn.png" height="20" alt="分享按钮.png">
    </div>
  </div>
</template>

<script>
import { Icon } from '@youzan/vis-ui';
import { getFeedTime } from './util';

export default {
  name: 'operations',
  components: {
    'van-icon': Icon,
  },

  props: {
    feed: {
      type: Object,
      default: () => {},
    },
    showEditMore: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      showDeleteConfirm: false,
    };
  },

  computed: {
    feedTime() {
      return getFeedTime(this.feed.createdAt);
    },
    hasPrivilege() {
      const senderId = String(this.feed.senderId);
      return senderId === String(_global.userId) || senderId === String(_global.buyer_id);
    },
  },

  methods: {
    clickEditMore(e) {
      e.stopPropagation();
      e.preventDefault();
      this.$emit('clickEditMore');
    },
  },
};
</script>
<style lang="scss" scoped>
.feeds-card-operator__edit {
  position: relative;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  margin-bottom: 8px;
  color: #576b95;

  span {
    padding-right: 10px;
  }

  &-time {
    span {
      &:first-child {
        color: #969799;
      }
    }
  }

  &-operations {
    position: absolute;
    display: flex;
    background-color: #4f5052;
    color: #ffffff;
    border-radius: 6px;
    right: 40px;
    z-index: 1;
    bottom: -10px;

    .operators-cover {
      position: fixed;
      top: 0;
      left: 0;
      z-index: 999;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }

    ul {
      display: flex;
      align-items: center;
      z-index: 1001;
      height: 40px;
      line-height: 40px;
      font-size: 13px;

      li {
        position: relative;
        display: flex;
        padding: 0 18px;
        align-items: center;
        word-break: keep-all;

        &:not(:last-child)::after {
          position: absolute;
          right: 0;
          top: 0;
          width: 1px;
          height: 100%;
          background-color: #353638;
          content: '';
          transform: scale(.5);
        }
      }
    }
  }

  &-more {
    background-color: #F2F3F5;
    font-weight: bold;
    font-size: 20px;
    height: 20px;
    line-height: 18px;
    border-radius: 2px;

    .ellipsis {
      padding: 0 8px;
    }
  }

  .popup-list {
    text-align: center;
  }
}

.share-popup {
  position: fixed;
  left: 55%;
  top: 10%;
  width: 70%;
  border-radius: 2%;
  padding: 10px;
  margin: 10px;
  overflow: visible;

  &-trangle-top {
    position: absolute;
    top: -10px;
    right: 20px;
    width: 0;
    height: 0;
    border-left: 15px solid transparent;
    border-right: 15px solid transparent;
    border-bottom: 15px solid #fff;
  }

  .share-text {
    &-title {
      display: flex;
      flex-direction: row-reverse;
      font-size: 20px;
      padding-bottom: 5px;
    }
    &-content {
      display: flex;
      flex-direction: row-reverse;
    }
  }
}

.operator-icons {
  margin-right: 5px;
}
</style>
