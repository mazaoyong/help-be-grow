<template>
  <div class="block-user-login dropdown">
    <div v-if="hasLogin" class="dropdown-trigger">
      <img-wrap
        class="user-avatar"
        width="24px"
        height="24px"
        :src="userAvatar"
      />

      <span class="username">
        {{ username }}
      </span>

      <van-icon
        name="arrow-down"
        size="14px"
        color="#323233"
      />

      <div class="dropdown-menu">
        <div
          v-for="item in menuItems"
          :key="item.name"
          class="dropdown-menu-item"
          @click="item.handler"
        >
          {{ item.label }}
        </div>
      </div>
    </div>

    <div v-else class="dropdown-trigger" @click="login">
      登录
    </div>
  </div>
</template>

<script>
import { get } from 'lodash';
import { Icon as VanIcon } from 'vant';
import { ImgWrap } from '@youzan/vis-ui';
import UA from '@youzan/utils/browser/ua_browser';
import openLoginDialog from '../../components/dialog-login';
import { logout } from '../../apis';

function getDefaultAvatar() {
  const buyerAvatar = get(_global, 'visBuyer.finalAvatar', '');

  const isWeixinAvatar = buyerAvatar.indexOf('qlogo.cn') > -1;
  if (buyerAvatar && (UA.isWeixin() || !isWeixinAvatar)) {
    return buyerAvatar;
  }

  return 'https://img01.yzcdn.cn/public_files/2017/10/23/1321da81aa84d0539b0d5af73fbbf53b.png';
}

export default {
  name: 'block-user-login',

  components: {
    VanIcon,
    ImgWrap,
  },

  data() {
    return {
      hasLogin: _global.user.has_login,
      userAvatar: getDefaultAvatar(),
      username: _global.visBuyer.finalUsername || '',

      menuItems: [
        {
          name: 'logout',
          label: '退出登录',
          handler: () => {
            logout().finally(() => window.location.reload());
          },
        },
      ],
    };
  },

  methods: {
    login() {
      openLoginDialog();
    },
  },
};
</script>

<style lang="scss">
.block-user-login {
  font-size: 14px;
  line-height: 20px;
  color: #323233;

  .dropdown-menu {
    position: absolute;
    top: 30px;
    right: -11px;
    display: none;
    padding-top: 4px;
    background: #fff;
    border-radius: 2px;
    box-shadow: 0 2px 8px 0 rgba(200, 201, 204, .5);

    &::before {
      position: absolute;
      top: 50%;
      left: 50%;
      z-index: 0;
      width: calc(100% + 40px);
      height: calc(100% + 40px);
      content: '';
      transform: translate(-50%, -50%);
    }

    &::after {
      position: absolute;
      top: -7px;
      right: 12px;
      border-right: 7px solid transparent;
      border-bottom: 8px solid #fff;
      border-left: 7px solid transparent;
      content: '';
    }
  }

  .dropdown-trigger {
    position: relative;
    display: flex;
    cursor: pointer;
    align-items: center;

    &:hover {
      .dropdown-menu {
        display: block;
      }
    }
  }

  .dropdown-menu-item {
    position: relative;
    z-index: 1;
    padding: 12px 24px;
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    color: #323233;
    white-space: nowrap;
    cursor: pointer;
  }

  .user-avatar {
    display: inline-block;
  }

  .imgWrap__img {
    border-radius: 50%;
  }

  .username {
    margin-left: 8px;
  }

  .van-icon-arrow-down {
    margin-left: 8px;
  }
}
</style>
