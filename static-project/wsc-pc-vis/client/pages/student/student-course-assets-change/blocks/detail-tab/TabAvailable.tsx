import * as React from 'react';
import { Notify } from 'zent';
import { EasyList } from '@youzan/ebiz-components';
import format from 'date-fns/format';
import get from 'lodash/get';
import { IEasyGridColumn, IListProps, IListContext, IRenderPropsType, ICombinedFilterConf } from '@youzan/ebiz-components/es/types/easy-list';
import { IEduAssetOperationInfoDTO, IPage } from 'definitions/api/owl/pc/EduAssetOperationFacade/queryAssetOperationPage';
import { queryAssetOperationPage } from '../../api';
import { IListQuery, ITabProps } from './types';
import { getNillStringRemovedObj } from './utils';
import { CHANGE_TYPE } from './constants';

const { List, Filter, EasyGrid, DatePickerTypes } = EasyList;

const TabAvailable: React.FC<ITabProps> = (props) => {
  const listRef = React.useRef<IListContext>(null);
  const filterRef = React.useRef<IRenderPropsType>(null);

  const getFilterConfig: ICombinedFilterConf[] = [
    {
      name: 'changeType',
      label: '类型：',
      type: 'Select',
      defaultValue: '0',
      options: [
        { text: '全部类型', value: '0' },
        { text: '增加', value: '1' },
        { text: '减少', value: '2' }
      ],
    },
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
        title: '类型',
        name: 'changeType',
        width: '119px',
        bodyRender(item) {
          return (
            <span>{item.changeType === CHANGE_TYPE.INCREASE ? '增加' : '减少'}</span>
          );
        },
        fixed: true
      },
      {
        title: '变更内容',
        name: 'changeContent',
        width: '171px',
        fixed: true
      },
      {
        title: '变更时间',
        name: 'eventTime',
        nowrap: true,
        bodyRender(item) {
          return (
            <span>{format(item.eventTime, 'YYYY-MM-DD HH:mm:ss')}</span>
          );
        }
      },
      {
        title: '有效期变更（天）',
        name: 'mainAssetChangeAmount',
        nowrap: true,
        bodyRender(item) {
          const { validityChange } = item.operationValidityInfo || {};
          const isIncrease = item.changeType === CHANGE_TYPE.INCREASE;
          let map: { icon: string, className: string } = {
            icon: '',
            className: ''
          };
          if (validityChange === '永久有效' || validityChange === '未设置有效期') {
            map = {
              icon: '',
              className: ''
            };
          } else {
            if (isIncrease) {
              map = {
                icon: '+ ',
                className: 'tab-course__highlight'
              };
            } else {
              map = {
                icon: '- ',
                className: ''
              };
            }
          }
          let el = (
            <span className={map.className}>{map.icon}{`${validityChange}`}</span>
          );
          return (
            <span>{el}</span>
          );
        }
      },
      {
        title: '有效期',
        name: 'validity',
        nowrap: true,
        bodyRender(item) {
          return <span>{get(item, 'operationValidityInfo.validity')}</span>;
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
      const changeType = state.changeType;
      const time = (state.time && state.time[0]) || [];
      const query: IListQuery = {
        kdtId: props.kdtId,
        studentId: props.studentId,
        changeType: changeType || '0',
        startTime: time[0],
        endTime: time[1],
        operationOriginType: 2,
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
        scroll={{ x: 1200 }}
        rowKey="orderNo"
      />
    </List>
  );
};

export default TabAvailable;
