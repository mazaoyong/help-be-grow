import React from 'react';
import ReactDOM from 'react-dom';

import { CUSTOM_COLUMNS_DIALOG_ID, CUSTOM_COLUMNS_KEY } from '../constants';

import { openModifyDisplayColumns } from '../components/modify-display-columns';

import { IEasyGridProps } from '../../../types/grid';
import { useLayoutEffect } from '../../../../utils/use-ssr-hooks';

type ColumnsType = IEasyGridProps['columns'];
interface IUseCustomColumnsRes {
  displayColumns: ColumnsType;
  CustomColumnsTrigger: React.ReactPortal | null;
}

const supportStorage = localStorage !== undefined;
export const useCustomColumns = (params: {
  columns: ColumnsType;
  customColumns: boolean;
  customColumnsCacheKey: string | undefined;
  customColumnsTriggerText: string | undefined;
  customColumnsDialogTitle: string | undefined;
  ref: HTMLDivElement | null;
}): IUseCustomColumnsRes => {
  const {
    columns,
    customColumns,
    customColumnsCacheKey,
    customColumnsTriggerText = '配置表头',
    customColumnsDialogTitle = '自定义表头',
    ref,
  } = params;
  const [renderReady, setRenderReady] = React.useState(false);
  const [displayIdxList, setDisplayIdxList] = React.useState(
    getDisplayIdxListFromStorage(customColumnsCacheKey)
  );

  const filterColumns: ColumnsType = React.useMemo(() => {
    let tempIdx = 0;
    return supportStorage
      ? columns.filter((column) => {
          const { forbidCustom = false } = column;
          if (forbidCustom) return true;
          if (!customColumns || !hasCustom(customColumnsCacheKey)) return true;
          return displayIdxList.includes(tempIdx++);
        })
      : columns;
  }, [columns, customColumns, customColumnsCacheKey, displayIdxList]);

  const handleClickTrigger = React.useCallback(() => {
    const altColumnNames = columns
      .filter(
        (column) =>
          !column.forbidCustom && (column.title !== undefined || column.altTitle !== undefined)
      )
      .map((column) => column.altTitle || (column.title as string));
    openModifyDisplayColumns({
      title: customColumnsDialogTitle,
      alternativeColumnNames: altColumnNames,
      displayColumnIdxList: !hasCustom(customColumnsCacheKey)
        ? altColumnNames.map((_, idx) => idx)
        : displayIdxList,
    })
      .afterClosed()
      .then((displayList) => {
        overrideDisplayIdxList(displayList, customColumnsCacheKey);
        setDisplayIdxList(displayList);
      })
      .catch(() => {
        /** do nothing */
      });
  }, [columns, customColumnsCacheKey, customColumnsDialogTitle, displayIdxList]);

  const CustomColumnsTrigger = React.useMemo(() => {
    if (renderReady) {
      if (customColumns && ref) {
        const hasBatchHeader = ref.querySelector('.zent-grid-batch') !== null;
        const injectNode = ref.querySelector(`#${CUSTOM_COLUMNS_DIALOG_ID}`)!;
        if (!hasBatchHeader) {
          injectNode.classList.add('no-batch-header');
        }
        return ReactDOM.createPortal(
          <div className="easy-grid__custom-columns">
            <a
              data-testid="custom-columns"
              className="easy-grid__custom-columns_trigger"
              onClick={handleClickTrigger}
            >
              {customColumnsTriggerText}
            </a>
          </div>,
          injectNode
        );
      }
    }
    return null;
  }, [customColumns, customColumnsTriggerText, handleClickTrigger, ref, renderReady]);

  useLayoutEffect(() => {
    setRenderReady(true);
  }, []);

  return {
    displayColumns: filterColumns,
    CustomColumnsTrigger,
  };
};

function getCurrentStorageKey(cacheKey?: string) {
  if (cacheKey) {
    return CUSTOM_COLUMNS_KEY + '$' + cacheKey;
  }
  // 不可能没有页面没有url吧
  const PAGE_NAME = location.href
    .match(/\/([\w_-]+)/g)!
    .pop()!
    .replace(/^\//, '');
  return CUSTOM_COLUMNS_KEY + '$' + PAGE_NAME;
}

function hasCustom(cacheKey: string | undefined) {
  return localStorage.getItem(getCurrentStorageKey(cacheKey)) !== null;
}

function getDisplayIdxListFromStorage(cacheKey: string | undefined): number[] {
  const idxListString = localStorage.getItem(getCurrentStorageKey(cacheKey));
  if (idxListString) {
    return idxListString.split('::').map(Number);
  }
  return [];
}

function overrideDisplayIdxList(idxList: number[], cacheKey: string | undefined) {
  localStorage.setItem(getCurrentStorageKey(cacheKey), idxList.join('::'));
}
