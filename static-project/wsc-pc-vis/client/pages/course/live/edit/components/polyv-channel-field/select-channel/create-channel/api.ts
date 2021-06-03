import { visAjax } from 'fns/new-ajax';
import { Scene } from '../enums';

export function asyncCreatePolyvLive(data: { name: string, scene: Scene }): Promise<string> {
  return visAjax('POST', '/course/live/polyv/asyncCreatePolyvLive.json', data);
}

export function getAsyncCreateStatus(data: { createId: string }): Promise<number> {
  return visAjax('GET', '/course/live/polyv/getAsyncCreateStatus.json', data);
}
