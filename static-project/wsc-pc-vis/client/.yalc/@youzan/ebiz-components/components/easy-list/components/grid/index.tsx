import React from 'react';
import { Grid, IGridProps, IGridOnChangeConfig } from 'zent';
import { isElement } from 'react-is';
import get from 'lodash/get';

import { IEasyGridProps, IEasyGridRef } from '../../types/grid';
import { adaptorConstructor, CUSTOM_COLUMNS_DIALOG_ID } from './constants';
import { useCustomColumns } from './hooks/use-custom-columns';
import { useAdaptionScrollWidth } from './hooks/use-adaption-scroll-width';
import { useSelectConfig } from './hooks/use-select-config';
import { RadioContextProvider } from './utils/radio-context';
import { getRadioConfig } from './components/easy-grid-radio';
import { getDecoratedColumns } from './utils/get-decorated-columns';

type RequiredGridProps = Required<IGridProps>;
const EasyGridWithRef = React.forwardRef<IEasyGridRef, IEasyGridProps>(function EasyGrid(
  props,
  ref
) {
  const {
    // grid override props
    columns,
    /** 可以省略这个参数，直接使用selection */
    easySelection,
    datasets: passiveDatasets,
    selection: passiveSelection,
    // page info
    pageNumber: passivePageNumber,
    pageSize: passivePageSize,
    pageSizeOptions,
    total: passiveTotal,
    // sort
    sortBy: passiveSortBy,
    sortType: passiveSortType,
    // others
    emptyLabel,
    emptyCreateLabel,
    customColumns = false,
    customColumnsCacheKey,
    customColumnsTriggerText,
    customColumnsDialogTitle,
    scroll,
    rowKey = 'id',
    onChange,
    ...restGridProps
  } = props;
  const gridRef = React.useRef<HTMLDivElement | null>(null);
  const { queries: adaptorQueries, setFilter } = React.useMemo(() => adaptorConstructor(props), [
    props,
  ]);
  // 需要响应一下GState中的selectedRowKeys的变化
  const listCtxSelectedKeys = React.useMemo(() => adaptorQueries.selectedRowKeys, [
    adaptorQueries.selectedRowKeys,
  ]);
  const selectConfig = useSelectConfig(passiveSelection || easySelection);
  // 修改成只在初始化的时候向URL获取一次已选项
  const [selectedRowKeys, setSelectedRowKeys] = React.useState(() =>
    get(selectConfig, 'selectedRowKeys')
  );
  React.useImperativeHandle(ref, () => ({ setSelectedRowKeys }));

  // 不管有没有开启自定义表头的开关，都走一遍过滤
  const { displayColumns, CustomColumnsTrigger } = useCustomColumns({
    columns,
    customColumns,
    customColumnsCacheKey,
    customColumnsTriggerText,
    customColumnsDialogTitle,
    ref: gridRef.current,
  });
  const wrappedColumns = React.useMemo(() => {
    const { columns: decoratedCols, params } = getDecoratedColumns(displayColumns);
    const { hasLeftFixedCol } = params;
    if (selectConfig && selectConfig.selectType === 'single') {
      // 渲染单选框
      decoratedCols.unshift(getRadioConfig({ rowKey, isFixed: hasLeftFixedCol }));
    }
    return decoratedCols;
  }, [displayColumns, rowKey, selectConfig]);

  const columnWidthList = React.useMemo(
    () =>
      wrappedColumns.map((column) => {
        const matchRes = String(column.width).match(/^(\d+)/);
        return Number(get(matchRes, '[1]', 0));
      }),
    [wrappedColumns]
  );
  const scrollProps = useAdaptionScrollWidth({
    gridRef,
    enableScroll: scroll !== undefined,
    passiveScroll: scroll as any,
    columnSize: columnWidthList.filter((size) => size > 0).length,
    columnWidthList,
  });

  const handleSelect = React.useCallback(
    (newSelectedRowKeys: any[], selectedRows: any[], changedRow: any) => {
      if (selectConfig) {
        const passiveSelectHandler = selectConfig.onSelect;
        const canSelect = passiveSelectHandler
          ? passiveSelectHandler(newSelectedRowKeys, selectedRows, changedRow)
          : true;
        if (canSelect) {
          // 这里没有用，zent/Grid的selectedRowKeys是非受控的模式运行，垃圾玩意
          setSelectedRowKeys(newSelectedRowKeys);
        } else {
          /* istanbul ignore next */
          if (selectConfig.selectType === 'multiple') {
            // 如果是多选模式，强制刷新一下备选项
            setSelectedRowKeys((prev) => [...(prev || [])]);
          }
        }
      }
      return true;
    },
    [selectConfig]
  );

  const handleGetCheckboxProps = React.useCallback(
    (data: any) => {
      if (selectConfig) {
        const passiveCheckboxHandler = selectConfig.getCheckboxProps;
        if (passiveCheckboxHandler) {
          return passiveCheckboxHandler(data);
        }
      }
      return {};
    },
    [selectConfig]
  );

  const handleChange = React.useCallback(
    (next: IGridOnChangeConfig) => {
      onChange && onChange(next);
      const {
        current: nextPageNumber,
        pageSize: nextPageSize,
        sortBy: nextSortBy,
        sortType: nextSortType,
      } = next;
      const nextFilter = {
        page: nextPageNumber,
        pageSize: nextPageSize,
        sortType: nextSortType,
        sortBy: nextSortBy,
      };
      setFilter(nextFilter);
    },
    [onChange, setFilter]
  );

  const pageInfo = React.useMemo<RequiredGridProps['pageInfo']>(() => {
    const { pageNumber, pageSize, total } = adaptorQueries;
    return {
      current: passivePageNumber || pageNumber,
      pageSize: passivePageSize || pageSize,
      total: passiveTotal || total,
      pageSizeOptions,
    };
  }, [adaptorQueries, pageSizeOptions, passivePageNumber, passivePageSize, passiveTotal]);

  const EmptyLabel = React.useMemo(() => {
    if (isElement(emptyLabel)) return emptyLabel;
    return (
      <div className="easy-list__empty-label">
        <span>没有更多数据了</span>
        {isElement(emptyCreateLabel) && emptyCreateLabel}
      </div>
    );
  }, [emptyCreateLabel, emptyLabel]);

  const datasets = React.useMemo(() => passiveDatasets || adaptorQueries.datasets, [
    adaptorQueries.datasets,
    passiveDatasets,
  ]);

  const selectSettings = React.useMemo(() => {
    if (selectConfig && selectConfig.selectType === 'multiple') {
      return {
        selection: {
          selectedRowKeys: selectedRowKeys || listCtxSelectedKeys,
          onSelect: handleSelect,
          getCheckboxProps: handleGetCheckboxProps,
        },
      };
    }
    return {};
  }, [handleGetCheckboxProps, handleSelect, listCtxSelectedKeys, selectConfig, selectedRowKeys]);

  const selectConfigAdaptor = React.useMemo(() => {
    switch (selectConfig && selectConfig.selectType) {
      case 'single':
        return {
          selectedRowKey: get(selectConfig, 'selectedRowKeys[0]'),
          handleSelect: get(selectConfig, 'onSelect'),
        };

      case 'multiple':
      default:
        return {
          selectedRowKey: get(selectSettings, 'selection.selectedRowKeys[0]'),
          handleSelect: get(selectSettings, 'selection.onSelect'),
        };
    }
  }, [selectConfig, selectSettings]);

  return (
    <div data-testid="easy-grid" ref={gridRef} className="easy-grid-container">
      <div id={CUSTOM_COLUMNS_DIALOG_ID}>{CustomColumnsTrigger}</div>
      <RadioContextProvider {...selectConfigAdaptor} getRadioProps={handleGetCheckboxProps}>
        <Grid
          {...restGridProps}
          {...scrollProps}
          {...selectSettings}
          rowKey={rowKey}
          columns={wrappedColumns}
          datasets={datasets}
          emptyLabel={EmptyLabel}
          onChange={handleChange}
          pageInfo={pageInfo}
          sortBy={passiveSortBy || adaptorQueries.sortBy}
          sortType={passiveSortType || adaptorQueries.sortType}
          loading={restGridProps.loading || adaptorQueries.loading}
        />
      </RadioContextProvider>
    </div>
  );
});

EasyGridWithRef.defaultProps = {
  pageable: true,
};

export default EasyGridWithRef;
