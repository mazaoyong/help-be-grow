<template>
  <div class="invite-info">
    <div class="invite-info__avatar">
      <img
        :src="avatar"
        class="avatar-img"
      >
      <van-tag
        v-if="isHead"
        class="head-tag tag-hollow"
        round
      >
        团长
      </van-tag>
    </div>
    <div class="invite-info__name">
      <p class="nick">
        {{ nickName }}
      </p>
      <p
        v-if="groupStatus===0"
        class="invite-text"
      >
        {{ inviteText }}
      </p>
    </div>
  </div>
</template>

<script>
import { Tag } from 'vant';

export default {
  name: 'invite-info',

  components: {
    [Tag.name]: Tag,
  },

  props: {
    avatar: {
      type: String,
      default: 'https://img01.yzcdn.cn/public_files/2017/10/23/1321da81aa84d0539b0d5af73fbbf53b.png',
    },

    nickName: {
      type: String,
      default: '小伙伴',
    },

    isHead: {
      type: Boolean,
      default: false,
    },

    isMember: {
      type: Number,
      default: 0,
    },

    groupStatus: {
      type: Number,
      default: 0,
    },
  },

  computed: {
    inviteText() {
      return this.isMember ? '快去邀请小伙伴一起学习吧!' : '邀请你一起组队学习！';
    },
  },
};
</script>

<style lang="scss">
@import "var";

.invite-info {
  position: relative;
  display: flex;
  padding: 17px 0 10px;
  align-items: center;

  &__avatar {
    position: relative;

    .avatar-img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }

    .head-tag {
      position: absolute;
      top: 0;
      right: -10px;
      line-height: 1;

      /* color: $c-red-light;
      background-color: $c-white !important; */
    }
  }

  &__name {
    margin-left: 15px;
    font-size: 12px;
    line-height: 16px;
    color: $c-white;

    .nick {
      font-size: 13px;
    }
  }
}
</style>
