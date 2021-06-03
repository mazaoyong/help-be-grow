import { Pop } from '@zent/compat';
import React, { Component } from 'react';
import { Rate, previewImage } from 'zent';
import { format } from 'date-fns';
import { OrderTable } from '@youzan/ebiz-components';
import Filter from './component/filter';
import ResponseDialog from './component/response-modal';
import { checkAccess } from '@youzan/sam-components';
import { getCourseEvaluationList } from '../api/course-evaluation';
import { isInStoreCondition } from 'fns/chain/index';
import buildUrl from '@youzan/utils/url/buildUrl';

const columns = ctx => [
  {
    title: '课程名称',
    name: 'eduCourseName',
    isHead: true,
    bodyRender: ({ eduCourseName }) => eduCourseName || '-',
  },
  {
    title: '线下课',
    name: 'courseName',
    isHead: true,
    bodyRender: ({ courseName, courseAlias, kdtId = '' }) => {
      const href = buildUrl(
        `https://h5.youzan.com/wscvis/edu/prod-detail?alias=${courseAlias}&kdt_id=${kdtId}`,
        '',
        kdtId
      );
      return (
        <a
          target="_blank"
          className="cursor-link"
          rel="noopener noreferrer"
          href={href}
        >
          {courseName}
        </a>
      );
    },
  },
  {
    title: '订单编号',
    name: 'orderNo',
    isHead: true,
    bodyRender: ({ orderNo }) => (
      <a
        target="_blank"
        className="cursor-link"
        rel="noopener noreferrer"
        href={`https://www.youzan.com/v2/trade/order/detail?order_no=${orderNo}`}
      >
        {orderNo}
      </a>
    ),
  },
  {
    title: '所属校区',
    name: 'kdtName',
    isHead: true,
    hidden: !isInStoreCondition({
      supportEduHqStore: true,
    }),
    bodyRender: ({ kdtName }) => kdtName || '-',
  },
  {
    title: '评价内容',
    name: 'evaluation',
    textAlign: 'left',
    bodyRender: ({ evaluationModels }) => {
      // 评价是按照时间排布的，所以默认第一条都是用户的评价
      const { evaluation, pictures } = evaluationModels[0];
      return (
        <div className="evalList__table-cell">
          <div>{evaluation}</div>
          {pictures && (
            <div className="img-container">
              {pictures.map((pic, index) => (
                <img key={index} src={pic} onClick={ctx.handlePreviewImage.bind(ctx, pictures)} />
              ))}
            </div>
          )}
        </div>
      );
    },
  },
  {
    title: '评价星级',
    width: '150px',
    name: 'score',
    textAlign: 'center',
    bodyRender: ({ evaluationModels }) => {
      const buyerEvaluation = evaluationModels[0];
      return <Rate value={buyerEvaluation.score} disabled onChange={() => null} />;
    },
  },
  {
    title: '评价时间',
    width: '150px',
    name: 'evaluationAt',
    textAlign: 'center',
    bodyRender: ({ evaluationModels }) => {
      const buyerEvaluation = evaluationModels[0];
      return format(buyerEvaluation.evaluationAt, 'YYYY-MM-DD HH:mm:ss');
    },
  },
  {
    title: '评价人',
    width: '120px',
    name: 'nickName',
    textAlign: 'center',
    bodyRender: ({ evaluationModels }) => {
      const { userId, nickName } = evaluationModels[0] || {};
      return (
        <a
          target="_blank"
          className="cursor-link"
          rel="noopener noreferrer"
          href={`/v4/scrm/customer/manage#/detail?yzUid=${userId}`}
        >
          {nickName}
        </a>
      );
    },
  },
  {
    title: '学员',
    width: '120px',
    name: 'studentName',
    textAlign: 'center',
    bodyRender: ({ studentName, studentId }) => {
      return (
        <a
          target="_blank"
          className="cursor-link"
          rel="noopener noreferrer"
          href={`https://www.youzan.com/v4/vis/edu/page/student#/detail/${studentId}`}
        >
          {studentName}
        </a>
      );
    },
  },
  {
    title: '操作',
    width: '100px',
    textAlign: 'center',
    bodyRender: ({ evaluationModels }) => {
      const sellerEvaluation = evaluationModels[0];
      const { evaluationType, merchantReplyPermission } = sellerEvaluation;
      // 统计是否回复超过3次
      let content = '';
      let over3times = false;
      let canReply = checkAccess('编辑');
      if (evaluationType === 1) {
        over3times = !merchantReplyPermission;
        if (over3times) content = '最多回复3次';
      }
      if (!canReply) content = '没有足够的权限进行该操作';
      const handleClick = canReply ? ctx.showResponseModal.bind(ctx, evaluationModels[0]) : null;
      const classNames = `pointer ${(!canReply || over3times) ? 'disable' : ''}`;
      if (canReply && !over3times) {
        return (
          <a className={classNames} onClick={handleClick}>
            回复
          </a>
        );
      }
      return (
        <Pop trigger="hover" content={content}>
          <a className={classNames}>回复</a>
        </Pop>
      );
    },
  },
];

