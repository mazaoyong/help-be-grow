import React, { useState } from 'react';
import { Icon } from 'zent';
import classnames from 'classnames';

import './styles.scss';

const useVisible = () => {
  const [ visible, setVisible ] = useState(false);
  const toggleVisible = () => {
    setVisible(val => !val);
  };
  return [ visible, toggleVisible ];
};

export default function ShowMore({ children }) {
  const [ visible, toggleVisible ] = useVisible();
  const className = classnames({
    'edu-enrollment-show-more-icon': true,
    'edu-enrollment-show-more-icon-closed': !visible,
  });
  return (
    <>
      <div className="edu-enrollment-show-more">
        <span onClick={toggleVisible}>
          <Icon type="caret-down" className={className} />
          <a href="javascript: void(0)">{visible ? '折叠更多设置' : '更多设置'}</a>
        </span>
      </div>
      <div className="edu-enrollment-show-more-block" style={{ display: visible ? 'block' : 'none' }}>
        {children}
      </div>
    </>
  );
}
