import React, { useRef, useCallback } from 'react';
import SchoolSelector from '@ability-center/shop/school-selector';
import { getCompusAPI } from '../../api/edit';
import { Notify } from 'zent';

const parseCampusShopList = (campusShopList, pageConditions) => { // 前端分页
  const { current, pageSize } = pageConditions;
  return campusShopList.slice((current - 1) * pageSize, current * pageSize);
};

export default ({ name, designateType, designatedKdtIds = [] }) => {
  let campusShopList = useRef([]);

  const getCampus = useCallback(() => {
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
  }, [designateType, designatedKdtIds]);

  const [openDialog, SchoolDialog] = SchoolSelector({
    componentConfig: {
      Filter: <div className="activity-name">参与活动名称：{name}</div>,
      Foot: null,
      hasSelect: false,
      fetch: ({
        pageConditions,
      }) => {
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

  if (designateType === 1) {
    return <span>全部校区</span>;
  }

  return (
    <>
      <span className="cursor-link" onClick={handleClick}>{designatedKdtIds.length}</span>
      <SchoolDialog />
    </>
  );
};
