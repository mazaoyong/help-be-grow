import FamilyAccountInvite from './container/index.vue';
import FamilyAccountInviteSuccess from './container/success.vue';
import FamilyAccountInviteFail from './container/fail.vue';

const routes = [
  {
    name: 'FamilyAccountInvite',
    path: '/',
    component: FamilyAccountInvite,
    meta: {
      title: '链接主页',
      hideCopyright: true,
    },
  },
  {
    name: 'FamilyAccountInviteSuccess',
    path: '/success',
    component: FamilyAccountInviteSuccess,
    meta: {
      title: '邀请成功',
      hideCopyright: false,
    },
  },
  {
    name: 'FamilyAccountInviteFail',
    path: '/fail',
    component: FamilyAccountInviteFail,
    meta: {
      title: '链接失效',
      hideCopyright: false,
    },
  },
];

export default routes;
