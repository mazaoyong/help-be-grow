import React from 'react';
import Model from './model';
import Env from './env';

const defaultConfig = {
  sku: {
    readonly: false,
    message: '',
  },
  price: {
    readonly: false,
    message: '',
  },
  quota: {
    readonly: false,
    message: '',
  },
  sold_time: {
    readonly: false,
  },
  start_sold_time: {
    readonly: false,
  },
  join_level_discount: {
    message: '',
  },
  pre_sale: {
    readonly: false,
  },
  part_pre_sale: {
    readonly: false,
  },
  purchase_right: {
    readonly: false,
  },
  message: {
    readonly: false,
  },
  shop_method: {
    readonly: false,
  },
  unload: {
    confirm: false,
    confirm_message: '',
  },
  title: {
    readonly: false,
  },
  picture: {
    readonly: false,
  },
  sku_pictures_limit: 40,
  is_diaplay: {
    readonly: false,
  },
  content: {
    readonly: false,
  },
  delivery: {
    readonly: false,
  },
};

let editConfig = {};

export default {
  get(key) {
    return editConfig[key] || {};
  },

  set() {
    editConfig = {};
    let data = Model.get();
    let isEditLock = +data.is_edit_lock;
    let isLock = data.is_lock;
    let lockItems = data.item_lock_types || [];
    // 商品正在进行营销活动
    let lockActivities = data.on_going_activities || [];

    // 多人拼团
    if ((isEditLock && +isLock === 3) || lockActivities.includes(4)) {
      editConfig = Object.assign({}, editConfig, {
        sku: {
          readonly: true,
          message: '该商品正在参加多人拼团活动，活动结束或失效后才能修改商品规格。',
        },
        price: {
          readonly: true,
          message: '该商品正在参加多人拼团活动，活动结束或失效后才能修改价格。',
        },
        quota: {
          readonly: true,
          message: '该商品正在参加多人拼团活动，活动结束或失效后才能修改限购信息。',
        },
        join_level_discount: {
          message: '该商品正在参加多人拼团活动，勾选会员折扣仅在单独购买时生效。',
        },
        sold_time: {
          readonly: true,
          message: '该商品正在参加多人拼团活动，活动结束或失效后才能修改开售时间。',
        },
        is_diaplay: {
          readonly: true,
          message: '该商品正在参加多人拼团活动，活动结束或失效后才能放入仓库。',
        },
        part_pre_sale: {
          readonly: true,
          message: '该商品正在参加多人拼团活动，活动结束或失效后才能设置定金预售。',
        },
      });
    }

    // 积分商城活动
    if ((isEditLock && +isLock === 4) || lockActivities.includes(5)) {
      editConfig = Object.assign({}, editConfig, {
        sku: {
          readonly: true,
          message: '该商品正在参加积分商城活动，活动结束或失效后才能修改商品规格。',
        },
        price: {
          readonly: true,
          message: '该商品正在参加积分商城活动，活动结束或失效后才能修改价格。',
        },
        quota: {
          readonly: true,
          message: '该商品正在参加积分商城活动，活动结束或失效后才能修改限购信息。',
        },
        sold_time: {
          readonly: true,
          message: '该商品正在参加积分商城活动，活动结束或失效后才能修改开售时间。',
        },
        part_pre_sale: {
          readonly: true,
          message: '该商品正在参加积分商城活动，活动结束或失效后才能设置定金预售。',
        },
      });
    }

    // 秒杀
    if ((isEditLock && +isLock === 5) || lockActivities.includes(6)) {
      editConfig = Object.assign({}, editConfig, {
        shop_method: {
          readonly: true,
          message: '该商品正在参加秒杀活动，活动结束或失效后才能修改购买方式。',
        },
        sku: {
          readonly: true,
          message: '该商品正在参加秒杀活动，活动结束或失效后才能修改商品规格。',
        },
        pre_sale: {
          readonly: true,
          message: '该商品正在参加秒杀活动，活动结束或失效后才能修改预售信息。',
        },
        price: {
          readonly: true,
          message: '该商品正在参加秒杀活动，活动结束或失效后才能修改价格。',
        },
        quota: {
          readonly: true,
          message: '该商品正在参加秒杀活动，活动结束或失效后才能修改限购信息。',
        },
        purchase_right: {
          readonly: true,
          message: '该商品正在参加秒杀活动，活动结束或失效后才能修改购买权限。',
        },
        message: {
          readonly: true,
          message: '该商品正在参加秒杀活动，活动结束或失效后才能修改留言设置。',
        },
        sold_time: {
          readonly: true,
          message: '该商品正在参加秒杀活动，活动结束或失效后才能开售时间。',
        },
        unload: {
          confirm: true,
          confirm_message: '该商品正在参加秒杀活动，放入仓库后相关活动将会失效。确定要放入仓库吗？',
        },
        part_pre_sale: {
          readonly: true,
          message: '该商品正在参加秒杀活动，活动结束或失效后才能设置定金预售。',
        },
      });
    }

    // 优惠套餐
    if ((isEditLock && +isLock === 6) || lockActivities.includes(7)) {
      editConfig = Object.assign({}, editConfig, {
        shop_method: {
          readonly: true,
          message: '该商品正在参加优惠套餐活动，活动结束或失效后才能修改购买方式。',
        },
        sku: {
          readonly: true,
          message: '该商品正在参加优惠套餐活动，活动结束或失效后才能修改商品规格。',
        },
        pre_sale: {
          readonly: true,
          message: '该商品正在参加优惠套餐活动，活动结束或失效后才能修改预售信息。',
        },
        price: {
          readonly: true,
          message: '该商品正在参加优惠套餐活动，活动结束或失效后才能修改价格。',
        },
        quota: {
          readonly: true,
          message: '该商品正在参加优惠套餐活动，活动结束或失效后才能修改限购信息。',
        },
        purchase_right: {
          readonly: true,
          message: '该商品正在参加优惠套餐活动，活动结束或失效后才能修改购买权限。',
        },
        message: {
          readonly: true,
          message: '该商品正在参加优惠套餐活动，活动结束或失效后才能修改留言设置。',
        },
        sold_time: {
          readonly: true,
          message: '该商品正在参加优惠套餐活动，活动结束或失效后才能开售时间。',
        },
        unload: {
          confirm: true,
          confirm_message:
            '该商品正在参加优惠套餐活动，放入仓库后相关活动将会失效。确定要放入仓库吗？',
        },
        part_pre_sale: {
          readonly: true,
          message: '该商品正在参加优惠套餐活动，活动结束或失效后才能设置定金预售。',
        },
      });
    }

    // 周期购锁定
    if (lockItems.includes(10) || lockActivities.includes(13)) {
      editConfig = Object.assign({}, editConfig, {
        price: {
          readonly: true,
          message: '该商品正在参加周期购活动，活动结束或失效后才能修改价格。',
        },
        sku: {
          readonly: true,
          message: '该商品正在参加周期购活动，活动结束或失效后才能修改商品规格。',
        },
        pre_sale: {
          readonly: true,
          message: '该商品正在参加周期购活动，活动结束或失效后才能修改预售信息。',
        },
        unload: {
          confirm: true,
          confirm_message:
            '该商品正在参加周期购活动，放入仓库后相关活动将会失效。确定要放入仓库吗？',
        },
        part_pre_sale: {
          readonly: true,
          message: '该商品正在参加周期购活动，活动结束或失效后才能设置定金预售。',
        },
      });
    }

    // 享立减锁
    if (lockItems.includes(11)) {
      editConfig = Object.assign({}, editConfig, {
        delivery: {
          readonly: true,
          message: '该商品正在参加有赞微信公众号推广活动，活动结束或失效后才能修改快递运费。',
        },
      });
    }

    // 自定义会员价
    if (lockActivities.includes(10)) {
      editConfig = Object.assign({}, editConfig, {
        part_pre_sale: {
          readonly: true,
          message: '该商品设置了自定义会员价，需要取消自定义会员价才能设置定金预售。',
        },
      });
    }

    // 团购返现
    if (lockActivities.includes(2)) {
      editConfig = Object.assign({}, editConfig, {
        part_pre_sale: {
          readonly: true,
          message: '该商品正在参加团购返现活动，活动结束或失效后才能设置定金预售。',
        },
      });
    }

    // 限时折扣
    if (lockActivities.includes(11)) {
      editConfig = Object.assign({}, editConfig, {
        part_pre_sale: {
          readonly: true,
          message: '该商品正在参加限时折扣活动，活动结束或失效后才能设置定金预售。',
        },
      });
    }

    // 降价拍
    if (lockActivities.includes(3)) {
      editConfig = Object.assign({}, editConfig, {
        part_pre_sale: {
          readonly: true,
          message: '该商品正在参加降价拍活动，活动结束或失效后才能设置定金预售。',
        },
      });
    }

    // 打包一口价
    if (lockActivities.includes(104)) {
      editConfig = Object.assign({}, editConfig, {
        part_pre_sale: {
          readonly: true,
          message: '该商品正在参加打包一口价活动，活动结束或失效后才能设置定金预售。',
        },
      });
    }

    // 商品报名有赞微信公众号推广活动，待审核及审核中
    // if (lockItems.includes(100)) {
    //   editConfig = Object.assign({}, editConfig, {
    //     sku: {
    //       readonly: true,
    //       message: '该商品已报名有赞微信公众号推广活动，暂不可修改，如需修改可取消参加活动'
    //     }
    //   });
    // }

    // 商品报名有赞微信公众号推广活动，审核中及审核通过
    if (lockItems.includes(101) || lockItems.includes(11)) {
      editConfig = Object.assign({}, editConfig, {
        sku: {
          readonly: true,
          message: '该商品正在参加有赞微信公众号推广活动，活动结束或失效后才能修改商品规格。',
        },
        price: {
          readonly: true,
          message: '该商品正在参加有赞微信公众号推广活动，活动结束或失效后才能修改价格。',
        },
        purchase_right: {
          readonly: true,
          message: '该商品正在参加有赞微信公众号推广活动，活动结束或失效后才能修改购买权限。',
        },
        title: {
          readonly: true,
          message: '该商品正在参加有赞微信公众号推广活动，活动结束或失效后才能修改商品名称。',
        },
        picture: {
          readonly: true,
          message: '该商品正在参加有赞微信公众号推广活动，活动结束或失效后才能修改商品图。',
        },
        quota: {
          readonly: true,
          message: '该商品正在参加有赞微信公众号推广活动，活动结束或失效后才能修改价格限购信息。',
        },
        sold_time: {
          readonly: true,
          message: '该商品正在参加有赞微信公众号推广活动，活动结束或失效后才能修改开售时间。',
        },
        is_diaplay: {
          readonly: true,
          message: '该商品正在参加有赞微信公众号推广活动，活动结束或失效后才能放入仓库。',
        },
        content: {
          readonly: true,
          message: '该商品正在参加有赞微信公众号推广活动，活动结束或失效后才能修改图文详情。',
        },
      });
    }

    // 重置供货商商品设置
    if (Env.isSupplier()) {
      editConfig = Object.assign({}, editConfig, {
        part_pre_sale: {
          readonly: true,
          message: '该商品为供货商商品，暂不支持设置定金预售。',
        },
      });
    }

    // 重置分销商品设置
    if (Env.isFenxiao()) {
      editConfig = Object.assign({}, editConfig, {
        quota: {
          readonly: true,
          message: '该商品为分销商品，暂不支持限购设置。',
        },
        pre_sale: {
          readonly: true,
          message: '该商品为分销商品，暂不支持设置全款预售。',
        },
        part_pre_sale: {
          readonly: true,
          message: '该商品为分销商品，暂不支持设置定金预售。',
        },
        sku: {
          readonly: true,
          message: '该商品为分销商品，暂不支持修改商品规格。',
        },
        message: {
          readonly: true,
          message: '该商品为分销商品，暂不支持修改留言。',
        },
        stock: {
          readonly: true,
          message: '该商品为分销商品，暂不支持修改库存。',
        },
      });

      // 有自定义上架时间
      if (data.start_sold_time) {
        editConfig.sold_time = {
          readonly: true,
          message: `供货商已设置上架时间：${data.start_sold_time}`,
        };
      } else {
        editConfig.start_sold_time = {
          readonly: true,
          message: '目前暂不支持分销商品独立设置上架时间',
        };
      }
    } else {
      editConfig.start_sold_time = Object.assign({}, editConfig.sold_time);
    }

    // 周期购商品锁
    if (Env.isPeriodBuy()) {
      let periodBuyUrl = `${window._global.url.www}/ump/periodbuy#/create?id=${data.periodBuyId}`;
      editConfig.stock = {
        readonly: true,
        message: (
          <div>
            <p>周期购商品请</p>
            <p>
              <a target="_blank" rel="noopener noreferrer" href={periodBuyUrl}>
                点此修改库存
              </a>
            </p>
          </div>
        ),
      };
    }

    // 广点通推广商品
    if (Env.isTxAdsGood()) {
      editConfig = Object.assign({}, editConfig, {
        sku: {
          readonly: true,
          message: '锁定为推广商品期间，仅支持价格、库存的编辑修改',
        },
      });
    }

    editConfig = Object.assign({}, defaultConfig, editConfig);
  },
};
