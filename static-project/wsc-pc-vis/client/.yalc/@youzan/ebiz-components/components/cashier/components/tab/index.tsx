import React, { useState } from 'react';
import { Button } from 'zent';

import { ITabProps } from '../../types';

export default function Tab({ options }: ITabProps) {
  const [curIndex, setCurIndex] = useState(0);

  const toggleCurIndex = (index: number) => () => {
    setCurIndex(index);
  };

  return (
    <>
      <Button.Group className="edu-enrollment-tab-btn-group">
        {options.map((option, index) => (
          <Button
            className="edu-enrollment-tab-btn"
            key={index}
            type="primary"
            outline={curIndex !== index}
            onClick={toggleCurIndex(index)}>
            {option.text}
          </Button>
        ))}
      </Button.Group>
      {options[curIndex].children}
    </>
  );
}
