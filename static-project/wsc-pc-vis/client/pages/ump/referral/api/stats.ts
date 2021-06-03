import { visAjax } from 'fns/new-ajax';
import {
  IPage
} from 'definitions/api/owl/pc/common';
import { ISummaryData, IRecommendRankDTO, IRecommendRewardDTO } from '../types';

export function getOverview(data) {
  return visAjax<ISummaryData>('GET', '/pct/referral/getOverview.json', data);
}

export function findRankDataByPage(data) {
  return visAjax<IPage<IRecommendRankDTO>>('GET', '/pct/referral/findRankDataByPage.json', data);
}

export function findDetailDataByPage(data) {
  return visAjax<IPage<IRecommendRewardDTO>>(
    'GET',
    '/pct/referral/findDetailDataByPage.json',
    data,
  );
}

export function exportReferralRewardData(data) {
  return visAjax('GET', '/pct/referral/exportReferralRewardData.json', data);
};
