import React, { ReactElement } from 'react';
import './styles.scss';

interface ISplitTitleProps {
  title: string | ReactElement;
}

export const SplitTitle = (props: ISplitTitleProps) => {
  const { title = '' } = props;
  return (
    title
      ? (<div className="split-title">
        <i className="split" />
        {title}
      </div>)
      : null
  );
};
