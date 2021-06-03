import { Select } from '@zent/compat';
import React, { Component } from 'react';
import { DateRangeQuickPicker, Input, Button } from 'zent';
import { isInStoreCondition } from 'fns/chain/index';
import { findListAllCampus } from '../../api/shop';

const options = [
  {
    value: 0,
    text: '全部',
  },
  {
    value: 1,
    text: '一星',
  },
  {
    value: 2,
    text: '二星',
  },
  {
    value: 3,
    text: '三星',
  },
  {
    value: 4,
    text: '四星',
  },
  {
    value: 5,
    text: '五星',
  },
];

// 抽离字段、默认值以及标签，用于组件数据解耦
const KEYS = {
  evaluationRange: {
    key: 'evaluationRange',
    name: '评价时间',
    default: [],
    // 格式化函数，参数同onChange顺序一致，但是input类型不会返回evt对象，而是evt.target.value
    format(timeRange, chooseDays) {
      this.setState({
        evaluationRange: timeRange,
        chooseDays: chooseDays[0],
      });
    },
  },
  courseName: {
    key: 'courseName',
    name: '线下课名称',
    default: '',
  },
  eduCourseName: {
    key: 'eduCourseName',
    name: '课程名称',
    default: '',
  },
  orderNo: {
    key: 'orderNo',
    name: '订单编号',
    default: '',
  },
  score: {
    key: 'score',
    name: '评价星级',
    default: 0,
  },
  kdtIdList: {
    key: 'kdtIdList',
    name: '所属校区',
    default: [''],
  },
};

export default class Filter extends Component {
  state = {
    chooseDays: undefined,
    evaluationRange: KEYS.evaluationRange.default,
    score: KEYS.score.default,
    courseName: KEYS.courseName.default,
    eduCourseName: KEYS.eduCourseName.default,
    orderNo: KEYS.orderNo.default,
    kdtIdList: KEYS.kdtIdList.default,
    schoolSelectOptions: [
      {
        text: '全部',
        value: '',
      },
    ],
  };

  componentDidMount() {
    this.findListAllCampus();
  }

  findListAllCampus() {
    return findListAllCampus()
      .then(res => {
        const schoolSelectOptions = res.map(item => {
          return {
            value: item.kdtId,
            text: item.shopName || '',
          };
        });

        schoolSelectOptions.unshift({
          text: '全部',
          value: '',
        });

        this.setState({
          schoolSelectOptions,
        });
      });
  }

  handleFilterChange(key, value, ...others) {
    const format = KEYS[key].format;
    let val = value;
    if (value.target) {
      val = value.target.value;
    }

    if (key === 'kdtIdList') {
      val = [val];
    }

    if (format) {
      format.call(this, val, others);
    } else {
      this.setState({ [key]: val });
    }
  }

  handleSubmit = () => {
    const { onSubmit } = this.props;
    if (onSubmit) {
      // eslint-disable-next-line no-unused-vars
      const { chooseDays, schoolSelectOptions, ...filterConf } = this.state;
      onSubmit(filterConf);
    }
  };

  // 清空筛选条件，同样也会触发onSubmit事件
  handleResetAction = () => {
    const resetVal = {};
    const keys = Object.keys(KEYS);
    keys.forEach(fieldKey => {
      const one = KEYS[fieldKey];
      const { key } = one;
      const initialVal = one.default;
      resetVal[key] = initialVal;
    });
    resetVal.chooseDays = undefined;
    this.setState(resetVal, _ => this.handleSubmit());
  };

  render() {
    const { evaluationRange, chooseDays, score, courseName, eduCourseName, orderNo, schoolSelectOptions } = this.state;
    let { kdtIdList = [''] } = this.state;
    kdtIdList = kdtIdList[0] || '';
    return (
      <div className="evalList__filter-container">
        <div className="evalList__filter-line">
          <div className="evalList__filter-field">
            <div className="evalList__filter-label">{KEYS.evaluationRange.name}：</div>
            <div className="evalList__filter-input">
              <DateRangeQuickPicker
                value={evaluationRange}
                valueType="number"
                onChange={this.handleFilterChange.bind(this, KEYS.evaluationRange.key)}
                format="YYYY-MM-DD"
                chooseDays={chooseDays}
              />
            </div>
          </div>
        </div>
        <div className="evalList__filter-line">
          <div className="evalList__filter-field">
            <div className="evalList__filter-label">{KEYS.eduCourseName.name}：</div>
            <div className="evalList__filter-input">
              <Input
                width={184}
                value={eduCourseName}
                onChange={this.handleFilterChange.bind(this, KEYS.eduCourseName.key)}
              />
            </div>
          </div>
          <div className="evalList__filter-field">
            <div className="evalList__filter-label">{KEYS.courseName.name}：</div>
            <div className="evalList__filter-input">
              <Input
                width={184}
                value={courseName}
                onChange={this.handleFilterChange.bind(this, KEYS.courseName.key)}
              />
            </div>
          </div>
          <div className="evalList__filter-field">
            <div className="evalList__filter-label">{KEYS.orderNo.name}：</div>
            <div className="evalList__filter-input">
              <Input
                width={184}
                value={orderNo}
                onChange={this.handleFilterChange.bind(this, KEYS.orderNo.key)}
              />
            </div>
          </div>
          <div className="evalList__filter-field">
            <div className="evalList__filter-label">{KEYS.score.name}：</div>
            <div className="evalList__filter-input">
              <Select
                width={184}
                data={options}
                value={score}
                onChange={this.handleFilterChange.bind(this, KEYS.score.key)}
              />
            </div>
          </div>
          {
            isInStoreCondition({
              supportEduHqStore: true,
            }) && <div className="evalList__filter-field">
              <div className="evalList__filter-label">{KEYS.kdtIdList.name}：</div>
              <div className="evalList__filter-input">
                <Select
                  width={184}
                  key={KEYS.kdtIdList.key}
                  data={schoolSelectOptions}
                  value={kdtIdList}
                  filter={(item, keyword) => item.text.indexOf(keyword) > -1}
                  placeholder="全部"
                  onChange={this.handleFilterChange.bind(this, KEYS.kdtIdList.key)}
                />
              </div>
            </div>
          }
        </div>
        <div className="evalList__filter-field operator">
          <Button type="primary" className="submit" onClick={this.handleSubmit}>
            筛选
          </Button>
          <a className="reset pointer cursor-link" onClick={this.handleResetAction}>
            重置筛选条件
          </a>
        </div>
      </div>
    );
  }
}
