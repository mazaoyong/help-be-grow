import ajax from 'fns/ajax';

const bookListen = {
  GetStudentList(data) {
    return ajax({
      url: '/v4/vis/h5/edu/getStudents.json',
      method: 'GET',
      data,
      loading: false,
    });
  },
  GetCourceList(data) {
    return ajax({
      url: '/v4/vis/h5/edu/getCourseList.json',
      method: 'GET',
      data,
      loading: false,
    });
  },
  GetDaysList(data) {
    return ajax({
      url: '/v4/vis/h5/edu/getDays.json',
      method: 'GET',
      data,
      loading: false,
    });
  },
  GetLessonsList(data) {
    return ajax({
      url: '/v4/vis/h5/edu/bookListen/getLessons.json',
      method: 'GET',
      data,
      loading: false,
    });
  },
  PostCreateAppointment(data) {
    return ajax({
      url: '/v4/vis/h5/edu/createAppointment.json',
      method: 'POST',
      data,
      loading: false,
    });
  },
  updateStudentLesson(data) {
    return ajax({
      url: '/v4/vis/h5/edu-admin/appointment/updateStudentLesson.json',
      method: 'POST',
      data,
      loading: true,
    });
  },
  getStudentLessonForUpdate(data) {
    return ajax({
      url: '/v4/vis/h5/edu-admin/appointment/getStudentLessonForUpdate.json',
      data,
    });
  },
  PostCreateClueAppointment(data) {
    return ajax({
      url: '/v4/vis/h5/edu/createClueAppointment.json',
      method: 'POST',
      data,
      loading: false,
    });
  },
  PostConfirmAppointment(data) {
    return ajax({
      url: '/v4/vis/h5/edu/confirmAppointment.json',
      method: 'POST',
      data,
      loading: false,
    });
  },
  GetAppointment(data) {
    return ajax({
      url: '/v4/vis/h5/edu/getAppointment.json',
      method: 'GET',
      data,
      loading: false,
    });
  },
  DetectConflict(data) {
    return ajax({
      url: '/v4/vis/h5/edu/conflict.json',
      method: 'GET',
      data,
      loading: false,
    });
  },
  getUpdateAppointmentResult(data) {
    return ajax({
      url: '/v4/vis/h5/edu-admin/appointment/getUpdateAppointmentResult.json',
      method: 'GET',
      data,
      loading: false,
    });
  },
};

export default bookListen;
