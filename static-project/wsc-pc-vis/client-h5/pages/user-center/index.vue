<template>
  <div class="container">
    <user-header
      :icon="teacher.icon"
      :teacher-name="teacher.teacherName"
      :role-name="teacher.roleName"
      :mobile="teacher.mobile"
    />
    <user-label class="shop" @click.native="onSwitchShop">
      <span class="text text-left">当前机构</span>
      <span class="text text-right">
        {{ shopName }}
      </span>
      <vis-icon
        class="arrow-right"
        name="arrow"
        size="14px"
        color="#7d7e80"
      />
    </user-label>
    <user-label @click.native="onLogout">
      <span class="logout">退出登录</span>
    </user-label>

    <tab active="userCenter" />
  </div>
</template>

<script>
import { Icon } from '@youzan/vis-ui';
import { Toast } from 'vant';
import ZNB from '@youzan/znb';
import { userCenter, login } from 'pages-api';
import tab from 'components/tab/index.vue';
import userHeader from './components/user-header.vue';
import userLabel from './components/user-label.vue';

const DEFAULT_AVATER = 'https://b.yzcdn.cn/public_files/2019/03/21/b06c3be951d97fbe05f632bfd4b7771a.png';
const global = window._global;
const visUserInfo = global.visUserInfo || {};

ZNB.init({ kdtId: global.kdtId });

export default {
  name: 'user-center',
  components: {
    'vis-icon': Icon,
    'tab': tab,
    'user-header': userHeader,
    'user-label': userLabel,
  },
  data() {
    return {
      teacher: {
        icon: '', // 老师头像
        teacherName: '', // 老师昵称
        roleName: '', // 角色名称
        mobile: '', // 手机号
      },
      shopName: '', // 当前机构名称
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      Promise.all([userCenter.GetTeacherInfoById(), userCenter.GetShopInfoByKdtId()])
        .then(([teacherInfo, shopInfo]) => {
          this.teacher.icon = teacherInfo.avatar || DEFAULT_AVATER;
          this.teacher.teacherName = teacherInfo.staffName || '';
          this.teacher.roleName = teacherInfo.roleName || '';
          this.teacher.mobile = teacherInfo.mobile || '';
          this.shopName = shopInfo.shopName || '';
        }).catch(msg => {
          Toast(msg || '获取信息失败');
        });
    },
    // 切换店铺
    onSwitchShop() {
      window.location.href = '/v4/vis/h5/edu/shop-list';
    },
    // 退出登录
    onLogout() {
      const { mobile = '' } = global;
      // 退出登录的时候，小程序端做清除token的操作
      // wx.miniProgram.navigateTo({url: '/pages/login/index?pageType=LOGOUT'})
      login.Logout({
        mobileUser: {
          countryCode: visUserInfo.countryCode || '+86',
          mobile,
        },
      })
        .then(() => {
          ZNB.navigate({
            type: 'reLaunch',
            weappUrl: '/pages/login/index?pageType=LOGOUT',
          });
        })
        .catch(msg => {
          Toast(msg || '退出登录失败');
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  padding: 10px;
  width: 100%;
  min-height: 100%;
  background-color: #f7f8fa;
  .shop {
    display: flex;
    position: relative;
    .text {
      display: block;
      flex: 1;
      font-size: 14px;
      &-right {
        text-align: right;
        font-weight: bold;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .arrow-right {
      position: absolute;
      top: 50%;
      right: 5px;
      margin-top: -7px;
    }
  }
  .logout {
    font-size: 14px;
    color: #ff4444;
  }
}
</style>
