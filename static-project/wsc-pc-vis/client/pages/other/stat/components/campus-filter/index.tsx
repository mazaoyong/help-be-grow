import React, { useContext, useState, useEffect } from 'react';
import { isEduBranchStore } from '@youzan/utils-shop';
import StatShopSelect from '../shop-select';
import { campus } from '../../reducers/campus';
import { findListAllCampusAPI } from '../../api';

import './index.scss';

const hqKdtId = isEduBranchStore ? _global.shopInfo.parentKdtId || _global.kdtId : _global.kdtId;

interface IProps {
  showHqStore?: boolean;
  showFilter?: boolean;
}

interface IShopListDataModel {
  kdtId: number;
  shopName: string;
}

const initialState: IShopListDataModel = {
  kdtId: hqKdtId,
  shopName: '总部',
};

const divideItems = [
  {
    text: '所有校区',
    kdtId: 0,
  },
];
const clsPrefix = 'campus-filter';

function CampusFilter(props: IProps) {
  const { showHqStore, showFilter } = props;
  const { context, dispatch } = useContext(campus);
  const [showShopList, setShowShopList] = useState(false);

  const onChange = (newKdtId: number) => {
    if (!newKdtId) {
      setShowShopList(false);
    }
    dispatch({ type: 'setState', payload: { subKdtId: newKdtId } });
  };

  const onOpen = () => {
    setShowShopList(true);
  };

  const [shopList, setShopList] = useState([initialState]);

  useEffect(() => {
    findListAllCampusAPI().then(data => {
      const options: IShopListDataModel[] = (showHqStore ? [initialState] : []).concat(data);
      setShopList(options);
    });
  }, [showHqStore]);

  return (
    <div className={clsPrefix}>
      校区范围
      <StatShopSelect
        className={`${clsPrefix}__right`}
        rootShop={_global.shopInfo}
        kdtId={context.subKdtId}
        shopList={showShopList ? shopList : []}
        onChange={onChange}
        onOpen={onOpen}
        divideItems={divideItems}
        filter={showFilter ? (item, keyword) => item.shopName.includes(keyword) : null}
      />
    </div>
  );
}

export default CampusFilter;
