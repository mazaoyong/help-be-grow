import React from 'react';
import ClampLines from '../highlight';
// import HighLight from '../highlight';

export default function OptionClue({ keyword, item, onSelect }) {
  const handleClick = () => {
    onSelect({ mode: 'clue', item });
  };
  return (
    <div className="edu-enrollment-user-option" onClick={handleClick}>
      <div className="edu-enrollment-user-option-overlay">
        <ClampLines lines={1} text={item.name} keyword={keyword} />
        <ClampLines lines={1} text={item.mobile} keyword={keyword} />
        {item.ownerName ? <ClampLines lines={1} text={`课程顾问：${item.ownerName}`} /> : null}
      </div>
      {/* <HighLight str={item.name} substr={keyword} />
      <HighLight str={item.mobile} substr={keyword} />
      <span>课程顾问：{item.ownerName}</span> */}
    </div>
  );
}
