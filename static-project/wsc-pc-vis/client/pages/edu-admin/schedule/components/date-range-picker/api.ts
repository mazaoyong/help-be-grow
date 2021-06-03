import { visAjax } from 'fns/new-ajax';
import { IData } from './type';

// 创建时间段
export function createDateRange(data: Omit<IData, 'id'>) {
  return visAjax('POST', '/daterange/create.json', data);
}

export function findDateRange(configType: number) {
  return visAjax('GET', '/daterange/findByKdtId.json', { configType });
}

export function updateDateRange(data: IData) {
  return visAjax('PUT', '/daterange/update.json', data);
}

export function deleteDateRange(id: number) {
  return visAjax('DELETE', '/daterange/delete.json', { id });
}
