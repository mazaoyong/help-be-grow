import { React, FC } from '@youzan/tany-react';
import accMul from '@youzan/utils/number/accMul';
import cx from 'classnames';
import { RateType, ScoreRule } from 'domain/homework-domain/types/homework';
import { Option } from '../grade-select-field';
import { CorrectGrade } from '../../types';
import { BooleanLike } from '../../../../../types';
import './styles.scss';

interface IScoreDisplay {
  type: RateType;
  value: CorrectGrade | string;
  scoreRule?: ScoreRule;
  isGoodAssignment: BooleanLike;
}

const fullScoreMap: Record<ScoreRule, number> = {
  [ScoreRule.HUNDRED]: 100,
  [ScoreRule.TEN]: 10,
};

const calcHasPassed = (value: number, scoreRule: ScoreRule) => {
  return ~~value >= accMul(fullScoreMap[scoreRule] || 100, 0.6);
};

/** 等第制分数展示 */
const GradeScoreDisplay: FC<{ value: CorrectGrade }> = ({ value }) => (
  <Option value={value} text={value} selected={true} style={{ cursor: 'default' }} onClick={() => {}}/>
);

/** 分数制分数展示 */
const PointScoreDisplay: FC<{ value: number, scoreRule: ScoreRule }> = ({ value, scoreRule }) => {
  const hasPassed = calcHasPassed(value, scoreRule);

  return (
    <span className={cx('assignment-score', { passed: hasPassed })}>{value ?? '0'}</span>
  );
};

const ScoreDisplayComponentMap: Record<RateType, React.ComponentType<any>> = {
  [RateType.GRADE]: GradeScoreDisplay,
  [RateType.POINT]: PointScoreDisplay,
};

const ScoreDisplay: FC<IScoreDisplay> = (props) => {
  const { type, isGoodAssignment } = props;
  const Comp = ScoreDisplayComponentMap[type];

  return (
    <div className="score-display">
      <div className="score">
        <span className="label">作业得分：</span>
        <div className="score">
          <Comp {...props} />
        </div>
      </div>
      {isGoodAssignment ? (
        <img className="good-assignment" width={96} height={96} src="//b.yzcdn.cn/public_files/0688d48243676df7e4b85e91cacf75e2.svg" alt="" />
      ) : null}
    </div>
  );
};

export default ScoreDisplay;
