import { Pop } from '@zent/compat';
import React, { Component } from 'react';
import { BlockLoading, Tag, Pagination, previewImage, Dialog, Button, Input, Notify } from 'zent';

import fullfillImage from 'zan-utils/lib/fullfillImage';
import formatDate from 'zan-utils/date/formatDate';
import get from 'lodash/get';

import AduioPlay from 'components/audio-play';
import TeacherComments from './TeacherComments';

import {
  getPunchLogsListAPI,
  addPunchLogsAPI,
  updateSelectionStatusAPI,
  updateShowStatusAPI,
} from '../../api';

export default class DiaryComments extends Component {
  state = {
    loading: true,
    content: [],
    page: 1,
    total: 10,
    teacherComment: '',
    activeLogId: '',
  };

  componentDidUpdate(prevProps) {
    if (prevProps.active.id !== this.props.active.id) {
      this.getPunchLogsList(1);
    }
  }

  // 图片预览
  handleImagesPreview = (images, idx) => {
    previewImage({
      images: images,
      index: idx,
      parentComponent: this,
      scaleRatio: 3,
    });
  };

  onCommentChange = evt => {
    this.setState({
      teacherComment: evt.target.value,
    });
  };

  onDialogSwitch = id => {
    this.setState({
      activeLogId: id,
    });
  };

  // 获取打卡评论列表
  getPunchLogsList = current => {
    this.setState({
      loading: true,
    });

    getPunchLogsListAPI({
      alias: this.props.alias,
      page: current || this.state.page,
      size: 10,
      taskId: get(this.props.active, 'id'),
    })
      .then(({ content = [], total = 0, pageable: { pageNumber = 1 } }) => {
        this.setState({
          content,
          total,
          page: pageNumber,
        });
      })
      .catch(msg => {
        Notify.error(msg || '网络错误！');
      })
      .finally(() => {
        this.setState({
          loading: false,
        });
      });
  };

  // 精选状态
  onSelectionChange = (gciLogId, selectionStatus) => {
    this.setState({
      loading: true,
    });

    updateSelectionStatusAPI({
      gciLogId,
      selectionStatus: 1 - selectionStatus,
    })
      .then(() => {
        Notify.success('修改成功！');
        this.getPunchLogsList();
      })
      .catch(msg => {
        Notify.error(msg || '修改失败！');
      });
  };

  // 显示/隐藏
  onShowChange = (gciLogId, showStatus) => {
    this.setState({
      loading: true,
    });

    updateShowStatusAPI({
      gciLogId,
      showStatus: 1 - showStatus,
    })
      .then(() => {
        Notify.success('修改成功！');
        this.getPunchLogsList();
      })
      .catch(msg => {
        Notify.error(msg || '修改失败！');
      });
  };

  // 添加评论
  addComemnt = id => {
    addPunchLogsAPI({
      gciLogId: id,
      comment: this.state.teacherComment,
      fansId: get(window._global, 'userId'),
    })
      .then(() => {
        this.getPunchLogsList();
        this.setState({
          activeLogId: '',
          teacherComment: '',
        });
      })
      .catch(msg => {
        Notify.error(msg || '点评失败！');
      });
  };

  renderItem = one => {
    return (
      <div className="punch-diary__comments__list__item" key={one.id}>
        <div className="item-head">
          <img className="item-head__avatar" src={one.avatar} alt="" />
          <div className="item-head__content">
            <span className="nickname">{one.nickname}</span>
            {one.selection === 1 && <Tag color="red">精选</Tag>}
            {one.show === 0 && <Tag color="blue">已隐藏</Tag>}
            <div className="operate">
              <Pop
                trigger="click"
                position="left-top"
                content={
                  one.selection === 0 ? '设为精选后此内容将置顶显示，确定吗?' : '确认取消精选？'
                }
                onConfirm={() => this.onSelectionChange(one.id, one.selection)}
              >
                <span className="ui-link--split-l cursor-link">
                  {one.selection === 0 ? '精选' : '取消精选'}
                </span>
              </Pop>
              <Pop
                trigger="click"
                position="left-top"
                content={one.show === 0 ? '确认显示？' : '隐藏后学员将无法查看此内容，确定隐藏？'}
                onConfirm={() => this.onShowChange(one.id, one.show)}
              >
                <span className="ui-link--split-l cursor-link">
                  {one.show === 0 ? '显示' : '隐藏'}
                </span>
              </Pop>
              <span
                className="ui-link--split comment-link"
                onClick={() => this.onDialogSwitch(one.id)}
              >
                点评
              </span>
              <Dialog
                className="teacher-comment-dialog"
                visible={this.state.activeLogId === one.id}
                title={one.nickname || '匿名'}
                onClose={() => {
                  this.onDialogSwitch('');
                }}
              >
                <Input
                  type="textarea"
                  maxLength={300}
                  showCount
                  style={{ height: '250px' }}
                  value={this.state.teacherComment}
                  placeholder="老师的点评是学员打卡的最大动力！"
                  onChange={evt => this.onCommentChange(evt)}
                />
                <div className="zent-dialog-r-footer">
                  <Button
                    type="primary"
                    disabled={this.state.teacherComment === ''}
                    onClick={() => this.addComemnt(one.id)}
                  >
                    提交
                  </Button>
                  <Button type="primary" outline onClick={() => this.onDialogSwitch('')}>
                    取消
                  </Button>
                </div>
              </Dialog>
            </div>
            <p className="desc">
              <span>
                共打卡
                {one.cumulativeCount}次
              </span>
              <span>{formatDate(one.createTime, 'YYYY-MM-DD HH:mm:ss')}</span>
            </p>
          </div>
        </div>
        <div className="item-content">
          <p className="item-content__text">{one.content}</p>
          <div className="item-content__audio">
            {one.audios &&
              one.audios.map((src, idx) => {
                return src !== '' && <AduioPlay src={src} key={idx} />;
              })}
          </div>
          <div className="item-content__images">
            {one.images &&
              one.images.map((src, idx) => {
                return (
                  <div
                    style={{ backgroundImage: `url(${fullfillImage(src)})` }}
                    className="item-content__images__item"
                    key={idx}
                    onClick={() => this.handleImagesPreview(one.images, idx)}
                  />
                );
              })}
          </div>
        </div>
        {get(one, 'teacherComments.total') > 0 && (
          <TeacherComments id={one.id} taskId={this.props.active} data={one.teacherComments} />
        )}
      </div>
    );
  };

  render() {
    const { loading, page, total } = this.state;
    const task = this.props.active;

    return (
      <BlockLoading loading={loading}>
        <div className="punch-diary__comments">
          <div className="punch-diary__comments__head">
            <h4>{task.name || '暂未设置任务'}</h4>
            <span className="date">{task.taskDate}</span>
            <span className="right">
              共{task.taskGciTimes}
              人打卡
            </span>
          </div>
          <div className="punch-diary__comments__list">
            {this.state.content.map(one => this.renderItem(one))}
          </div>
          {total > 0 ? (
            <Pagination
              current={page}
              totalItem={total}
              onChange={({ current }) => this.getPunchLogsList(current)}
            />
          ) : (
            <div className="no-log">还没有人打卡</div>
          )}
        </div>
      </BlockLoading>
    );
  }
}
