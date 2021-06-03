import { ModelOf, createComponent, computed } from '@youzan/tany-vue';
import './style.scss';

/** 评分风格枚举 */
export enum HomeworkScoreStyleEnum {
  /** 分数制 */
  NUMBER = 1,
  /** 等第制 */
  GRADE = 2
}

/** 评分规则枚举 */
export enum HomeworkScoreRuleEnum {
  /** 十分制 */
  TEN = 1,
  /** 百分制 */
  HUNDRED = 2
}

export interface IHomeworkScoreProps {
  /** 评分风格 */
  scoreStyle: HomeworkScoreStyleEnum;
  /** 评分规则 */
  scoreRule: HomeworkScoreRuleEnum;
  /** 分数 */
  score: string | number;
  /** 是否被老师评价为优秀作业 */
  isExcellent: boolean;
}

export const SCORE_BG_MAP = {
  /** 老师标注的优秀作业 */
  markExcellent: 'https://b.yzcdn.cn/public_files/9ce032d741140792142cb6a21c34634b.png',
  /** 普遍意义上的优秀作业 */
  excellent: 'https://b.yzcdn.cn/public_files/9ce032d741140792142cb6a21c34634b.png',
  /** 良好 */
  good: 'https://b.yzcdn.cn/public_files/9cfc0e4797c96f09db94f135890b153e.png',
  /** 及格 */
  pass: 'https://b.yzcdn.cn/public_files/381b25674c9ab5e53e68c4191c9b6056.png',
  /** 不及格 */
  fail: 'https://b.yzcdn.cn/public_files/e2bdd09c11e101e910fc4ede7e196890.png'
}

function HomeworkScoreModel(props: IHomeworkScoreProps) {
  const bgUrl = computed(() => {
    let url = 'https://b.yzcdn.cn/public_files/09dfea87e13c4d54aaf9c881fdc3fbb1.png';
    if (props.isExcellent) {
      url = SCORE_BG_MAP.markExcellent;
    } else {
      if (props.scoreStyle === HomeworkScoreStyleEnum.NUMBER) {
        if (props.scoreRule === HomeworkScoreRuleEnum.HUNDRED) {
          if (props.score >= 80) {
            url = SCORE_BG_MAP.excellent;
          } else if (props.score >= 70 && props.score < 80) {
            url = SCORE_BG_MAP.good;
          } else if (props.score >= 60 && props.score < 70) {
            url = SCORE_BG_MAP.pass
          } else {
            url = SCORE_BG_MAP.fail;
          }
        } else if(props.scoreRule === HomeworkScoreRuleEnum.TEN) {
          if (props.score >= 8) {
            url = SCORE_BG_MAP.excellent;
          } else if (props.score >= 7 && props.score < 8) {
            url = SCORE_BG_MAP.good;
          } else if (props.score >= 6 && props.score < 7) {
            url = SCORE_BG_MAP.pass
          } else {
            url = SCORE_BG_MAP.fail;
          }
        }
      } else if (props.scoreStyle === HomeworkScoreStyleEnum.GRADE) {
        if (props.score === 'S' || props.score === 'A') {
          url = SCORE_BG_MAP.excellent;
        } else if (props.score === 'B') {
          url = SCORE_BG_MAP.good;
        } else if (props.score === 'C') {
          url = SCORE_BG_MAP.pass;
        } else {
          url = SCORE_BG_MAP.fail;
        }
      }
    }

    return url;
  });

  const NUMBER_REGEX = /(\d+).?(\d*)/;

  const integer = computed(() => {
    const result = props.score.toString().match(NUMBER_REGEX);
    if (result) {
      return result[1];
    }

    return '';
  });
  const float = computed(() => {
    const result = props.score.toString().match(NUMBER_REGEX);
    if (result) {
      return result[2];
    }

    return '';
  });

  return {
    props,
    bgUrl,
    integer,
    float
  };
}

function HomeworkScore(model: ModelOf<typeof HomeworkScoreModel>) {
  const {
    bgUrl,
    float,
    integer,
    props,
  } = model;
  return (
    <div
      class="homework-score"
      style={{
        backgroundImage: `url('${bgUrl.value}')`
      }}
    >
      <div
        class={{
          'homework-score__value': true,
          'homework-score__value--normal': float.value.length < 2,
          'homework-score__value--small': float.value.length === 2
        }}
      >
        <div>
          <span
            class={{
              'homework-score__value__integer': true,
              'homework-score__value__integer--normal': float.value.length < 2,
              'homework-score__value__integer--small': float.value.length === 2
            }}
          >
            {integer.value || props.score}
          </span>
          {float.value !== '' ? (
            <span
              class={{
                'homework-score__value__float': true,
                'homework-score__value__float--normal': float.value.length < 2,
                'homework-score__value__float--small': float.value.length === 2
              }}
            >
              .{float.value}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default createComponent(HomeworkScore, {
  model: HomeworkScoreModel,
  initialState: {
    scoreStyle: 1,
    scoreRule: 1,
    score: 0,
    isExcellent: false,
  },
});