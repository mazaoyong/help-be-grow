import { ReactNode, CSSProperties } from 'react';
import { orderTableCols, Omit } from '../types';
interface IOrderTableHeader {
    selectable: boolean;
    header: string[];
    columns: orderTableCols;
    selectStatus: {
        [key: string]: boolean;
    };
    onSelectAll: (status: boolean) => void;
}
interface IOrderTableHeaderItem {
    title: ReactNode;
    width?: string;
    textAlign?: CSSProperties['textAlign'];
    status: IOrderTableHeader['selectStatus'];
    onSelect: IOrderTableHeader['onSelectAll'];
}
declare type omitSelectProperties = 'title' | 'width' | 'textAlign';
declare const OrderTableHeader: {
    (props: IOrderTableHeader): JSX.Element;
    CheckBox(props: Omit<IOrderTableHeaderItem, omitSelectProperties>): JSX.Element;
    Item(props: Omit<IOrderTableHeaderItem, "onSelect" | "status">): JSX.Element;
};
export default OrderTableHeader;
