
import root from './root';
import RecommendGift from '@/domain/recommend-gift/store';

export default {
  modules: {
    'recommend-gift': RecommendGift,
  },
  ...root,
};
