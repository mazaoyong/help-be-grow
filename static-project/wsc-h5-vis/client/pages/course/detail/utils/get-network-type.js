import { ZNB } from '@youzan/wxsdk';

export default function getNetworkType() {
  return new Promise((resolve, reject) => {
    ZNB.init({
      kdtId: _global.kdt_id,
    });

    ZNB.getWx()
      .then(wx => {
        wx.getNetworkType({
          success(res) {
            resolve(res.networkType);
          },
          fail(msg) {
            reject(msg);
          },
        });
      }).catch(() => {});
  });
}
