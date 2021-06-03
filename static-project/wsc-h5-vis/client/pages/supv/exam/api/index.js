import ajax from 'captain-ajax';

const BASE_URL = '/wscvis/exam';

function getPCQrCode(url) {
  return ajax({
    url: '/wscvis/knowledge/qrcode.json',
    data: {
      url,
      isShortenUrl: true,
      kdt_id: window._global.kdt_id,
      deleteWhite: true,
    },
  });
}

function submitAnswerApi(data) {
  return ajax({
    method: 'POST',
    url: `${BASE_URL}/submitAnswer.json`,
    data,
  });
}

function joinExamApi(data) {
  return ajax({
    method: 'POST',
    url: `${BASE_URL}/joinExam.json`,
    data,
  });
}

function getExamDetailApi(data) {
  return ajax({
    url: `${BASE_URL}/getExamDetail.json`,
    data,
  });
}

function getQuestionListApi(data) {
  return ajax({
    url: `${BASE_URL}/getQuestionList.json`,
    data,
  });
}

function getExamRecordApi(data) {
  return ajax({
    url: `${BASE_URL}/getExamRecord.json`,
    data,
  });
}

function getShareApi(data) {
  return ajax({
    url: `${BASE_URL}/getShare.json`,
    data,
  });
}

export {
  submitAnswerApi,
  joinExamApi,
  getExamDetailApi,
  getQuestionListApi,
  getExamRecordApi,
  getShareApi,
  getPCQrCode,
};
