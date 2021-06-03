import { Toast } from 'vant';

// 获取用户位置
export default function getUserPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject({
        message: '用户手机不支持定位API',
      });
      return;
    }
    Toast.loading({
      mask: true,
      duration: 0,
      message: '获取定位中...',
    });
    navigator.geolocation.getCurrentPosition((position) => {
      const latitude = position.coords.latitude; // 纬度
      const longitude = position.coords.longitude; // 经度
      Toast.clear();
      resolve({
        latitude,
        longitude,
      });
    }, (err) => {
      Toast.clear();
      reject(err);
    });
  });
}
