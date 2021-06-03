import React, { useState } from 'react';
import { Button } from 'zent';

export default function ButtonTab({ options, wrapper: Wrapper, ...restProps }) {
  const [curIndex, setCurIndex] = useState(0);
  const toggleCurIndex = index => () => {
    setCurIndex(index);
  };
  return (
    <Wrapper {...restProps}>
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
    </Wrapper>
  );
}
