import { ConnectDragSource, ConnectDragPreview } from 'react-dnd';
import React from 'react';
export interface BoxProps {
    name: number;
    hoverList?: number[];
    setHoverList?: Function;
    isDragging: boolean;
    connectDragSource: ConnectDragSource;
    connectDragPreview: ConnectDragPreview;
    endDrag?: (startTime: number, endTime: number) => void;
}
declare const _default: import("react-dnd").DndComponentClass<React.FC<BoxProps>, Pick<BoxProps, "name" | "hoverList" | "setHoverList" | "endDrag">>;
export default _default;
