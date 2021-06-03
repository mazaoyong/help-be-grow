/** 导出记录的类型
 * @see https://doc.qima-inc.com/pages/viewpage.action?pageId=268795967
 */
export enum EXPORT_RECORD_TYPES {
  /** 考试学员导出 */
  EXAM_STUDENT = 17,
  /** 线索导出-全部线索 */
  CLUE_ALL = 32,
  /** 线索导出-公海池 */
  CLUE_POOL,
  /** 签到列表 */
  SIGNIN_LIST,
  /** 学员列表 */
  STUDENT_LIST,
  /** 报读列表 */
  APPLY_LIST,
  /** 课时汇总明细手动扣减 */
  COURSE_SUMMARY_MANUAL_CONSUME,
  /** 课时汇总按照学员 */
  COURSE_SUMMARY_STUDENT_DIMENSION,
  /** 课时汇总按照报读课程 */
  COURSE_SUMMARY_APPLY_COURSE_DIMENSION,
  /** 专栏-学习记录  **/
  COLUMN_STUDY_RECORD = 21,
  /** 直播-直播间管理-打赏管理 **/
  LIVE_REWARD = 19,
  /** 直播-学习明细 **/
  LIVE_STUDY_RECORD = 16,
  /** 预约管理 **/
  APPOINTMENT_LIST = 7,
  /** 课程表-导出签到表 **/
  SCHEDULE_SIGNED_LIST = 8,
  /** 课程表-导出课表 **/
  SCHEDULE_COURSE_LIST = 6,
  /** 老师-所授线下课 **/
  TEACHER_COURSE_LIST = 10,
  /** 老师-上课记录 **/
  TEACHER_TEACH_LIST = 11,
  /** 老师-老师列表 **/
  TEACHER_LIST = 9,
  /** 转介绍-新学员列表  **/
  INVITE_REWARD_NEW_STUDENT = 18,
  /** 群打卡-学员数据 **/
  PUNCH_STUDENT = 2,
  /** 群打卡-每日数据 **/
  PUNCH_DAILY = 3,
  /** 信息采集记录 **/
  RECORD_ORDER = 1,
  /** 推荐有奖-详情数据 **/
  REFERRAL_DETAIL = 20,
  /** 攒学费-数据 **/
  TUITION_OFFSET = 26,
  /** 直播导出抽奖记录 */
  LIVE_LOTTO_RECORD_EXPORT_TYPE = 60,
  /** 奖励导出记录 */
  REWARD_EXPORT_TYPE = 66,
}
