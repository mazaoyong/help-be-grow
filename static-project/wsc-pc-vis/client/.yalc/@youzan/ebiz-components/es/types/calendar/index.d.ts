import Calendar from './Calendar';
import CalendarPanel from './Panel';
import CalenderHeader from './Header';
import './style/index.scss';
declare const CalendarModule: {
    Calendar: typeof Calendar;
    CalendarPanel: typeof CalendarPanel;
    CalenderHeader: typeof CalenderHeader;
};
export * from './types';
export default CalendarModule;
