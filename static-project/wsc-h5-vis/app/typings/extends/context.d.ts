/// <reference path="../../../node_modules/@youzan-types/iron-base/app/extends/context.d.ts" />
import { SessionCache, SessionCacheBuyer, SessionCachePlatform, SessionCacheUser } from 'astroboy';

/**
 * nobody
 */
interface IVisContext {
  nobody: string;
  /**
   * 用户 id
   * 一般用来传给后端的用户标志
   */
  buyerId: number;

  /**
   * 用户手机号
   */
  buyerPhone: SessionCacheBuyer['mobile'];

  /**
   * 用户的第三方平台 id
   * 传给后端的一般都是 buyerId
   */
  fansId: SessionCache['fans_id'];

  /**
   *
   */
  youzanFansId: SessionCache['youzan_fans_id'];

  /**
   * 粉丝类型
   */
  fansType: SessionCache['fans_type'];

  /**
   * 第三方体系下的用户名（微信、微博。。
   */
  fansNickname: SessionCache['fans_nickname'];

  /**
   * 第三方体系下的头像（微信
   */
  fansPicture: string,

  /**
   * 有赞体系下的用户名（手机号登录
   */
  buyerNickname: SessionCacheBuyer['nick_name'];

  /**
   * 有赞体系下的头像（手机号登录
   */
  buyerPicture: SessionCacheBuyer['avatar'];

  /**
   * verify_weixin_openid
   */
  openId: SessionCache['verify_weixin_openid'];

  /**
   * 平台信息
   */
  platform: SessionCache['platform'];

  /**
   *  用户信息
   */
  user: SessionCache['user'];

  /**
   * 聚合字段：统一从这两个字段取头像和用户名，确保对前端统一
   * https://doc.qima-inc.com/pages/viewpage.action?pageId=103221541
   */
  finalAvatar: SessionCachePlatform['platform_avatar'] | SessionCacheUser['avatar'];

  /**
   * 聚合字段：统一从这两个字段取头像和用户名，确保对前端统一
   * https://doc.qima-inc.com/pages/viewpage.action?pageId=103221541
   */
  finalUsername: SessionCachePlatform['platform_nickname'] | SessionCacheUser['nickname'];
}

interface IVisLogger {
  info(msg: string, e: Error, extra: any): void;
  warn(msg: string, e: Error, extra: any): void;
  debug(msg: string, e: Error, extra: any): void;
  error(msg: string, e: Error, extra: any): void;
}

declare abstract class VisContext {
  /**
   * 返回 vis h5 端的根 url
   * `https://${host}/wscvis`
   */
  readonly appUrl: string;

  /**
   * getQueryData 模块在解析 zan-pc-ajax 的 query 请求的时候
   * 会在 key 里面把数组的方括号带上，并且做一个很奇怪的union动作
   *
   * 例如 querystring = baz=biz&foo[]=bis&foo[]=test&arr[]=1&arr[]=1 这样的请求
   *
   * @param {string} key
   * @returns
   */
  getQueryParse(key?: string): any

  /**
   * @description 获取用户相关信息
   */
  readonly visBuyer: IVisContext

  /**
   * @description 返回 vis logger 对象
   */
  readonly visLogger: IVisLogger

  /**
   * @description 将 object stringify 用于展示
   * 默认会过滤掉线上以及预发环境
   */
  prettyjson(json: object): string
}

declare module 'astroboy' {
  interface Context extends VisContext {}
}
