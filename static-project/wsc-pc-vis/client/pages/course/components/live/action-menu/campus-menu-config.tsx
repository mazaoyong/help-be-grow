import { Pop } from '@zent/compat';
import React from 'react';
import { isHqStore, isBranchStore, isPartnerStore } from '@youzan/utils-shop';
import { IConfigItem } from 'components/list-action-menu';
import { BRANCH_STORE_NAME } from 'constants/chain';

interface ICreateOptions {
  isItemCreateMode: boolean;
  targetKdtId: number;
}

export const createCampusMenuConfig = (options: ICreateOptions) => {
  const { isItemCreateMode, targetKdtId = _global.kdtId } = options;

  let popContent;

  if (isHqStore) {
    // 总部视角 & 非自建商品
    if (targetKdtId !== _global.kdtId && isItemCreateMode) {
      popContent = `${BRANCH_STORE_NAME}创建的直播，总部无法修改`;
    }
  } else if (isBranchStore) {
    if (!isItemCreateMode) {
      popContent = `总部创建的直播，${BRANCH_STORE_NAME}无法修改`;
    }
  }

  return (configItem: IConfigItem) => {
    // 在之前的diable的基础上增加连锁判断
    // 默认的disable
    // 非自建的商品标
    // 总部在校区视角
    configItem.disabled =
      configItem.disabled || !isItemCreateMode || (isHqStore && targetKdtId !== _global.kdtId) || isPartnerStore;

    if (popContent) {
      configItem.title = (
        <Pop trigger="click" position="bottom-left" content={popContent}>
          {configItem.title}
        </Pop>
      );
    }

    return configItem;
  };
};
