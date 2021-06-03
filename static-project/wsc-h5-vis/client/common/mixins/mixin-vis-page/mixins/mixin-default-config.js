import { getDefaultConfig, getPageConfig } from '../utils';

const defaultConfig = getDefaultConfig();

export default {
  beforeCreate() {
    const { $options } = this;
    const pageConfig = getPageConfig()($options.name);
    $options.config = Object.assign({}, defaultConfig, pageConfig, $options.config);
  },
};
