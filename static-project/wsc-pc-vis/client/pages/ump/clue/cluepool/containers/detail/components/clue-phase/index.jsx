// 线索详情阶段
import React, { memo, useMemo } from 'react';
import { Icon } from 'zent';
import cx from 'classnames';
import { phases } from '../../config';
import './style.scss';

const CluePhaseItem = memo(({ text }) => {
  return (
    <dl className="clue-phase__item__dot">
      <dd>
        <i className="circle" />
      </dd>
      <dt>{text}</dt>
    </dl>
  );
});

const getItemClass = (i, cur) => {
  return cx({
    'clue-phase__item': true,
    active: cur < 7 && i <= cur,
  });
};

const CluePhase = ({ phase: curPhase, giveUpPhase, onChangePhase }) => {
  const wrapClassName = useMemo(
    () =>
      cx({
        'clue-phase': true,
        'pointer': onChangePhase,
        'give-up-phase': curPhase === 7 || curPhase === 8,
      }),
    [curPhase],
  );

  if (curPhase === 7 || curPhase === 8) {
    return (
      <ul className={wrapClassName}>
        <li className="clue-phase__item">
          <span className="icon">
            <Icon type="remove-o" />
          </span>
          <p>线索已{curPhase === 7 ? '放弃' : '删除'}</p>
        </li>
      </ul>
    );
  } else {
    return (
      <ul className={wrapClassName} onClick={onChangePhase}>
        {phases.map((phase, i) => {
          return (
            <li key={phase.type} className={getItemClass(phase.type, curPhase)}>
              {i !== 0 && <hr />}
              <CluePhaseItem text={phase.text} />
            </li>
          );
        })}
      </ul>
    );
  }
};

export default CluePhase;
