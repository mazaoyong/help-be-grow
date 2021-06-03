<template>
  <div class="moments-feeds__notification">
    <div
      v-if="notificationInfo.hasNewMessage || errorList.hasError"
      class="moments-feeds__notification-container"
    >
      <!-- 渲染消息提示 -->
      <template v-if="notificationInfo.hasNewMessage">
        <notification-item
          noti-type="message"
          :avatar="notificationInfo.senderAvatar || staticAssets.userAvatar"
          :msg="`${notificationInfo.messageNum}条信息`"
          @clickItem="handleClick"
        />
      </template>
      <!-- 渲染错误提示 -->
      <template v-if="errorList.hasError">
        <notification-item
          v-for="id in errorList.modifyFailedPostId"
          :key="id"
          :error-id="id"
          :avatar="staticAssets.errorIcon"
          noti-type="error-modify"
          msg="点评修改失败"
          @clickItem="handleClick"
        />
        <notification-item
          v-for="id in errorList.sendFailedPostId"
          :key="id"
          :error-id="id"
          :avatar="staticAssets.errorIcon"
          noti-type="error-send"
          msg="点评发送失败"
          @clickItem="handleClick"
        />
      </template>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import NotificationItem from './item';
import constants from '../../constants';

export default {
  name: 'feeds-notification',

  components: {
    'notification-item': NotificationItem,
  },

  data() {
    return {
      staticAssets: constants.STATIC_ASSETS,
    };
  },

  computed: mapState({
    notificationInfo: state => state.notifications.messageInfo,
    errorList: state => {
      const list = state.notifications.errorList;

      return Object.assign({}, {
        hasError: (list.modifyFailedPostId || []).length > 0 ||
          (list.sendFailedPostId || []).length > 0,
      }, list);
    },
  }),

  mounted() {
    this.$store.dispatch('notifications/getNotifications', { userRole: 2 });
  },

  methods: {
    handleClick(id, type) {
      if (!id) {
        window.location.href = `/v4/vis/h5/edu/moments/messagebox?unReadMessageNum=${this.notificationInfo.messageNum}`;
      } else {
        window.location.href = `/v4/vis/h5/edu/moments/feeds/detail/${id}`;
      }
    },
  },
};
</script>

<style lang="scss">
.moments-feeds__notification {
  display: flex;
  flex-direction: column;

  &-container {
    padding: 32px 0 6px;
  }
}
</style>
