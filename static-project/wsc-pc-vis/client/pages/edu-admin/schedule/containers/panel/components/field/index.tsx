import React, { ReactElement, FC, MouseEventHandler, useState, useCallback, useRef, useEffect, useMemo } from 'react';
import cx from 'classnames';
import { IViewCellData } from '../../types';

import DetailPop from '../detail-pop';
import { StateType, DispatchType } from '../../store';
import './style.scss';

export interface IScheduleFieldProps {
  data: IViewCellData;
  store: StateType;
  dispatch: DispatchType;
  latestSchedule?: {
    id: string;
    startTime: number;
    endTime: number;
    scheduleId: string;
  }
  disablePop?: boolean;
  isInDialog?: boolean;
  closeDialog?: () => void;
};

// 如果修改字体大小，此处需修改相应的大小
const font: { width: number, height: number } = {
  width: 14,
  height: 20,
};

const ScheduleField: FC<IScheduleFieldProps> =
({ data, store, dispatch, latestSchedule, disablePop = false, isInDialog = false, closeDialog = () => {} }) => {
  const [position, setPosition] = useState({ top: 0 });
  const [courseHeight, setCourseHeight] = useState<string>('');
  const [isSingleLine, setIsSibgleLine] = useState<boolean>(false);
  const fieldRef = useRef(null);

  const getContentHeight = useCallback((): string => {
    return courseHeight || 'auto';
  }, [courseHeight]);

  const isLatestField = useCallback<() => boolean>(() => {
    if (!latestSchedule) {
      return false;
    }
    const { startTime, scheduleId } = latestSchedule;
    return data.startTime === startTime && data.scheduleId === parseInt(scheduleId);
  }, [latestSchedule, data]);

  useEffect(() => {
    const { offsetWidth = 0, offsetHeight = 0, offsetLeft = 0, offsetRight = 0 } = fieldRef.current as any;

    const width: number = offsetWidth - offsetLeft - offsetRight;
    const height: number = offsetHeight - 15;
    const fontPerRow: number = Math.floor(width / font.width);
    const courseName = data.className || data.eduCourseName || '';
    const row: number = Math.ceil(courseName.length / fontPerRow);
    const bottomMargin = 5 + (data.teacherName ? 25 : 0) + (data.classroomName ? 25 : 0);
    if (height - bottomMargin < font.height) {
      setCourseHeight('100%');
      setIsSibgleLine(true);
    } else if (row * font.height < height - bottomMargin) {
      setCourseHeight('auto');
      setIsSibgleLine(false);
    } else {
      setCourseHeight(`${Math.floor((height - bottomMargin) / font.height) * font.height}px`);
      setIsSibgleLine(false);
    }
  }, [fieldRef.current, data]);

  const fieldClass = useMemo<string>(() => cx({
    panel__schedule__field: true,
    conflict: data.conflictResources !== '0' && data.endTime > new Date().getTime(),
    deprecated: data.endTime < new Date().getTime(),
    current: isLatestField(),
  }), [data, isLatestField]);

  const fieldContent = useMemo<ReactElement>(() => {
    const fontHeight = getContentHeight();
    const cssProperties = {
      height: fontHeight,
    };
    if (isSingleLine) {
      cssProperties['textOverflow'] = 'ellipsis';
      cssProperties['whiteSpace'] = 'nowrap';
      cssProperties['overflow'] = 'hidden';
    }
    return <div className={fieldClass} onMouseEnter={e => onMouseEnter(e)}>
      <div className="panel__schedule__field__content">
        <div className="panel__schedule__field__item" style={cssProperties}>{data.className || data.eduCourseName}</div>
        { !!data.teacherName && <p className="panel__schedule__field__subtitle">{data.teacherName}</p> }
        { !!data.classroomName && <p className="panel__schedule__field__subtitle">{data.classroomName}</p> }
      </div>
    </div>;
  }, [fieldClass, data, getContentHeight, isSingleLine]);

  const onMouseEnter: MouseEventHandler = e => {
    setPosition({
      top: e.pageY,
    });
  };

  return (
    <div ref={fieldRef} style={{ height: '100%' }}>
      {!disablePop ? <DetailPop
        isInDialog={isInDialog}
        closeDialog={closeDialog}
        data={data} store={store}
        dispatch={dispatch}
        position={position}>
        {fieldContent}
      </DetailPop> : fieldContent }
    </div>
  );
};

export default ScheduleField;
