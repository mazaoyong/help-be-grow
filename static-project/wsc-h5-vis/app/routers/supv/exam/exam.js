/**
 * 小测试相关接口
 */
module.exports = [
  ['POST', '/wscvis/exam/submitAnswer.json', 'supv.exam.ExamController', 'submitAnswerJson'],
  ['POST', '/wscvis/exam/joinExam.json', 'supv.exam.ExamController', 'joinExamJson'],
  ['GET', '/wscvis/exam/getExamDetail.json', 'supv.exam.ExamController', 'getExamDetailJson'],
  ['GET', '/wscvis/exam/getQuestionList.json', 'supv.exam.ExamController', 'getQuestionListJson'],
  ['GET', '/wscvis/exam/getExamRecord.json', 'supv.exam.ExamController', 'getExamRecordJson'],
  ['GET', '/wscvis/exam/getShare.json', 'supv.exam.ExamController', 'getShareJson'],

  ['GET', '/wscvis/exam/*', 'supv.exam.IndexController', 'getIndexHtml'],
];
