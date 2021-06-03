import React from 'react';
import SchoolSelector from '@ability-center/shop/school-selector';
import './index.scss';

const fetch = (applicableCampusList, pageConditions, length) => {
  const { content = [] } = setFetchData(applicableCampusList);
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

const setFetchData = applicableCampusList => {
  const content = applicableCampusList.map(campus => {
    let obj = {};
    obj.shopName = campus.shopName;
    obj.address = campus.address;
    obj.lifecycleStatus = campus.lifecycleStatus || '';
    obj.lifecycleEndTime = campus.lifecycleEndTime;
    return obj;
  });

  return { content };
};

const parseApplicableCampusList = (applicableCampusList, pageConditions) => { // 前端分页
  const { current, pageSize } = pageConditions;
  return applicableCampusList.slice((current - 1) * pageSize, current * pageSize);
};

export const SchoolTD = (props) => {
  const { applicableCampusList = [], applicableCampusType = 1, title = '' } = props.data;
  const originLength = applicableCampusList.length; // 真实的长度
  const [openDialog, SchoolDialog] = SchoolSelector({
    componentConfig: {
      Filter: <div className= "activity-name">活动名称：{title}</div>,
      Foot: null,
      hasSelect: false,
      fetch: ({
        filterConditions = {},
        pageConditions
      }) => {
        const parsedApplicableCampusList = parseApplicableCampusList(applicableCampusList, pageConditions);
        return fetch(parsedApplicableCampusList, pageConditions, originLength);
      }
    },
    dialogConfig: {
      title: '参与活动校区'
    }
  });
  return <>
    { !!applicableCampusType && <span>全部校区</span>}
    { !applicableCampusType && <>
      <span><a href="javascript: void(0);" onClick={openDialog}>{applicableCampusList.length}</a></span>
      <SchoolDialog />
    </>
    }
  </>;
};
