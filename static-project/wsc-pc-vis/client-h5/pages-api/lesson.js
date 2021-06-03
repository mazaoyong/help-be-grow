import ajax from 'fns/ajax';

const lesson = {
  GetDateList(data) {
    return ajax({
      url: '/v4/vis/h5/lesson/findDateOfLessonKanBanV2.json',
      method: 'GET',
      data,
      loading: false,
    });
  },
  GetLessons(data) {
    return ajax({
      url: '/v4/vis/h5/lesson/findLessonsV2.json',
      method: 'GET',
      data,
      loading: false,
    });
  },
  GetTeachersByKeyword(data) {
    return ajax({
      url: '/v4/vis/h5/lesson/findPage.json',
      method: 'GET',
      data,
      loading: false,
    });
  },
  GetAssistantsByKeyword(data) {
    return ajax({
      url: '/v4/vis/h5/lesson/findAssistantPage.json',
      method: 'GET',
      data,
      loading: false,
    });
  },
};

export default lesson;
