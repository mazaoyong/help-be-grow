const COURSE_SUMMARY_PAGE_PREFIX = '/v4/vis/edu/page/course-summary';
// const COURSE_SUMMARY_API_PREFIX = '/v4/vis/edu/course-summary/api';
const COURSE_SUMMARY_CONTROLLER_PREFIX = 'edu-admin.course-summary';

module.exports = [
  [
    'GET',
    COURSE_SUMMARY_PAGE_PREFIX + '*',
    COURSE_SUMMARY_CONTROLLER_PREFIX + '.CourseSummaryCommonController',
    'getIndexHtml',
  ],
];
