import wrapper from './wrapper';
import Schedule from './schedule';
import EduClass from './educlass';

export const ScheduleNewDialog = wrapper(Schedule, 'schedule-dialog');
export const EduClassNewDialog = wrapper(EduClass);
