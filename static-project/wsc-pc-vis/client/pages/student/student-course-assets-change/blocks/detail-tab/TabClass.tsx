import * as React from 'react';
import { Notify } from 'zent';
import { EasyList } from '@youzan/ebiz-components';
import get from 'lodash/get';
import format from 'date-fns/format';
import { IEasyGridColumn, IListProps, IListContext, IRenderPropsType, ICombinedFilterConf } from '@youzan/ebiz-components/es/types/easy-list';
import { IEduAssetOperationInfoDTO, IPage } from 'definitions/api/owl/pc/EduAssetOperationFacade/queryAssetOperationPage';
import { queryAssetOperationPage } from '../../api';
import { IListQuery, ITabProps } from './types';
import { getNillStringRemovedObj } from './utils';

const { List, Filter, EasyGrid, DatePickerTypes } = EasyList;

const TabAvailable: React.FC<ITabProps> = (props) => {
  const listRef = React.useRef<IListContext>(null);
  const filterRef = React.useRef<IRenderPropsType>(null);

  const getFilterConfig: ICombinedFilterConf[] = [
    {
      name: 'time',
      label: '变更时间：',
      type: DatePickerTypes.DateRangeQuickPicker,
      inheritProps: {
        canClear: true,
        format: 'YYYY-MM-DD HH:mm:ss',
      }
    },
  ];
  const columns = React.useCallback(() => {
    return [
      {
        title: '名称',
        name: 'changeContent',
        width: '119px',
        fixed: true
      },
      {
        title: '变更时间',
        name: 'eventTime',
        fixed: true,
        width: '171px',
        bodyRender(item) {
          return (
            <span>{format(item.eventTime, 'YYYY-MM-DD HH:mm:ss')}</span>
          );
        }
      },
      {
        title: '变更前班级',
        name: 'oldclassName',
        nowrap: true,
        bodyRender(item) {
          return <span>{get(item, 'operationClassInfo.oldClassInfo.className')}</span>;
        }
      },
      {
        title: '变更前班级有效期',
        nowrap: true,
        name: 'oldClassInfo',
        bodyRender(item) {
          const oldClassInfo = get(item, 'operationClassInfo.oldClassInfo');
          const { validity } = oldClassInfo || {};
          return (
            <span>{validity}</span>
          );
        }
      },
      {
        title: '变更后班级',
        name: 'newclassName',
        nowrap: true,
        bodyRender(item) {
          return <span>{get(item, 'operationClassInfo.newClassInfo.className')}</span>;
        }
      },
      {
        title: '变更后班级有效期',
        name: 'newClassInfo',
        nowrap: true,
        bodyRender(item) {
          const newClassInfo = get(item, 'operationClassInfo.newClassInfo');
          const { validity } = newClassInfo || {};
          return (
            <span>{validity}</span>
          );
        }
      },
      {
        title: '备注',
        name: 'remark',
        width: '200px',
        bodyRender(item) {
          let el = item.remark.map((o, index) => {
            return (<p key={index}>{o}</p>);
          });
          return <div>
            {el}
          </div>;
        }
      },
      {
        title: '操作人',
        name: 'operator',
        nowrap: true,
        bodyRender(item) {
          let el = item.operator.map((o, index) => {
            return (<p key={index}>{o}</p>);
          });
          return <div>
            {el}
          </div>;
        }
      },
    ] as IEasyGridColumn<IEduAssetOperationInfoDTO>[];
  }, []);

  const fetch = React.useCallback<IListProps['onSubmit']>((state, globalState) => {
    return new Promise((resolve, reject) => {
      console.log('fetch state', state, globalState);
      const time = (state.time && state.time[0]) || [];
      const query: IListQuery = {
        kdtId: props.kdtId,
        studentId: props.studentId,
        startTime: time[0],
        endTime: time[1],
        operationOriginType: 3,
        assetNo: props.assetNo,
      };

      queryAssetOperationPage<IPage<IEduAssetOperationInfoDTO>>({
        query: getNillStringRemovedObj(query),
        pageRequest: {
          pageNumber: state.page,
          pageSize: state.pageSize,
          sort: { orders: [{ direction: ('DESC').toLocaleUpperCase(), property: 'created_at' }] },
        },
      })
        .then(res => {
          const { content = [], total = 0 } = res;
          // const { pageNumber = 0, pageSize = 0 } = pageable;
          resolve({
            dataset: content,
            pageInfo: { page: state.page, pageSize: state.pageSize, total },
          });
        })
        .catch(err => {
          reject(err);
          Notify.error(err);
        });
    });
  }, []);

  return (
    <List ref={listRef} mode="hash" onSubmit={fetch} defaultFilter={{ pageSize: 10 }}>
      <Filter
        ref={filterRef}
        config={getFilterConfig}
      />
      <EasyGrid
        columns={columns()}
        emptyLabel="还没有变更记录"
        scroll={{ x: 1400 }}
        rowKey="orderNo"
      />
    </List>
  );
};

export default TabAvailable;
