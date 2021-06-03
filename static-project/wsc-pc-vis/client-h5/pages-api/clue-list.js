import ajax from 'fns/ajax';

const clueList = {
  GetTagList(data) {
    return ajax({
      url: '/v4/vis/h5/edu/clue/getFindTagGroupPage.json',
      method: 'GET',
      data,
      loading: false,
    });
  },
  GetSourceList(data) {
    return ajax({
      url: '/v4/vis/h5/edu/clue/getFindSourceGroupPage.json',
      method: 'GET',
      data,
      loading: false,
    });
  },
  GetClueList(data) {
    return ajax({
      url: '/v4/vis/h5/edu/clue/getFindMyClueByPage.json',
      method: 'GET',
      data,
      loading: true,
    });
  },
  FindListAllCampus(data) {
    return ajax({
      url: '/v4/vis/h5/edu/findListAllCampus.json',
      method: 'GET',
      data,
      loading: false,
    });
  },
};

export default clueList;
