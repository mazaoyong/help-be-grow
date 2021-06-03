import { GridTextAlign } from 'zent';

export const CONVERSION = [{
  title: '新增-邀约转化率',
  key: 'newToInviteRate',
  top: '59px',
  left: '105px',
}, {
  title: '邀约-试听转化率',
  key: 'inviteToAuditionRate',
  top: '167px',
  left: '105px',
}, {
  title: '试听-成交转化率',
  key: 'auditionToDealRate',
  top: '274px',
  left: '105px',
}, {
  title: '新增-成交转化率',
  key: 'newToDealRate',
  top: '164px',
  left: '0px',
}];

export const CLUE = [{
  title: '新增线索数',
  key: 'newCnt',
  color: '#F4F9FE',
}, {
  title: '待试听线索数',
  key: 'inviteCnt',
  color: '#F7FCF8',
}, {
  title: '已试听线索数',
  key: 'auditionCnt',
  color: '#F4F4F9',
}, {
  title: '已成交线索数',
  key: 'dealCnt',
  color: '#FFFDF9',
}];

const RIGHT: GridTextAlign = 'right';

export const COLUMNS = [
  {
    title: '转化周期',
    name: 'period',
    width: '35%',
  },
  {
    title: '成交线索数',
    name: 'num',
    width: '30%',
  },
  {
    title: '新增-成交转化率',
    name: 'rate',
    width: '35%',
    textAlign: RIGHT,
  },
];
