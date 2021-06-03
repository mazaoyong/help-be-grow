import BaseService from '../../../base/BaseService';
import { ISendSmsCaptchaCommand } from 'definitions/api/owl/api/SmsCaptchaFacade/sendSmsCaptcha';
import { IVerifySmsCaptchaCommand } from 'definitions/api/owl/api/SmsCaptchaFacade/verifySmsCaptcha';

class SmsCaptchaFacade extends BaseService {
  public readonly SERVICE_NAME = 'com.youzan.owl.api.common.SmsCaptchaFacade';

  /**
   * @description 通用发送短信验证码
   * @link http://zanapi.qima-inc.com/site/service/view/1020108
   */

  async sendSmsCaptcha(
    kdtId: number,
    command: ISendSmsCaptchaCommand
  ): Promise<boolean> {
    return this.invoke('sendSmsCaptcha', [kdtId, command]);
  }

  /**
   * @description 通用校验验证码
   * @link http://zanapi.qima-inc.com/site/service/view/1020109
   */

  async verifySmsCaptcha(
    kdtId: number,
    command: IVerifySmsCaptchaCommand
  ): Promise<boolean> {
    return this.invoke('verifySmsCaptcha', [kdtId, command]);
  }
}

export = SmsCaptchaFacade;
