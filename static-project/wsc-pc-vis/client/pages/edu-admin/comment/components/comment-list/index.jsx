
import { Select } from '@zent/compat';
/* eslint-disable camelcase */
import React, { useEffect, useContext, useState, useRef } from 'react';
import { Pagination, BlockLoading, Checkbox, Button, Notify } from 'zent';
import { Dialog } from '@youzan/ebiz-components';
import { isEduHqStore, isWscHqStore, isUnifiedHqStore, isRetailMinimalistHqStore, isUnifiedPartnerStore, isRetailMinimalistPartnerStore } from '@youzan/utils-shop';
import { BRANCH_STORE_NAME } from 'constants/chain';
import Item from './Item';
import NoData from '../nodata';
import MaskGuide from 'components/mask-guide';
import './style.scss';

import { comment } from '../../reducers/comment';
import * as service from '../../api';

const { openDialog, DialogBody, DialogFooter } = Dialog;
const CheckboxGroup = Checkbox.Group;
const supportHqStore = isEduHqStore || isWscHqStore || isUnifiedHqStore || isRetailMinimalistHqStore;
const supportPartnerStore = isUnifiedPartnerStore || isRetailMinimalistPartnerStore;

const commentType = [
  {
    value: -1,
    text: '全部留言',
  },
  {
    value: 2,
    text: '精选留言',
  },
  {
    value: 1,
    text: '置顶',
  },
];

const initialState = {
  loading: false,
  list: [],
  page: 1,
  pageSize: 20,
  total: 0,
  replyId: '',
  btnLoading: false
};

