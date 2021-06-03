import { Pop } from '@zent/compat';
import React, { FC, useContext } from 'react';
import { withRouter, WithRouterProps } from 'react-router';
import { Button as SamButton } from '@youzan/sam-components';
import { context } from '../../store';
import { has, get } from 'lodash';
import { Icon, Button } from 'zent';
import { ScheduleNewDialog } from '../../../../../../new-dialogs';
import GotoPage from '../schedule/gotopage';
import { getScheduleData } from '../../format';
import YZLocalStorage from 'zan-utils/local_storage';
import './style.scss';

type schedultType = 'day' | 'week' | 'month';

export interface IToobarProps {
  project?: string;
}

export interface IInterfaceProps {
  type: number;
  text: string;
}

export interface ITypeButtonProps {
  type: schedultType;
  text: string;
}

const TypeButton: FC<ITypeButtonProps> = ({ type, text }) => {
  const { store, dispatch } = useContext(context);

  return (
    <Button
      className="tab-button__type"
      type={type === store.scheduleType ? 'primary' : 'default'}
      onClick={() => {
        dispatch({
          type: 'setFilter',
          value: { scheduleType: type, data: {}, pageNumber: 1 } as any,
        });
        YZLocalStorage.setItem('default_schedule_type', type);
      }
      }
    >
      {text}
    </Button>
  );
};

const IntervalButton: FC<IInterfaceProps> = ({ type, text }) => {
  const { store, dispatch } = useContext(context);
  return (
    <Button
      className="tab-button__interval"
      onClick={() => {
        dispatch({
          type: 'setIntervalValue',
          value: type,
        });
      }}
      type={type === store.interval ? 'primary' : 'default'}
    >
      {text}
    </Button>
  );
};

const Toolbar: FC<IToobarProps & WithRouterProps> = ({ project, router }) => {
  const { store, dispatch } = useContext(context);

  return (
    <div className="panel__toolbar">
      <SamButton
        type="primary"
        name="编辑"
        onClick={() => {
          let query: any = {};
          let kdtId = window._global.kdtId || '';
          if (/educlass/.test(location.pathname)) {
            if (has(router, 'params.eduClassId') && has(router, 'params.eduCourseId')) {
              query.eduCourseId = get(router, 'params.eduCourseId');
              query.classNo = get(router, 'params.classNo');
              kdtId = get(router, 'params.kdtId');
            }
          }
          ScheduleNewDialog.open('新建日程', {
            kdtId,
            query,
            afterSaveSucceed: (submitData: any, scheduleId: string) => {
              if (!store.activeId) {
                GotoPage(submitData, store, dispatch, scheduleId);
              } else {
                getScheduleData(
                  { pageNumber: store.pageInfo.current },
                  store,
                  dispatch,
                  store.activeId,
                );
              }
            },
          });
        }}
      >
        新建日程
      </SamButton>
      <div className="panel__toolbar__rightpart">
        {store.type === 'view' && <a
          className="panel__toolbar__search"
          onClick={() =>
            dispatch({ type: 'setFilter', value: { showMoreFilter: !store.showMoreFilter } })
          }
        >
          {store.showMoreFilter ? '收起' : '展开'}筛选项
          <span className={`panel__toolbar__search--${store.showMoreFilter ? 'up' : 'down'}`}>
            <Icon type="right" />
          </span>
        </a>}
        {!store.activeId && store.type === 'view' && project !== 'educlass' && (
          <div className="panel__filter__tabs">
            <Button.Group>
              <TypeButton type="day" text="日" />
              <TypeButton type="week" text="周" />
              <TypeButton type="month" text="月" />
            </Button.Group>
            {store.scheduleType !== 'month' && (
              <Pop trigger="hover" position="top-center" content={<p>看板时间间隔</p>}>
                <span>
                  <Button.Group>
                    <IntervalButton type={15} text="15分" />
                    <IntervalButton type={30} text="30分" />
                    <IntervalButton type={60} text="1小时" />
                  </Button.Group>
                </span>
              </Pop>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default withRouter(Toolbar);
