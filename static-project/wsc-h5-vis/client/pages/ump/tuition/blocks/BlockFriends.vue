  <!-- 助力好友展示模块 -->
<template>
  <section class="friends-block">
    <section class="card" @click="onClickFriendsBlock">
      <friends-avatar-list :avatars="avatarList" />
      <div class="message">
        <span>{{ boostFriendsCount }}人已帮我攒</span>
        <van-icon name="arrow" />
      </div>
    </section>
    <vis-popup
      v-model="show"
      :title="`已有${boostFriendsCount}人帮我攒学费`"
      closeable
      class="friend-popup"
      :buttons="popupButton"
    >
      <vis-common-list :request="fetchBoostFriends">
        <div slot-scope="props" class="item van-hairline--bottom">
          <van-img
            :src="props.item.avatar | formatAvatar"
            round
            fit="contain"
            :width="36"
            :height="36"
            class="avatar"
          />
          <span class="name">{{ props.item.name | formatName }}</span>
          <span class="time">{{ props.item.helpTime | relativeTime }}</span>
        </div>
      </vis-common-list>
    </vis-popup>
  </section>
</template>

<script>
import Vue from 'vue';
import { Icon as VanIcon, Image as VanImg } from 'vant';
import { Popup as VisPopup, CommonList as VisCommonList } from '@youzan/vis-ui';

import getRelativeTime from '@/common/utils/getRelativeTime';

import FriendsAvatarList from '../components/FriendsAvatarList.vue';
import { getListHelperPagedJson } from '../api';

import { DEFAULT_AVATAR } from '../constants';
import { mapGetters, mapState } from 'vuex';
export default Vue.extend({
  name: 'block-friends',
  components: {
    VanImg,
    VanIcon,
    VisPopup,
    VisCommonList,
    FriendsAvatarList,
  },
  filters: {
    relativeTime(value) {
      return getRelativeTime(value);
    },
    formatName(name) {
      return name || '小伙伴';
    },
    formatAvatar(src) {
      return src || DEFAULT_AVATAR;
    },
  },
  data() {
    return {
      show: false,
      params: { page: 1, pageSize: 10 },

    };
  },
  computed: {
    ...mapGetters([
      'instanceId',
      'popupFriendsButton',
    ]),
    ...mapState([
      'boostFriends',
      'boostFriendsCount',
    ]),
    avatarList() {
      return this.boostFriends.map(item => item.avatar || DEFAULT_AVATAR);
    },
    popupButton() {
      const { isVisible, text, action } = this.popupFriendsButton;
      if (!isVisible) {
        return [];
      }
      return [
        {
          text,
          color: '#FF6713',
          // onClick为使用getOpenPopup特别适配过了，当使用getOpenPopup的时候，第一个返回的参数会是$slot.defalut[0]的实例
          onClick: () => {
            // eslint-disable-next-line vue/no-side-effects-in-computed-properties
            this.show = false;
            this.$store.dispatch(action);
          },
        },
      ];
    },
  },
  methods: {
    onClickFriendsBlock() {
      this.show = true;
    },
    fetchBoostFriends(params) {
      // 抽取转换函数
      const { page, pageSize } = params;

      return getListHelperPagedJson(this.instanceId, page, pageSize).then(data => {
        const { content, totalPages } = data;
        return {
          list: content,
          hasNext: page < totalPages,
        };
      });
    },
  },
});
</script>

<style lang="scss" scoped>
.friends-block {
  margin: 12px auto 0;
  background: #ffffff;
  border-radius: 8px;
  padding: 16px 0;
  section.card {
    display: flex;
    justify-content: center;
    align-items: center;
    .message {
      padding: 3px 8px;
      background-color: #f2f3f5;
      color: #646566;
      font-size: 14px;
      border-radius: 999px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-left: 4px;
    }
  }
}
.friend-popup {
  .item {
    margin: 0 16px;
    display: flex;
    align-items: center;
    padding: 12px 8px;
    border: 0 solid #ebedf0;
    span.name {
      flex: 1;
      padding: 0 16px;
      font-size: 14px;
      color: #323233;
      line-height: 18px;
    }
    span.time {
      font-size: 14px;
      color: #969799;
      line-height: 18px;
    }
  }
}
</style>
