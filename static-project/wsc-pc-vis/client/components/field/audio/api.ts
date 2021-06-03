import { visAjax } from 'fns/new-ajax';

export function checkPublicBroadLimitAudioUpload() {
  return visAjax('GET', '/commom/material/checkPublicBroadLimitAudioUpload.json', {});
};
