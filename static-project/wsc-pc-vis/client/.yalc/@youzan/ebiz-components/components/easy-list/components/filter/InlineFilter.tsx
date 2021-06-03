import React from 'react';

const InlineWrapper: React.FC<{
  left: React.ReactNode;
  right: React.ReactNode;
}> = (props) => {
  const { left, right } = props;

  const LEFT_NODES = React.useMemo(() => {
    return React.Children.map(left, (child, index) => (
      <div key={`wrapperItem${index}`} className="easy-list__inline-wrapper-item">
        {child}
      </div>
    ));
  }, [left]);

  const RIGHT_NODES = React.useMemo(() => {
    return React.Children.map(right, (child, index) => (
      <div key={`wrapperItem${index}`} className="easy-list__inline-wrapper-item">
        {child}
      </div>
    ));
  }, [right]);

  return (
    <div data-testid="easy-filter-inline" className="easy-list__inline-wrapper">
      <div className="easy-list__inline-wrapper__left">{LEFT_NODES}</div>
      <div className="easy-list__inline-wrapper__right">{RIGHT_NODES}</div>
    </div>
  );
};

export default InlineWrapper;
