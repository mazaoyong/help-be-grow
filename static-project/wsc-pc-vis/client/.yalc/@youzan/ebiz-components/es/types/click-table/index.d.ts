import React, { Component, ReactNode } from 'react';
import { IClickTableProps } from './types';
import './style.scss';
export * from './types';
export default class ClickTable extends Component<IClickTableProps> {
    static defaultProps: IClickTableProps;
    renderTableHead(): ReactNode[];
    handleClickRow: (data: any, index: number) => void;
    handleDisable: (disabled: boolean, evt: React.MouseEvent<HTMLTableDataCellElement, MouseEvent>) => void;
    renderTableCells(data: object, index: number): (ReactNode | ReactNode[]);
    renderTableBody(): (ReactNode | ReactNode[]);
    render(): JSX.Element;
}
