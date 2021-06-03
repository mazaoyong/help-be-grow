<template>
  <div class="invite-info">
    <div class="invite-info__avatar">
      <img
        :src="inviteInfo.fansPicture"
        class="avatar-img"
      >
      <van-tag
        v-if="inviteInfo.isHead"
        v-theme.main="'color'"
        class="head-tag"
        round
      >
        团长
      </van-tag>
    </div>
    <div class="invite-info__name">
      <p class="nick">
        {{ inviteInfo.fansNickName }}
      </p>
      <p
        class="invite-text"
      >
        {{ inviteText }}
      </p>
    </div>
  </div>
</template>

<script>
import { Tag } from 'vant';
import { mapState } from 'vuex';

export default {
  name: 'invite-info',

  components: {
    [Tag.name]: Tag,
  },

  computed: {
    ...mapState(['inviteInfo', 'isJoinedGroup']),
    inviteText() {
      return this.isJoinedGroup ? '快去邀请小伙伴一起学习吧!' : '邀请你一起组队学习！';
    },
  },
};
</script>

<style lang="scss" scoped>
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
      top: -8px;
      right: -10px;
      line-height: 1;
      background-color: #fff;
    }
  }

  &__name {
    margin-left: 15px;
    line-height: 16px;
    font-size: 12px;
    color: $c-white;

    .nick {
      font-size: 13px;
    }
  }
}
</style>
