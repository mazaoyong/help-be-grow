import React from 'react';
import SchoolSelector from '@ability-center/shop/school-selector';
import { findPageByEduCourse } from '../../../api/educourse';
import './index.scss';

export const SchoolTD = (props) => {
  const { id, applicableCampusList, applicableCampusType, name } = props.data;
  const [openDialog, SchoolDialog] = SchoolSelector({ componentConfig: {
    Filter: <div className= "shop-number-tips-wrap"><span className="shop-number-tips">{ `以下为课程"${name || '钢琴课'}"的上课校区`}</span ><span onClick={() => {
      window.open(`https://www.youzan.com/v4/vis/edu/page/educourse#/edit/${id}`);
    }} className="shop-number-link">去设置</span></div>,
    Foot: null,
    fetch: ({ filterConditions, pageConditions }) => {
      return findPageByEduCourse({
        eduCourseShopQuery: {
          id
        },
        pageRequest: {
          pageNumber: pageConditions.current,
          pageSize: pageConditions.pageSize
        }
      });
    },
    hasSelect: false
  } });
  return <>
    { !!applicableCampusType && <span>全部校区</span>}
    { !applicableCampusType && <>
      <span><a onClick={openDialog}>{applicableCampusList.length}</a>个</span>
      <SchoolDialog />
    </>
    }
  </>;
};
