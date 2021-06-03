import ajax from 'fns/ajax';

const apis = {
  GetClueDetailById(data) {
    return ajax({
      url: '/v4/vis/h5/edu/clue/getDetailById.json',
      method: 'GET',
      data,
      loading: false
    });
  },
  FindStudentLessonsForClue(data) {
    return ajax({
      url: '/v4/vis/h5/edu/clue/findStudentLessonsForClue.json',
      method: 'GET',
      data,
      loading: false
    });
  },
  FindStudentLessonsByIdentity(data) {
    return ajax({
      url: '/v4/vis/h5/edu/clue/findStudentLessonsByIdentity.json',
      method: 'GET',
      data,
      loading: false
    });
  },
  FindPageByMobileWithCourse(data) {
    return ajax({
      url: '/v4/vis/h5/edu/clue/findPageByMobileWithCourse.json',
      method: 'GET',
      data,
      loading: false
    });
  },
  FindPageClueRecords(data) {
    return ajax({
      url: '/v4/vis/h5/edu/clue/findPageClueRecords.json',
      method: 'GET',
      data,
      loading: false
    });
  },
  GetNextDetailById(data) {
    return ajax({
      url: '/v4/vis/h5/edu/clue/getNextDetailById.json',
      method: 'GET',
      data,
      loading: false
    });
  },
  FindListAllCampus(data) {
    return ajax({
      url: '/v4/vis/h5/edu/findListAllCampus.json',
      method: 'GET',
      data,
      loading: false
    });
  },
  CancelAppointment(data) {
    return ajax({
      url: '/v4/vis/h5/edu/clue/cancelAppointment.json',
      method: 'POST',
      data,
      loading: false
    });
  },
  ChangeState(data) {
    return ajax({
      url: '/v4/vis/h5/edu/clue/changeState.json',
      method: 'POST',
      data,
      loading: false
    });
  },
  CreatePreAppointment(data) {
    return ajax({
      url: '/v4/vis/h5/edu/clue/createPreAppointmentForClue.json',
      method: 'POST',
      contentType: 'application/json; charset=utf-8',
      data,
      loading: false
    });
  },
  getClueSetting(data) {
    return ajax({
      url: '/v4/vis/h5/edu/clue/getClueSetting.json',
      method: 'GET',
      data,
      loading: false
    });
  },
  queryRelatedOrder(data) {
    return ajax({
      url: '/v4/vis/h5/edu/clue/queryRelatedOrder.json',
      method: 'GET',
      data,
      loading: false
    });
  },
  CreateClueRecord(data) {
    return ajax({
      url: '/v4/vis/h5/edu/clue/createClueRecord.json',
      method: 'POST',
      data,
      loading: false
    });
  },
  UpdateClueRecord(data) {
    return ajax({
      url: '/v4/vis/h5/edu/clue/updateClueRecord.json',
      method: 'POST',
      data,
      loading: false
    });
  },
  DistributeClues(data) {
    return ajax({
      url: '/v4/vis/h5/edu/clue/distributeClues.json',
      method: 'POST',
      data,
      loading: false
    });
  }
};

export default apis;
