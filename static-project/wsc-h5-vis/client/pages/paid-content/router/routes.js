const AllColumns = r => require.ensure([], () => r(require('../containers/all-columns/index.vue')), 'paid-content/all-columns');
const AllContents = r => require.ensure([], () => r(require('../containers/all-contents/index.vue')), 'paid-content/all-contents');
const AllLives = r => require.ensure([], () => r(require('../containers/all-lives/index.vue')), 'paid-content/all-lives');
const AllBenefits = r => require.ensure([], () => r(require('../containers/all-benefits/index.vue')), 'paid-content/all-benefits');
const ColumnShow = r => require.ensure([], () => r(require('../containers/column-show/index.vue')), 'paid-content/column-show');
const ContentShow = r => require.ensure([], () => r(require('../containers/content-show/index.vue')), 'paid-content/content-show');
const VipBenefitShow = r => require.ensure([], () => r(require('../containers/benefit-show/index.vue')), 'paid-content/vip-benefit-show');
const MyPay = r => require.ensure([], () => r(require('../containers/my-pay/index.vue')), 'paid-content/my-pay');
const VipBenefitDesc = r => require.ensure([], () => r(require('../containers/benefit-desc/index.vue')), 'paid-content/vip-benefit-desc');
const WriteComment = r => require.ensure([], () => r(require('../containers/write-comment/index.vue')), 'paid-content/write-comment');
const GrouponInvitation = r => require.ensure([], () => r(require('../containers/groupon-invitation/index.vue')), 'paid-content/groupon-invitation');
const GiftShow = r => require.ensure([], () => r(require('../containers/gift-show/index.vue')), 'paid-content/gift-show');
const SupportInvitation = r => require.ensure([], () => r(require('../containers/support-invitation/index.vue')), 'paid-content/support-invitation');
const Lecturer = r => require.ensure([], () => r(require('../containers/lecturer/index.vue')), 'paid-content/lecturer');
const LecturerEdit = r => require.ensure([], () => r(require('../containers/lecturer-edit/index.vue')), 'paid-content/lecturer-edit');
const LiveRoom = r => require.ensure([], () => r(require('../containers/live-chat/pages/live-room/index.vue')), 'paid-content/live-chat');
const LiveDetail = r => require.ensure([], () => r(require('../containers/live-detail/index.vue')), 'paid-content/live-detail');
const BeLector = r => require.ensure([], () => r(require('../containers/be-lector/index.vue')), 'paid-content/be-lector');
const InviteCard = r => require.ensure([], () => r(require('../containers/invite-card/index.vue')), 'paid-content/invite-card');
const Preview = r => require.ensure([], () => r(require('../containers/preview/index.vue')), 'paid-content/preview');
const ReferralInvite = r => require.ensure([], () => r(require('../containers/referral-invite/index.vue')), 'paid-content/referral-invite');
const Profit = r => require.ensure([], () => r(require('../containers/profit/index.vue')), 'paid-content/profit');
const ProfitList = r => require.ensure([], () => r(require('../containers/profit-list/index.vue')), 'paid-content/profit-list');
const Lock = r => require.ensure([], () => r(require('../containers/lock/index.vue'), 'paid-content/lock'));

const routes = [
  { name: 'AllColumns', path: '/allcolumns', component: AllColumns },
  { name: 'ColumnShow', path: '/columnshow', component: ColumnShow },
  { name: 'AllContents', path: '/allcontents', component: AllContents },
  { name: 'ContentShow', path: '/contentshow', component: ContentShow },
  { name: 'GiftShow', path: '/giftshow', component: GiftShow },
  { name: 'GrouponInvitation', path: '/grouponinvitation', component: GrouponInvitation },
  { name: 'SupportInvitation', path: '/supportinvitation', component: SupportInvitation },
  { name: 'MyPay', path: '/mypay', component: MyPay },
  { name: 'VipBenefit', path: '/vipbenefit', component: VipBenefitShow },
  { name: 'VipBenefitDesc', path: '/vipbenefitdesc', component: VipBenefitDesc },
  { name: 'WriteComment', path: '/writecomment', component: WriteComment },
  { name: 'AllLives', path: '/alllives', component: AllLives },
  { name: 'LiveDetail', path: '/livedetail', component: LiveDetail },
  { name: 'BeLector', path: '/belector', component: BeLector },
  { name: 'AllMembers', path: '/allmembers', component: AllBenefits },
  { name: 'Lecturer', path: '/lecturer', component: Lecturer },
  { name: 'LecturerEdit', path: '/lectureredit', component: LecturerEdit },
  { name: 'LiveRoom', path: '/liveroom', component: LiveRoom },
  { name: 'InviteCard', path: '/invitecard', component: InviteCard },
  { name: 'Preivew', path: '/preview', component: Preview },
  { name: 'ReferralInvite', path: '/referralinvite', component: ReferralInvite },
  { name: 'Profit', path: '/profit', component: Profit },
  { name: 'ProfitList', path: '/profitlsit', component: ProfitList },
  { name: 'Lock', path: '/lock', component: Lock },
  { name: 'AllColumns', path: '*', component: AllColumns },
];

export default routes;
