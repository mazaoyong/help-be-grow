import { Pop } from '@zent/compat';
import React, { PureComponent } from 'react';
import { Button, Dialog, Icon, Tag, Notify } from 'zent';
import { isArray, map } from 'lodash';
import { VisList, VisFilterTable } from 'components/vis-list';
import SchoolTD from '@ability-center/shop/school-td';
import formatDate from 'zan-utils/date/formatDate';
import { arrayColumnWrapper } from 'fns/chain/index';
import { isEduHqStore, isEduBranchStore } from '@youzan/utils-shop';

import { findListAllCampus } from 'common/api/shop';
import CreationGroup from '../../components/creation-group';
import { LinkGroup } from '@youzan/ebiz-components';
import AdmissionPreview from '../editor/admission/preview';
import GraduationPreview from '../editor/graduation/preview';

import { findCertificateTemplate, deleteCertificateTemplate, invalidCertificateTemplate } from '../../api';
import { hashHistory } from 'react-router';

import '../../styles.scss';

const { openDialog, closeDialog } = Dialog;

const h5 = window._global.url.h5;
const v4 = window._global.url.v4;

const DEFAULT_CAMPUS = { value: 0, text: '全部' };

export default class Certificates extends PureComponent {
  state = {
    campusList: [DEFAULT_CAMPUS],
    campusId: DEFAULT_CAMPUS.value,
  }

  componentDidMount() {
    findListAllCampus().then(data => {
      let campusList = [DEFAULT_CAMPUS];
      if (isArray(data)) {
        campusList = campusList.concat(map(data, campus => ({
          text: campus.shopName,
          value: campus.kdtId,
        })));
      } else {
        campusList = [{ value: -1, text: '暂无校区' }];
      }

      this.setState({
        campusList,
      });
    });
  }

  render() {
    const queried = this.isQueried();
    return (
      <div className="certificate-filter-table-container">
        {!isEduBranchStore && <CreationGroup />}
        <VisList>
          <VisFilterTable
            filterProps={{
              defaultValue: this.defaultValue,
              options: arrayColumnWrapper(this.options),
              bottomActions: this.renderBottomAction,
            }}
            tableProps={{
              rowKey: 'alias',
              emptyLabel: queried ? '未找到符合条件的学员证书，请更换条件重新查找' : '没有相关数据',
              ref: this.ref,
              scroll: { x: 1200 },
              columns: arrayColumnWrapper(this.columns),
              fetchData: this.fetchData,
            }}
          />
        </VisList>
      </div>
    );
  }

  ref = dom => {
    this.tableDom = dom;
  }

  renderBottomAction = filter => {
    const { submit, reset } = filter;
    return (
      <>
        <Button type="primary" onClick={submit}>
          筛选
        </Button>
        <span className="filter__actions__reset" onClick={reset}>
          重置筛选条件
        </span>
      </>
    );
  };

  defaultValue = {
    name: '',
    certType: '',
    courseName: '',
    campusKdtId: DEFAULT_CAMPUS.value,
  };

  get options() {
    return [
      {
        type: 'Input',
        name: 'name',
        label: '证书名称：',
        props: {
          placeholder: '',
        },
      },
      {
        type: 'Select',
        name: 'certType',
        label: '证书类型：',
        data: [
          {
            value: '',
            text: '全部',
          },
          {
            value: '1',
            text: '入学证书',
          },
          {
            value: '2',
            text: '毕业证书',
          },
        ],
      },
      {
        type: 'Select',
        name: 'campusKdtId',
        chainState: isEduHqStore,
        label: '适用校区：',
        data: this.state.campusList,
      },
      {
        type: 'Input',
        name: 'courseName',
        label: '线下课：',
        props: {
          placeholder: '',
        },
      },
    ];
  }

