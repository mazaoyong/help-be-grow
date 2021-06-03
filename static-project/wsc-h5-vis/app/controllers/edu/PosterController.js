const formatDate = require('zan-utils/date/formatDate');
const BaseController = require('../base/BaseController');
const SnapshotService = require('../../services/snap-shot/SnapShotService');
const CertificateCustomFacade = require('../../services/owl/client/ump/certificate/CertificateCustomFacade');
const WeappQRCodeService = require('../../services/channels/WeappQRCodeService');
const BaiduAppInfoService = require('../../services/channels/BaiduAppInfoService');

class PosterController extends BaseController {
  // 毕业证书
  async getGradIndex(ctx) {
    await ctx.render('common/poster/graduate.html');
  }

  // 获取活动海报
  async getCertificatePoster(ctx) {
    const { kdtId, buyerId: operatorId } = ctx;
    const query = {
      userId: operatorId,
      popStatus: 0,
      findType: 3,
    };
    const pageRequest = {
      pageNumber: 1,
      pageSize: 20,
      sort: {
        orders: [
          {
            direction: 'DESC',
            property: 'created_at',
          },
        ],
      },
    };

    const res = await new CertificateCustomFacade(ctx).find(kdtId, pageRequest, query);
    const certList = res.content;
    let currentInfo = {};
    let result = '';
    if (certList.length > 0) {
      // 批量更新证书
      let certIds = [];
      for (let item of certList) {
        certIds.push(item.id);
      }

      // 构造海报数据
      const certDTO = certList[0];
      const showDatas = certDTO.showDatas || {};
      const certificateTemplateDTO = certDTO.certificateTemplateDTO || {};
      currentInfo.bgUrl = this.getImageBg(certDTO.type, certificateTemplateDTO);
      currentInfo.title = certDTO.title || (certDTO.type === 1 ? '入学证书' : '毕业证书');
      currentInfo.avatar = showDatas.avatar || 'https://img01.yzcdn.cn/edu/avatar-man@3x.png';
      currentInfo.identityName = showDatas.identityName || ' ';
      // 入学证书可选字段
      currentInfo.courseName = showDatas.courseName ? `《${showDatas.courseName}》` : ' ';
      currentInfo.duration = showDatas.duration || ' ';
      // 毕业证书可选字段
      currentInfo.checkinDays = showDatas.checkinDays === 0 ? '0' : showDatas.checkinDays;
      currentInfo.consumeCount = showDatas.consumeCount === 0 ? '0' : showDatas.consumeCount;
      currentInfo.signatureText = certificateTemplateDTO.signatureText || ' ';
      currentInfo.praiseText = certificateTemplateDTO.praiseText || ' ';
      currentInfo.shareText = certificateTemplateDTO.shareText || ' ';
      const startDate = Number(certDTO.createdAt);
      if (startDate) {
        currentInfo.startDate = formatDate(startDate, 'YYYY年MM月DD日');
      } else {
        currentInfo.startDate = ' ';
      }
      // 自定义二维码
      if (certificateTemplateDTO.qrType === 1) {
        currentInfo.qrUrl = certificateTemplateDTO.qrUrl;
      } else {
        const page = `/packages/edu/webview/index`;
        const query = {
          targetUrl: encodeURIComponent(`https://h5.youzan.com/wscvis/edu/prod-detail?alias=${certDTO.sourceBizId || ''}&kdtId=${kdtId}`),
        };
        const weappCode = await this.getWeappCode(page, query);
        if (weappCode) {
          currentInfo.qrUrl = weappCode;
        }
      }

      // 渲染html
      let html = '';
      if (certDTO.type === 1) {
        html = await ctx.renderView('common/poster/certificate.html', { currentInfo });
      } else {
        html = await ctx.renderView('common/poster/graduate.html', { currentInfo });
      }

      try {
        result = await new SnapshotService(ctx).postSnapshotAsync({
          html,
          operatorId,
          height: 500,
          width: 315,
          alwaysCdn: 1,
          quality: 100,
        });
        await new CertificateCustomFacade(ctx).batchUpdatePopStatus(ctx.kdtId, certIds, 1);
      } catch (err) {
        ctx.logger.warn('社区团购活动海报生成失败', err);
      }

      if (!result) return ctx.json(1000009, 'error', '社区团购活动海报生成失败，请重试');
    }
    ctx.json(0, 'ok', result);
  }

  async getWeappCode(page, query) {
    let params = {
      ...query,
      kdtId: this.ctx.kdtId,
      page,
    };
    params = JSON.stringify(params);
    const weappQRCodeService = new WeappQRCodeService(this.ctx);
    const data = await weappQRCodeService.getCodeUltra(this.ctx.kdtId, 'pages/common/blank-page/index', params);
    return 'data:image/png;base64,' + data.imageBase64;
  }

