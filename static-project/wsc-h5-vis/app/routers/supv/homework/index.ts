/**
 * 作业本-渲染&通用接口
 */
module.exports = [
  /* 接口 */
  ['GET', '/wscvis/supv/homework/findAssignmentExchangePage.json', 'supv.homework.ApiController', 'findAssignmentExchangePage'],
  ['POST', '/wscvis/supv/homework/submitAssignment.json', 'supv.homework.ApiController', 'submitAssignment'],
  ['POST', '/wscvis/supv/homework/shareHomework.json', 'supv.homework.ApiController', 'shareHomework'],
  ['GET', '/wscvis/supv/homework/getHomeworkDetail.json', 'supv.homework.ApiController', 'getHomeworkDetail'],
  ['POST', '/wscvis/supv/homework/joinExerciseBook.json', 'supv.homework.ApiController', 'joinExerciseBook'],
  ['GET', '/wscvis/supv/homework/getUserExercise.json', 'supv.homework.ApiController', 'getUserExercise'],
  ['GET', '/wscvis/supv/homework/getStudentAssignment.json', 'supv.homework.ApiController', 'getStudentAssignment'],
  ['GET', '/wscvis/supv/homework/findUserExercisePage.json', 'supv.homework.ApiController', 'findUserExercisePage'],
  ['GET', '/wscvis/supv/homework/findUserAssignmentPage.json', 'supv.homework.ApiController', 'findUserAssignmentPage'],
  ['GET', '/wscvis/supv/homework/findOtherStudentInfo.json', 'supv.homework.ApiController', 'findOtherStudentInfo'],
  /* 页面渲染 */
  ['GET', '/wscvis/supv/homework*', 'supv.homework.IndexController', 'renderHtml'],
];
