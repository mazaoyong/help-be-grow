import { reduce } from 'lodash';

interface DesignItem {
  type: string,
};

interface Design {
  header: DesignItem[],
  main: DesignItem[],
  detail: DesignItem[],
  aside: DesignItem[],
  left: DesignItem[],
  right: DesignItem[],
  footer: DesignItem[],
};

const config = {
  LIVE: {
    goodsType: 5,
    key: 'live',
    spm: 'pcl',
    goodsIdKey: 'goodsId',
    isLockKey: 'isLock',
    design: {
      header: [
        { type: 'block-logo' },
        { type: 'block-user-login' },
      ],
      main: [
        { type: 'block-cover' },
        { type: 'block-base-info' },
      ],
      detail: [
        { type: 'block-detail' },
      ],
      aside: [
        { type: 'block-mobile-qrcode' },
        { type: 'block-shop-qrcode' },
      ],
      left: [],
      right: [],
      footer: [],
    },
  },
};

export const { keyMap, spmMap, goodsIdKeyMap, isLockKeyMap, designMap } = reduce(config, (obj, item) => {
  obj.keyMap[item.goodsType] = item.key;
  obj.spmMap[item.goodsType] = item.spm;
  obj.goodsIdKeyMap[item.goodsType] = item.goodsIdKey;
  obj.isLockKeyMap[item.goodsType] = item.isLockKey;
  obj.designMap[item.goodsType] = item.design;
  return obj;
}, {
  keyMap: {} as {
    [prop: number]: string
  },
  spmMap: {} as {
    [prop: number]: string
  },
  goodsIdKeyMap: {} as {
    [prop: number]: string
  },
  isLockKeyMap: {} as {
    [prop: number]: string
  },
  designMap: {} as {
    [props: number]: Design
  },
});
