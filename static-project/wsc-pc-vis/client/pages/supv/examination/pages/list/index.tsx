import React, { useState, useRef } from 'react';
import { hot } from 'react-hot-loader';
import get from 'lodash/get';
import { hashHistory } from 'react-router';
import { EasyList } from '@youzan/ebiz-components';
import { UmpAppBoardV2 } from '@youzan/react-components';
import { Button as SamButton } from '@youzan/sam-components';
import { filterConfig, columns } from './config';
import { findPage, deleteExam, quickUpdate } from '../../api';
import Promotion from '../../components/promotion';
import EmptyDisplay from '../../components/empty-display';
import openSubscribeDialog from '../../components/subscribe-dialog';
import { BlockLoading, Notify } from 'zent';
import './index.scss';
import { ExamStatus } from '../../types';
import { SAM_NAME, APPID } from '../../constants';

const { List, Filter, EasyGrid } = EasyList;

function ListPage() {
  const [shareVisible, setShareVisible] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [startEmpty, setStartEmpty] = useState(true);
  const listRef = useRef(null);
  const fetchList: any = (filter) => {
    setLoading(true);
    const { page, name, status, timeRange } = filter;
    const query: any = {};
    if (name) {
      query.title = name;
    }
    if (status && parseInt(status) > 0) {
      query.status = parseInt(status);
    }
    if (timeRange && timeRange.length > 0) {
      query.startTime = timeRange[0][0];
      query.endTime = timeRange[0][1];
    }
    return findPage({ pageNumber: page, pageSize: 10 }, query)
      .then((res) => {
        setLoading(false);
        const { content, total } = res;
        if (content.length > 0) {
          setStartEmpty(false);
        }
        return {
          dataset: content,
          pageInfo: {
            total,
            page: page,
          },
        };
      })
      .catch(() => {
        setLoading(false);
        Notify.error('列表获取失败');
      });
  };

  const onDelete = (id: number) => {
    deleteExam(id)
      .then(() => {
        Notify.success('删除成功');
        refresh();
      })
      .catch((e) => {
        Notify.error(e);
      });
  };

  const onUpdate = (id: number, status: ExamStatus) => {
    const text = status === ExamStatus.PUB ? '发布' : '停用';
    quickUpdate(id, status)
      .then(() => {
        Notify.success(`${text}成功`);
        refresh();
      })
      .catch(() => {
        Notify.success(`${text}失败`);
      });
  };

  const refresh = () => {
    // @ts-ignore
    const refAction = listRef.current ? listRef.current.action : null;
    refAction.refresh();
  };

  const createExam = () => {
    if (get(_global, 'pluginInfo.canBeUsed', false)) {
      hashHistory.push('/create');
    } else {
      openSubscribeDialog();
    }
  };

  return (
    <div className="examination-list">
      <div className="market-wrapper">
        <UmpAppBoardV2 id={APPID} title="考试" />
      </div>

      <div className="list-filter clearfix">
        <div className="list-header">
          <SamButton name={SAM_NAME.EDIT_EXAM} type="primary" onClick={createExam}>
            新建考试
          </SamButton>
        </div>

        <List mode="none" onSubmit={fetchList} ref={listRef} defaultFilter={{ pageSize: 10 }}>
          <Filter config={filterConfig} />
          {!startEmpty ? (
            <EasyGrid
              ellipsis
              scroll={{ x: 1180 }}
              columns={columns({
                setShareVisible,
                setShareUrl,
                setPreviewVisible,
                setPreviewUrl,
                onDelete,
                onUpdate,
              })}
            />
          ) : (
            <BlockLoading loading={loading}>
              <EmptyDisplay text="还没有创建考试" newText="去创建" onClick={createExam} />
            </BlockLoading>
          )}
        </List>
        <Promotion
          visible={shareVisible}
          showWeapp={true}
          onClose={() => setShareVisible(false)}
          url={shareUrl}
          mode="share"
        />
        <Promotion
          visible={previewVisible}
          onClose={() => setPreviewVisible(false)}
          url={previewUrl}
          mode="preview"
        />
      </div>
    </div>
  );
}

export default hot(module)(ListPage);
