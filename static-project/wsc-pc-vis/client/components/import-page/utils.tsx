import React, { ComponentClass } from 'react';

export const StepWrapper = function(WrappedComponent: ComponentClass) {
  return function RenderComp(props: any) {
    return <div className="step-wrapper">
      <div className="header">
        {props.index ? <div className="step-icon">{props.index}</div> : ''}
        {props.title ? <div className="title">{props.title}</div> : ''}
      </div>
      <div className="body">
        <div className="connector"></div>
        <WrappedComponent {...props} />
      </div>
    </div>;
  };
};
