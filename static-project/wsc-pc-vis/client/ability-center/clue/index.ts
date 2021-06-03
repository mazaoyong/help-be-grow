export { CluePhase } from './clue-phase';
export type { ICluePhaseProps } from './clue-phase';
export { ClueTag } from './clue-tag';
export type { IClueTagProps } from './clue-tag';
export { ClueRecords } from './clue-records';
export type { IClueRecordsProps } from './clue-records';
export { SourceInfo } from './source-info';
export type { ISourceInfo } from './source-info';
export { ChangeSource } from './change-source';
export type { IChangeSourceProps } from './change-source';
export { openTransferClueDialog } from './transter-clue';

export type TClueDetailType = 'all' | 'mine' | 'pool';
export const getClueDetailUrl = (type: TClueDetailType, clueId: number) =>
  `${_global.url.v4}/vis/edu/page/clue/${type}#/detail/${clueId}`;

export enum ClueRecordTypes {
  ADD_CLUE = 1,
  UPDATE_BASE_PROFILE,
  UPDATE_PHASE,
  UPDATE_TAGS,
  /** 更新课程顾问 */
  UPDATE_OWNER,
  /** 更新跟进进度 */
  UPDATE_RECORD,
  /** 报名表单 */
  SUBMIT_REGISTER_FORM,
  /** 体验课报名 */
  TRAIL_SIGN_UP,
  /** 好友助力 */
  BOOST_UP,
  /** 公众号海报 */
  POSTER,
  /** 品牌官网 */
  BRAND_HOMEPAGE = 12,
  /** 未知的类型 */
  TYPE_UNKNOWN,
  /** 转介绍 */
  INTRO_TRANSFER = 14,
  ONLINE_REGISTER,
  JOIN_EXAM,
  UPDATE_SOURCE = 100,
  /** 更新角色 */
  UPDATE_ROLE,
}
