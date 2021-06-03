export const ARR = ['scheduledStuCnt', 'signedStuCnt', 'dayOffStuCnt', 'absentStuCnt', 'unsignedStuCnt'];
export const TIME = 'currentDay';

export const CONFIG = {
  scheduledStuCnt: {
    title: '应到人次',
    unit: '人',
  },
  signedStuCnt: {
    title: '已到人次',
    unit: '人',
  },
  dayOffStuCnt: {
    title: '请假人次',
    unit: '人',
  },
  absentStuCnt: {
    title: '未到人次',
    unit: '人',
  },
  unsignedStuCnt: {
    title: '待签到人次',
    unit: '人',
  },
};

export const columnOption = {
  grid: {
    borderWidth: 0,
    x: 50,
    x2: 75,
    y: 55,
    y2: 24,
  },
  title: {
    textStyle: {
      color: '#999',
      fontSize: 12,
      fontWeight: 'normal',
      align: 'center',
    },
  },
  legend: {
    itemGap: 40,
    itemWidth: 10,
    itemHeight: 10,
    textStyle: {
      color: '#333',
    },
    selected: {},
    selectedMode: true,
  },
};

export const lineOption = {
  grid: {
    borderWidth: 0,
    x: 50,
    x2: 75,
    y: 55,
    y2: 24,
  },
  title: {
    textStyle: {
      color: '#999',
      fontSize: 12,
      fontWeight: 'normal',
      align: 'center',
    },
  },
  legend: {
    itemGap: 40,
    textStyle: {
      color: '#333',
    },
    selected: {},
    selectedMode: true,
  },
};
