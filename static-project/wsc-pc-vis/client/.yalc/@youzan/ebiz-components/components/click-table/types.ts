import { CSSProperties } from "react";

export interface ITableColumn {
  title: string;
  name?: string;
  width?: string;
  textAlign?: CSSProperties['textAlign'];
  disable?: (row: any, index: number) => boolean;
  bodyRender?: (row: any, index: number, isDisabled: boolean) => JSX.Element;
}

export interface IClickTableProps {
  loading?: boolean,
  columns: Array<ITableColumn>
  datasets: Array<object>;
  emptyLabel: string;
  scroll?: {
    x?: number,
    y?: number,
  };
  currentRow?: (row: any) => boolean;
  disabledRow?: (row: any) => boolean;
  onClickRow?: (row: any, index: number) => void;
}