const CommentList = () => {
  const { context, dispatch } = useContext(comment);
  const [commentList, setCommentList] = useState([]);
  const [loading, setLoadingState] = useState(initialState.loading);
  const [page, setCurrentPage] = useState(initialState.page);
  const [total, setTotalNum] = useState(initialState.total);
  const [replyId, setReplayId] = useState(initialState.replyId);
  const [shopList, setShopList] = useState([]);
  const [checkedIdList, setCheckedIdList] = useState([]);
  const maskRef = useRef();

  const handleDispatch = (type, payload) => {
    dispatch({
      type,
      payload,
    });
  };

  /**
   * 获取网店列表
   *
   * @param {string} keyword 搜索词
   * @return {undefined}
   */
  const searchDescendentShop = (keyword) => {
    service.findListAllCampus({
      shopName: keyword,
    }).then(res => {
      setShopList(res.map(({ kdtId, shopName }) => ({
        value: kdtId,
        text: shopName,
      })));
    });
  };

  const handleBatchConcealCheck = (e) => {
    const commentIdList = commentList.map(item => item.id);
    setCheckedIdList(e.target.checked ? commentIdList : []);
  };

  const DialogContent = (props) => {
    const { dialogref, loadingState } = props;
    return (
      <>
        <DialogBody>隐藏留言后，课程详情页将不展示已经隐藏的留言，确定隐藏吗？</DialogBody>
        <DialogFooter>
          <Button type="primary" loading={loadingState} onClick={dialogref.submit}>
            确定
          </Button>
          <Button onClick={dialogref.close}>取消</Button>
        </DialogFooter>
      </>
    );
  };

  const openBatchConcealModal = () => {
    if (checkedIdList.length === 0) {
      Notify.error('请选择至少一个留言进行批量操作');
      return;
    }
    openDialog(DialogContent, {
      title: '隐藏留言',
      mask: true,
      submitEffect() {
        return new Promise((resolve) => {
          const itemList = commentList.reduce((arr, checkItem) => {
            if (checkedIdList.includes(checkItem.id)) {
              arr.push({
                id: checkItem.id,
                kdtId: checkItem.kdtId
              });
            }
            return arr;
          }, []);
          service.setbBatchCommentStatus({
            isHide: true,
            kdtId: window._global.kdtId,
            itemList
          }).then((data) => {
            if (data.failCount === 0) {
              Notify.success('批量隐藏留言成功');
            } else if (data.successCount > 0 && data.failCount > 0) {
              Notify.error('部分留言隐藏失败，请重试');
            } else if (data.successCount === 0 && data.failCount > 0) {
              Notify.error('全部留言隐藏失败，请重试');
            }
            handleDispatch('reloadComments');
          }).catch((err) => {
            Notify.error(err);
          }).finally(() => {
            resolve(true);
          });
        });
      }
    }).afterClosed();
  };

  useEffect(() => {
    searchDescendentShop();
  }, []);

  useEffect(
    () => {
      if (context.productAlias !== '') {
        setLoadingState(true);
        service.getCommentList({
          page,
          pageSize: initialState.pageSize,
          contentId: context.productId,
          chosenSticky: context.chosenSticky === -1 ? undefined : context.chosenSticky,
          alias: context.productAlias,
          subKdtId: context.subKdtId, // 校区kdtId
        })
          .then(data => {
            const { content: list, total } = data || {};
            setCommentList(list);
            setTotalNum(total);
            setCheckedIdList([]);
          })
          .finally(_ => setLoadingState(false));
      }
    },
    // figure out the compare mark
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      context.chosenSticky,
      context.productAlias,
      context.reloadComments,
      context.subKdtId,
      page,
    ],
  );

  let title = commentType.find(one => one.value === context.chosenSticky);
  title = title ? title.text : '全部留言';
  const checkedAll =
  !!checkedIdList.length && checkedIdList.length === commentList.length;
  const indeterminate =
  !!checkedIdList.length && checkedIdList.length !== commentList.length;

  return (
    <div className="comment-content-container">
      <div className="comment-content-filter">
        <Select
          autoWidth
          width={120}
          data={commentType}
          // placeholder="全部留言"
          value={context.chosenSticky ? context.chosenSticky : -1}
          className="comment-content-filter__typeselect"
          onChange={(_, data) => handleDispatch('setState', { chosenSticky: data.value })}
        />
        {/* 是否为教育总部 */}
        {supportHqStore ? (<Select
          autoWidth
          width={200}
          resetOption
          resetText={supportPartnerStore ? '' : `全部${BRANCH_STORE_NAME}`}
          data={shopList}
          placeholder={supportPartnerStore ? '' : `全部${BRANCH_STORE_NAME}`}
          value={context.subKdtId}
          onChange={(_, data) => handleDispatch('setState', { subKdtId: data.value })}
          onAsyncFilter={searchDescendentShop}
        />) : supportPartnerStore
          ? (<div ref={maskRef} >
            <Select
              autoWidth
              width={200}
              resetOption
              resetText={supportPartnerStore ? '' : `全部${BRANCH_STORE_NAME}`}
              data={shopList}
              placeholder={supportPartnerStore ? '' : `全部${BRANCH_STORE_NAME}`}
              value={context.subKdtId}
              onChange={(_, data) => handleDispatch('setState', { subKdtId: data.value })}
              onAsyncFilter={searchDescendentShop}
            />
            <MaskGuide
              fieldRef={maskRef}
              storageKey={`comment-partner-list-${_global.kdtId}`}
              styles={{ top: '0', left: '90px', width: '230px' }}
              popClassName='comment-selector__pop'
            />
          </div>)
          : null
        }
      </div>
      <div className="comment-content-container__conceal">
        <Checkbox
          checked={checkedAll}
          disabled={commentList.length === 0}
          indeterminate={indeterminate}
          onChange={handleBatchConcealCheck}
        >
          当页全选
        </Checkbox>
        <Button onClick={openBatchConcealModal}>隐藏</Button>
      </div>
      <div className="comment-content-container__title">{title}</div>
      <BlockLoading loading={loading}>
        <div className="comment-content-list">
          <CheckboxGroup
            className="comment-content-list-checkbox__group"
            value={checkedIdList}
            onChange={value => setCheckedIdList(value)}
          >
            {commentList.length > 0 ? (
              commentList.map(one => (
                <div className="comment-content-list-checkbox" key={one.id}>
                  <Checkbox value={one.id} className="comment-content-list-checkbox__item"></Checkbox>
                  <Item
                    key={one.id}
                    data={one}
                    reply={one.id === replyId}
                    onClick={status => {
                      setReplayId(status ? one.id : '');
                    }}
                  />
                </div>
              ))
            ) : (
              <NoData text="暂无留言" />
            )}
          </CheckboxGroup>
        </div>
      </BlockLoading>

      {commentList.length > 0 ? (
        <Pagination
          current={page}
          totalItem={total}
          onChange={({ current: page }) => {
            setCurrentPage(page);
          }}
          pageSize={initialState.pageSize}
        />
      ) : null}
    </div>
  );
};

export default CommentList;
