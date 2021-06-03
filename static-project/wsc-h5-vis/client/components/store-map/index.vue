<template>
  <div class="map-container">
    <div ref="mapBox" />
  </div>
</template>

<script>
import loadAMap from 'zan-utils/browser/loadAMap';
import { ajax } from '@youzan/vis-ui';
import { ZNB } from '@youzan/wxsdk';

export default {
  name: 'store-map',

  props: {
    useLocalAddress: {
      type: Boolean,
      default: false,
    },
    storeIds: {
      type: String,
      default: '[]',
    },
    longitude: {
      type: String,
      default: '',
    },
    latitude: {
      type: String,
      default: '',
    },
    name: {
      type: String,
      default: '',
    },
    province: {
      type: String,
      default: '',
    },
    city: {
      type: String,
      default: '',
    },
    district: {
      type: String,
      default: '',
    },
    address: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      env: '',
    };
  },

  mounted() {
    if (this.useLocalAddress) {
      this.getEnv()
        .then(() => {
          this.loadMap().then(() => this.showMap(this.$props));
        });
    } else {
      this.initMap();
    }
  },

  methods: {
    loadMap() {
      const options = {
        v: '1.4.2',
        key: 'd556dc1b176626ac55ce4a748c5bdb6d',
      };
      const num = 3;
      const callbackName = 'loadMap';

      return loadAMap(options, num, callbackName)
        .catch(err => {
          console.log(err);
        });
    },

    initMap() {
      this.loadMap()
        .then(res => {
          // 高德地图加载成功且参数挂载完毕
          this.$nextTick(() => {
            this.mapBox = this.$refs.mapBox;
            this.getAddressInfo()
              .then(res => {
                if (res && res.length > 0) {
                  const item = res[0];
                  this.getEnv()
                    .then(() => {
                      this.showMap({
                        name: item.name,
                        ...item.addressWrapDTO,
                      });
                    });
                }
              })
              .catch(err => {
                console.log(err);
              });
          });
        });
    },
    showMap(address) {
      this.timer = setTimeout(() => {
        const AMap = window.AMap; // 为什么要这样做?因为commit eslint报错 'AMap' is not defined
        if (AMap) {
          clearTimeout(this.timer);
          const longitude = address.longitude - 0.0065 || 0; // 将后端存的百度地图坐标系转成腾讯坐标系
          const latitude = address.latitude - 0.006 || 0; // 将后端存的百度地图坐标系转成腾讯坐标系
          this.name = address.name || '';
          this.detail = `${address.province}${address.city}${address.district}${address.address}`;
          this.mapBox = this.$refs.mapBox;
          this.map = new AMap.Map(this.mapBox, {
            resizeEnable: true,
            center: [longitude, latitude],
            zoom: 16,
          });
          this.initMarker(longitude, latitude); // 初始化标记
          this.initInfoWindow(); // 初始化信息窗口
          this.infoWindow.open(this.map, this.marker.getPosition()); // 显示信息窗口
          AMap.event.addListener(this.marker, 'click', () => {
            this.infoWindow.open(this.map, this.marker.getPosition());
          });
        }
      }, 100);
    },
    // 初始化标记
    initMarker(longitude, latitude) {
      const AMap = window.AMap; // 为什么要这样做？因为commit eslint报错 'AMap' is not defined
      this.map.clearMap();
      this.marker = new AMap.Marker({
        map: this.map,
        position: [longitude, latitude],
      });
    },
    getEnv() {
      return new Promise((resolve, reject) => {
        ZNB.getEnv().then(env => {
          if (env.platform === 'weapp') {
            this.env = 'weapp';
          }
          resolve();
        }).catch(() => {
          resolve();
        });
      });
    },
    // 初始化信息窗口
    initInfoWindow() {
      const AMap = window.AMap; // 为什么要这样做？因为commit eslint报错 'AMap' is not defined
      this.infoWindow = new AMap.InfoWindow({
        content: this.createInfoWindow(),
        offset: new AMap.Pixel(1, -25),
      });
    },
    createInfoWindow() {
      // 构建信息窗体中显示的内容
      var info = [];
      info.push(`<h1 class="name">${this.name}</h1>`);
      info.push(`<p class="detail">${this.detail}</p>`);
      if (this.env !== 'weapp' && this.env !== 'swan') {
        info.push(`<a href="https://m.amap.com/search/view/keywords=${this.detail}" class="btn go-address-btn">到这里去</a>`);
      }
      return info.join('');
    },
    // 获取地址信息
    getAddressInfo() {
      const kdtId = window._global.kdt_id || 0;
      return new Promise((resolve, reject) => {
        ajax({
          url: '/wscvis/edu/getAddressList.json',
          method: 'GET',
          data: {
            storeIds: this.storeIds || '[]',
            kdtId,
          },
        }).then(res => {
          if (res && res.length > 0) {
            resolve(res);
          } else {
            reject({
              message: '无法获取地址信息',
            });
          }
        })
          .catch(err => {
            reject(err);
          });
      });
    },
    getSearchKey(key = '') {
      let keyValObj;
      if (keyValObj) {
        return keyValObj[key] || null;
      }
      const search = window.location.search || '';
      if (search) {
        const keyValArr = search.split('?')[1].split('&') || [];
        keyValObj = {};
        keyValArr.forEach(item => {
          const [searchKey, searchVal] = item.split('=');
          keyValObj[searchKey] = searchVal;
        });
        return keyValObj[key] || null;
      }
      return null;
    },
  },
};
</script>

<style lang="scss">
html,
body,
.map-container,
.amap-container {
  width: 100%;
  height: 100%;
}
.amap-info-content {
  position: relative;
  padding-bottom: 30px;
}
.name {
  margin-bottom: 10px;
  line-height: 1.8;
  font-size: 13px;
  font-weight: bold;
  color: #111213;
}
.detail {
  line-height: 1.4;
  font-size: 12px;
  color: #111213;
}
.go-address-btn {
  display: inline-block;
  position: absolute;
  right: 5px;
  bottom: 5px;
  padding: 1px 3px;
  line-height: 1;
  height: 12px;
  font-size: 12px;
  text-align: center;
  color: #ccc;
  border: 1px solid #e5e5e5;
  border-radius: 3px;
}
</style>
