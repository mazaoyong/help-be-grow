import React, { useState, useEffect, useRef } from 'react';
import { isBranchStore, isPartnerStore } from '@youzan/utils-shop';
import StatShopSelect from './shop-select';
import { BRANCH_STORE_NAME } from 'constants/chain';
import MaskGuide from 'components/mask-guide';
import { findListAllCampusAPI } from './api';

import './index.scss';

const hqKdtId = isBranchStore ? _global.shopInfo.parentKdtId || _global.kdtId : _global.kdtId;

export interface IProps {
  showHqStore?: boolean;
  showFilter?: boolean;
  targetKdtId: number;
  divideItems?: Array<{
    text: string;
    kdtId: number;
  }>;
  onChangeTargetKdtId: (targetKdtId: number) => void;
}

interface IShopListDataModel {
  kdtId: number;
  shopName: string;
}

const initialState: IShopListDataModel = {
  kdtId: hqKdtId,
  shopName: '总部',
};

const defaultDivideItems = [
  {
    text: `所有${BRANCH_STORE_NAME}`,
    kdtId: 0,
  },
];
const clsPrefix = 'campus-filter';

function CampusFilter(props: IProps) {
  const {
    showHqStore,
    showFilter,
    targetKdtId,
    onChangeTargetKdtId,
    divideItems = defaultDivideItems,
  } = props;
  const [showShopList, setShowShopList] = useState(false);
  const maskRef = useRef(null);

  const onChange = (newKdtId: number) => {
    if (!newKdtId) {
      setShowShopList(false);
    }
    onChangeTargetKdtId(newKdtId);
  };

  const onOpen = () => {
    setShowShopList(true);
  };

  const [shopList, setShopList] = useState([initialState]);

  useEffect(() => {
    findListAllCampusAPI().then((data) => {
      const options: IShopListDataModel[] = (showHqStore ? [initialState] : []).concat(data);
      setShopList(options);
    });
  }, [showHqStore]);

  return (
    <div className={clsPrefix}>
      {`${BRANCH_STORE_NAME}范围`}
      { isPartnerStore ? (
        <div ref={maskRef}>
          <StatShopSelect
            className={`${clsPrefix}__right`}
            rootShop={_global.shopInfo}
            kdtId={targetKdtId}
            shopList={showShopList ? shopList : []}
            onChange={onChange}
            onOpen={onOpen}
            divideItems={divideItems}
            placeholder={`选择${BRANCH_STORE_NAME}`}
            filter={showFilter ? (item, keyword) => item.shopName.includes(keyword) : null}
          />
          <MaskGuide fieldRef={maskRef} storageKey={`live-partner-list-${_global.kdtId}`} styles={{ top: '0', left: '0' }} popClassName='live-selector__pop'/>
        </div>)
        : (<StatShopSelect
          className={`${clsPrefix}__right`}
          rootShop={_global.shopInfo}
          kdtId={targetKdtId}
          shopList={showShopList ? shopList : []}
          onChange={onChange}
          onOpen={onOpen}
          divideItems={divideItems}
          placeholder={`选择${BRANCH_STORE_NAME}`}
          filter={showFilter ? (item, keyword) => item.shopName.includes(keyword) : null}
        />)
      }
    </div>
  );
}

export default CampusFilter;
