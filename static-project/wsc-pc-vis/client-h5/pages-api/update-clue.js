import ajax from 'fns/ajax';

const apis = {
  FindAttributeItemsByKdtId(data) {
    return ajax({
      url: '/v4/vis/edu/clue/find-unified-attribute-items.json',
      method: 'GET',
      data,
      loading: false,
    });
  },
  FindSourceGroupPage(data) {
    return ajax({
      url: '/v4/vis/h5/edu/clue/findSourceGroupPage.json',
      method: 'GET',
      data,
      loading: false,
    });
  },
  GetAttributesById(data) {
    return ajax({
      url: '/v4/vis/h5/edu/clue/getAttributesById.json',
      method: 'GET',
      data,
      loading: false,
    });
  },
  Create(data) {
    return ajax({
      url: '/v4/vis/h5/edu/clue/create.json',
      method: 'POST',
      contentType: 'application/json',
      data,
      loading: false,
    });
  },
  Update(data) {
    return ajax({
      url: '/v4/vis/h5/edu/clue/update.json',
      method: 'POST',
      contentType: 'application/json',
      data,
      loading: false,
    });
  },
  GetRemoteConf() {
    return ajax({
      url: '/v4/vis/edu/profile/get-remote-conf.json',
      method: 'GET',
      contentType: 'application/json',
      data: {},
      loading: false,
    });
  },
};

export default apis;
