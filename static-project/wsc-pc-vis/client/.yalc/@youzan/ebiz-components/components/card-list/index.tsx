import React, { FC, useCallback, useState, useEffect } from 'react';
import { Pagination, BlockLoading, IGridPageInfo, Radio, IRadioEvent } from 'zent';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';

import CardItem, { RowData } from '../card-item';
import { ICardListProps, IListSelectItem } from './types';
import 'zent/css/card.css';
import './styles.scss';

const RadioGroup = Radio.Group;

const initPageInfo: IGridPageInfo = {
  current: 1,
  pageSize: 20,
  total: 0,
};

const CardList: FC<ICardListProps> = (props) => {
  const {
    rowKey = 'id',
    pageInfo,
    fetchData,
    renderConfig,
    updatingSignal,
    emptyLabel = '没有更多数据了',
    selectable = false,
    onSelected = () => {},
    ...cardItemProps
  } = props;
  const mergedDefaultPageInfo = Object.assign({}, initPageInfo, pageInfo);
  const [loading, setLoading] = useState(false);
  const [datasets, setDatasets] = useState<RowData[]>([]);
  const [total, setTotal] = useState(mergedDefaultPageInfo.total);
  const [current, setCurrent] = useState(mergedDefaultPageInfo.current);
  const [pageSize, setPageSize] = useState(mergedDefaultPageInfo.pageSize);
  const [selectedItem, setSelectedItem] = useState<IListSelectItem | null>(null);

  const handlePageChange = useCallback<(detail: IGridPageInfo) => void>(
    (detail) => {
      const { current: curPage, pageSize: curPageSize } = detail;
      setCurrent(curPage || current);
      setPageSize(curPageSize || pageSize);
      // if (selectable) {
      //   setSelectedItem(null);
      // }
    },
    [current, pageSize]
  );

  const fetch = useCallback(
    (passivePageInfo: IGridPageInfo) => {
      setLoading(true);
      fetchData(passivePageInfo)
        .then((res) => {
          const { datasets, total } = res;
          setTotal(total);
          setDatasets(datasets);
          // if (selectable) {
          //   setSelectedItem(null);
          // }
        })
        .finally(() => setLoading(false));
    },
    [fetchData]
  );

  useEffect(() => {
    fetch({ current, pageSize });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, pageSize]);

  useEffect(() => {
    if (updatingSignal) {
      setCurrent(mergedDefaultPageInfo.current);
      setTotal(mergedDefaultPageInfo.total);
      fetch(Object.assign({}, mergedDefaultPageInfo, { pageSize }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updatingSignal]);

  const renderCard = useCallback(
    (rowData: RowData, index: number) => {
      const key = get(rowData, rowKey, index);
      return <CardItem key={key} rowData={rowData} {...renderConfig} {...cardItemProps} />;
    },
    [cardItemProps, renderConfig, rowKey]
  );

  const renderSelectedCard = useCallback(
    (rowData: RowData, index: number) => {
      const key = get(rowData, rowKey, index);
      return (
        <div
          className={`card-list__item__wrapper ${
            selectedItem && isEqual(selectedItem.item, rowData) ? 'card-list__item__selected' : ''
          }`}
        >
          <Radio value={index} />
          <CardItem key={key} rowData={rowData} {...renderConfig} {...cardItemProps} />
        </div>
      );
    },
    [cardItemProps, renderConfig, rowKey, selectedItem]
  );

  const onItemSelected = useCallback<(e: IRadioEvent<number>) => void>(
    (e) => {
      setSelectedItem({
        item: datasets[e.target.value || 0],
      });
      if (selectable && onSelected) {
        onSelected(datasets[e.target.value || 0]);
      }
    },
    [datasets, onSelected, selectable]
  );

  const checkRadioSelect = useCallback(
    (selectedItem) => {
      if (!selectedItem || !datasets) {
        return null;
      }

      for (let index = 0; index < datasets.length; index++) {
        if (isEqual(selectedItem.item, datasets[index])) {
          return index;
        }
      }

      return null;
    },
    [datasets]
  );

  return (
    <BlockLoading loading={loading} className="card-list__container">
      {datasets.length ? (
        selectable ? (
          <div className="card-list__list">
            <RadioGroup
              style={{ width: '100%' }}
              value={checkRadioSelect(selectedItem)}
              onChange={onItemSelected}
            >
              {datasets.map(renderSelectedCard)}
            </RadioGroup>
          </div>
        ) : (
          <div className="card-list__list">{datasets.map(renderCard)}</div>
        )
      ) : (
        <div className="card-list__list empty">
          <div className="card-list__item-container">{emptyLabel}</div>
        </div>
      )}
      <Pagination
        total={total}
        current={current}
        pageSize={pageSize}
        onChange={handlePageChange}
        pageSizeOptions={pageInfo && pageInfo.pageSizeOptions}
      />
    </BlockLoading>
  );
};

export default CardList;
export { CardItem };
export * from './types';
