module.exports = {
  // 业务场景名称
  biz: '@wsc-h5-asstes/edu-paid-status',

  // 使用的 extension 列表
  extensions: [
    {
      name: '@wsc-h5-assets/pay-base',
      version: '1.0.1-beta.2',
      displayName: '中文名',
      extensionId: 'YgTDy7PtLnwwKd3Z',
      pathInBundle: 'pay-base',
      widget: {
        default: 'Main',
      },
      data: {
        provide: {
          outBizNo: ['r', 'w'],
          payAmount: ['r', 'w'],
          returnUrl: ['r', 'w'],
          height: ['r', 'w'],
          width: ['r', 'w'],
          kdtId: ['r', 'w'],
          result: ['r', 'w'],
          buttonText: ['r', 'w'],
          buttonStyle: ['r', 'w'],
        },
      },
      process: {
        define: ['navigateTo', 'logger'],
      },
      bundle: 'https://b.yzcdn.cn/wsc-h5-assets/ranta-extension_341a3c43.js',
      sandbox: {
        level: 'Unsafe',
      },
    },
    {
      name: '@wsc-h5-vis/pay-receipt-container',
      version: '0.0.1-beta.4',
      displayName: '中文名',
      extensionId: 'avNteaJWQoKyUiQ8',
      pathInBundle: 'pay-receipt-container',
      widget: {
        default: 'Main',
        provide: [],
        consume: [],
      },
      component: {
        provide: [],
        consume: [],
      },
      lambda: {
        provide: [],
        consume: [],
      },
      data: {
        provide: {
          orderNo: ['r'],
          price: ['r'],
          tip: ['r'],
          payStateText: ['r'],
          payRewardInfo: ['r'],
          pointsName: ['r'],
          btnList: ['r'],
          btnUmpMap: ['r'],
          rewardInfo: ['r'],
          presentInfo: ['r'],
          orderCouponInfo: ['r'],
          joinGroupSetting: ['r'],
          resultUrl: ['r'],
        },
        consume: {
          outBizNo: ['r'],
          payAmount: ['r'],
          returnUrl: ['r'],
          height: ['r'],
          kdtId: ['r'],
        },
      },
      event: {
        emit: [],
        listen: [],
      },
      process: {
        invoke: ['navigateTo', 'logger'],
        define: ['navigateGo', 'logAction'],
      },
      sandbox: {
        level: 'Unsafe',
      },
      bundle: 'https://b.yzcdn.cn/wsc-h5-vis/ranta-extension_a0cfcc18.js',
    },
    {
      name: '@wsc-h5-vis/pay-result',
      version: '0.0.1-beta.4',
      displayName: '中文名',
      extensionId: 'Nj5lL2gBCNYv1Wea',
      pathInBundle: 'pay-result',
      widget: {
        default: 'Main',
        provide: [],
        consume: [],
      },
      component: {
        provide: [],
        consume: [],
      },
      lambda: {
        provide: [],
        consume: [],
      },
      data: {
        provide: {},
        consume: {
          payStateText: ['r'],
          price: ['r'],
          tip: ['r'],
        },
      },
      event: {
        emit: [],
        listen: [],
      },
      process: {
        invoke: [],
        define: [],
      },
      sandbox: {
        level: 'Unsafe',
      },
      bundle: 'https://b.yzcdn.cn/wsc-h5-vis/ranta-extension_a0cfcc18.js',
    },
    {
      name: '@wsc-h5-vis/pay-reward',
      version: '0.0.1-beta.4',
      displayName: '中文名',
      extensionId: 'Jn0JKMYl6M9u36SM',
      pathInBundle: 'pay-reward',
      widget: {
        default: 'Main',
        provide: [],
        consume: [],
      },
      component: {
        provide: [],
        consume: [],
      },
      lambda: {
        provide: [],
        consume: [],
      },
      data: {
        provide: {},
        consume: {
          payRewardInfo: ['r'],
          pointsName: ['r'],
        },
      },
      event: {
        emit: [],
        listen: [],
      },
      process: {
        invoke: ['navigateGo', 'logAction'],
        define: [],
      },
      sandbox: {
        level: 'Unsafe',
      },
      bundle: 'https://b.yzcdn.cn/wsc-h5-vis/ranta-extension_a0cfcc18.js',
    },
    {
      name: '@wsc-h5-vis/pay-actions-buttons',
      version: '0.0.1-beta.4',
      displayName: '中文名',
      extensionId: 'Qjvmvk0s6Bf2HLtq',
      pathInBundle: 'pay-actions-buttons',
      widget: {
        default: 'Main',
        provide: [],
        consume: [],
      },
      component: {
        provide: [],
        consume: [],
      },
      lambda: {
        provide: [],
        consume: [],
      },
      data: {
        provide: {},
        consume: {
          btnList: ['r'],
          btnUmpMap: ['r'],
          resultUrl: ['r'],
        },
      },
      event: {
        emit: [],
        listen: [],
      },
      process: {
        invoke: ['navigateGo', 'logAction'],
        define: [],
      },
      sandbox: {
        level: 'Unsafe',
      },
      bundle: 'https://b.yzcdn.cn/wsc-h5-vis/ranta-extension_a0cfcc18.js',
    },
    {
      name: '@wsc-h5-vis/pay-actions-promotion',
      version: '0.0.1-beta.4',
      displayName: '中文名',
      extensionId: '3_WSRlYstjCoMurj',
      pathInBundle: 'pay-actions-promotion',
      widget: {
        default: 'Main',
        provide: [],
        consume: [],
      },
      component: {
        provide: [],
        consume: [],
      },
      lambda: {
        provide: [],
        consume: [],
      },
      data: {
        provide: {},
        consume: {
          joinGroupSetting: ['r'],
        },
      },
      event: {
        emit: [],
        listen: [],
      },
      process: {
        invoke: ['logAction'],
        define: [],
      },
      sandbox: {
        level: 'Unsafe',
      },
      bundle: 'https://b.yzcdn.cn/wsc-h5-vis/ranta-extension_a0cfcc18.js',
    },
    {
      name: '@wsc-h5-vis/pay-ump-fission-coupon',
      version: '0.0.1-beta.4',
      displayName: '中文名',
      extensionId: 'Grdxdu-4yy9qf7dp',
      pathInBundle: 'pay-ump-fission-coupon',
      widget: {
        default: 'Main',
        provide: [],
        consume: [],
      },
      component: {
        provide: [],
        consume: [],
      },
      lambda: {
        provide: [],
        consume: [],
      },
      data: {
        provide: {},
        consume: {
          orderCouponInfo: ['r'],
          orderNo: ['r'],
        },
      },
      event: {
        emit: [],
        listen: [],
      },
      process: {
        invoke: ['navigateGo'],
        define: [],
      },
      sandbox: {
        level: 'Unsafe',
      },
      bundle: 'https://b.yzcdn.cn/wsc-h5-vis/ranta-extension_a0cfcc18.js',
    },
    {
      name: '@wsc-h5-vis/pay-ump-reward',
      version: '0.0.1-beta.4',
      displayName: '中文名',
      extensionId: 'mmjnJeLt248Kkf-W',
      pathInBundle: 'pay-ump-reward',
      widget: {
        default: 'Main',
        provide: [],
        consume: [],
      },
      component: {
        provide: [],
        consume: [],
      },
      lambda: {
        provide: [],
        consume: [],
      },
      data: {
        provide: {},
        consume: {
          rewardInfo: ['r'],
          pointsName: ['r'],
        },
      },
      event: {
        emit: [],
        listen: [],
      },
      process: {
        invoke: ['navigateGo', 'logAction'],
        define: [],
      },
      sandbox: {
        level: 'Unsafe',
      },
      bundle: 'https://b.yzcdn.cn/wsc-h5-vis/ranta-extension_a0cfcc18.js',
    },
    {
      name: '@wsc-h5-vis/pay-ump-present',
      version: '0.0.1-beta.4',
      displayName: '中文名',
      extensionId: 'mY5dRke3hy0QiODb',
      pathInBundle: 'pay-ump-present',
      widget: {
        default: 'Main',
        provide: [],
        consume: [],
      },
      component: {
        provide: [],
        consume: [],
      },
      lambda: {
        provide: [],
        consume: [],
      },
      data: {
        provide: {},
        consume: {
          presentInfo: ['r'],
          orderNo: ['r'],
        },
      },
      event: {
        emit: [],
        listen: [],
      },
      process: {
        invoke: ['navigateGo', 'logAction'],
        define: [],
      },
      sandbox: {
        level: 'Unsafe',
      },
      bundle: 'https://b.yzcdn.cn/wsc-h5-vis/ranta-extension_a0cfcc18.js',
    },
  ],

  // extension 间的绑定关系
  modules: [
    {
      moduleId: 'pay-base',
      extensionId: 'YgTDy7PtLnwwKd3Z',
    },
    {
      moduleId: '@wsc-h5-vis/pay-receipt-container',
      extensionId: 'avNteaJWQoKyUiQ8',
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
      extensionId: 'Nj5lL2gBCNYv1Wea',
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
      extensionId: 'Jn0JKMYl6M9u36SM',
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
      extensionId: 'Qjvmvk0s6Bf2HLtq',
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
      extensionId: '3_WSRlYstjCoMurj',
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
      extensionId: 'Grdxdu-4yy9qf7dp',
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
        process: {
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
      moduleId: '@wsc-h5-vis/pay-ump-present',
      extensionId: 'mY5dRke3hy0QiODb',
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
      extensionId: 'mmjnJeLt248Kkf-W',
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
