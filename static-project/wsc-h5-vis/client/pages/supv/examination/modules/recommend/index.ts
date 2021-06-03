import createModule from '@/common/plugins/module/createModule';
import BlockRecommendList from './blocks/RecommendList.vue';
import store from './store';

export default createModule({
  name: 'recommend',
  component: BlockRecommendList as any,
  store,
});
