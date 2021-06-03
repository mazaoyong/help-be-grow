import { FC } from 'react';
import './style/backrow.scss';
import { ConnectDropTarget } from 'react-dnd';
export interface IBackRowProps {
    data: number[];
    interval: number;
    rowHeight: number;
    index?: number;
    days?: number;
    renderBackRow?: (time: Date) => JSX.Element;
    hoverList?: number[];
    setHoverList?: Function;
    endDrag?: (startTime: number, endTime: number) => void;
}
export interface IBackViewRowProps {
    data: any[];
    resource: {
        resourceName: string;
        resourceId: string;
    };
    content?: any[];
    interval: number;
    rowHeight: number;
    renderBackRow?: (time: Date) => JSX.Element;
    renderField?: (item: object) => JSX.Element;
    days: any[];
}
export interface IBackViewCellProps {
    columnType: 'dimension' | 'content';
    interval: number;
    rowHeight: number;
    resource: {
        resourceName: string;
        resourceId: string;
    };
    content?: any[];
    renderBackRow?: (time: Date) => JSX.Element;
    renderField?: (item: object) => JSX.Element;
    day: string;
    data: any[];
}
export interface IDropProps {
    canDrop: boolean;
    isOver: boolean;
    connectDropTarget: ConnectDropTarget;
}
export declare type IBackCellProps = IBackRowProps & IDropProps & {
    time: number;
    isHovered: boolean;
};
declare const BackRow: FC<IBackRowProps>;
export declare const BackViewRow: FC<IBackViewRowProps>;
export default BackRow;
