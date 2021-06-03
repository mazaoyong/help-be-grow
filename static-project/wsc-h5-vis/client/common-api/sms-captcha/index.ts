import { get } from 'lodash';
import { ajax } from '@youzan/vis-ui';
import { ISendSmsCaptchaCommand } from 'definitions/api/owl/api/SmsCaptchaFacade/sendSmsCaptcha';
import { IVerifySmsCaptchaCommand } from 'definitions/api/owl/api/SmsCaptchaFacade/verifySmsCaptcha';

/** 因为支付页的域名是 cashier.youzan.com，所以需要写死域名 */
function getH5Link(path: string) {
  return get(window, '_global.url.h5') + path;
}

export const sendSmsCaptcha = (data: ISendSmsCaptchaCommand) => {
  return ajax({
    method: 'GET',
    url: getH5Link('/wscvis/common/smscaptcha/sendSmsCaptcha.json'),
    data,
    rawResponse: true,
  });
};

export const verifySmsCaptcha = (data: IVerifySmsCaptchaCommand) => {
  return ajax({
    url: getH5Link('/wscvis/common/smscaptcha/verifySmsCaptcha.json'),
    method: 'GET',
    data,
    rawResponse: true,
  });
};
