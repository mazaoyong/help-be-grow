import BaseService from '../../../base/BaseService';
import { IBaiduQrCodeWithCompressionParam, IBaiduQrCodeWithCompressionDTO } from "definitions/api/channels/apps/BaiduAppInfoService/getBaiduQrCodeWithCompression";

class BaiduAppInfoService extends BaseService {
    public readonly  SERVICE_NAME = 'com.youzan.channels.apps.service.BaiduAppInfoService';

    /**
     * @description 生成百度小程序二维码，可压缩自定义参数
     *  注意：
     *    1、该接口会将自定义参数转换为一个scene参数，追加在path后面；扫码之后从path中得到的scene参数需调用《decompressBaiduQrCode》接口解析出具体内容
     *    2、接口入参中除customParam外的参数，如果有传递值则在生成二维码之前也会写入customParam中；同时也会写入createdAt字段用于标识创建二维码的时间。
     *    调用方应避免在自定义参数中使用这些变量名，否则会被覆盖掉（kdtId、mpId、acc
     * @link http://zanapi.qima-inc.com/site/service/view/899516
     */
    async getBaiduQrCodeWithCompression(param: IBaiduQrCodeWithCompressionParam): Promise<IBaiduQrCodeWithCompressionDTO> {
        return this.invoke('getBaiduQrCodeWithCompression', [param]);
    }
};

export = BaiduAppInfoService;
