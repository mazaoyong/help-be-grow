import React, { Component } from 'react';
import { hashHistory } from 'react-router';
import { Button } from 'zent';
import { Button as SamButton } from '@youzan/sam-components';
import VisList, { VisFilterTable, formatFilterOpts } from 'components/vis-list';

import { getFilterOptions, getColumns } from './config';
// import EduClassDialog from '../../components/dialog-edu-class';
import EduClassDeleteDialog from '../../components/dialog-edu-class-delete';
import { EduClassNewDialog, ScheduleNewDialog } from '../../../../new-dialogs';
import { getClassList, getCourseList } from '../../api';
import { findPageByEduCourse } from '../../../api/educourse';
import { deleteEmptyProperty } from '../../utils';
import { chainSupportAllEduStoreShowWrapper } from '../../chain';
import { arrayColumnWrapper } from 'fns/chain';

import './index.scss';

const CSSamButton = chainSupportAllEduStoreShowWrapper(SamButton);

export default class List extends Component {
  state = {
    defaultValue: {},
    options: [],
    eduCourseId: '',
    kdtId: _global.kdtId,
    eduCourseList: [],
    shopNameList: [],
  };

  editEduClass = (eduClassInfo = {}) => {
    EduClassNewDialog.open('新建班级', { defaultData: eduClassInfo, callback: this.pageReload });
  };

  deleteEduClass = (eduClassInfo = {}) => {
    EduClassDeleteDialog.open({ defaultData: eduClassInfo, callback: this.pageReload });
  };

  pageReload = () => {
    location.reload();
  };

  addSchedule = (eduClassInfo = {}) => {
    const eduClass = eduClassInfo.eduClass || {};
    ScheduleNewDialog.open('新建日程', {
      kdtId: eduClassInfo.kdtId || _global.kdtId,
      query: {
        eduCourseId: eduClass.eduCourseId,
        classNo: eduClass.eduClassNo,
      },
    });
  };

  onFilterChange = data => {
    // todo
  };

  onFilterSubmit = data => {
    // todo
  };

  genTablePlaceholder = () => {
    return (
      <div className="class-table-placeholder">
        还没有数据，你可以
        <span className="class-table-placeholder__add-btn" onClick={this.editEduClass}>
          新建班级
        </span>
      </div>
    );
  };

  // 加载课程列表
  fetchCourseList = (query, pageRequest) => {
    return getCourseList({ query, pageRequest });
  };

  refreshList = () => this.VisTable.refetchData;

  // 加载班级列表
  fetchEduClassList = ({ filterConditions, pageConditions }) => {
    const {
      sort: { orders },
    } = pageConditions;

    orders[0].property = orders[0].property === 'created_time' ? 'created_at' : orders[0].property;
    if (!orders[0].property) {
      pageConditions.sort.orders = [];
    }

    if (!filterConditions.kdtId) {
      filterConditions.kdtId = _global.kdtId;
    }
    const param = {
      filter: deleteEmptyProperty(filterConditions),
      pageRequest: deleteEmptyProperty(pageConditions),
    };
    return getClassList(param).then(({ content, total, pageable }) => ({
      datasets: content,
      total,
      current: pageable.pageNumber,
    }));
  };

  getNameById = (listName, id) => {
    const list = this.state[listName];
    for (let i = 0; i < list.length; i++) {
      if (+list[i].value === +id) return list[i].text;
    }
  };

  pushQuery = (data) => {
    const location = hashHistory.getCurrentLocation();
    const query = location.query;
    const eduCourseName = this.getNameById('eduCourseList', query.eduCourseId);
    const shopName = this.getNameById('shopNameList', query.kdtId);

    if (eduCourseName) {
      location.query = { ...query, eduCourseName };
    }

    if (shopName) {
      location.query = { ...query, shopName };
    }

    if (shopName || eduCourseName) {
      hashHistory.replace(location);
    }
  };

