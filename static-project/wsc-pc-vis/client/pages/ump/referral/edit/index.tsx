import React, { FC, useEffect, useMemo, useContext } from 'react';
import { IVisRouterProps } from 'fns/router';
import { visitTracker } from 'components/logger';

import Aside from './blocks/aside';
import Main from './blocks/main';
import { getEventEditType } from './utils';
import { Context, Provider } from './context';
import { UPDATE_STATE, TRACK_REFERRAL_CREATE } from '../constants';

import './styles.scss';

const EditPage: FC<IVisRouterProps> = (props) => {
  const {
    params: { id, status },
    route: { path },
  } = props;

  const editType = useMemo(() => getEventEditType(path), [path]);
  const { dispatch } = useContext(Context);
  const pageStatus = useMemo(() => (status ? Number(status) : undefined), [status]);

  useEffect(() => {
    dispatch({
      type: UPDATE_STATE,
      payload: {
        showSuccessPage: false,
        editType,
      },
    });
  }, [editType, dispatch]);

  useEffect(() => {
    visitTracker({ pageType: TRACK_REFERRAL_CREATE, eventName: '浏览新建推荐有奖' });
  }, []);

  return (
    <div className="page-container">
      <div className="referral-edit">
        <Aside />
        <Main id={id} editType={editType} pageStatus={pageStatus} />
      </div>
    </div>
  );
};

const EditPageWithContext: FC<IVisRouterProps> = (props) => {
  return (
    <Provider>
      <EditPage {...props} />
    </Provider>
  );
};

export default EditPageWithContext;
