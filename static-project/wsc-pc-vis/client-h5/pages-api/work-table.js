import ajax from 'fns/ajax';

const workTable = {
  GetWorkTableData(data) {
    return ajax({
      url: '/v4/vis/h5/edu/getWorkTableData.json',
      method: 'GET',
      data,
      loading: false,
    });
  },
  findMessageBox(data) {
    return ajax({
      url: '/v4/vis/h5/edu/moments/findUserBadge.json',
      method: 'GET',
      data,
      loading: false,
    });
  },
  checkHasHomework(data) {
    return ajax({
      url: '/v4/vis/h5/supv/homework/workbook/findPageByCondition.json',
      methods: 'GET',
      data: {
        pageRequest: {
          pageNumber: 1,
          pageSize: 1,
        },
      },
      loading: false,
    })
      .then(res => {
        if (res && !res.total) {
          return false;
        }

        return true;
      })
      .catch(() => {
        return true;
      });
  },
};

export default workTable;
