
import Vue from 'vue';
import { Lazyload } from 'vant';
import Args from 'zan-utils/url/args';
import { WebLogger } from '@youzan/client-log-sdk';
import 'common/log/pageLogger';
import batchLog from '../../log/batch-log';
import { Common } from '@youzan/vis-ui';

const skynet = Common.skynet;
const _global = window._global || {};

window.yzStackLog = {
  log({ name, message, extra, level }) {
    skynet.businessLog({
      name,
      message,
      extra,
      level,
    });
  },
  monitor(config) {
    const { appName, logIndex, topic, extra = {} } = config;
    skynet.monitorLog({
      appName,
      logIndex,
      topic,
      extra,
    });
  },
};

// 新版日志sdk
try {
  const href = window.location.href;

  if (!window.yzlogInstance) {
    var params = {
      hq_kdt_id: _global.hq_kdt_id,
      kdt_id: _global.kdt_id,
      buyer_id: _global.buyer_id,
      is_fans: _global.is_fans,
      fans_id: _global.fans_id,
      yz_fans_id: _global.youzan_fans_id,
      yz_uid: _global.youzan_user_id,
      nobody: _global.nobody,
      oid: _global.offline_id,
      activity_names: _global.activity_names,
      activity_type: _global.activity_type,
      source: _global.source,
      sourceID: _global.sourceID,
    };
    var clickId = Args.get('gdt_vid', href) || Args.get('qz_gdt', href);
    var sessionParams = {
      atr_ps: Args.get('atr_ps', href),
      atr_ps_utime: Args.get('atr_ps', href) ? parseInt(new Date().getTime() / 1000, 10) : undefined,
      dc_ps: Args.get('dc_ps', href),
      dc_ps_utime: Args.get('dc_ps', href) ? parseInt(new Date().getTime() / 1000, 10) : undefined,
      is_share: Args.get('is_share', href),
      qr: Args.get('qr', href),
      sales_id: Args.get('sales_id', href),
      sales_ch: Args.get('sales_ch', href),
      banner_id: Args.get('banner_id', href),
      from_source: Args.get('from_source', href),
      from_params: Args.get('from_params', href),
      // 如果url中存在gdt_vid参数，取gdt_vid的值，并把参数名更为 click_id，设为全局参数
      click_id: clickId,
      click_id_utime: clickId ? parseInt(new Date().getTime() / 1000, 10) : undefined,
    };

    window.yzlogInstance = WebLogger.getTracker({
      yai: 'wsc_c',
      autoClick: true,
      autoSpm: true,
      plat: {
        yai: 'wsc_c',
      },
      user: {
        li: _global.buyer_id || '',
        m: (_global.buyer || {}).mobile || '',
      },
      event: {
        si: _global.kdt_id || '',
        pt: (_global.spm && _global.spm.logType) || '',
        params: cleanObject(params),
      },
      baseUrl: 'https://tj1.youzanyun.com/v3/js/log',
    });
    // 设置 全局参数的有效期24小时
    window.yzlogInstance.addSessionParams(cleanObject(sessionParams), 24 / 24);
    // 设置 click_id，click_id_utime，atr_ps，atr_ps_utime 参数的有效期为90天
    // 如果没有，不用设置成空，而是不添加此参数
    if (sessionParams.click_id) {
      window.yzlogInstance.addSessionParams({ click_id: sessionParams.click_id }, 90);
    }
    if (sessionParams.click_id_utime) {
      window.yzlogInstance.addSessionParams({ click_id_utime: sessionParams.click_id_utime }, 90);
    }
    if (sessionParams.atr_ps) {
      window.yzlogInstance.addSessionParams({ atr_ps: sessionParams.atr_ps }, 90);
    }
    if (sessionParams.atr_ps_utime) {
      window.yzlogInstance.addSessionParams({ atr_ps_utime: sessionParams.atr_ps_utime }, 90);
    }
    // 知识付费SPA / 优惠套餐列表页/ 新下单页 / 视频直播间 enterpage异步打点，屏蔽静默打点
    if (
      location.pathname.indexOf('wscvis/knowledge/index') < 0 &&
      location.pathname.indexOf('wscvis/ump/package-buy') < 0 &&
      location.pathname.indexOf('pay/wscvis_buy') < 0 &&
      location.pathname.indexOf('wscvis/course/live/video/room') < 0 &&
      location.pathname.indexOf('wscvis/supv/punch/introduction') < 0 &&
      location.pathname.indexOf('wscvis/supv/punch/task') < 0
    ) {
      // auto log enterpage
      window.yzlogInstance.init();
    }
  }
} catch (e) {
  console.error(e);
}

const batchLogger = (items) => {
  const { pctSpm = '' } = window._global;
  window.yzlogInstance.log({
    et: 'view',
    ei: 'view',
    en: '商品曝光',
    params: {
      view_objs: items,
      spm: pctSpm,
    },
  });
};

batchLog.setLogSubscribe(batchLogger);
batchLog.initLog();

Vue.use(Lazyload, {
  adapter: {
    loaded({ el }) {
      const Logger = window.Logger;
      if (!Logger) {
        return;
      }

      const dataset = el.dataset || {};
      const id = dataset.lazyLogId || '';
      const trackItemType = dataset.trackItemType || '';
      let lazyLogParams = {};
      try {
        lazyLogParams = JSON.parse(dataset.lazyLogParams || '{}');
      } catch (err) {
        console.error(err);
      }

      if (!id && !(lazyLogParams && lazyLogParams.goods_id)) {
        return;
      }

      const spm = (Logger.getSpm && Logger.getSpm()) || '';
      let str;
      if (spm.lastIndexOf('_') === spm.length - 1) {
        str = spm + 'SI' + id;
      } else {
        str = spm + '_SI' + id;
      }

      // fuck vue-lazyload
      // stop it
      el.dataset.lazyLogId = '';

      Logger.log({
        spm: str,
        fm: 'display',
      });

      // 批量上传商品曝光数据
      let logParams = {
        goods_id: id + '',
        item_id: id + '',
        item_type: trackItemType,
      };
      if (lazyLogParams && lazyLogParams.goods_id) {
        logParams = lazyLogParams;
      }
      batchLog.addLogItem(logParams);
    },
  },
});

function cleanObject(o) {
  var newObject = {};
  Object.keys(o).forEach(function(key) {
    if (o[key]) {
      newObject[key] = o[key];
    }
  });
  return newObject;
}
