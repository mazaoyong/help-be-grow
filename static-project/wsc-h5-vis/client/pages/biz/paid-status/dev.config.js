const PayActionsButtons = require('../../../extensions/pay-actions-buttons/extension.json');
const PayActionsPromotion = require('../../../extensions/pay-actions-promotion/extension.json');
const PayReceiptContainer = require('../../../extensions/pay-receipt-container/extension.json');
const PayResult = require('../../../extensions/pay-result/extension.json');
const PayReward = require('../../../extensions/pay-reward/extension.json');
const PayUmpFissionCoupon = require('../../../extensions/pay-ump-fission-coupon/extension.json');
const PayUmpPresent = require('../../../extensions/pay-ump-present/extension.json');
const PayUmpReward = require('../../../extensions/pay-ump-reward/extension.json');
const AssetsPayBase = require('./other-extensions/assets-pay-base/extension.json');

module.exports = {
  // 业务场景名称
  biz: '@wsc-h5-asstes/edu-paid-status',

  // 使用的 extension 列表
  extensions: [
    PayActionsButtons,
    PayActionsPromotion,
    PayReceiptContainer,
    PayResult,
    PayReward,
    PayUmpFissionCoupon,
    PayUmpPresent,
    PayUmpReward,
    AssetsPayBase,
  ],

  // extension 间的绑定关系
  modules: [
    {
      moduleId: 'pay-base',
      extensionId: AssetsPayBase.extensionId,
    },
    {
      moduleId: '@wsc-h5-vis/pay-receipt-container',
      extensionId: PayReceiptContainer.extensionId,
      bindings: {
        data: {
          outBizNo: {
            moduleId: 'pay-base',
            name: 'outBizNo',
          },
          payAmount: {
            moduleId: 'pay-base',
            name: 'payAmount',
          },
          returnUrl: {
            moduleId: 'pay-base',
            name: 'returnUrl',
          },
          height: {
            moduleId: 'pay-base',
            name: 'height',
          },
          kdtId: {
            moduleId: 'pay-base',
            name: 'kdtId',
          },
        },
        process: {
          navigateTo: [
            {
              moduleId: 'pay-base',
              name: 'navigateTo',
            },
          ],
          logger: [
            {
              moduleId: 'pay-base',
              name: 'logger',
            },
          ],
        },
      },
    },
    {
      moduleId: '@wsc-h5-vis/pay-result',
      extensionId: PayResult.extensionId,
      bindings: {
        data: {
          payStateText: {
            moduleId: '@wsc-h5-vis/pay-receipt-container',
            name: 'payStateText',
          },
          price: {
            moduleId: '@wsc-h5-vis/pay-receipt-container',
            name: 'price',
          },
          tip: {
            moduleId: '@wsc-h5-vis/pay-receipt-container',
            name: 'tip',
          },
        },
      },
    },
    {
      moduleId: '@wsc-h5-vis/pay-reward',
      extensionId: PayReward.extensionId,
      bindings: {
        data: {
          payRewardInfo: {
            moduleId: '@wsc-h5-vis/pay-receipt-container',
            name: 'payRewardInfo',
          },
          pointsName: {
            moduleId: '@wsc-h5-vis/pay-receipt-container',
            name: 'pointsName',
          },
        },
        process: {
          navigateGo: [
            {
              moduleId: '@wsc-h5-vis/pay-receipt-container',
              name: 'navigateGo',
            },
          ],
          logAction: [
            {
              moduleId: '@wsc-h5-vis/pay-receipt-container',
              name: 'logAction',
            },
          ],
        },
      },
    },
    {
      moduleId: '@wsc-h5-vis/pay-actions-buttons',
      extensionId: PayActionsButtons.extensionId,
      bindings: {
        data: {
          btnList: {
            moduleId: '@wsc-h5-vis/pay-receipt-container',
            name: 'btnList',
          },
          btnUmpMap: {
            moduleId: '@wsc-h5-vis/pay-receipt-container',
            name: 'btnUmpMap',
          },
          resultUrl: {
            moduleId: '@wsc-h5-vis/pay-receipt-container',
            name: 'resultUrl',
          },
        },
        process: {
          navigateGo: [
            {
              moduleId: '@wsc-h5-vis/pay-receipt-container',
              name: 'navigateGo',
            },
          ],
          logAction: [
            {
              moduleId: '@wsc-h5-vis/pay-receipt-container',
              name: 'logAction',
            },
          ],
        },
      },
    },
    {
      moduleId: '@wsc-h5-vis/pay-actions-promotion',
      extensionId: PayActionsPromotion.extensionId,
      bindings: {
        data: {
          joinGroupSetting: {
            moduleId: '@wsc-h5-vis/pay-receipt-container',
            name: 'joinGroupSetting',
          },
          resultUrl: {
            moduleId: '@wsc-h5-vis/pay-receipt-container',
            name: 'resultUrl',
          },
        },
        process: {
          logAction: [
            {
              moduleId: '@wsc-h5-vis/pay-receipt-container',
              name: 'logAction',
            },
          ],
          navigateGo: [
            {
              moduleId: '@wsc-h5-vis/pay-receipt-container',
              name: 'navigateGo',
            },
          ],
        },
      },
    },
    {
      moduleId: '@wsc-h5-vis/pay-ump-fission-coupon',
      extensionId: PayUmpFissionCoupon.extensionId,
      bindings: {
        data: {
          orderCouponInfo: {
            moduleId: '@wsc-h5-vis/pay-receipt-container',
            name: 'orderCouponInfo',
          },
          orderNo: {
            moduleId: '@wsc-h5-vis/pay-receipt-container',
            name: 'orderNo',
          },
        },
      },
    },
    {
      moduleId: '@wsc-h5-vis/pay-ump-present',
      extensionId: PayUmpPresent.extensionId,
      bindings: {
        data: {
          orderNo: {
            moduleId: '@wsc-h5-vis/pay-receipt-container',
            name: 'orderNo',
          },
          presentInfo: {
            moduleId: '@wsc-h5-vis/pay-receipt-container',
            name: 'presentInfo',
          },
        },
        process: {
          navigateGo: [
            {
              moduleId: '@wsc-h5-vis/pay-receipt-container',
              name: 'navigateGo',
            },
          ],
          logAction: [
            {
              moduleId: '@wsc-h5-vis/pay-receipt-container',
              name: 'logAction',
            },
          ],
        },
      },
    },
    {
      moduleId: '@wsc-h5-vis/pay-ump-reward',
      extensionId: PayUmpReward.extensionId,
      bindings: {
        data: {
          rewardInfo: {
            moduleId: '@wsc-h5-vis/pay-receipt-container',
            name: 'rewardInfo',
          },
          pointsName: {
            moduleId: '@wsc-h5-vis/pay-receipt-container',
            name: 'pointsName',
          },
        },
        process: {
          navigateGo: [
            {
              moduleId: '@wsc-h5-vis/pay-receipt-container',
              name: 'navigateGo',
            },
          ],
          logAction: [
            {
              moduleId: '@wsc-h5-vis/pay-receipt-container',
              name: 'logAction',
            },
          ],
        },
      },
    },
  ],

  // 页面路由、布局
  app: {
    pages: [
      {
        routes: ['/index'],
        containers: [
          {
            contentType: 'module',
            layout: 'column',
            contents: [
              'pay-base',
              '@wsc-h5-vis/pay-receipt-container',
              '@wsc-h5-vis/pay-result',
              '@wsc-h5-vis/pay-reward',
              '@wsc-h5-vis/pay-actions-buttons',
              '@wsc-h5-vis/pay-actions-promotion',
              '@wsc-h5-vis/pay-ump-fission-coupon',
              '@wsc-h5-vis/pay-ump-reward',
              '@wsc-h5-vis/pay-ump-present',
            ],
          },
        ],
      },
    ],
  },
};
