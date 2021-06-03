import BaseService from '../../../base/BaseService';
import { IWxaGetCodeUltraParams, IWeappQrCodeUltraResult } from 'definitions/api/uic/channel/WxWeappQRCodeService/wxaGetCodeUltra';

class WxWeappQRCodeService extends BaseService {
  public readonly SERVICE_NAME ='com.youzan.uic.channel.business.api.service.WxWeappQRCodeService';

  /**
     * @description 获取当前kdtId对应的数量不受限二维码，如果当前kdtId没有对应的渠道信息，那么会获取此当前店铺总店的相关二维码
     *  支持自己携带map，然后拼接成scene
     * @link http://zanapi.qima-inc.com/site/service/view/467043
     */
  async wxaGetCodeUltra(params: IWxaGetCodeUltraParams): Promise<IWeappQrCodeUltraResult> {
    return this.invoke('wxaGetCodeUltra', [params]);
  }
};

export = WxWeappQRCodeService;
