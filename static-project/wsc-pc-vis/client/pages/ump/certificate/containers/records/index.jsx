import React, { PureComponent } from 'react';
import { Button } from 'zent';
import { isArray, map } from 'lodash';
import qs from 'querystring';
import { VisList, VisFilterTable } from 'components/vis-list';
import formatDate from 'zan-utils/date/formatDate';
import { isEduHqStore } from '@youzan/utils-shop';
import { arrayColumnWrapper } from 'fns/chain/index';

import { findListAllCampus } from 'common/api/shop';
import { findCertificate } from '../../api';

const DEFAULT_CAMPUS = { value: 0, text: '全部' };

export default class Certificates extends PureComponent {
  state = {
    campusList: [DEFAULT_CAMPUS],
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
      <VisList>
        <VisFilterTable
          filterProps={{
            defaultValue: this.defaultValue,
            options: arrayColumnWrapper(this.options),
            bottomActions: this.renderBottomAction,
          }}
          tableProps={{
            rowKey: 'alias',
            emptyLabel: queried ? '未找到符合条件的活动信息，请更换条件重新查找' : '没有相关数据',
            ref: this.ref,
            columns: arrayColumnWrapper(this.columns),
            fetchData: this.fetchData,
          }}
        />
      </VisList>
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
    userName: '',
    title: '',
    certType: '',
    campusKdtId: DEFAULT_CAMPUS.value,
    id: '',
  };

  get options() {
    return [
      {
        type: 'Input',
        name: 'userName',
        label: '学员姓名：',
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
            value: 1,
            text: '入学证书',
          },
          {
            value: 2,
            text: '毕业证书',
          },
        ],
      },
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
        name: 'campusKdtId',
        chainState: isEduHqStore,
        label: '所属校区：',
        data: this.state.campusList,
      },
    ];
  }

  columns = [
    {
      title: '学员姓名',
      bodyRender: item => item.showDatas && item.showDatas.identityName,
    },
    {
      title: '证书名称',
      bodyRender: item => item.certificateTemplateDTO && item.certificateTemplateDTO.name,
    },
    {
      title: '所属校区',
      chainState: isEduHqStore,
      bodyRender: item => item.campusShop && item.campusShop.shopName,
    },
    {
      title: '领取时间',
      bodyRender: item => formatDate(item.createdAt, 'YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '证书类型',
      textAlign: 'right',
      bodyRender: item => item.type === 1 ? '入学证书' : '毕业证书',
    },
  ];

  fetchData = params => {
    const _params = this.formatParams(params);
    const url = location.href.split('?');
    const queryId = qs.parse(url[1]).id;
    if (queryId) {
      _params.query.certTemplateId = queryId;
    }
    return findCertificate(_params)
      .then(({ content, total, pageable }) => ({
        datasets: content,
        current: pageable ? pageable.pageNumber : 0,
        total,
      }));
  };
  formatParams = ({ filterConditions, pageConditions }) => {
    const params = {};
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
    params.pageRequest = pageRequest;
    params.query = {
      userName: filterConditions.userName || '',
      name: filterConditions.name || '',
    };
    filterConditions.certType && (params.query.certType = filterConditions.certType);
    +filterConditions.campusKdtId && (params.query.campusKdtId = filterConditions.campusKdtId);
    return params;
  }

  isQueried = () => window.location.search;
};
