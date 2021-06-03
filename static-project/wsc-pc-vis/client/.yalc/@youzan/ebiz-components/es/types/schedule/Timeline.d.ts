import { FC } from 'react';
import './style/timeline.scss';
export interface ITimeLineProps {
    data: number[];
    rowHeight: number;
    interval: number;
    days?: number;
}
declare const TimeLine: FC<ITimeLineProps>;
export default TimeLine;
