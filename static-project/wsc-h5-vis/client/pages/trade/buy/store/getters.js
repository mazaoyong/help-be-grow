import { designFilter } from '@/pages/trade/buy/common/design-filter';

const getters = {
  customDesign(state, getters) {
    return designFilter(state.design, { state, getters });
  },
};

export default getters;
