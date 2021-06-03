import MainWidget from './Main.vue';
import * as PayStatusAPI from './api';

export default class Extension {
  constructor(options) {
    this.ctx = options.ctx;

    Promise.all([PayStatusAPI.getShopMetaInfo(), PayStatusAPI.getCustomPointName()])
      .then(([metaInfo, pointName]) => {
        window._global.shopMetaInfo = metaInfo;
        this.ctx.data.pointsName = pointName || '积分';
      });
  }

  static widgets = {
    Main: MainWidget,
  };
}
