import React, { FC } from 'react';

import { IDividerProps } from '../types';

const Divider: FC<IDividerProps> = props => {
  const { type = 'solid', textAlign = 'center', content, className, style } = props;

  return (
    <>
      <div className="student-card__divider-container">
        <span className="student-card__divider-line" style={{ borderStyle: type }} />
        <div className="student-card__divider-content" style={{ textAlign }}>
          {content}
        </div>
      </div>
      <section className={className} style={style}>{props.children}</section>
    </>
  );
};

export default Divider;
