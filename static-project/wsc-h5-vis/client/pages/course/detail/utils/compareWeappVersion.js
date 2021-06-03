import compareVersions from '@youzan/utils/string/compareVersions';
import { isRetailShop } from '@youzan/utils-shop';

const ERROR_NATIVE_WEAPP_VERSION_MIN = '2.53.2';
const ERROR_NATIVE_WEAPP_VERSION_MAX = '2.58.4';
const ERROR_NATIVE_RETAIL_WEAPP_VERSION_MIN = '3.17.2';
const ERROR_NATIVE_RETAIL_WEAPP_VERSION_MAX = '3.19.7';

const weappVersion = _global.weappVersion;

export default function isWeappRedirectToH5() {
  // 微商城小程序版本2.53.2至2.58.4和零售小程序版本3.17.2至3.19.7之间邀请卡页面分销员信息拼接有问题，
  // 邀请卡连接跳转到h5
  if (isRetailShop) {
    return compareVersions(weappVersion, ERROR_NATIVE_RETAIL_WEAPP_VERSION_MIN) > 0 &&
      compareVersions(ERROR_NATIVE_RETAIL_WEAPP_VERSION_MAX, weappVersion) > 0;
  }
  return compareVersions(weappVersion, ERROR_NATIVE_WEAPP_VERSION_MIN) > 0 &&
  compareVersions(ERROR_NATIVE_WEAPP_VERSION_MAX, weappVersion) > 0;
};
