import React from 'react';
import { BlockLoading, Notify } from 'zent';
import get from 'lodash/get';
import SortableJS, { SortableEvent, Swap } from 'sortablejs';

import DragListBox from './drag-list-box';
import DragListHeader from './drag-list-header';
import { IDragListProps } from './types';
import './styles.scss';
import DragListItem from './drag-list-item';
import { useLayoutEffect } from '../utils/use-ssr-hooks';

const DragListContainer: React.FC<IDragListProps> = (props) => {
  const {
    filter,
    noData,
    rowKey,
    columns,
    updateSignal,
    onOrderChange,
    fetchDatasets,
    icon = 'drag',
    disabledAnchor,
    iconSize = '1rem',
    iconColor = '#999',
    swap = false,
    swapClass = 'swap-standard-style',
    ghostClass,
    dragClass,
    chosenClass,
  } = props;
  const [keyFlag, setKeyFlag] = React.useState(0);
  const [dragDatasets, setDragDatasets] = React.useState<Record<string, any>[]>([]);
  const [frozenDatasets, setFrozenDatasets] = React.useState<Record<string, any>[]>([]);
  const [prevOrderDatasets, setPrevOrderDatasets] = React.useState<Record<string, any>[]>([]);
  const [loading, setLoading] = React.useState(false);
  const sortableRef = React.useRef<SortableJS | null>(null);
  const dragRef = React.useRef<HTMLTableSectionElement | null>(null);

  const getGroupedDatasets = React.useCallback(
    (datasets: Record<string, any>[]) => {
      const drag: Record<string, any>[] = [];
      const frozen: Record<string, any>[] = [];

      if (datasets.length) {
        if (filter) {
          datasets.forEach((rowData, index) => {
            rowData.currentId = index;
            if (filter(rowData)) {
              drag.push(rowData);
            } else {
              frozen.push(rowData);
            }
          });
        } else return [datasets, []];
      }
      return [drag, frozen];
    },
    [filter]
  );

  const fetchDatasetMethod = React.useCallback(() => {
    setLoading(true);
    fetchDatasets()
      .then((datasets) => {
        const [drag, frozen] = getGroupedDatasets(datasets);
        setDragDatasets(drag);
        setFrozenDatasets(frozen);
        setPrevOrderDatasets(drag);
        setKeyFlag((prevKeyFlag) => prevKeyFlag + 1);
      })
      .catch(Notify.error)
      .finally(() => setLoading(false));
  }, [fetchDatasets, getGroupedDatasets]);

  const baseDragItemProps = React.useMemo(
    () => ({
      icon,
      columns,
      iconSize,
      iconColor,
    }),
    [columns, icon, iconColor, iconSize]
  );

  const handleOrderChanged = React.useCallback<(evt: SortableEvent) => void>(
    (evt) => {
      const children = evt.to.children;
      const orders: number[] = [];
      for (let index = 0; index < children.length; index += 1) {
        const curChild = children[index] as HTMLTableRowElement;
        const orderNumber = Number(curChild.dataset.sortableId);
        if (!isNaN(orderNumber)) orders.push(orderNumber);
      }

      const sortableDatasets: Record<string, any>[] = [];
      orders.forEach((order) => sortableDatasets.push(dragDatasets[order] || {}));

      if (onOrderChange) {
        onOrderChange(sortableDatasets, prevOrderDatasets);
        setPrevOrderDatasets(sortableDatasets);
      }
    },
    [dragDatasets, onOrderChange, prevOrderDatasets]
  );

  React.useEffect(fetchDatasetMethod, []);
  React.useEffect(() => {
    if (updateSignal !== undefined) fetchDatasetMethod();
  }, [fetchDatasetMethod, updateSignal]);

  // mounted sortableJS
  useLayoutEffect(() => {
    if (!sortableRef.current && dragRef.current) {
      const baseOptions: SortableJS.Options = {
        // sortable anchor
        handle: '.ebiz-drag-list__content-dragAnchor',
        // delay to darg
        delay: 10,
        // sortable target
        dataIdAttr: 'data-sortable-id',
        // animation
        animation: 150,
        // auto scroll
        scroll: true,
        // classes
        ghostClass: ghostClass || 'ebiz-drag-list__content-placeholder',
        dragClass: dragClass || 'ebiz-drag-list__content-move',
        chosenClass: chosenClass || 'ebiz-drag-list__content-chosen',
      };
      const addonOption: Record<string, any> = {};
      if (swap) {
        SortableJS.mount(new Swap());
        addonOption.swap = true;
        addonOption.swapClass = swapClass;
        // 如果是交换模式，需要将修改ghost节点为显示状态
        addonOption.ghostClass = ghostClass;
        addonOption.chosenClass = chosenClass;
      }
      sortableRef.current = SortableJS.create(
        dragRef.current,
        Object.assign({}, baseOptions, addonOption)
      );
    }
    return () => {
      if (sortableRef.current) {
        sortableRef.current.destroy();
        sortableRef.current = null;
      }
    };
  }, [chosenClass, dragClass, ghostClass, swap, swapClass]);

  React.useEffect(() => {
    if (sortableRef.current) {
      // hooks
      sortableRef.current.option('onEnd', handleOrderChanged);
    }
  }, [handleOrderChanged]);

  return (
    <BlockLoading className="ebiz-drag-list__loading-container" loading={loading}>
      <div className="ebiz-drag-list__container">
        <DragListHeader columns={columns} className="ebiz-drag-list__header" />
        <DragListBox columns={columns} className="ebiz-drag-list__content">
          <tbody ref={dragRef}>
            {dragDatasets.length + frozenDatasets.length === 0 ? (
              <tr className="no-data">
                <td colSpan={99}>{noData || '没有更多数据了'}</td>
              </tr>
            ) : (
              dragDatasets.map((dataset) => (
                <DragListItem
                  datasets={dataset}
                  orderId={dataset.currentId}
                  // 添加一个更新标志，用于在排序失败之后重新设置节点位置
                  key={get(dataset, rowKey, dataset.currentId) + '_' + keyFlag}
                  {...baseDragItemProps}
                />
              ))
            )}
          </tbody>
          <tbody role="disabled-content">
            {frozenDatasets.length
              ? frozenDatasets.map((dataset) => (
                  <DragListItem
                    noAnchor
                    datasets={dataset}
                    orderId={dataset.currentId}
                    disabledAnchor={disabledAnchor}
                    key={get(dataset, rowKey, dataset.currentId) + '_' + keyFlag}
                    {...baseDragItemProps}
                  />
                ))
              : null}
          </tbody>
        </DragListBox>
      </div>
    </BlockLoading>
  );
};

export default DragListContainer;
