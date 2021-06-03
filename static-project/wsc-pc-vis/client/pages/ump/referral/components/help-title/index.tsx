import { Pop } from '@zent/compat';
import React from 'react';
import { Icon } from 'zent';
import './index.scss';

interface IHelpTitleProps {
  title: string;
  desc: string;
}

const HelpTitle = (props: IHelpTitleProps) => {
  const { title, desc } = props;
  return (
    <div className="help-title">
      <span>{title}</span>
      <Pop
        trigger="hover"
        position="top-center"
        content={desc}
        wrapperClassName="help-title-pop"
        className="help-title-pop-content"
      >
        <Icon type="help-circle" className="help-title-icon" />
      </Pop>
    </div>
  );
};

export default HelpTitle;
