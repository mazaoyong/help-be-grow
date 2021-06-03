import { hashHistory } from 'react-router';

const baseURL = '/vis/pct/page';
const newBaseURL = '/vis/course';
const reg = /^(\/*)(\w+)\/(.+)/;
// 当前已迁移路由的页面：直播/专栏
export const newURLReg = /^(\/*)(live|column)/;
export const multipageReg = /^(\/*)(column)/;

// tab 页面跳转
export function visPush(path: string, target = ''): void {
  if (!reg.test(path)) {
    hashHistory.push(path);
    throw new Error(`visPush: path not correct: ${path}`);
  }

  const paths = path.match(reg) as RegExpExecArray;
  const isUnderNewUrl = newURLReg.test(path);
  const visBaseURL = `${window._global.url.v4}${isUnderNewUrl ? newBaseURL : baseURL}`;

  // 跳转未迁移路由的老页面
  if (target === '_blank') {
    window.open(`${visBaseURL}/${paths[2]}#/${paths[3]}`, '_blank');
  } else if (window.location.pathname === `/v4${visBaseURL}/${paths[2]}`) {
    hashHistory.push(paths[3]);
  } else {
    window.location.href = `${visBaseURL}/${paths[2]}#/${paths[3]}`;
  }
}
