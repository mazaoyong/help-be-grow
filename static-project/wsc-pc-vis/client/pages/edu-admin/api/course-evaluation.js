import { visAjax } from 'fns/new-ajax';

export function getCourseEvaluationList(payload) {
  return visAjax('GET', '/edu/evaluation/getEvaluationList.json', payload);
}

export function putSellerEvaluation(payload) {
  return visAjax('PUT', '/edu/evaluation/putSellerEvaluation.json', payload);
}

export function getShopList(payload) {
  return visAjax('GET', '/edu/evaluation/getShopList.json', payload);
}
