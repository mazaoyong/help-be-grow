import React from 'react';
import get from 'lodash/get';
import { YZ_NODE_ENV } from '../../../../utils/constants';
import { useLayoutEffect } from '../../../../utils/use-ssr-hooks';

interface IUseAdaptionScrollWidthParams {
  gridRef: React.MutableRefObject<HTMLDivElement | null>;
  enableScroll: boolean;
  passiveScroll: {
    x: number;
    y: number;
  };
  columnSize: number;
  columnWidthList: number[];
}
export const useAdaptionScrollWidth = (params: IUseAdaptionScrollWidthParams) => {
  const { gridRef, enableScroll, passiveScroll, columnWidthList = [], columnSize } = params;
  const [minWidth, setMinWidth] = React.useState(0);
  const maxWidth = React.useMemo(() => get(passiveScroll, 'x', 0), [passiveScroll]);
  const curScrollWidth = React.useMemo(() => {
    const columnWidthSize = columnWidthList.length;
    if (columnWidthSize && columnSize === columnWidthSize) {
      /* istanbul ignore next */
      const _curScrollWidth = columnWidthList.reduce((prevV, width) => prevV + width, 0);
      if (YZ_NODE_ENV !== 'prod' && _curScrollWidth > maxWidth) {
        console.warn(`请注意，你设置的scroll的值小于实际表格可能展示的宽度，可能会导致内容展示不足
  设置的值为：${maxWidth}
  当前的值为：${_curScrollWidth}`);
      }
      return _curScrollWidth;
    }
    return maxWidth;
  }, [columnSize, columnWidthList, maxWidth]);

  useLayoutEffect(() => {
    if (enableScroll && gridRef.current) {
      setMinWidth(gridRef.current.offsetWidth);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const memoScrollX = React.useMemo(() => Math.max(curScrollWidth, minWidth), [
    curScrollWidth,
    minWidth,
  ]);
  if (!enableScroll) return {};
  return {
    scroll: {
      x: memoScrollX,
      y: passiveScroll.y,
    },
  };
};
