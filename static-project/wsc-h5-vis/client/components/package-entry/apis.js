import { ajax } from 'vis-ui';

export function fetchPackage() {
  return ajax({
    url: '',
    loading: false,
  });
};
