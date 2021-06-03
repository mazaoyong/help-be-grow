import React, { FC, useEffect } from 'react';
import { Dialog } from 'zent';
import { Provider, getInitialState, reducer, StateType } from './store';
import Condition from './components/condition';

const { closeDialog } = Dialog;

const EDIT_DIALOG_ID = 'edit_dialog_id';
export interface IPanelProps {
  project?: string;
  state?: StateType;
}

const Panel: FC<IPanelProps> = ({ project, children, state }) => {
  useEffect(() => {
    return () => {
      closeDialog(EDIT_DIALOG_ID, { triggerOnClose: true });
    };
  }, []);

  const newState = Object.assign({}, getInitialState(), state);

  return (
    <Provider state={newState} reducer={reducer}>
      <div className="panel">
        <Condition project={project} />
        {children}
      </div>
    </Provider>
  );
};

export default Panel;
