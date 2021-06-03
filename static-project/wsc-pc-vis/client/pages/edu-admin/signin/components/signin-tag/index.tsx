import React from 'react';

import './styles.scss';

export enum SignInStateEnum {
  SIGNIN = 0,
  ASK_FOR_LEAVE,
  ABSENT,
}

interface ISignInTagProps {
  state: SignInStateEnum;
}
export const SignInTag: React.FC<ISignInTagProps> = (props) => {
  const { state } = props;
  const signInClass = React.useMemo(
    () =>
      (({
        [SignInStateEnum.SIGNIN]: 'sign-blue',
        [SignInStateEnum.ASK_FOR_LEAVE]: 'sign-grey',
        [SignInStateEnum.ABSENT]: 'sign-red',
      } as Record<SignInStateEnum, string>)[state]),
    [state],
  );

  const signInLabel = React.useMemo(
    () =>
      (({
        [SignInStateEnum.SIGNIN]: '已签到',
        [SignInStateEnum.ASK_FOR_LEAVE]: '请假',
        [SignInStateEnum.ABSENT]: '未到',
      } as Record<SignInStateEnum, string>)[state]),
    [state],
  );

  return <span className={signInClass}>{signInLabel}</span>;
};
