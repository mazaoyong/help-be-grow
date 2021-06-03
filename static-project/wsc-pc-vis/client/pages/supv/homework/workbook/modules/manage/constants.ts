export const workbookStuListSortByMap = {
  /** 加入时间 */
  joinTime: 'created_at',
  /** 提交作业数 */
  completedAssignmentNum: 'submit_num',
  /** 优秀作业数 */
  goodAssignmentNum: 'excellent_num',
  /** 待批阅作业数 */
  awaitMarkingNum: 'to_review_num',
};

export const workbookHomeworkListSortByMap = {
  /** 发布时间 */
  publishTime: 'publish_time',
  /** 截止时间 */
  deadlineTime: 'deadline',
  /** 提交作业数 */
  submitNum: 'submit_num',
  /** 作业提交率 */
  submitRatio: 'submit_rate',
  /** 待批阅 */
  awaitMarkingNum: 'to_review_num',
};

export const HOMEWORK_DIALOG_ID = 'HOMEWORK_DELETE_DIALOG';
