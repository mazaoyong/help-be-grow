import { Context } from 'astroboy';

import LiveBaseController from './LiveBaseController';

class LiveWaitingController extends LiveBaseController {
  public async getIndexHtml(ctx: Context) {
    await this.setGlobalTheme();
    await ctx.render('course/live/waiting.html');
  }
}

export = LiveWaitingController;
