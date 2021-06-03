import React, { Component } from 'react';

import CalendarPanel from './Panel';
import CalenderHeader from './Header';
import { ICalendarProps } from './types';

export default class Calendar extends Component<ICalendarProps, {}> {
  render() {
    const {
      current,
      weekStartsOn,
      onMonthChange,
      onSelect,
      dateFullCellRender,
      dateCellRender
    } = this.props;
    console.log(this.props);
    return (
      <div className="ebiz-calendar">
        <CalenderHeader
          current={current}
          onMonthChange={date => onMonthChange(date)}
        />
        <CalendarPanel
          weekStartsOn={weekStartsOn}
          current={current}
          onMonthChange={onMonthChange}
          onSelect={onSelect}
          dateCellRender={dateCellRender}
          dateFullCellRender={dateFullCellRender}
        />
      </div>
    );
  }
}

// const useCount = (num, delay) => {
//   const [count, setCount] = useState(num);
//   let Timer = useRef(null);

//   const startRun = useCallback(() => {
//     if (!Timer.current) {
//       Timer.current = setInterval(() => {
//         setCount(count => count + 1)
//       }, delay)
//     }
    
//   }, [Timer.current]);

//   const endRun = useCallback(() => {
//     if (Timer.current) {
//       clearInterval(Timer.current)
//       Timer.current = null;
//     }
//   }, [Timer.current]);

//   return [count, startRun, endRun];
// }