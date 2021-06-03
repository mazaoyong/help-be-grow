import { hashHistory } from 'react-router';

// 获取当前的 clueId
export default function getCurClueId() {
  const { pathname } = hashHistory.getCurrentLocation();

  const clueId = /detail\/(\d+)/.exec(pathname)[1];

  return +clueId;
}
