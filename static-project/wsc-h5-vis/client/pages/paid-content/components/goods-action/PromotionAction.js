import GoodsAction from './index.vue';
import PromotionMixin from './mixins/PromotionMixin';

export default Object.assign(
  Object.create(null),
  GoodsAction,
  { mixins: [PromotionMixin] }
);
