import { visAjax } from 'fns/new-ajax';

interface Auth {
  userId: string,
  appId: string,
  appSecret: string,
};

export function getPolyvAuth(): Promise<Auth> {
  return visAjax('GET', '/course/live/polyv/getPolvyAuth.json', {});
}

export function savePolyvAuth(data: Auth) {
  return visAjax('POST', '/course/live/polyv/savePolvyAuth.json', data);
}
