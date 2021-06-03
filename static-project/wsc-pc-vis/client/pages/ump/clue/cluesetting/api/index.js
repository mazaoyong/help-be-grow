import { visAjax } from 'fns/new-ajax';

export function getClueSettings() {
  return visAjax('GET', '/edu/clue/setting/getClueSetting.json');
}

export function updateClueSetting(payload) {
  return visAjax('POST', '/edu/clue/setting/updateClueSetting.json', payload);
}

// the privilege is judged by backend
export function findPagePowerStaffs(targetKdtId) {
  return visAjax(
    'GET',
    '/commom/edu/findPagePowerStaffs.json',
    {
      cluePowerQuery: {
        powerTypes: [11],
        targetKdtId: targetKdtId || window._global.kdtId,
      },
    },
  );
}
