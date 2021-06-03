import React from 'react';

export default function OptionAdd({ keyword, onClick }) {
  return (
    <div className="edu-enrollment-user-option" onClick={onClick}>
      <a>+新增学员“{keyword}”</a>
    </div>
  );
}
