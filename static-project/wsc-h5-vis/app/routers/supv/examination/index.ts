/**
 * 考试-渲染&通用接口
 */
module.exports = [
  /* 接口 */
  ['POST', '/wscvis/supv/examination/startExam.json', 'supv.examination.ApiController', 'startExam'],
  ['GET', '/wscvis/supv/examination/getLatestQuestion.json', 'supv.examination.ApiController', 'getLatestQuestion'],
  ['GET', '/wscvis/supv/examination/getPrevQuestion.json', 'supv.examination.ApiController', 'getPrevQuestion'],
  ['GET', '/wscvis/supv/examination/getNextQuestion.json', 'supv.examination.ApiController', 'getNextQuestion'],
  ['GET', '/wscvis/supv/examination/getQuestion.json', 'supv.examination.ApiController', 'getQuestion'],
  ['GET', '/wscvis/supv/examination/getAnswerCard.json', 'supv.examination.ApiController', 'getAnswerCard'],
  ['GET', '/wscvis/supv/examination/getResult.json', 'supv.examination.ApiController', 'getResult'],
  ['POST', '/wscvis/supv/examination/answerQuestion.json', 'supv.examination.ApiController', 'answerQuestion'],
  ['GET', '/wscvis/supv/examination/submit.json', 'supv.examination.ApiController', 'submit'],
  ['GET', '/wscvis/supv/examination/getDetail.json', 'supv.examination.ApiController', 'getDetail'],
  ['GET', '/wscvis/supv/examination/getRecommendList.json', 'supv.examination.ApiController', 'getRecommendList'],
  ['GET', '/wscvis/supv/examination/getUserExamList.json', 'supv.examination.ApiController', 'getUserExamList'],
  ['GET', '/wscvis/supv/examination/getUserExam.json', 'supv.examination.ApiController', 'getUserExam'],
  ['GET', '/wscvis/supv/examination/getCourseExamList.json', 'supv.examination.ApiController', 'getCourseExamList'],
  ['GET', '/wscvis/supv/examination/getCourseExam.json', 'supv.examination.ApiController', 'getCourseExam'],
  ['GET', '/wscvis/supv/examination/getStudentList.json', 'supv.examination.ApiController', 'getStudentList'],
  ['GET', '/wscvis/supv/examination/getInGray.json', 'supv.examination.ApiController', 'isInGray'],

  /* 页面渲染 */
  ['GET', '/wscvis/supv/examination/*', 'supv.examination.IndexController', 'renderIndex'],
];
