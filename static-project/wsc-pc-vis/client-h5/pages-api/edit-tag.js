import ajax from 'fns/ajax';

const apis = {
  FindTagGroupPage(data) {
    return ajax({
      url: '/v4/vis/h5/edu/clue/findTagGroupPage.json',
      method: 'GET',
      data,
      loading: false,
    });
  },
  UpdateClueTags(data) {
    return ajax({
      url: '/v4/vis/h5/edu/clue/updateClueTags.json',
      method: 'POST',
      data,
      loading: false,
    });
  },
};

export default apis;
