<template>
  <div v-if="!noLikedUsers" class="feeds-card-operator__bottom-like">
    <div
      :class="showAvatar ? 'like-icon-posfix like-icon-posfix__avatar' : 'like-icon-posfix'"
    >
      <van-icon name="dianzan-bold" size="12px" />
    </div>
    <template v-if="!showAvatar">
      <label
        v-for="(user, index) in feed.likedUsers"
        :key="index"
        @click="onClickLikedUser(user)"
      >
        {{ user.userName }}{{ index === feed.likedUsers.length - 1 ? '' : '、' }}
      </label>
    </template>
    <template v-else>
      <img-wrap
        v-for="(user, index) in feed.likedUsers"
        :key="index"
        width="34px"
        height="34px"
        class="feeds-card-operator__bottom-like-avatar"
        :src="user.avatar || defaultAvatar"
        :fullfill="'!120x0.jpg'"
        :cover="true"
        @click.native="onClickLikedUser(user)"
      />
    </template>
  </div>
</template>

<script>
import { Icon, ImgWrap } from '@youzan/vis-ui';
import isEmpty from 'lodash/isEmpty';

export default {
  name: 'liked-users',
  components: {
    'van-icon': Icon,
    'img-wrap': ImgWrap,
  },

  props: {
    feed: {
      type: Object,
      default: () => {},
    },
    defaultAvatar: {
      type: String,
      default: '',
    },
    showAvatar: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    noLikedUsers() {
      return isEmpty(this.feed.likedUsers);
    },

    likedUsers() {
      return this.feed.likedUsers.map(u => u.userName);
    },
  },

  methods: {
    onClickLikedUser(user) {
      this.$emit('clickLikedUser', {
        userId: user.userId,
        userRole: user.userRole,
      });
    },
  },
};
</script>
<style lang="scss">
.feeds-card-operator__bottom-like {
  padding: 0 8px;
  margin-top: 7px;
  margin-bottom: 7px;
  display: flex;
  flex-wrap: wrap;

  .van-icon-like-o {
    margin-right: 5px;
    color: #576B95;
    vertical-align: middle;
  }

  label {
    color: #576b95;
    font-weight: bold;
    font-size: 14px;
    line-height: 22px;
  }

  &-avatar {
    margin: 2px 0 2px 4px;
    border-radius: 2px;
  }
}

// 位置修正
.like-icon-posfix {
  width: 12px;
  height: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 8px;
  color: #576b95;
  margin-top: 5px;

  &__avatar {
    margin-right: 8px;
    margin-top: 13px;
  }
}

</style>