  renderBottomAction = ({ data, submit, reset }) => {
    const onSubmit = () => {
      submit();
      this.pushQuery(data);
    };
    return (
      <div className="class-filter-opetation">
        <Button type="primary" bordered={false} onClick={onSubmit}>
          筛选
        </Button>
        <span className="class-filter-opetation__reset" onClick={reset}>
          清空筛选条件
        </span>
      </div>
    );
  };

  getDefaultEduCourseOption = () => {
    const location = this.props.location;
    const query = location.query || {};
    if (query.eduCourseName && query.eduCourseId) {
      return { text: query.eduCourseName, value: query.eduCourseId.toString() };
    }
  };

  getDefaultShopNameOption = () => {
    const location = this.props.location;
    const query = location.query || {};
    if (query.shopName && query.kdtId) {
      return { text: query.shopName, value: query.kdtId };
    }
  }

  setStateShopNameList = (options) => {
    const { shopNameList } = this.state;

    this.setState({ shopNameList: [].concat([], shopNameList, options) });
  }

  getShopNameList = (query, pageRequest) => {
    const { eduCourseId } = this.state;

    return findPageByEduCourse({
      eduCourseShopQuery: {
        id: +eduCourseId,
        name: query,
        kdtId: _global.kdtId,
      },
      pageRequest,
    });
  }

  // 切换校区
  handleShopChange = (_, val) => {
    this.setState({ kdtId: val });
  }

  // 切换课程
  handleEduCourseIdChange = (_, val) => {
    this.setState({ eduCourseId: val });
  }

  getEduCourseOptions = (query, pageRequest) => {
    const { kdtId } = this.state;
    return this.fetchCourseList({
      name: query,
      kdtId: kdtId || _global.kdtId,
    }, pageRequest).then(
      ({ content = [], total, pageable }) => {
        const options = content.map(item => {
          return {
            text: item.name,
            value: item.id,
          };
        });
        if (pageRequest.pageNumber === 1) {
          options.unshift({ text: '全部', value: '' });
        }

        const { eduCourseList } = this.state;

        this.setState({ eduCourseList: [].concat([], eduCourseList, options) });

        return options;
      },
    );
  };

  onChange = (key, value) => {
    this.setState({ [key]: value });
  };

  componentDidMount() {
    const location = this.props.location;
    const query = location.query || {};
    if (+query.add === 1) {
      const location = hashHistory.getCurrentLocation();
      let query = { ...location.query };

      this.editEduClass({
        createDefault: {
          eduCourseId: query.eduCourseId,
          eduCourseName: query.eduCourseName,
          kdtId: query.kdtId,
          shopName: query.shopName,
        },
      });
      delete query.add;
      location.query = query;
      hashHistory.replace(location);
    }

    if (query.eduCourseId) {
      this.setState({ eduCourseId: query.eduCourseId });
    }

    if (query.kdtId) {
      this.setState({ kdtId: query.kdtId });
    }
  }

  render() {
    const { defaultValue, options } = formatFilterOpts(arrayColumnWrapper(getFilterOptions(this)));
    return (
      <div className="class-list-page">
        <CSSamButton name="编辑" bordered={false} type="primary" onClick={this.editEduClass}>
          新建班级
        </CSSamButton>
        <div className="class-filter-table-wrap">
          <VisList>
            <VisFilterTable
              filterProps={{
                defaultValue: {
                  ...defaultValue,
                  eduCourseId: '',
                },
                options,
                bottomActions: this.renderBottomAction,
              }}
              tableProps={{
                ref: table => (this.VisTable = table),
                rowKey: 'eduClass.id',
                columns: arrayColumnWrapper(getColumns(this)),
                emptyLabel: this.genTablePlaceholder(),
                fetchData: this.fetchEduClassList,
                scroll: { x: 1200 },
              }}
            />
          </VisList>
        </div>
      </div>
    );
  }
}
