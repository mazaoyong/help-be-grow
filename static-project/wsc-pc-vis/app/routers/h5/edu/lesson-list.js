module.exports = [
  ['GET', '/v4/vis/h5/edu/lesson-list', 'h5.lesson.IndexController', 'getIndexHtml'],
  ['GET', '/v4/vis/h5/edu/getDateList.json', 'h5.lesson.IndexController', 'getDateList'],
  ['GET', '/v4/vis/h5/edu/getLessons.json', 'h5.lesson.IndexController', 'getLessons'],
  [
    'GET',
    '/v4/vis/h5/lesson/findLessonsV2.json',
    'h5.lesson.IndexController',
    'getFindLessonsV2Json',
  ],
  [
    'GET',
    '/v4/vis/h5/lesson/findDateOfLessonKanBanV2.json',
    'h5.lesson.IndexController',
    'getFindDateOfLessonKanBanV2Json',
  ],
  ['GET', '/v4/vis/h5/lesson/findPage.json', 'h5.lesson.IndexController', 'getFindPageJson'],
  [
    'GET',
    '/v4/vis/h5/lesson/findAssistantPage.json',
    'h5.lesson.IndexController',
    'getFindAssistantPageJson',
  ],
];