  get columns() {
    const prev = [
      {
        title: '证书名称',
        width: 180,
        fixed: 'left',
        name: 'name',
      },
      {
        title: '证书类型',
        bodyRender: item => item.type === 1 ? <Tag outline color="blue">入学证书</Tag> : <Tag outline color="green">毕业证书</Tag>,
      },
      {
        title: '证书状态',
        bodyRender: item => item.status === 0 ? '发放中' : '停止发放',
      },
      {
        title: '关联线下课',
        bodyRender: item => (
          <a
            href={`${h5}/wscvis/edu/prod-detail?alias=${item.sourceId}&kdt_id=${item.kdtId}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {item.sourceTitle}
          </a>
        ),
      },
    ];
    const last = [
      {
        title: '领取证书人数',
        bodyRender: item => (
          <a
            href={`${v4}/vis/edu/page/certificate#/records?id=${item.id}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {item.receivedNum}
          </a>
        ),
      },
      {
        title: (
          <Pop
            trigger="hover"
            content={(
              <div>
                该扫码次数为关联课程的二维码，
                <br />
                自定义二维码扫码次数无法获得
              </div>
            )}
          >
            <span className="certificate-list-icon-wrapper">
              被扫码次数
              <Icon type="help-circle" className="certificate-list-icon" />
            </span>
          </Pop>
        ),
        name: 'qrScanNum',
      },
      {
        title: '创建时间',
        bodyRender: item => formatDate(item.createdAt, 'YYYY-MM-DD HH:mm:ss'),
      },
      {
        title: '操作',
        bodyRender: item => (
          <div>
            <LinkGroup data={this.getOperations(item)} />
          </div>
        ),
      },
    ];

    if (+this.state.campusId) {
      return [...prev, ...last];
    } else {
      return [...prev, {
        title: '适用校区',
        chainState: isEduHqStore,
        width: '10%',
        bodyRender: ({ name, applyType, applyCampusList }) => {
          return <SchoolTD label="证书名称：" name={name} designateType={applyType} designatedKdtIds={applyCampusList} />;
        },
      }, ...last];
    }
  }

  getOperations = item => {
    if (isEduBranchStore || !!+this.state.campusId) {
      return [{
        text: '预览',
        onClick: this.handleShow(item),
      }];
    }
    if (item.status === 0) {
      return [
        {
          text: '预览',
          onClick: this.handleShow(item),
        },
        {
          text: '编辑',
          onClick: this.handleEdit(item),
        },
        {
          text: '失效',
          onClick: this.handleUnuse(item),
        },
      ];
    }
    return [
      {
        text: '预览',
        onClick: this.handleShow(item),
      },
      {
        text: '删除',
        onClick: this.handleRemove(item),
      },
    ];
  };

  handleShow = ({ extSettings, ...restValue }) => () => {
    const value = Object.assign({}, extSettings, restValue);
    openDialog({
      title: '证书预览',
      style: { width: '450px' },
      dialogId: 'preview',
      className: 'certificate-list-preview',
      children: value.type === 1 ? <AdmissionPreview value={value} /> : <GraduationPreview value={value} />,
    });
  };

  handleEdit = item => () => {
    hashHistory.push(`editor/${item.type === 1 ? 'admission' : 'graduation'}/${item.id}`);
  };

  handleUnuse = item => () => {
    openDialog({
      title: '提示',
      dialogId: 'unuse',
      children: (
        <>
          <div>失效后将无法恢复，确认失效吗？</div>
          <div className="certificate-dialog-subtitle">失效后未获得证书的学员将无法获得该证书</div>
        </>
      ),
      footer: (
        <>
          <Button type="primary" outline onClick={() => closeDialog('unuse')}>取消</Button>
          <Button type="primary" onClick={this.unuse(item)}>确认</Button>
        </>
      ),
    });
  };

  handleRemove = item => () => {
    openDialog({
      title: '提示',
      dialogId: 'remove',
      children: '删除后将无法恢复，确认删除吗？',
      footer: (
        <>
          <Button type="primary" outline onClick={() => closeDialog('remove')}>取消</Button>
          <Button type="primary" onClick={this.remove(item)}>确认</Button>
        </>
      ),
    });
  };

  unuse = item => () => this.wrapPromise(invalidCertificateTemplate({ id: item.id }))
    .finally(() => {
      closeDialog('unuse');
    });

  remove = item => () => this.wrapPromise(deleteCertificateTemplate({ id: item.id }))
    .finally(() => {
      closeDialog('remove');
    });

  wrapPromise = promise => promise
    .then(data => {
      this.tableDom.refetchData.refresh();
    })
    .catch(e => {
      Notify.error(e);
    });

  fetchData = params => {
    this.setState({
      campusId: +params.filterConditions.campusKdtId,
    });
    const _params = this.formatParams(params);
    return findCertificateTemplate(_params).then(({ content = [], pageable = {}, total = 0 }) => {
      return {
        datasets: content,
        current: pageable ? pageable.pageNumber : 1,
        total,
      };
    });
  };

  formatParams = ({ filterConditions, pageConditions }) => {
    const pageRequest = {
      pageNumber: pageConditions.pageNumber,
      pageSize: pageConditions.pageSize,
      sort: {
        orders: [{
          direction: 'DESC',
          property: 'created_at',
        }],
      },
    };
    const query = {
      name: filterConditions.name,
    };
    filterConditions.certType && (query.certType = filterConditions.certType);
    filterConditions.courseName && (query.courseName = filterConditions.courseName);
    +filterConditions.campusKdtId && (query.campusKdtId = filterConditions.campusKdtId);
    return { pageRequest, query };
  }

  isQueried = () => window.location.search;
}
