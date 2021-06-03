import { ConnectDragSource, DragSourceMonitor, DragSourceConnector, DragSource, ConnectDragPreview } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import React, { FC, useEffect } from 'react';

const style: React.CSSProperties = {
  backgroundColor: 'transparent',
  width: '100%',
  height: '100%',
  float: 'left',
};

export interface BoxProps {
  name: number
  hoverList?: number[];
  setHoverList?: Function;
  // Collected Props
  isDragging: boolean
  connectDragSource: ConnectDragSource
  connectDragPreview: ConnectDragPreview;
  endDrag?: (startTime: number, endTime: number) => void;
}
const Box: FC<BoxProps> = ({ connectDragSource, connectDragPreview, children }) => {
  useEffect(() => { connectDragPreview(getEmptyImage(), { captureDraggingState: true }); }, []);
  return (
    <div ref={connectDragSource} style={{ ...style }}>
      {children}
    </div>
  );
};

export default DragSource(
  'box',
  {
    beginDrag: (props: BoxProps) => {
      const { hoverList = [], setHoverList = () => {}, name } = props;
      if (hoverList.indexOf(name) === -1) {
        setHoverList([name, ...hoverList].sort());
      }
      return { name: props.name };
    },
    endDrag(props: BoxProps, monitor: DragSourceMonitor) {
      const { setHoverList = () => {}, endDrag = () => {} } = props;
      const item = monitor.getItem();
      const dropResult = monitor.getDropResult();
      setHoverList([]);
      if (dropResult) {
        // alert(`You dropped ${item.name} into ${dropResult.name}!`);
        endDrag(item.name, dropResult.name);
      }
    },
  },
  (connect: DragSourceConnector, monitor: DragSourceMonitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
    connectDragPreview: connect.dragPreview(),
  }),
)(Box);
