import React, { useContext } from 'react';
import { Avatar, Icon, Notify } from 'zent';
import Editor from './Editor';
import CommentReply from './CommentReply';
import commentActionsAdapter from './commen-actions';
import { comment } from '../../reducers/comment';
import { getKdtId } from 'common/utils';
import { format } from 'date-fns';
import { isEduHqStore, isUnifiedPartnerStore, isRetailMinimalistPartnerStore } from '@youzan/utils-shop';

const supportPartnerStore = isUnifiedPartnerStore || isRetailMinimalistPartnerStore;

const defaultAvatar =
  'https://img.yzcdn.cn/public_files/2018/04/24/fca6d416df298dbc4c96d826cb8d0219.png';

const Item = props => {
  const { context, dispatch } = useContext(comment);
  const { reply, data } = props;
  const time = format(data.createAt, 'YYYY-MM-DD HH:mm:ss');
  const { id } = data;

  const kdtId = getKdtId({ data });

  // payload
  const toggleStatusPayload = {
    id,
    kdtId,
    isSticky: data.isSticky,
    isChosen: data.isChosen,
    isHide: data.isHide,
  };
  const getDeletePayload = _ => {
    let id = null;
    if (data.replyComments.length) {
      id = data.replyComments[0].id;
    }
    return { id, kdtId };
  };
  const getAddCommentPayload = comment => ({
    id,
    comment,
    subKdtId: kdtId,
    alias: data.alias,
    userId: data.userId,
  });

  const disableClassName = supportPartnerStore ? 'comment-batch-actions__disabled' : '';

  // 对评论操作的一个统一入口，根据type区分，可以传入payload参数
  const commentActions = (type, payload) => {
    if (supportPartnerStore) {
      return;
    }
    payload.contentId = context.productId;
    commentActionsAdapter(type, payload).then(_ => {
      dispatch({ type: 'reloadComments' });
      // 重新刷新评价之后需要把选中显示输入框的评论id给消掉
      props.onClick(false);
    }).catch(errMsg => {
      Notify.error(errMsg || '网络错误');
    });
  };

  // 渲染操作按钮
  const replyComments = (data.replyComments || []).filter(one => one.isDelete !== 1);
  let replyBtn = null;
  let footer = null;
  if (replyComments.length > 0) {
    footer = replyComments.map((one, i) => (
      <CommentReply
        key={i}
        data={one}
        deleteComment={_ => commentActions('deleteComment', getDeletePayload())}
      />
    ));
  } else if (reply) {
    replyBtn = <span className={disableClassName}>收起回复</span>;
    footer = (
      <Editor
        cancel={props.onClick.bind(null, false)}
        addComment={comment => commentActions('addComment', getAddCommentPayload(comment))}
      />
    );
  } else {
    // 绑定触发显示隐藏的函数
    replyBtn = <span className={disableClassName} onClick={props.onClick.bind(null, true)}>回复</span>;
  }

  const chosenBtn = <span>{data.isChosen ? '取消精选' : '设为精选' }</span>;
  const stickyBtn = <span>{data.isSticky ? '取消置顶' : '置顶'}</span>;
  const hideBtn = <span>{data.isHide ? '取消隐藏' : '隐藏'}</span>;

  return (
    <div className="comment-content-list__item">
      <Avatar
        className="comment-content-list__item__avatar"
        size="large"
        shape="square"
        src={data.userHeadIcon || defaultAvatar}
      />
      <div className="comment-content-list__item__detail">
        <div className="comment-content-list-item__hd">
          <span>{data.userNickName || '匿名用户'}</span>
          {/* 是否为教育总部 */}
          {isEduHqStore
            ? <span className="comment-content-list-item__sub-shop-name">所属校区：{data.kdtName}</span>
            : null
          }
        </div>
        <div className="comment-content-list__item__detail__text">{data.productComment}</div>
        <div className="comment-content-list__item__detail__other">
          <span className="comment-content-list__item__detail__time">{time}</span>
          <span className="comment-content-list__item__detail__zan">
            <span className="comment-content-list__item__detail__zan__count">
              <Icon type="youzan-o" style={{ color: '#666', marginRight: '8px' }} />
              {data.praiseNum}
            </span>
            <i className="comment-content-list__item__detail__zan__icon" />
          </span>
          {reply ? null : (
            <span className="comment-content-list__item__detail__option">
              <span className={disableClassName} onClick={_ => commentActions('toggleStatus', { ...toggleStatusPayload, isChosen: !data.isChosen })}>{chosenBtn}</span>
              <span className={disableClassName} onClick={_ => commentActions('toggleStatus', { ...toggleStatusPayload, isSticky: !data.isSticky })}>{stickyBtn}</span>
              <span className={disableClassName} onClick={_ => commentActions('toggleStatus', { ...toggleStatusPayload, isHide: !data.isHide })}>{hideBtn}</span>
              {replyBtn}
            </span>
          )}
        </div>
        {!supportPartnerStore && footer}
      </div>
    </div>
  );
};

export default Item;
