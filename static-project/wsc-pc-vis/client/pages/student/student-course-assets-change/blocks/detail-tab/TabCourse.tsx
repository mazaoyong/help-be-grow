import * as React from 'react';
import { Notify } from 'zent';
import { EasyList } from '@youzan/ebiz-components';
import get from 'lodash/get';
import format from 'date-fns/format';
import { IEasyGridColumn, IListProps, IListContext, IRenderPropsType, ICombinedFilterConf } from '@youzan/ebiz-components/es/types/easy-list';
import { IEduAssetOperationInfoDTO, IPage } from 'definitions/api/owl/pc/EduAssetOperationFacade/queryAssetOperationPage';
import { queryAssetOperationPage } from '../../api';
import { IListQuery, ITabProps } from './types';
import { getNillStringRemovedObj, getNumberContent, getSafeCourseNumber } from './utils';
import { CHANGE_TYPE } from './constants';

const { List, Filter, EasyGrid, DatePickerTypes } = EasyList;

const TabCourse: React.FC<ITabProps> = (props) => {
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
        width: '56px',
        fixed: true,
        bodyRender(item) {
          return (
            <span>{item.changeType === CHANGE_TYPE.INCREASE ? '增加' : '减少'}</span>
          );
        }
      },
      {
        title: '变更内容',
        fixed: true,
        width: '84px',
        name: 'changeContent',
      },
      {
        title: '变更时间',
        name: 'eventTime',
        bodyRender(item) {
          return (
            <span>{format(item.eventTime, 'YYYY-MM-DD HH:mm:ss')}</span>
          );
        }
      },
      {
        title: '购买课时变更',
        nowrap: true,
        name: 'mainAssetChangeAmount',
        bodyRender(item) {
          const isIncrease = item.changeType === CHANGE_TYPE.INCREASE;
          const mainAssetChangeAmount = get(item, 'operationValueInfo.mainAssetChangeAmount');
          let map: { icon: string, className: string } = {
            icon: '',
            className: ''
          };
          if (mainAssetChangeAmount === 0) {
            map = {
              icon: '',
              className: ''
            };
          } else if (isIncrease) {
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
          let el = (
            <span className={map.className}>{map.icon}{getSafeCourseNumber(mainAssetChangeAmount)}</span>
          );
          return (
            <span>{el}</span>
          );
        }
      },
      {
        title: '赠送课时变更',
        nowrap: true,
        name: 'rewardAssetChangeAmount',
        bodyRender(item) {
          const isIncrease = item.changeType === CHANGE_TYPE.INCREASE;
          const rewardAssetChangeAmount = get(item, 'operationValueInfo.rewardAssetChangeAmount');
          let map: { icon: string, className: string } = {
            icon: '',
            className: ''
          };
          if (rewardAssetChangeAmount === 0) {
            map = {
              icon: '',
              className: ''
            };
          } else if (isIncrease) {
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
          let el = (
            <span className={map.className}>{map.icon}{getSafeCourseNumber(rewardAssetChangeAmount)}</span>
          );
          return (
            <span>{el}</span>
          );
        }
      },
      {
        title: '课时金额变更（元）',
        nowrap: true,
        name: 'mainAssetChangePrice',
        bodyRender(item) {
          const mainAssetChangePrice = get(item, 'operationValueInfo.mainAssetChangePrice');
          const isIncrease = item.changeType === CHANGE_TYPE.INCREASE;
          let map: { icon: string, className: string } = {
            icon: '',
            className: ''
          };
          if (mainAssetChangePrice === 0) {
            map = {
              icon: '',
              className: ''
            };
          } else if (isIncrease) {
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
          let el = (
            <span className={map.className}>{map.icon}{getSafeCourseNumber(mainAssetChangePrice)}</span>
          );
          return (
            <span>{el}</span>
          );
        }
      },
      {
        title: '剩余/总课时',
        nowrap: true,
        name: 'assetAmount',
        bodyRender(item) {
          const operationValueInfo = item.operationValueInfo || {};
          const { assetAmount, assetRemaining } = operationValueInfo;
          return <span>
            {getNumberContent(getSafeCourseNumber(assetRemaining))}/{getNumberContent(getSafeCourseNumber(assetAmount))}
          </span>;
        }
      },
      {
        title: '备注',
        width: '200px',
        name: 'remark',
        bodyRender(item) {
          let el = item.remark.map((o, index) => {
            return (<p key={index}>{o}</p>);
          });
          return <div>
            {el}
          </div>;
          // return <PopEllipsisText count={30} text={el} nowarp={false} />;
        }
      },
      {
        title: '操作人',
        name: 'operator',
        // nowrap: true,
        width: '300px',
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
        operationOriginType: 1,
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
        rowKey="orderNo"
        scroll={{ x: 1200 }}
      />
    </List>
  );
};

export default TabCourse;
