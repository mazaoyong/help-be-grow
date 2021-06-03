import React, { FC, useState, useMemo } from 'react';
import { hashHistory } from 'react-router';
import VisList, { VisFilterTable } from 'components/vis-list';
import { teacherOptions, defaultTeacherOptions, teacherColumns } from './teacher-columns';
import { Button as SamButton, Notify } from 'zent';
import { IListDataSets, ITeacherFilter } from '../interface';
import { queryTeacherListWithStatistic, exportTeacherListWithStatistic } from '../../../api/teachers';
import { validDateRange } from '../time-utils';
import { findPageAllCampus } from '../../../api/shop';
import { format } from 'date-fns';
import { isInStoreCondition } from 'fns/chain';
import { getExportRecordUrl, EXPORT_RECORD_TYPES } from '@ability-center/ump/export-record';
import './index.scss';

interface IShopRouter {
  text: string;
  value: string;
}

const TearcherList: FC<{}> = () => {
  const [shopList, setShopList] = useState<IShopRouter[]>([]);
  const [shopName, setShopName] = useState<string>('');
  const fetchData = ({ filterConditions, pageConditions }): Promise<IListDataSets | void> => {
    const query: object = {
      kdtId: filterConditions.kdtId || _global.kdtId,
      keyword: filterConditions.keyword,
    };
    if (filterConditions.dateRange && filterConditions.dateRange.length === 2) {
      query['startDate'] = format(filterConditions.dateRange[0], 'YYYY-MM-DD HH:mm:ss');
      query['endDate'] = format(filterConditions.dateRange[1], 'YYYY-MM-DD HH:mm:ss');
    }
    return queryTeacherListWithStatistic({
      query,
      pageRequest: pageConditions,
    }).then(resp => {
      return {
        datasets: resp.content || [],
        total: resp.total || 0,
        current: parseInt(pageConditions.pageNumber),
      };
    }).catch(err => {
      Notify.error(err);
    });
  };

  const exportDataUrl = useMemo(() => {
    return getExportRecordUrl({ type: EXPORT_RECORD_TYPES.TEACHER_LIST });
  }, []);

  const onCourseExport = (data: Partial<ITeacherFilter>): void => {
    const query: object = {
      keyword: data.keyword,
    };
    if (data.dateRange && data.dateRange.length === 2) {
      query['startDate'] = format(data.dateRange[0], 'YYYY-MM-DD HH:mm:ss');
      query['endDate'] = format(data.dateRange[1], 'YYYY-MM-DD HH:mm:ss');
    }
    if (isInStoreCondition({ supportEduHqStore: true }) && data.kdtId) {
      query['kdtId'] = data.kdtId;
    }
    exportTeacherListWithStatistic({
      query,
    }).then(resp => {
      if (resp) {
        Notify.success('导出列表成功');
        window.open(exportDataUrl);
      }
    }).catch(err => {
      Notify.error(err);
    });
  };

  const renderBottomAction: FC<{submit: ()=>void, reset: ()=>void, data: ()=>any}> = (filter) => {
    const { submit, reset, data } = filter;
    const filterData: Partial<ITeacherFilter> = data();
    const onSubmit = (data: Partial<ITeacherFilter>): void => {
      const errMessage = validDateRange(data.dateRange);
      if (!errMessage) {
        submit();
        pushQuery();
      } else {
        Notify.error(errMessage);
      }
    };
    return (
      <>
        <SamButton type="primary" onClick={() => onSubmit(filterData)}>
          筛选
        </SamButton>
        <SamButton onClick={() => onCourseExport(filterData)}>
          导出报表
        </SamButton>
        <SamButton onClick={() => { window.open(exportDataUrl); } }>
          查看已生成的报表
        </SamButton>
        <span className="filter__actions__reset" onClick={reset}>
          重置筛选条件
        </span>
      </>
    );
  };

  // @ts-ignore
  const getDefaultEduShopOption: (() => IShopRouter | void) = () => {
    // todo 有路由参数的时候需要回填
    const location = hashHistory.getCurrentLocation();
    const query = location.query || {};
    if (query.kdtId && query.shopName) {
      return { text: query.shopName, value: query.kdtId };
    }
  };

  const onShopSelected: (data: any, val: any) => void = (_, val) => {
    if (shopList && shopList.length) {
      const name = shopList.find((item: IShopRouter) => item.value === val);
      setShopName(name ? name.text : '');
    }
  };

  const pushQuery: () => void = () => {
    const location = hashHistory.getCurrentLocation();
    const query = location.query;
    const name = {
      shopName: shopName,
    };
    if (name.shopName) {
      location.query = { ...query, ...name };
    }

    if (name.shopName) {
      hashHistory.replace(location);
    }
  };

  const getShopOptions: (query: any, pageConditions: any) => Promise<any> = (query, pageConditions) => {
    const { name = null } = query || {};
    return findPageAllCampus({ shopCampusQuery: { hqKdtId: null, name }, pageRequest: pageConditions }).then(
      (res) => {
        const { content = [] } = res || {};
        const options = content.map(item => {
          return {
            text: item.shopName,
            value: item.kdtId,
          };
        });
        if (pageConditions.pageNumber === 1) {
          options.unshift({ text: '全部', value: '' });
        }
        setShopList(options);
        return options;
      },
    );
  };

  return (
    <div className='teacher-list-wrap'>
      <VisList>
        <VisFilterTable
          filterProps={
            {
              defaultValue: defaultTeacherOptions,
              options: teacherOptions({ getDefaultEduShopOption, onShopSelected, getShopOptions }),
              bottomActions: renderBottomAction,
            }
          }
          tableProps={
            {
              columns: teacherColumns(),
              fetchData: fetchData,
              rowKey: 'createdAt',
              pageConfig: {
                current: 1,
                pageSize: 10,
              },
            }
          }
        >
        </VisFilterTable>
      </VisList>
    </div>
  );
};

export default TearcherList;
