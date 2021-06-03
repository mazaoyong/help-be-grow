import React from 'react';
import cn from 'classnames';
import './styles.scss';

const FooterButtonContainer: React.SFC<React.HTMLAttributes<HTMLDivElement>> = props => {
  const { children, className, ...otherProps } = props;

  return (
    <div className={cn('button-container', className)} {...otherProps}>
      <div className="inner">{children}</div>
    </div>
  );
};

export default FooterButtonContainer;
