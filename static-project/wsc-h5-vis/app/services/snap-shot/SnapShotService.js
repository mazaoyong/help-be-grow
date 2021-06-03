const BaseService = require('../base/BaseService');

// 服务端绘制海报接入，文档https://doc.qima-inc.com/pages/viewpage.action?pageId=165220230
class SnapshotService extends BaseService {
  /**
   * @description 截图接口
   * @param {Object} data 入参
   * @param {number} data.operatorId required 操作人账号id，C端取ctx.userId
   * @param {string} data.html required 用于生成截图的html 主体内容
   * @param {string} data.width 截图的宽度,默认值375
   * @param {string} data.height 截图的高度，默认值667
   * @param {string} data.alwaysCdn 是否始终使用cdn上传,默认1、可选：0和1
   * 1：永远都是返回CDN的图片地址，
   * 0：首次返回图片的base64码后异步上传CDN，第二次请求同样的海报时会直接返回CDN图片地址
   * @param {string} data.quality 生成截图的图片质量,默认值80
   * @param {string} data.ratio 用于图片生成的设备倍屏数，默认值为2，可选值有： 1 | 2
   * @param {string} data.type 生成的图片格式，默认 jpeg，可选值有：png | jpeg
   * @param {string} data.redisKey 自定义kvds存储的key值。
   * @param {string} data.selector 选择器(类似querySelector)，指定选择器之后，截图的宽高以及xy会根据getBoundingClientRect的数值来设定，默认不传入选择器
   * @return {Object} res
   * @return {string} res.img 图片CDN地址 或 base64
   * @return {string} res.type 此次图片返回格式，base64 或 CDN 地址
   * @return {boolean} res.fromRedis 请求结果是否来自于kv
   */
  async postSnapshot(data) {
    const result = await this.ajax({
      method: 'POST',
      url: `${this.getConfig('CARD_SNAP_URL')}/snapshot/snapshot.json`,
      data,
      timeout: 5000,
    });
    return result;
  }

  /**
   * @description 根据 redisKey 判断kv中是否有缓存好的截图
   * @param {string} redisKey required kvds存储的key值,判断kv中是否有对应的key，有的话直接取缓存里的截图
   * @return {Object} res
   * @return {string} res.img 图片CDN地址 或 base64
   * @return {string} res.type 此次图片返回格式，base64 或 CDN 地址
   * @return {boolean} res.fromRedis 请求结果是否来自于kv
   */
  async getCache(redisKey) {
    const result = await this.ajax({
      method: 'GET',
      url: `${this.getConfig('CARD_SNAP_URL')}/snapshot/cache.json`,
      data: {
        redisKey,
      },
      timeout: 5000,
    });
    return result;
  }

  /**
   * @description 异步生成截图接口
   * @param {Object} data 同/snapshot/snapshot.json 接口
   * @return redisKey 异步任务成功后，会返回一个 redisKey，返回成功后通过 cache.json 来查询任务的状态。cache.json 的 type 字段新增了两个值：pending 和 error，pending说明正在生成海报，error 说明海报生成失败。
   */
  async postSnapshotAsync(data) {
    const result = await this.ajax({
      method: 'POST',
      url: `${this.getConfig('CARD_SNAP_URL')}/snapshot/snapshotAsync.json`,
      data,
      timeout: 5000,
    });
    return result;
  }
}

module.exports = SnapshotService;
