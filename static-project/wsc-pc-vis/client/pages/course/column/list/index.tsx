import React, { FC, useEffect, useState } from 'react';
import { VisButton } from 'fns/router';
import { Button as SamButton } from '@youzan/sam-components';
import { isEduShop, isRetailShop, isHqStore } from '@youzan/utils-shop';
import { LockWrap, TempAlertInfo } from '@youzan/ebiz-components';
import { LockType } from '@youzan/ebiz-components/es/lock-wrap';
import { arrayWrapper, ShowWrapper, isInStoreCondition } from 'fns/chain';
import FilterList from './list';
import { getRiskLockAPI } from '../../api/pct/risk-lock';
import { chainSupportHqAndSingleShowWrapper } from '../../common/chain';

import './style.scss';
const { IOSBuyAlert } = TempAlertInfo;
const ChainAddColumnBtn = chainSupportHqAndSingleShowWrapper(VisButton);
// 是否支持分销专栏，现在无需判断微商城扩展包
const supportFxColumn = !isHqStore && !isRetailShop;
// 是否极简版网店支持
const isRetailMinifyBranch = isInStoreCondition({ supportMinifyRetailBranchShop: true });

const App: FC = () => {
  const [isRiskLock, setRiskLock] = useState(false);
  useEffect(() => {
    getRiskLockAPI().then((data = {}) => {
      setRiskLock(!!Number(data.onoff || 0));
    });
  }, []);

  const onAdd = () => {
    window.location.href = `${window._global.url.v4}/vis/course/column/add`;
  };

  const onMarketClick = () => {
    window.open(`${window._global.url.v4}/fenxiao/fxmarket/edu`, '_blank');
  };

  let topBtns = arrayWrapper(
    {
      1: supportFxColumn,
    },
    [
      <ShowWrapper key="new" isInStoreCondition={!isRetailMinifyBranch}>
        <LockWrap lockType={LockType.PCT_SHOP} isLock={isRiskLock} onClick={onAdd}>
          <ChainAddColumnBtn type="primary" pctCheck name="活动管理">
            新建专栏
          </ChainAddColumnBtn>
        </LockWrap>
      </ShowWrapper>,
      <SamButton key="add" name="活动管理" onClick={onMarketClick}>
        采购专栏
      </SamButton>,
    ],
  );

  return (
    <>
      {isEduShop && <IOSBuyAlert />}
      <div className="column-list">
        <div className="app-filter-region btn-area">{topBtns}</div>
        <FilterList />
      </div>
    </>
  );
};

export default App;
