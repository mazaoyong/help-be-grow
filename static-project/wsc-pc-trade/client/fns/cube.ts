import ajax from 'zan-pc-ajax';

export const cubeRequest = <T = any>(cubeUrl: string, dubboUrl: string, body: any) => {
  return ajax<T>(cubeUrl, body).catch(() => {
    return ajax<T>(dubboUrl, body);
  });
};
