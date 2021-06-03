import { checkIsLiteAdmin, getLiteStoreList } from './api';

export function getLiteInfo() {
  return isLiteAdmin().then(flag => {
    if (flag) {
      return getLiteStoreList().then(res => {
        const currentRes = (res.items || []).map(item => {
          return {
            key: item?.storeKdtId,
            text: item?.storeName,
            value: item?.storeKdtId,
          };
        });

        return {
          isLite: true,
          currentRes,
        };
      });
    } else {
      return {
        isLite: false,
        currentRes: [],
      };
    }
  });
}

export function isLiteAdmin() {
  return checkIsLiteAdmin().then(res => {
    return res;
  });
}
