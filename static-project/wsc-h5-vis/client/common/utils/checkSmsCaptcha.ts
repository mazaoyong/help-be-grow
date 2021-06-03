import { sendSmsCaptcha, verifySmsCaptcha } from 'common-api/sms-captcha';
import { SUCCESS, INSUFFICIENT_BALANCE, ILLEGAL_CAPTCHA } from '@/constants/api-code';
import { ISendSmsCaptchaCommand, SceneEnum } from 'definitions/api/owl/api/SmsCaptchaFacade/sendSmsCaptcha';

interface IAPIResponse {
  code: number;
  msg: string;
}

export const sendCheckSmsCaptcha = (params: {
  mobile: string;
  bizAlias?: string;
  scene: SceneEnum;
  callBack: (isSuccess: boolean, msg?: string) => void;
}) => {
  const { mobile, bizAlias, scene, callBack } = params;

  const command: ISendSmsCaptchaCommand = {
    mobile,
    scene,
  };

  if (bizAlias) {
    command.bizAlias = bizAlias;
  }

  sendSmsCaptcha(command)
    .then((data: IAPIResponse) => {
      const { code, msg } = data;
      switch (code) {
        case SUCCESS:
          callBack(true);
          break;
        case INSUFFICIENT_BALANCE:
          callBack(false, '验证码发送失败，请刷新页面后再试');
          // 刷新页面
          setTimeout(location.reload.bind(location), 2000);
          break;
        default:
          callBack(false, msg || '网络异常');
          break;
      }
    });
};

export const verifyCheckSmsCaptcha = (params: {
  verifyCode: string;
  mobile: string;
  scene: SceneEnum;
  onSucccess: () => void;
  onFailed: (msg: string) => void;
}) => {
  const { verifyCode, mobile, scene, onSucccess, onFailed } = params;

  verifySmsCaptcha({
    verifyCode,
    mobile,
    scene,
  }).then((data: IAPIResponse) => {
    const { code, msg } = data;
    switch (code) {
      case SUCCESS:
        onSucccess();
        break;
      case ILLEGAL_CAPTCHA:
        onFailed('验证码不正确，请重新输入');
        break;
      default:
        onFailed(msg || '网络异常');
        break;
    }
  });
};