  getImageBg(type, certificateTemplateDTO) {
    // 入学证书
    if (type === 1) {
      // 第一种类型
      if (certificateTemplateDTO.bgNo === 1) {
        return 'https://img01.yzcdn.cn/public_files/2019/06/11/e895db8b271fc14f0d6ea5305f65f1c8.png';
      }
      // 第二种类型
      if (certificateTemplateDTO.bgNo === 2) {
        return 'https://img01.yzcdn.cn/public_files/2019/06/11/0e88c96be2a05203c611d69e739f85df.png';
      }
      // 第三种类型
      if (certificateTemplateDTO.bgNo === 3) {
        return 'https://img01.yzcdn.cn/public_files/2019/06/11/78b52a992a0d2d56a4a0b376c0abe92e.png';
      }
      // 自定义类型
      if (certificateTemplateDTO.bgNo === 0) {
        return certificateTemplateDTO.bgUrl;
      }
      return 'https://img01.yzcdn.cn/public_files/2019/06/11/e895db8b271fc14f0d6ea5305f65f1c8.png';
    }
    // 毕业证书
    if (type === 2) {
      // 第一种类型
      if (certificateTemplateDTO.bgNo === 1) {
        return 'https://img01.yzcdn.cn/public_files/2019/04/23/bb69a36c222d6c07c0f8760e5d616857.png';
      }
      // 第二种类型
      if (certificateTemplateDTO.bgNo === 2) {
        return 'https://img01.yzcdn.cn/public_files/2019/04/23/4976b4a5a1aaf0ceb0e1235f09f35dae.png';
      }
      // 第三种类型
      if (certificateTemplateDTO.bgNo === 3) {
        return 'https://img01.yzcdn.cn/public_files/2019/04/23/6c0c6f79fed61c0a440d5243a141ee91.png';
      }
      // 自定义类型
      if (certificateTemplateDTO.bgNo === 0) {
        return certificateTemplateDTO.bgUrl;
      }
      return 'https://img01.yzcdn.cn/public_files/2019/04/23/bb69a36c222d6c07c0f8760e5d616857.png';
    }
  }

  async getSnopshotByKey(ctx) {
    const { key } = ctx.getQueryData();
    const snapshotService = new SnapshotService(ctx);
    const result = await snapshotService.getCache(key);
    ctx.json(0, 'ok', result);
  }

  async getPosterWayJson(ctx) {
    const isWhiteList = await this.callService(
      'iron-base/common.GrayReleaseService',
      'isInGrayReleaseByKdtId',
      'communitybuy_poster',
      +ctx.kdtId
    );
    ctx.json(0, 'ok', isWhiteList);
  }

  // 通用生成微信小程序码接口
  async getCommonWeappCode(ctx) {
    const { page = '', hyaLine = '', targetUrl = '' } = ctx.query;
    let params = {
      targetUrl,
      kdtId: this.ctx.kdtId,
      page,
      hyaLine,
    };
    params = JSON.stringify(params);
    const weappQRCodeService = new WeappQRCodeService(this.ctx);
    const data = await weappQRCodeService.getChainCodeUltra(this.ctx.kdtId, 'pages/common/blank-page/index', params);
    ctx.json(0, 'ok', 'data:image/png;base64,' + data.imageBase64);
  }

  // 通用生成微信小程序码接口
  async getCommonSwanCode(ctx) {
    let targetUrl = ctx.query.targetUrl || {};
    let dto = {
      businessType: 1,
      kdtId: Number(ctx.kdtId),
      path: targetUrl,
    };
    const baiduAppInfoService = new BaiduAppInfoService(ctx);
    const data = await baiduAppInfoService.getBaiduAppQrCode(dto);
    ctx.json(0, 'ok', 'data:image/png;base64,' + data);
  }

  // 获取家庭成员邀请海报
  async getInvitePoster(ctx) {
    const { buyerId: operatorId, isWeapp } = ctx;
    const { qrUrl, avatar, name, students, overtime } = ctx.request.body;
    let currentInfo = {
      avatar: avatar || 'https://img01.yzcdn.cn/edu/avatar-man@3x.png',
      name,
      students,
      qrUrl,
      overtime,
      desc: `长按识别${isWeapp ? '小程序码' : '二维码'}，接受邀请`,
    };
    let redisKey;
    // 渲染html
    let html = '';
    html = await ctx.renderView('common/poster/family-account-invite.html', { currentInfo });
    try {
      redisKey = await new SnapshotService(ctx).postSnapshotAsync({
        html,
        operatorId,
        height: 431,
        width: 300,
        alwaysCdn: 1,
        quality: 100,
      });
    } catch (err) {
      ctx.logger.warn('邀请海报生成失败', err);
    }
    if (!redisKey) {
      return ctx.json('WSC-H5-VIS-POST-SNAPSHOT-ERROR', 'error', '邀请海报生成失败，请重试');
    }
    ctx.json(0, 'ok', redisKey);
  }
}
module.exports = PosterController;