class ListPage extends Component {
  state = {
    showResponseModal: false,
    evaluationInfo: null,
    zanQuery: {
      evaluationRange: [],
      courseName: '',
      eduCourseName: '',
      orderNo: '',
      score: 0,
    },
  };

  handleFilterChange = filterConf => {
    const { evaluationRange } = filterConf;
    if (Array.isArray(evaluationRange) && evaluationRange[0]) {
      filterConf.evaluationRange = evaluationRange.map(time => format(time, 'YYYY-MM-DD HH:mm:ss'));
    }
    if (filterConf.kdtIdList && !filterConf.kdtIdList[0]) {
      delete filterConf.kdtIdList;
    }
    this.setState({ zanQuery: filterConf }, _ => this.table.refreshData(true));
  };

  showResponseModal = evaluationInfo => {
    this.setState({
      evaluationInfo,
      showResponseModal: true,
    });
  };

  // 获取数据
  fetchData = (filterConf, pageConf) => {
    pageConf.pageSize = 10;
    return getCourseEvaluationList({
      query: filterConf,
      pageRequest: pageConf,
    }).then(data => ({
      datasets: data.content,
      total: data.total,
      current: data.pageable.pageNumber,
    }));
  };

  // 商家回复
  sellerEvaluation = (content, time, index) => (
    <div className="evalList__table-extend" key={`evaluation${index}`}>
      <div className="tag">商家回复：</div>
      <div className="context">
        {content}
        <div className="time">{format(time, 'YYYY-MM-DD HH:mm:ss')}</div>
      </div>
    </div>
  );

  // 客户追评
  attachEvaluation = (content, time, index, pictures) => (
    <div className="evalList__table-extend" key={`evaluation${index}`}>
      <div className="tag">用户追评：</div>
      <div className="context">
        {content}
        {pictures && (
          <div className="img-container">
            {pictures.map((pic, index) => (
              <img key={index} src={pic} onClick={this.handlePreviewImage.bind(this, pictures)} />
            ))}
          </div>
        )}
        <div className="time">{format(time, 'YYYY-MM-DD HH:mm:ss')}</div>
      </div>
    </div>
  );

  // 扩展底部：商家以及用户评论
  renderExtend = record => {
    const evaluation = record.evaluationModels;
    const sellerOrAttachEvaluation = evaluation.filter(
      evl => evl.evaluationType === 3 || evl.evaluationType === 2,
    );
    if (sellerOrAttachEvaluation.length) {
      const evls = sellerOrAttachEvaluation.map((evl, index) =>
        evl.evaluationType === 3
          ? this.sellerEvaluation(evl.evaluation, evl.evaluationAt, index)
          : this.attachEvaluation(evl.evaluation, evl.evaluationAt, index, evl.pictures),
      );
      return evls;
    }
    return null;
  };

  handleClose = (submit = false) => {
    if (submit) this.table.refreshData();
    this.setState({ showResponseModal: false });
  };

  // 图片预览
  handlePreviewImage = (images, e) => {
    previewImage({
      images,
      index: images.indexOf(e.target.src),
      parentComponent: this,
    });
  };

  render() {
    const { showResponseModal, evaluationInfo, zanQuery } = this.state;
    return (
      <div className="evalList">
        <Filter onSubmit={this.handleFilterChange} />
        <OrderTable
          ref={table => (this.table = table)}
          columns={columns(this)}
          fetchData={this.fetchData}
          extend={this.renderExtend}
          pageSize={10}
          zanQuery={zanQuery}
        />
        <ResponseDialog
          visiable={showResponseModal}
          evaluationInfo={evaluationInfo}
          onClose={this.handleClose}
        />
      </div>
    );
  }
}

export default ListPage;
