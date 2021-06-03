import React from 'react';
import SchoolSelector from '@ability-center/shop/school-selector';
import './index.scss';

import { BRANCH_STORE_NAME } from 'constants/chain';

const fetch = (campusShopList, pageConditions, length) => {
  const { content = [] } = setFetchData(campusShopList);
  const total = length;
  return new Promise((resolve, reject) => {
    const results = {
      content,
      pageable: {
        pageNumber: pageConditions.current || 1
      },
      total
    };
    resolve(results);
  });
};

const setFetchData = campusShopList => {
  const content = campusShopList.map(campus => {
    let obj = {};
    obj.shopName = campus.shopName;
    obj.address = campus.address;
    obj.lifecycleStatus = campus.lifecycleStatus || '';
    obj.lifecycleEndTime = campus.lifecycleEndTime;
    return obj;
  });

  return { content };
};

const parseCampusShopList = (campusShopList, pageConditions) => { // 前端分页
  const { current, pageSize } = pageConditions;
  return campusShopList.slice((current - 1) * pageSize, current * pageSize);
};

export const SchoolTD = (props) => {
  const { campusShopList = [], isAllCampus = true, title = '' } = props.data;
  const originLength = campusShopList.length; // 真实的长度
  const [openDialog, SchoolDialog] = SchoolSelector({
    componentConfig: {
      Filter: <div className= "activity-name">参与活动名称：{title}</div>,
      Foot: null,
      hasSelect: false,
      fetch: ({
        filterConditions = {},
        pageConditions
      }) => {
        const parsedCampusShopList = parseCampusShopList(campusShopList, pageConditions);
        return fetch(parsedCampusShopList, pageConditions, originLength);
      }
    },
    dialogConfig: {
      title: `参与活动${BRANCH_STORE_NAME}`
    }
  });
  return <>
    { !!isAllCampus && <span>全部</span>}
    { !isAllCampus && <>
      <span><a href="javascript: void(0);" onClick={openDialog}>{campusShopList.length}</a></span>
      <SchoolDialog />
    </>
    }
  </>;
};
