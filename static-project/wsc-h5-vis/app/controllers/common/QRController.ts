import BaseController from "../../controllers/base/BaseNewController";
import OwlCommonService from "../../services/api/owl/biz/OwlCommonService";
import GoodsScanPromotionService from "../../services/ump/marketing/goodsscan/GoodsScanPromotionService";
import WxWeappQRCodeService from "../../services/api/uic/channel/WxWeappQRCodeService";
// import { IQrCodeDTO } from "definitions/api/owl/biz/OwlCommonService/createQrCode";
import { IWxaGetCodeUltraParams } from "definitions/api/uic/channel/WxWeappQRCodeService/wxaGetCodeUltra";
import BaiduAppInfoService from "../../services/api/channels/apps/BaiduAppInfoService";
class QRController extends BaseController {
  async getQrcodeJson() {
    const { ctx } = this;
    const params = ctx.query;
    const queryData = {
      width: 280,
      height: 280,
      isShortenUrl: false,
      ...params
    };

    const result = await new OwlCommonService(ctx).createQrCode(queryData);
    ctx.json(0, "ok", result);
  }

  async getMpQrcodeJson() {
    const { ctx } = this;

    const { kdtId = ctx.kdtId, goodsId } = ctx.query;
    const result = await new GoodsScanPromotionService(ctx).findActivities(
      kdtId,
      goodsId
    );
    ctx.json(0, "ok", result);
  }

  /**
   * 获取通用的二维码
   */
  async createH5QrCode() {
    const { ctx } = this;
    const params = ctx.getPostData();
    // isShortenUrl 前端传递非有赞域名，后端拦截掉了，也不会有问题
    const {
      size = 280,
      shortenUrl: isShortenUrl = false,
      removeBorder: deleteWhite = false,
      errorCorrectionLevel,
      url = ""
    } = params;
    this.validator.required(url, "url 必须传递");
    console.log(isShortenUrl);
    // isShortenUrl 前端传递非有赞域名，后端拦截掉了，也不会有问题
    const result = await new OwlCommonService(ctx).createQrCode({
      url,
      deleteWhite,
      isShortenUrl,
      errorCorrectionLevel,
      width: size,
      height: size
    });
    ctx.json(0, "ok", result);
  }

  /**
   * 获取微信小程序码
   */
  async createWeappQrCode() {
    const { ctx } = this;
    const requestData = ctx.getPostData();
    const {
      width = 280,
      transparentBackground: hyaLine = false,
      page: queryPage,
      query
    } = requestData;

    const ENTRY_PAGE = "pages/common/blank-page/index";
    const params = {
      ...query,
      page: queryPage,
      kdtId: ctx.kdtId
    };
    // 保留特殊处理
    Object.keys(params).forEach(key => {
      params[key] = String(params[key]);
    });
    const payload: IWxaGetCodeUltraParams = {
      kdtId: ctx.kdtId,
      page: ENTRY_PAGE,
      width,
      hyaLine,
      params
    };
    const result = await new WxWeappQRCodeService(ctx).wxaGetCodeUltra(payload);
    ctx.success("data:image/png;base64," + result.imageBase64);
  }

  /**
   * 获取百度小程序码
   */
  async createSwanAppQrCode() {
    const { ctx } = this;
    const requestData = ctx.getPostData();
    const { size = 280, page, query } = requestData;
    this.validator.required(requestData);
    const payload = {
      page,
      width: size,
      businessType: 1,
      customParams: query
    };
    const result = await new BaiduAppInfoService(
      ctx
    ).getBaiduQrCodeWithCompression(payload);
    ctx.success(result);
  }
}

export = QRController;
