/**
 * Copy from wsc-h5-trade
 * 高德地图 SDK 封装
 */
import loadScript from './utils/browser/load-script';
import { stringifyAddress } from './utils/string/stringify-address';
import { gcjToBaidu } from './utils/gps-transform';

const SCRIPT_URL = 'https://webapi.amap.com/maps?v=1.4.14&key=d556dc1b176626ac55ce4a748c5bdb6d';

class Amap {
  constructor() {
    this.plugin = {};
    this.loaded = false;
  }

  // 加载高德 SDK seed
  loadMainScript() {
    if (!this.loadMainScriptPromise) {
      this.loadMainScriptPromise = loadScript(SCRIPT_URL).then(() => {
        if (window.AMap) {
          this.AMap = window.AMap;
          return this.loadPlugin();
        } else {
          throw new Error();
        }
      });
    }

    return this.loadMainScriptPromise;
  }

  // 加载地图插件
  // 目前用到相关地址匹配和获取地址定位两个插件
  loadPlugin() {
    return new Promise((resolve, reject) => {
      if (this.AMap.plugin) {
        this.AMap.plugin(['AMap.Autocomplete', 'AMap.Geocoder', 'AMap.Geolocation', 'AMap.PlaceSearch'], () => {
          this.plugin.geocoder = new this.AMap.Geocoder();
          this.plugin.autoComplete = new this.AMap.Autocomplete({
            citylimit: true,
            datatype: 'poi',
          });
          resolve();
        });
      } else {
        reject();
      }
    });
  }

  /**
   * 计算两点距离
   * a: [lng, lat]
   * b: [lng, lat]
   */
  getDistance(a, b) {
    return this.AMap.GeometryUtil.distance(a, b);
  }

  // 设置 autoComplete 所在城市
  setSearchCity(city) {
    const { autoComplete } = this.plugin;
    if (autoComplete) {
      autoComplete.setCity(city);
    }
  }

  // autoComplete 地址
  autoComplete(keyword) {
    return new Promise(resolve => {
      const { autoComplete } = this.plugin;
      if (!autoComplete) {
        return;
      }

      autoComplete.search(keyword, (status, result) => {
        if (status === 'complete' && result && result.tips) {
          const { tips } = result;

          if (!Array.isArray(tips)) {
            resolve(tips);
          }

          tips.forEach(item => {
            // 过滤掉空数组的 address 字段
            if (Array.isArray(item.address) && !item.address.length) {
              item.address = '';
            }

            // 如果存在相同的地名，则在 name 中补全省市区
            const sameTips = tips.filter(
              tip => item.address === tip.address && item.name === tip.name
            );
            if (sameTips.length > 1) {
              sameTips.forEach(tip => {
                tip.name = tip.district + tip.name;
              });
            }
          });

          const filterdTips = [];
          // 最后根据 name 做一次去重
          tips.forEach(item => {
            if (!filterdTips.filter(tip => tip.name === item.name).length) {
              filterdTips.push(item);
            }
          });

          resolve(filterdTips);
        } else if (status === 'no_data') {
          resolve([]);
        }
      });
    });
  }

  // 根据地址匹配对应的省区市
  getLocation(address) {
    return new Promise((resolve, reject) => {
      const { geocoder } = this.plugin;
      if (geocoder) {
        // 防止高德报错导致流程无法继续
        try {
          geocoder.getLocation(address, (status, result) => {
            if (status === 'complete') {
              resolve(result);
            } else {
              reject();
            }
          });
        } catch (err) {
          reject();
        }
      } else {
        reject();
      }
    });
  }

  // 补全地址的经纬度
  fillAddressLocation(address, callback) {
    this.getLocation(stringifyAddress(address))
      .then(result => {
        if (result && result.info === 'OK') {
          try {
            const { location } = result.geocodes[0];
            const baiduLocation = gcjToBaidu(location.lng, location.lat);
            address.lat = baiduLocation.lat;
            address.lon = baiduLocation.lng;
          } catch (error) {
            address.lat = '';
            address.lon = '';
          }
        }
        callback(address);
      })
      .catch(() => {
        callback(address);
      });
  }
}

export const amap = new Amap();
