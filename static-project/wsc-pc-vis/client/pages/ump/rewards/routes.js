import { createRouter } from 'fns/router';
// import RewardsList from './containers/RewardsListPage';
import RecordsList from './containers/RecordsListPage';
import EditReward from './containers/EditRewardPage';
import TabWrapper from './NavWrapper';
import get from 'lodash/get';
import { REWARDS_TYPE_BREADCRUM } from './constants';

/**
 * @type {import('fns/router').IVisRoutes[]}
 */
const routes = [
  {
    path: 'rewardslist',
    component: TabWrapper,
    breadcrumb: '',
    onEnter() {},
  },
  {
    path: 'recordslist/:type',
    component: RecordsList,
    breadcrumb: '查看记录',
    onEnter() {},
  },
  {
    path: 'add',
    component: EditReward,
    breadcrumb: (nextState) => {
      const rewardType = get(nextState, 'location.query.type', 'processing');
      return `新建${REWARDS_TYPE_BREADCRUM[rewardType]}奖励`;
    },
    onEnter() {},
  },
  {
    path: 'edit/:id',
    component: EditReward,
    breadcrumb: (nextState) => {
      const rewardType = get(nextState, 'location.query.type', 'processing');
      return `编辑${REWARDS_TYPE_BREADCRUM[rewardType]}奖励`;
    },
    onEnter() {},
  },
  {
    path: 'view/:id',
    component: EditReward,
    breadcrumb: '查看奖励',
    onEnter() {},
  },
  {
    path: '*',
    redirect: 'rewardslist',
  },
];

// breadcrumb: nextState => {
//   const type = nextState.params.type;
//   return `编辑${types[type] || '内容'}`;
// },

export default createRouter(routes);
