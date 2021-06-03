import { FC } from 'react';
import './style/columns.scss';
declare type renderFieldType = (item: object) => JSX.Element;
export interface IColumnsProps {
    max?: number;
    date: Date;
    data: any;
    renderField: renderFieldType;
    timeLineStart: String;
    timeLineEnd: String;
    onShowMoreClick?: (date: Date) => void;
}
export interface IColumnProps {
    data: any;
    renderField: renderFieldType;
    timeLineStart: String;
    timeLineEnd: String;
}
declare const Columns: FC<IColumnsProps>;
export default Columns;
