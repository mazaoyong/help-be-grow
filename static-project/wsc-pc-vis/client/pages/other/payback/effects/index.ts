import { createEffect, Actions } from 'zan-shuai';
import { Notify } from 'zent';
import * as api from '../api';
import { ActionTypes } from '../states';

export interface EffectTypes {
  fetchInfoData(page?): void;
}

const $ = Actions.payback as ActionTypes;

export default function createEffects() {
  createEffect('fetchInfoData', (page = 1) => {
    $.toggleShowHistoryLoading(true);
    api
      .queryInfo(page)
      .then(resp => {
        const { records, calcOrders, status } = resp;
        $.updateStatusData(status);
        $.updateInfoData(calcOrders);
        $.updateHistory(records);
      })
      .catch(msg => {
        Notify.error(msg);
      })
      .finally(() => {
        $.toggleShowHistoryLoading(false);
      });
  });
}
