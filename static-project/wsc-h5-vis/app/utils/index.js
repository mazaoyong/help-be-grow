const makeDateTimeStr = require('zan-utils/date/makeDateTimeStr');

module.exports = {
  /**
   * 格式化owl后台传过来的日期，2018-04-26T14:05:19Z => 2018-04-26 14:05:19
   * P.S. 这是一个诡异的转换，因为2018-04-26T14:05:19Z 表示标准时区的时间，但是后端存储的时候未区分时区，不得不
   * 在这儿做这个转换
   */
  formatOwlDateTimeStr(dateTimeStr, format = 'YYYY-MM-DD HH:mm:ss') {
    let dateTime = new Date(dateTimeStr);
    dateTime.setHours(dateTime.getHours() - 8);
    return makeDateTimeStr(dateTime, format);
  },

  isYouzanHost(redirect) {
    let isInWhiteList = false;
    const whiteList = ['youzan.com', 'koudaitong.com', 'youzanyun.com'];
    const match = redirect && redirect.match(/^(https?:)?\/\/([^/]*)\/?/);
    const host = match[2];

    isInWhiteList = whiteList.some(function(item) {
      var appendItem = '.' + item;
      return host.lastIndexOf(appendItem) > -1 && host.lastIndexOf(appendItem) === (host.length - appendItem.length);
    });

    return isInWhiteList;
  },
};
