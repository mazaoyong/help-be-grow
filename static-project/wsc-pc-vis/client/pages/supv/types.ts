export enum QuestionType {
  All = 0,
  /** 单选 */
  Single,
  /** 多选 */
  Multiple,
  /** 判断 */
  Judge,
  /** 填空 */
  FillBlank,
  /** 简答题 */
  Subjective,
}

export enum QuestionLevel {
  All = 0,
  Easy,
  Normal,
  Medium,
}

export enum ScoringFormula {
  /** 少选得分 */
  Less = 1,
  /** 按选项 */
  ByOption
}
