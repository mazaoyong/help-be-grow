const lodash = require('lodash');

const NODE_ENV = process.env.NODE_ENV;
const envPath = `../../config/config.${NODE_ENV}.js`;
const envConfig = require(envPath);

const utils = {
  getConfig(name) {
    return lodash.get(envConfig, name);
  },

  /**
   * 把陀峰结构转为下划线结构，会循环递归转换所有的key值
   * @param {Array|Object} data
   */
  toSnakeCase(data) {
    if (Array.isArray(data)) {
      return data.map(item => this.toSnakeCase(item));
    }

    if (lodash.isPlainObject(data)) {
      return Object.keys(data).reduce((newObj, key) => {
        newObj[lodash.snakeCase(key)] = this.toSnakeCase(data[key]);
        return newObj;
      }, {});
    }

    return data;
  },

  toCamelCase(data) {
    if (Array.isArray(data)) {
      return data.map(item => this.toCamelCase(item));
    }

    if (lodash.isPlainObject(data)) {
      return lodash.mapKeys(data, (value, key) => lodash.camelCase(key));
    }

    return data;
  },
  /**
   * 解析apollo配置的切流决策
   * apollo的文本配置以半角逗号分隔，百分比值写在第一项，其次白名单，最后黑名单
   * 遇到0或者0%会判为不匹配
   * '%1,491391,603367,-160,-11998'
   * const useNew = isInGrayReleaseByKdtId(ctx, { namespace: '', key: '' }, kdtId);
   */
  matchGrayConfig(config, kdtId) {
    const kdtIdList = config.split(',');
    // 先判断0或者黑名单的情况
    if (kdtIdList.includes('0') || kdtIdList.includes('0%') || kdtIdList.includes('-' + kdtId)) {
      return false;
    } else if (kdtIdList.includes(String(kdtId))) {
      // kdtId全匹配
      return true;
    } else if (config.indexOf('%') > 0) {
      // 百分比判断
      const percentArr = kdtIdList
        .filter(singleConfig => {
          return singleConfig.endsWith('%');
        })
        .map(singleConfig => {
          return singleConfig.slice(0, singleConfig.length - 1);
        });
      if (percentArr && percentArr.length) {
        // 只取第一个百分比配置
        const onlyPercent = Number(percentArr[0]);
        return !!(onlyPercent >= 0 && onlyPercent <= 100 && Number(kdtId) % 100 <= onlyPercent);
      } else {
        return false;
      }
    } else {
      return false;
    }
  },
};

module.exports = utils;
