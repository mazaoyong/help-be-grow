export const ARR = ['consumedLessonCnt', 'consumedLessonAmt', 'waitingConsumedLessonCnt', 'waitingConsumedLessonAmt'];
export const TIME = 'currentDay';

export const CONFIG = {
  consumedLessonCnt: {
    title: '课时消耗数',
    unit: '',
    format: item => item / 100,
  },
  consumedLessonAmt: {
    title: '课时消耗金额',
    unit: '元',
    type: 'money',
  },
  waitingConsumedLessonCnt: {
    title: '待消耗课时数',
    unit: '',
    format: item => item / 100,
  },
  waitingConsumedLessonAmt: {
    title: '待消耗课时金额',
    unit: '元',
    type: 'money',
  },
};
