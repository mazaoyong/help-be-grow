import ajax from 'fns/ajax';

const apis = {
  GiveUpClues(data) {
    return ajax({
      url: '/v4/vis/h5/edu/clue/giveUpClues.json',
      method: 'POST',
      data,
      loading: false,
    });
  },
};

export default apis;
