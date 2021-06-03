import React from 'react';
import ClampLines from '../highlight';

export default function OptionStudent({ item, keyword, onSelect }) {
  const handleClick = () => {
    onSelect({ mode: 'student', item });
  };
  return (
    <div className="edu-enrollment-user-option" onClick={handleClick}>
      <div className="edu-enrollment-user-option-overlay">
        <ClampLines lines={1} text={item.name} keyword={keyword} />
        <ClampLines lines={1} text={item.mobile} keyword={keyword} />
      </div>
      {/* <HighLight str={item.name} substr={keyword} />
      <HighLight str={item.mobile} substr={keyword} /> */}
    </div>
  );
}
