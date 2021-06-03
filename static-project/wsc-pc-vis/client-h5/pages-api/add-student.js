import ajax from 'fns/ajax';

const apis = {
  getStudentList(data) {
    return ajax({
      url: '/v4/vis/h5/edu/getPureStudentList.json',
      method: 'GET',
      data,
      loading: false,
    });
  },
  addStudents(data) {
    return ajax({
      url: '/v4/vis/h5/edu/addStudents.json',
      method: 'POST',
      data,
      contentType: 'application/json; charset=utf-8',
      loading: false,
    });
  },
  detectConflict(data) {
    return ajax({
      url: '/v4/vis/h5/edu/conflict.json',
      method: 'GET',
      data,
      loading: false,
    });
  },
  findStudentsForReview(data) {
    return ajax({
      url: '/v4/vis/h5/edu/moments/findStudentsForReview.json',
      method: 'GET',
      data,
      loading: data.pageNumber === 1,
    });
  },
  findRecentReviewedStudents(data) {
    return ajax({
      url: '/v4/vis/h5/edu/moments/findRecentReviewedStudents.json',
      method: 'GET',
      data,
      loading: false,
    });
  },
  findStudentsOnLesson(data) {
    return ajax({
      url: '/v4/vis/h5/edu/moments/findStudentsOnLesson.json',
      method: 'GET',
      data,
      loading: data.pageNumber === 1,
    });
  },
};

export default apis;
