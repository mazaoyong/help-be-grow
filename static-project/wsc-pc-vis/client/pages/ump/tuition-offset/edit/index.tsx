import React, { FC, useEffect, useMemo, useContext } from 'react';
import { IVisRouterProps } from 'fns/router';
import get from 'lodash/get';

import Aside from './blocks/aside';
import Main from './blocks/main';
import SuccessPage from './components/success-page';
import { Context, Provider } from './context';
import { getEventEditType } from './utils';
import { editPageTypeMap } from '../constants';

import './styles.scss';

const EditPage: FC<IVisRouterProps> = props => {
  const { id } = props.params;
  const { path } = props.route;
  const { status } = get(props, 'location.query', {});
  const editType = useMemo(() => getEventEditType(path), [path]);
  const pageStatus = useMemo(() => Number(status), [status]);
  const { state, dispatch } = useContext(Context);

  useEffect(() => {
    dispatch({
      type: 'UPDATE_STATE',
      payload: {
        showSuccessPage: false,
        editType,
      },
    });
  }, [id, editType, dispatch]);

  return (
    <div className="page-container">
      {state.showSuccessPage
        ? (
          <SuccessPage
            alias={state.alias}
            action={get(editPageTypeMap, editType, '新建')}
          />
        ) : (
          <div className="tuition-offset-edit">
            <Aside />
            <Main id={id} editType={editType} pageStatus={pageStatus} />
          </div>
        )
      }
    </div>
  );
};

const EditPageWithContext: FC<IVisRouterProps> = props => {
  return (
    <Provider>
      <EditPage { ...props } />
    </Provider>
  );
};

export default EditPageWithContext;
