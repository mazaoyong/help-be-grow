import React, { useRef, useCallback } from 'react';
import SchoolSelector from '@ability-center/shop/school-selector';
import { getCompusAPI } from './api';
import { Notify } from 'zent';
import './style.scss';

const parseCampusShopList = (campusShopList, pageConditions) => {
  // 前端分页
  const { current, pageSize } = pageConditions;
  return campusShopList.slice((current - 1) * pageSize, current * pageSize);
};

export default ({ label = '参与活动名称：', name, designateType, designatedKdtIds = [] }) => {
  let campusShopList = useRef([]);

  const getCampus = useCallback(() => {
    if (designatedKdtIds.length) {
      return getCompusAPI({
        isAllCampus: designateType === 1,
        campusKdtIds: designatedKdtIds,
      })
        .then((res = []) => {
          const campus = res.map(campu => {
            const { province, city, county, address } = campu.address || {};
            const wholeAddress = `${province}${city}${county}${address}`;
            return Object.assign({}, campu, { address: wholeAddress });
          });
          campusShopList.current = campus;
        })
        .catch(msg => Notify.error(msg || '网络错误'));
    }
    return Promise.resolve();
  }, [designateType, designatedKdtIds]);

  const [openDialog, SchoolDialog] = SchoolSelector({
    componentConfig: {
      Filter: (
        <div className="activity-name">
          {label}
          {name}
        </div>
      ),
      Foot: null,
      hasSelect: false,
      fetch: ({ filterConditions = {}, pageConditions }) => {
        if (campusShopList.current.length === 0) {
          return getCampus().then(() => {
            const campus = campusShopList.current;
            const parsedCampusShopList = parseCampusShopList(campus, pageConditions);

            return {
              content: parsedCampusShopList,
              pageable: {
                pageNumber: 1,
              },
              total: campus.length,
            };
          });
        }
        const campus = campusShopList.current;
        const parsedCampusShopList = parseCampusShopList(campus, pageConditions);
        const datasets = {
          content: parsedCampusShopList,
          pageable: {
            pageNumber: pageConditions.current || 1,
          },
          total: campus.length,
        };
        return Promise.resolve(datasets);
      },
    },
    dialogConfig: {
      title: '参与活动校区',
    },
  });

  const handleClick = useCallback(() => {
    openDialog();
  }, [openDialog]);

  return (
    <>
      <span className="cursor-link" onClick={handleClick}>
        {designateType === 1 ? '全部' : designatedKdtIds.length}
      </span>
      <SchoolDialog />
    </>
  );
};
