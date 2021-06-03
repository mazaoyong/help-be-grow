import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Button, Radio, Notify } from 'zent';
import { VisFilter, VisGrid } from 'components/vis-list';
import { filterOptions, columns } from './config';
import { Dialog } from '@youzan/ebiz-components';
import isString from 'lodash/isString';
import find from 'lodash/find';
import { queryRelatedOrder, findListAllCampusAPI } from '../../../../api';

import './style.scss';
import { isEduHqStore } from '@youzan/utils-shop';

const { Group: RadioGroup } = Radio;
const { DialogFooter } = Dialog;
const SelectOrder = ({ dialogref, data }) => {
  const [query, setQuery] = useState({});
  const [selectedOrderNo, setSelectOrderNo] = useState(null);
  const [dataList, setDataList] = useState([]);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [isFirstQuery, setIsFirstQuery] = useState(true);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [campus, setCampus] = useState([]);

  if (isFirstLoad) {
    if (data.state) {
      setQuery(data.state.query);
      setSelectOrderNo(data.state.orderNo);
      setCurrentPageNumber(data.state.pageNumber);
    }
    setIsFirstLoad(false);
  }

  useEffect(() => {
    findListAllCampusAPI().then(data => {
      const _campus = [
        {
          value: '',
          text: '全部',
        },
        {
          value: window._global.kdtId,
          text: '总部',
        },
      ].concat(
        data.map(item => ({
          value: item.kdtId,
          text: item.shopName,
        })),
      );
      setCampus([..._campus]);
    });
  }, []);

  const fetchData = useCallback(
    ({ pageConditions, filterConditions }) => {
      const { pageNumber } = pageConditions;

      const page = {
        pageNumber,
        pageSize: 5,
      };

      const requestParams = {
        ...filterConditions,
        clueId: data.clueId,
        from: 'pc',
      };

      if (requestParams.bookTime) {
        if (requestParams.bookTime.startTime === null) {
          delete requestParams.bookTime.startTime;
        }

        if (requestParams.bookTime.endTime === null) {
          delete requestParams.bookTime.endTime;
        }
      }

      if (isEduHqStore && !requestParams.targetKdtId) {
        delete requestParams.targetKdtId;
      }

      return queryRelatedOrder(page, requestParams).then(data => {
        if (!isFirstQuery) {
          setSelectOrderNo(null);
          setCurrentPageNumber(pageNumber);
        }
        setIsFirstQuery(false);
        return {
          datasets: data.content,
          total: data.total,
          current: pageNumber,
          pageSize: 5,
        };
      });
    },
    [data.clueId, isFirstQuery],
  );

  const onChange = e => {
    setSelectOrderNo(e.target.value);
  };

  const onSubmit = useCallback(() => {
    if (selectedOrderNo === null) {
      Notify.error('请先选择一个订单');
    } else {
      const order = find(dataList, o => o.orderNo === selectedOrderNo);
      if (order !== undefined) {
        dialogref.submit({
          order: {
            lessonName: order.lessonName,
            orderNo: order.orderNo,
            totalPay: order.totalPay,
            bookTime: order.bookTime,
            campusShopName: isEduHqStore ? order.campusShopName : null,
          },
          state: {
            query,
            pageNumber: currentPageNumber,
            orderNo: order.orderNo,
          },
        });
      } else {
        Notify.error('请重新选择订单');
      }
    }
  }, [dialogref, selectedOrderNo, dataList, query, currentPageNumber]);

  // 初始查询条件
  const defaultQuery = useMemo(() => {
    const _query = { ...query };
    if (_query.bookTime) {
      const { startTime, endTime } = _query.bookTime;
      _query.bookTime = new Array(2).fill(null);
      if (isString(startTime)) {
        _query.bookTime[0] = startTime.split(' ')[0];
      }
      if (isString(endTime)) {
        _query.bookTime[1] = endTime.split(' ')[0];
      }
    }

    if (_query.targetKdtId) {
      _query.targetKdtId = '';
    }

    return _query;
  }, [query]);

  return (
    <div className="edu__clue-detail-select-order-dialog">
      <VisFilter
        options={filterOptions(campus)}
        defaultValue={defaultQuery}
        bottomActions={({ submit, reset }) => {
          return (
            <div>
              <Button type="primary" onClick={submit}>
                筛选
              </Button>
              <a
                href="javascript:;"
                onClick={reset}
                style={{ marginLeft: '15px', color: '#155BD4' }}
              >
                重置筛选条件
              </a>
            </div>
          );
        }}
        onSubmit={values => {
          const { bookTime, lessonName, orderNo, studentName, targetKdtId } = values;
          const _query = {
            bookTime:
              bookTime === undefined
                ? {}
                : {
                  startTime: bookTime[0] ? bookTime[0] + ' 0:00:00' : null,
                  endTime: bookTime[1] ? bookTime[1] + ' 23:59:59' : null,
                },
            lessonName,
            orderNo,
            studentName,
            t: Date.now(),
          };
          if (isEduHqStore) {
            _query.targetKdtId = targetKdtId;
          }
          setQuery(_query);
        }}
      />
      <RadioGroup onChange={onChange} value={selectedOrderNo}>
        <VisGrid
          columns={columns}
          fetchData={fetchData}
          zanQueries={query}
          initQueries={{ pageNumber: currentPageNumber, ...query }}
          rowKey="orderNo"
          pageConfig={{ pageSize: 5 }}
          onDataChange={data => {
            setDataList(data);
          }}
        />
      </RadioGroup>
      <DialogFooter>
        <Button onClick={() => dialogref.close()}>取消</Button>
        <Button type="primary" onClick={onSubmit} disabled={selectedOrderNo === null}>
          确定
        </Button>
      </DialogFooter>
    </div>
  );
};

export default SelectOrder;
