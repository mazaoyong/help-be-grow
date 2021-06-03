const BaseController = require('../base/BaseController');

class ReviewBaseController extends BaseController {
  init() {
    super.init();
    this.initUserInfo();
    this.initTeamStatus();
  }
}

module.exports = ReviewBaseController;
