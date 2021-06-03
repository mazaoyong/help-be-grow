import { reduce } from 'lodash';

interface DesignItem {
  type: string,
};

interface Design {
  top: DesignItem[],
  pic: DesignItem[],
  main: DesignItem[],
  bottom: DesignItem[],
};

const config = {
  COLUMN: {
    goodsType: 1,
    key: 'column',
    spm: 'pcm',
    goodsIdKey: 'goodsId',
    isLockKey: 'isLock',
    design: {
      top: [{
        type: 'preview-qrcode-block',
      }, {
        type: 'campus-switch-block',
      }, {
        type: 'visit-gift-block',
      }, {
        type: 'gift-receive-block',
      }, {
        type: 'column-update-notice-block',
      }],
      pic: [{
        type: 'pct-image-block',
      }],
      main: [{
        type: 'ump-block',
      }, {
        type: 'column-tab-block',
      }, {
        type: 'base-info-block',
      }, {
        type: 'group-buy-block',
      }, {
        type: 'join-group-block',
      }, {
        type: 'promotion-block',
      }, {
        type: 'tuition-block',
      }, {
        type: 'service-block',
      }, {
        type: 'package-buy-block',
      }, {
        type: 'intro-block',
      }, {
        type: 'price-desc-block',
      }, {
        type: 'course-exam-block',
      }, {
        type: 'column-free-block',
      }, {
        type: 'column-catalogue-block',
      }, {
        type: 'present-block',
      }, {
        type: 'share-block',
      }, {
        type: 'popup-block',
      }],
      bottom: [{
        type: 'submit-block',
      }],
    },
  },
  FX_COLUMN: {
    goodsType: 2,
    key: 'sellerColumn',
    spm: 'pcm',
    goodsIdKey: 'sellerColumn.goodsId',
    isLockKey: 'sellerColumn.isLock',
    design: {
      top: [{
        type: 'preview-qrcode-block',
      }, {
        type: 'campus-switch-block',
      }, {
        type: 'visit-gift-block',
      }, {
        type: 'gift-receive-block',
      }, {
        type: 'column-update-notice-block',
      }],
      pic: [{
        type: 'pct-image-block',
      }],
      main: [{
        type: 'ump-block',
      }, {
        type: 'column-tab-block',
      }, {
        type: 'base-info-block',
      }, {
        type: 'group-buy-block',
      }, {
        type: 'join-group-block',
      }, {
        type: 'promotion-block',
      }, {
        type: 'service-block',
      }, {
        type: 'tuition-block',
      }, {
        type: 'package-buy-block',
      }, {
        type: 'intro-block',
      }, {
        type: 'price-desc-block',
      }, {
        type: 'course-exam-block',
      }, {
        type: 'column-free-block',
      }, {
        type: 'column-catalogue-block',
      }, {
        type: 'present-block',
      }, {
        type: 'share-block',
      }, {
        type: 'popup-block',
      }],
      bottom: [{
        type: 'submit-block',
      }],
    },
  },
  CONTENT: {
    goodsType: 3,
    key: 'content',
    spm: 'pct',
    goodsIdKey: 'content.goodsId',
    isLockKey: 'content.isLock',
    design: {
      top: [{
        type: 'preview-qrcode-block',
      }, {
        type: 'campus-switch-block',
      }, {
        type: 'visit-gift-block',
      }, {
        type: 'gift-receive-block',
      }],
      pic: [{
        type: 'pct-image-block',
      }],
      main: [{
        type: 'ump-block',
      }, {
        type: 'base-info-block',
      }, {
        type: 'group-buy-block',
      }, {
        type: 'join-group-block',
      }, {
        type: 'promotion-block',
      }, {
        type: 'tuition-block',
      }, {
        type: 'service-block',
      }, {
        type: 'package-buy-block',
      }, {
        type: 'column-entry-block',
      }, {
        type: 'intro-block',
      }, {
        type: 'price-desc-block',
      }, {
        type: 'group-sign-block',
      }, {
        type: 'course-exam-block',
      }, {
        type: 'next-content-block',
      }, {
        type: 'present-block',
      }, {
        type: 'recommends-goods-block',
      }, {
        type: 'comment-block',
      }, {
        type: 'share-block',
      }, {
        type: 'popup-block',
      }],
      bottom: [{
        type: 'submit-block',
      }],
    },
  },
  FX_CONTENT: {
    goodsType: 4,
    key: 'sellerContent',
    spm: 'pct',
    goodsIdKey: 'sellerContent.goodsId',
    isLockKey: 'sellerContent.isLock',
    design: {
      top: [{
        type: 'preview-qrcode-block',
      }, {
        type: 'campus-switch-block',
      }, {
        type: 'visit-gift-block',
      }, {
        type: 'gift-receive-block',
      }],
      pic: [{
        type: 'pct-image-block',
      }],
      main: [{
        type: 'ump-block',
      }, {
        type: 'base-info-block',
      }, {
        type: 'group-buy-block',
      }, {
        type: 'join-group-block',
      }, {
        type: 'promotion-block',
      }, {
        type: 'tuition-block',
      }, {
        type: 'service-block',
      }, {
        type: 'package-buy-block',
      }, {
        type: 'column-entry-block',
      }, {
        type: 'intro-block',
      }, {
        type: 'price-desc-block',
      }, {
        type: 'group-sign-block',
      }, {
        type: 'course-exam-block',
      }, {
        type: 'next-content-block',
      }, {
        type: 'present-block',
      }, {
        type: 'recommends-goods-block',
      }, {
        type: 'comment-block',
      }, {
        type: 'share-block',
      }, {
        type: 'popup-block',
      }],
      bottom: [{
        type: 'submit-block',
      }],
    },
  },
  LIVE: {
    goodsType: 5,
    key: 'live',
    spm: 'pcl',
    goodsIdKey: 'goodsId',
    isLockKey: 'isLock',
    design: {
      top: [{
        type: 'preview-qrcode-block',
      }, {
        type: 'campus-switch-block',
      }, {
        type: 'visit-gift-block',
      }],
      pic: [{
        type: 'pct-image-block',
      }],
      main: [{
        type: 'ump-block',
      }, {
        type: 'base-info-block',
      }, {
        type: 'group-buy-block',
      }, {
        type: 'join-group-block',
      }, {
        type: 'promotion-block',
      }, {
        type: 'tuition-block',
      }, {
        type: 'service-block',
      }, {
        type: 'package-buy-block',
      }, {
        type: 'column-entry-block',
      }, {
        type: 'intro-block',
      }, {
        type: 'price-desc-block',
      }, {
        type: 'course-exam-block',
      }, {
        type: 'next-content-block',
      }, {
        type: 'present-block',
      }, {
        type: 'comment-block',
      }, {
        type: 'share-block',
      }, {
        type: 'popup-block',
      }],
      bottom: [{
        type: 'submit-block',
      }, {
        type: 'live-guide-block',
      }],
    },
  },
  COURSE: {
    goodsType: 6,
    key: 'course',
    spm: 'cg',
    goodsIdKey: 'course.productId',
    isLockKey: 'product.isRiskLock',
    design: {
      top: [{
        type: 'preview-qrcode-block',
      }, {
        type: 'campus-switch-block',
      }, {
        type: 'trade-carousel-block',
      }, {
        type: 'visit-gift-block',
      }],
      pic: [{
        type: 'image-block',
      }],
      main: [{
        type: 'ump-block',
      }, {
        type: 'base-info-block',
      }, {
        type: 'group-buy-block',
      }, {
        type: 'promotion-block',
      }, {
        type: 'tuition-block',
      }, {
        type: 'service-block',
      }, {
        type: 'sku-block',
      }, {
        type: 'package-buy-block',
      }, {
        type: 'course-evaluate-block',
      }, {
        type: 'course-tab-block',
      }, {
        type: 'apply-user-block',
      }, {
        type: 'teacher-list-block',
      }, {
        type: 'directory-list-block',
      }, {
        type: 'intro-block',
      }, {
        type: 'buy-notice-block',
      }, {
        type: 'price-desc-block',
      }, {
        type: 'course-exam-block',
      }, {
        type: 'share-block',
      }, {
        type: 'popup-block',
      }],
      bottom: [{
        type: 'submit-block',
      }],
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
