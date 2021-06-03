import { visAjax } from 'fns/new-ajax';
import { Scene } from './enums';

export interface Channel {
  channelId: string,
  isBind: number,
  name: string,
  scene: Scene
}

interface ChannelRes {
  content: Channel[],
  total: number,
};

export function findPoliyvLives(data: { pageNumber: number, pageSize: number }): Promise<ChannelRes> {
  return visAjax('GET', '/course/live/polyv/findPoliyvLives.json', data);
}
