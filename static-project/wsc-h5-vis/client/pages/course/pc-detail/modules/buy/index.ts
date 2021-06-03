import { get } from 'lodash';
import SessionStorage from '@youzan/utils/browser/session_storage';
import { GOODS_TYPE } from '@/constants/course/goodsType';
import { getAssetState, postCreate } from '../../apis';
import * as Toast from '../../components/toast';
import { COMPLETED_KEY } from '../../constants';
import openQrcodeDialog from '../../components/dialog-qrcode/index';
import { createBaseParams } from './orderParams';
import { isOnlineCourse, isOnlyFreeColumn } from '../goods';

export interface IBuyContext {
  goodsData: any;
  goodsType: GOODS_TYPE;
  alias: string;
}

/**
 * 添加会话状态，用于检查用户是否报名成功
 */
export const setCompleted = () => {
  SessionStorage.setItem(COMPLETED_KEY, '1');
};
export const removeCompleted = () => {
  SessionStorage.removeItem(COMPLETED_KEY);
};

/**
 * 购买完成后设置标识，并刷新页面
 */
function afterBuy() {
  setCompleted();
  window.location.reload();
}
/**
 * 检查会话状态，判断是否需要检查报名状态
 *
 * @return {boolean}
 */
export const needCheckBuy = () => {
  const completed = SessionStorage.getItem(COMPLETED_KEY) || false;
  return !!completed;
};
export const notifyBuyStatus = (hasOwned: boolean) => {
  if (needCheckBuy()) {
    if (hasOwned) {
      Toast.success('报名成功');
    } else {
      Toast.error('未完成报名，请重试');
    }
    removeCompleted();
  }
};

export const startBuy = async (ctx: IBuyContext) => {
  // 1. 检查用户是否已拥有
  const hasOwned = await checkBuyStatus(ctx.alias || '');
  if (hasOwned) {
    Toast.info('已报名课程')
      .then(() => {
        window.location.reload();
      });
  } else {
    const { goodsData, goodsType } = ctx;
    // 2. 直接领取0元商品
    const canReceive = await ensureReceive(goodsData, goodsType);
    if (!canReceive) {
      // 3. 打开扫码购买弹窗
      openQrcodeDialog({
        onCompleted: afterBuy,
        props: {
          actionText: '报名',
          title: '扫码报名',
          okText: '已完成报名',
          cancelText: '暂不报名',
        },
      });
    }
  }
};

// 检查用户资产状态，已拥有返回 true，其他情况返回 false
async function checkBuyStatus(alias: string) {
  return new Promise((resolve) => {
    getAssetState({
      alias,
    })
      .then(res => {
        if (res) {
          resolve(!!res.isOwnAsset);
        }
        resolve(false);
      })
      .catch((err) => {
        resolve(false);
        console.error(err);
      });
  });
}

// 确认是不是0元可直接领取的商品
// 是的话直接领取并刷新页面
// 不是则返回 false
// 仅专栏售卖且专栏价格为0元时，返回false
async function ensureReceive(goodsData: any, goodsType: GOODS_TYPE): Promise<boolean> {
  if (isOnlineCourse(goodsType)) {
    if (isOnlyFreeColumn(goodsData)) {
      return false;
    }

    // 免费知识付费商品且没有设置信息采集，在当前页面购买
    if (goodsData.sku.minPrice === 0 &&
      get(goodsData, 'collectInfoSetting.customizeItems', []).length === 0
    ) {
      const params = createBaseParams(goodsData, goodsType);
      await postCreate(params)
        .then(() => {
          Toast.success('领取成功');
          setTimeout(location.reload.bind(location), 2000);
        })
        .catch((errMsg: string) => {
          // todo: 领取失败的场景
          Toast.error(errMsg || '网络错误，请稍后重试');
        });

      return true;
    }
  }

  return false;
}
