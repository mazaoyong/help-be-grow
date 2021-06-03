import { Notify, Sweetalert } from 'zent';
import ajax from 'zan-pc-ajax';
import find from 'lodash/find';
import isString from 'lodash/isString';
import isArray from 'lodash/isArray';
import assign from 'lodash/assign';
import get from 'lodash/get';
import has from 'lodash/has';
import YZLocalStorage from '@youzan/utils/browser/local_storage';
import { isNewVersion } from 'fns/check-weapp-version';
import { NEW_WEAPP_VERSION } from './constants';

export const RELEASED_VERSION_STORAGE_KEY = 'weapp-released-version';

/**
 * 获取第一个校验错误的design组件
 * @param {*} errors
 */
export function getFirstDesignError(errors) {
  if (!errors) {
    return '';
  }

  if (isString(errors)) {
    return errors;
  }

  const firstErrorMap = find(errors, err => err && Object.keys(err).length > 0);
  const firstError = firstErrorMap[Object.keys(firstErrorMap)[0]];

  if (isArray(firstError)) {
    if (isString(firstError[0])) {
      return find(firstError, item => item !== '');
    }
    return firstError[0][Object.keys(firstError[0])[0]];
  }
  return firstError;
}

/**
 * 获取分类模板组件校验结果
 * @param {*} errors
 */
export function getClassificationFirstDesignError(errors) {
  const firstErrorMap = find(errors, err => err && Object.keys(err).length > 0);
  // 分类模板吐出来的所有错误数组
  const firstError = firstErrorMap[Object.keys(firstErrorMap)[0]];
  let errorData;
  let errorKey;
  let errorText;
  let errorNumber;

  if (isArray(firstError) && firstError.length > 0) {
    errorData = find(firstError, (errorItem, idx) => {
      errorKey = find(Object.keys(errorItem), key => {
        return errorItem[key] && errorItem[key].isShowError;
      });
      errorText = errorKey && errorItem[errorKey].text;
      errorNumber = idx;
      return errorText;
    });
  }

  if (errorData) {
    return `分类${errorNumber + 1}: ${errorText}`;
  }
  return null;
}

/**
 * 判断是否开通小程序代销
 */
export function checkIsWxPayBig() {
  return new Promise((resolve, reject) => {
    ajax({
      url: `${window._global.url.www}/weapp/config/paymentSettings.json`,
    })
      .then(res => {
        if (res.WX_APPLET_BIG) {
          resolve();
        } else {
          reject();
        }
      })
      .catch(err => {
        Notify.error(err);
        reject();
      });
  });
}

/**
 * 判断发布版本号是否大于某一版本
 */
export function checkIsNeedUpgrade(comparedVersion) {
  return new Promise((resolve, reject) => {
    let releasedVersion = '';
    try {
      releasedVersion = YZLocalStorage.getItem(RELEASED_VERSION_STORAGE_KEY);
    } catch (ex) {
      releasedVersion = '';
    }

    if (!releasedVersion) {
      ajax({
        url: `${window._global.url.www}/weapp/config/config.json`,
      })
        .then(res => {
          if (!res) {
            reject();
          }
          releasedVersion = res.releasedVersion;

          YZLocalStorage.setItem(RELEASED_VERSION_STORAGE_KEY, releasedVersion);
          checkVersion(releasedVersion, comparedVersion, resolve, reject);
        })
        .catch(err => {
          Notify.error(err);
          reject();
        });
    } else {
      checkVersion(releasedVersion, comparedVersion, resolve, reject);
    }
  });
}

/**
 * 比较版本号
 */
let versionArrIndex = 0;
function versionCompare(target, comparison) {
  const targetArr = target.split('.');
  const comparisonArr = comparison.split('.');
  if (!target || !comparison) {
    return false;
  }
  return compareVersionArr(targetArr, comparisonArr);
}

function compareVersionArr(targetArr, comparisonArr) {
  if (targetArr[versionArrIndex] > comparisonArr[versionArrIndex]) {
    return targetArr[versionArrIndex] - comparisonArr[versionArrIndex];
  }
  if (targetArr[versionArrIndex] < comparisonArr[versionArrIndex]) {
    return targetArr[versionArrIndex] - comparisonArr[versionArrIndex];
  }
  if (targetArr[versionArrIndex] === comparisonArr[versionArrIndex]) {
    if (versionArrIndex === comparisonArr.length - 1) {
      versionArrIndex = 0;
      return 0;
    }
    versionArrIndex++;
    return compareVersionArr(targetArr, comparisonArr);
  }
}

