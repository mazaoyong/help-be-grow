import ajax from 'fns/ajax';

const apis = {
  FindStaffPage(data) {
    return ajax({
      url: '/v4/vis/commom/edu/findPagePowerStaffs.json',
      method: 'GET',
      data: {
        cluePowerQuery: {
          powerTypes: [11],
          targetKdtId: window._global.kdtId,
        },
      },
      loading: false,
    });
  },
  FindTransferReasonPage(data) {
    return ajax({
      url: '/v4/vis/h5/edu/clue/findTransferReasonPage.json',
      method: 'GET',
      data,
      loading: false,
    });
  },
  TransferClues(data) {
    return ajax({
      url: '/v4/vis/h5/edu/clue/transferClues.json',
      method: 'POST',
      data,
      loading: false,
    });
  },
};

export default apis;
