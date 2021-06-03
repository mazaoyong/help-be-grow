import { visAjax } from 'fns/new-ajax';

// 知识付费下内容和专栏的 隐藏/显示
export function hideOwlAPI(data) {
  return visAjax('PUT', '/pct/biz/hideOwl.json', data);
}

// 对知识付费下内容,直播,专栏,专栏下的内容,专栏下的直播进行排序
export function sortOwlAPI(data) {
  return visAjax('PUT', '/pct/biz/sortOwl.json', data);
}
