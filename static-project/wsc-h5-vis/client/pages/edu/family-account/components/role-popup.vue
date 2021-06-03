<template>
  <vis-standard-popup
    v-model="show"
    title="选择身份"
    closeable
    class="role-popup"
  >
    <ul
      v-if="list.length"
      class="role-popup_card"
    >
      <li
        v-for="(item, index) in list"
        :key="index"
        :class="{ 'bind': !item.canInvite }"
        class="role-popup_card-item"
        @click="invite(item)"
      >
        <vis-icon
          v-theme.main="`color${item.canInvite ? '!important' : ''}`"
          :name="roleIcons[item.role - 1]"
          size="48px"
          :color="item.canInvite ? '#00B389' : '#DCDEE0'"
          class="avatar"
        />
        <div class="info">
          <p class="name">
            {{ item.desc }}
          </p>
          <p class="desc">
            {{ parseNumDesc(item) }}
          </p>
        </div>
        <vis-icon v-if="item.canInvite" name="arrow" />
      </li>
    </ul>
  </vis-standard-popup>
</template>
<script>
import { Toast } from 'vant';
import { Icon, Popup } from '@youzan/vis-ui';
import { invite } from '../api';
export default {
  name: 'role-popup',

  components: {
    'vis-standard-popup': Popup,
    'vis-icon': Icon,
  },

  props: {
    value: {
      type: Boolean,
      default: false,
    },

    roleList: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      list: [],
      roleIcons: ['father', 'mother', 'grandfather', 'grandmother', 'grandfather', 'grandmother', 'children'],
      isCanInvite: true,
    };
  },

  computed: {
    show: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      },
    },
  },

  watch: {
    roleList: {
      handler(list) {
        if (list.length) {
          this.sortRole(list);
        }
      },
      immediate: true,
    },
  },

  methods: {
    invite(item) {
      if (!item.canInvite || !this.isCanInvite) {
        return;
      }
      this.isCanInvite = false;
      invite({
        role: item.role,
        invitedMember: {
          avatar: '',
          name: '',
        },
      })
        .then(res => {
          if (res.url) {
            this.show = false;
            this.$emit('invite', item, res);
          } else {
            Toast('家庭账号成员数量超出限制');
          }
        })
        .catch(() => {
          Toast('生成邀请链接失败，请稍后再试~');
        })
        .finally(() => {
          this.isCanInvite = true;
        });
    },

    // 已邀请的放在后面，未邀请的放在前面，同时两者都需要按照角色的固定顺序排列
    sortRole(list) {
      let originRoleList = list.slice();
      let canInviteRoleList = [];
      let canNotInviteRoleList = [];
      originRoleList.forEach(item => {
        if (item.canInvite) {
          canInviteRoleList.push(item);
        } else {
          canNotInviteRoleList.push(item);
        }
      });
      canInviteRoleList = canInviteRoleList.sort((a, b) => a.role - b.role);
      canNotInviteRoleList = canNotInviteRoleList.sort((a, b) => a.role - b.role);

      this.list = [...canInviteRoleList, ...canNotInviteRoleList];
    },

    parseNumDesc(item) {
      const { limitNum = 0, existNum = 0, canInvite = true } = item;
      const restNum = limitNum - existNum;
      return !canInvite ? '已达到添加上限' : limitNum > 1 && existNum !== 0 ? `可再添加${restNum}位` : `可添加${restNum}位`;
    },
  },
};
</script>
<style lang="scss">
.role-popup {
  &_card {
    padding: 12px;
    background-color: #f5f5f5;
    color: #969799;;

    &-item {
      display: flex;
      padding: 14px 12px 14px 16px;
      margin-bottom: 12px;
      align-items: center;
      background-color: #fff;
      border-radius: 4px;

      &:last-child {
        margin-bottom: 0;
      }

      .avatar {
        margin-right: 26px;
      }

      .info {
        flex: 1;
        color: #969799;
      }

      .name {
        font-size: 16px;
        color: #323233;
      }

      .desc {
        margin-top: 9px;
        font-size: 13px;
      }

      &.bind {
        .info {
          .name,
          .desc {
            color: #C8C9CC;
          }
        }
      }
    }
  }
}

</style>
