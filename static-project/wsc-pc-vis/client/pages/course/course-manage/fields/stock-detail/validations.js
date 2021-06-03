// import Env from '../../common/env';

export default {
  priceRange(values, value, range) {
    return (
      isNaN(value) ||
      typeof range.min === 'undefined' ||
      typeof range.max === 'undefined' ||
      (+value >= +range.min && +value <= +range.max)
    );
  },
};
