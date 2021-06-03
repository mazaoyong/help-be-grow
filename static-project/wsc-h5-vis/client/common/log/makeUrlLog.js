import Args from 'zan-utils/url/args';
import './log';

/* 统一处理再url中传递的埋点参数
 */
/**
 * 获取reft
 * [访问时间]_[离开时间]
 */
const getReft = (reft) => {
  if (reft === '') {
    return new Date().getTime();
  }
  if (reft.indexOf('_') < 0) {
    return reft + '_' + new Date().getTime();
  }
  reft = reft.split('_');
  return reft[1] + '_' + new Date().getTime();
};
/**
 * 获取广告路径
 * 广告入口.time.curr_page.pre_page
 */
const getTrack = (track) => {
  if (track === '') {
    return '';
  }
  track = track.split('.');
  const time = new Date().getTime();
  const pre_page = `${_global.spm.logType + _global.spm.logId}` || `fake${window._global.kdt_id}`; // eslint-disable-line
  switch (track.length) {
    case 1:
      return '';
    case 2:
      track.push(time);
      break;
    case 3:
      track.push(pre_page);
      break;
    case 4:
      track.pop();
      track.push(pre_page);
      break;
  }
  return track.join('.');
};

const mf = Args.get('mf');
const sf = Args.get('sf');
const reft = Args.get('reft') || '';
const track = getTrack(Args.get('tr'));
const kdtfrom = Args.get('kdtfrom');
const from = Args.get('from');
const promote = Args.get('promote');
let source = Args.get('source');
let fpd = Args.get('fpd');
let spm = '';

export default (url) => {
  const newSource = Args.get('source', url);
  if (!fpd) {
    fpd = Args.get('fpd', url);
  }
  if (window.Logger) {
    spm = window.Logger.getSpm();
  }
  source = newSource || source;
  return Args.add(url, {
    'reft': getReft(reft),
    'spm': spm,
    'sf': sf,
    'mf': mf,
    'tr': track,
    'source': source,
    'kdtfrom': kdtfrom,
    'form': from,
    'promote': promote,
    'fpd': fpd,
  });
};
