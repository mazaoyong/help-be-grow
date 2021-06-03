/**
 * 店铺生命周期
 * https://doc.qima-inc.com/pages/viewpage.action?pageId=220779844
 */
export const SHOP_LIFE_STATUS = {
  /** 试用期 */
  TRY: 'try',
  /** 有效期 */
  VALID: 'valid',
  /** 保护期 */
  PROTECT: 'protect',
  /** 歇业 */
  PAUSE: 'pause',
  /** 打烊 */
  CLOSE: 'close',
  /** 删除 */
  DELETE: 'delete',
  /** 准备期 */
  PREPARE: 'prepare',
  /** 无效 */
  INVALID: 'invalid',
};
