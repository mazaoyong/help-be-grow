import createModule from '@/common/plugins/module/createModule';
import AnswerPopup from './blocks/AnswerPopup.vue';
import ReviewPopup from './blocks/ReviewPopup.vue';
import ResultCardBlock from './blocks/ResultCard.vue';
import store from './store';
import InitMixin from './mixins/init';
import { withMixin } from './utils';

export const createAnswer = createModule({
  name: 'answerCard',
  components: {
    answer: withMixin(AnswerPopup, InitMixin) as any,
    review: withMixin(ReviewPopup, InitMixin) as any,
  },
  store,
  methods: {
    showPopup() {
      this.componentInstance.showPopup();
    },
  },
});

export const createResult = createModule({
  name: 'answerCard',
  component: withMixin(ResultCardBlock, InitMixin) as any,
  store,
});
