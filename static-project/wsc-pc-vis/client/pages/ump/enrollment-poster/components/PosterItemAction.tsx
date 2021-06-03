import { Pop } from '@zent/compat';
import React, { useCallback } from 'react';
import { hashHistory } from 'react-router';
import Divider from './Divider';
import { Link as SamLink } from '@youzan/sam-components';
import { Notify } from 'zent';
import { clickTracker, EventTypeEnum } from 'components/logger';
import { useStore } from '../store';
import { IPosterItemData } from '../types';
import { deletePoster } from '../api';
import { ENROLLMENT_POSTER_LIST } from '../contants';

interface IPosterItemActionProps {
  id: number;
  data: IPosterItemData;
}
function PosterItemAction(props: IPosterItemActionProps) {
  const { id, data } = props;
  const [store, dispatch] = useStore();
  const editItem = useCallback(() => {
    clickTracker({
      eventName: '编辑海报',
      eventSign: 'edit_poster',
      pageType: ENROLLMENT_POSTER_LIST,
      otherParams: {
        eventType: EventTypeEnum.EDIT,
      },
    });
    // if (checkAccess('编辑')) {
    hashHistory.push(`/edit/${id}`);
    // }
  }, [id]);
  const promote = useCallback(() => {
    dispatch({
      promotionVisible: true,
      itemData: data,
    });
    clickTracker({
      eventName: '推广海报',
      eventSign: 'promote_poster',
      pageType: ENROLLMENT_POSTER_LIST,
      otherParams: {
        eventType: EventTypeEnum.PROMOTE,
      },
    });
  }, [dispatch, data]);
  const deleteItem = useCallback(() => {
    deletePoster({ id })
      .then(() => {
        Notify.success('删除成功');
        dispatch({
          refreshFlag: store.refreshFlag + 1,
        });
        clickTracker({
          eventName: '删除海报',
          eventSign: 'delete_poster',
          pageType: ENROLLMENT_POSTER_LIST,
          otherParams: {
            eventType: EventTypeEnum.DELETE,
          },
        });
      })
      .catch(() => {
        Notify.error('删除失败');
      });
  }, [id, store, dispatch]);
  return (
    <div className="poster-item-action">
      <div className="poster-item-action-left">
        <SamLink name="编辑" href="javascript:;" onClick={editItem}>
          编辑
        </SamLink>
        <Divider />
        <SamLink name="编辑" href="javascript:;" onClick={promote}>
          推广
        </SamLink>
      </div>
      <div className="poster-item-action-left">
        <SamLink name="编辑" href="javascript:;">
          <Pop
            trigger="click"
            content={<div>删除后将不可恢复，确认删除？</div>}
            onConfirm={deleteItem}
            confirmText="删除"
            position="top-right"
            className="pop-delete"
          >
            删除
          </Pop>
        </SamLink>
      </div>
    </div>
  );
}

export default PosterItemAction;