function checkVersion(releasedVersion, comparedVersion, resolve, reject) {
  if (
    versionCompare(releasedVersion, comparedVersion) !== false &&
    versionCompare(releasedVersion, comparedVersion) >= 0
  ) {
    resolve();
  } else {
    reject();
  }
}

/**
 * 是否能添加拼团组件
 */
export function shouldCreateGroupon() {
  return new Promise((resolve, reject) => {
    Promise.all([checkIsWxPayBig(), checkIsNeedUpgrade('1.8.0')])
      .then(() => {
        resolve();
      })
      .catch(() => {
        reject();
        grouponNotify();
      });
  });
}

/**
 * 添加拼团提醒弹窗
 */
function grouponNotify() {
  Sweetalert.confirm({
    title: '温馨提示',
    content: '你需要把小程序升级到最新版本并开通微信代销，才可以使用拼团功能。',
    confirmText: '去设置',
    onConfirm: () => {
      window.location = `${window._global.url.www}/weapp/setting#/pay`;
    },
  });
}

/**
 * 是否能保存默认模板
 */
export function shouldSaveDefaultTempl() {
  return new Promise((resolve, reject) => {
    checkIsNeedUpgrade('1.11.0')
      .then(() => {
        resolve();
      })
      .catch(() => {
        reject();
        saveDefaultTemplNotify();
      });
  });
}

/**
 * 保存默认模板提醒弹窗
 */
function saveDefaultTemplNotify() {
  Sweetalert.confirm({
    title: '升级提醒',
    content:
      '你当前操作的是默认模板，我们对此模板进行了升级，你需更新小程序，待新版审核通过后即可使用。',
    cancelText: '暂不更新',
    confirmText: '更新',
    onConfirm: () => {
      window.location = `${window._global.url.www}/weapp/setting#/setting`;
    },
  });
}

/**
 * 获取默认编辑第几个组件num
 * @param {*} model
 * @param {*} type
 */
export function displayEditorNum(model, type) {
  let number;
  if (type === 'default') {
    number = model.length > 1 ? 2 : -1;
  } else {
    number = model.length > 0 ? 0 : -1;
  }
  return number;
}

/**
 * 判断是否使用共享版有赞小程序，use_common是true
 * 共享版的状态，专享版 is_valid 必须是false
 */
export function hasUseCommonWeapp() {
  const isValid = !!(_global.has_order_weapp || {}).isValid;
  if (isValid) {
    return false;
  }
  return !!(_global.has_order_weapp || {}).useCommon;
}

/**
 * 判断是否使用专享版有赞小程序
 */
export function isVip() {
  return !!(_global.has_order_weapp || {}).isValid;
}

/**
 * 格式化config里面的category
 * @param {*} category
 */
export function formatCategory(category) {
  const newCategory = [];
  if (isArray(category) && category.length > 0) {
    category.forEach(item => {
      newCategory.push(item);
    });
  }
  return newCategory;
}

/**
 * 获取保存的微页面data
 * @param {*} data 微页面数据
 * @param {*} config 页面的配置(是更新还是新建，更新话，有alias))
 * @param {*} extraConfig 页面button loading 和 is_display信息
 */
export function getSavedDesignData(args) {
  const { components, config, extraConfig, categoryIds } = args;
  const { isCreate } = config;
  const isDisplay = {
    is_display: extraConfig.is_display,
  };
  const createData = assign(
    {},
    {
      is_display: 1,
      platform: 3,
      template_id: config.templateId,
      title: config.title,
      components,
    },
    isDisplay
  );

  const editData = assign(
    {},
    {
      is_display: 1,
      platform: 3,
      id: config.id,
      title: config.title,
      components,
    },
    isDisplay
  );

  const param = isCreate ? createData : editData;

  if (isArray(categoryIds) && categoryIds.length) {
    // 转成数字
    const newCategoryIds = categoryIds.map(categoryId => {
      return +categoryId;
    });
    param.categoryIds = newCategoryIds;
  }

  // 精简版店铺额外传的参数popularize (20180815)
  if (has(extraConfig, 'isSimplification')) {
    param.popularize = 1;
  }

  return param;
}

// 是否为新版小程序
export function isNewWeappVersion() {
  return isNewVersion(NEW_WEAPP_VERSION);
}

// 判断是否为旧模板
export function isOldTemplate(templateId) {
  // 判断是否为老模板：template_id 2-18
  let oldTemplateTag = false;
  if (templateId > 1 && templateId < 19) {
    oldTemplateTag = true;
  }
  return oldTemplateTag;
}

/**
 * 判断店铺是否绑定过腾讯广点通账号
 */
export function needShowPopularize() {
  return get(window._global, 'shop_bind_tx_config', false);
}
