import configs from '../configs';
import get from 'lodash/get';

const appType = location.href.indexOf('wscvis') > -1 ? 'h5' : 'weapp';
const versionCode = get(_global, 'versionStatus.versionCode', 'edu_profession_version');
let currentShopVersion = versionCode === 'edu_base_version' ? 'Basic' : 'Pro';
// currentShopVersion = currentShopVersion.replace(/^(.)(.*)$/, (m, p1, p2) => `${p1.toUpperCase()}${p2}`);

export const getTargetType = (name) => {
  if (!name || !currentShopVersion) return '';

  const config = get(configs[`${appType}${currentShopVersion}`], name);
  if (config && isConfigValid(config, config.type)) {
    return config.type;
  }
  return '';
};

export const getEffectsByName = (name, downgrade) => {
  if (!name || !currentShopVersion) return [];

  const config = get(configs[`${appType}${currentShopVersion}`], name);

  if (config && isConfigValid(config, config.type)) {
    // 判断是否取降级配置
    if (get(downgrade, 'from', false)) {
      return config.downgradeConfigs;
    }

    return config.configs;
  }

  return [];
};

export const isConfigValid = (config, type) => !!config && (config.type === type || config.type === undefined);
