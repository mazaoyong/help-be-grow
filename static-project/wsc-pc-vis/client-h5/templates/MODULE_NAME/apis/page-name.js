import ajax from 'fns/ajax';

export function sample(data) {
  return ajax({
    url: '/wscvis/sample/***.json',
    data,
    loading: false,
  });
};
