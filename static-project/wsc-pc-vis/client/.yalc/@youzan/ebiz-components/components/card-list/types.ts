import { ReactNode } from 'react';
import { IGridPageInfo } from 'zent';

import { RowData, ICardRenderProps, IColorSchema } from '../card-item/types';

export type FetchData = (
  pageInfo: IGridPageInfo
) => Promise<{ total: number; datasets: RowData[]; pageSize?: number }>;

export interface ICardListProps {
  renderConfig: ICardRenderProps;
  fetchData: FetchData;
  pageInfo?: IGridPageInfo;
  rowKey?: string;
  colorSchema?: IColorSchema;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  updatingSignal?: number;
  emptyLabel?: ReactNode;
  selectable?: boolean;
  onSelected?: (item: any) => void;
}
export interface IListSelectItem {
  item: RowData;
}
