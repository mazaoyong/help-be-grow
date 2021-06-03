
import { Form } from '@zent/compat';
import React, { PureComponent } from 'react';
import { Notify } from 'zent';
import { withRouter, hashHistory } from 'react-router';
import { map } from 'lodash';

import GraduationForm from './form';
import GraduationPreview from './preview';
import { createCertificateTemplate, getCertificateTemplate, updateCertificateTemplate } from '../../../api';

const { createForm } = Form;

const _signatureText = window._global.shopName;

class Editor extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      initialValue: {
        sourceId: 0,
        showAvatar: 1,
        qrType: 0,
        qrUrl: '',
        bgNo: 1,
        praiseText: '恭喜你，毕业啦！在这门课程中你已经收获了知识，取得了很大的进步，继续加油！',
        shareText: '精彩课堂，完美名师尽在这里',
        signatureText: _signatureText,
        showConsumeCount: 1,
        showCheckinDays: 1,
        issuePercentage: 0,
        beforeDays: 0,
        applyType: 0,
        campusShopList: [],
      },
      value: {
        sourceId: 0,
        showAvatar: 1,
        qrType: 0,
        qrUrl: '',
        bgNo: 1,
        praiseText: '恭喜你，毕业啦！在这门课程中你已经收获了知识，取得了很大的进步，继续加油！',
        shareText: '精彩课堂，完美名师尽在这里',
        signatureText: _signatureText,
        showConsumeCount: 1,
        showCheckinDays: 1,
        issuePercentage: 0,
        beforeDays: 0,
        applyType: 0,
        campusShopList: [],
      },
    };
    this.WrappedForm = createForm({ onChange: this.handleFormChange })(GraduationForm);
  }

  componentDidMount() {
    const { id } = (this.props && this.props.router && this.props.router.params) || {};
    if (id) {
      this.id = id;
      getCertificateTemplate({ id }).then(data => {
        const { extSettings, issueExpression, ...restData } = data;
        const { percent: issuePercentage, beforeDays, issueType } = issueExpression || {};
        const _data = Object.assign({}, { issuePercentage, beforeDays, issueType }, extSettings, restData);
        this.setState({ initialValue: _data, value: _data });
      });
    }
  }

  render() {
    const id = this.id;
    const issueLimit = this.issueLimit;

    const { WrappedForm } = this;

    const initialValue = this.inputFormat(this.state.initialValue);
    const value = this.inputFormat(this.state.value);

    return (
      <div className="certificate-editor">
        <div className="certificate-editor-preview">
          <GraduationPreview value={this.state.value} />
        </div>
        <WrappedForm
          initialValue={initialValue}
          value={value}
          editing={!!id}
          issueLimit={issueLimit}
          onSubmit={this.handleSubmit}
        />
      </div>
    );
  }

  handleFormChange = data => {
    const value = this.outputFormat(data);
    this.setState({
      value,
    });
  }

  handleSubmit = (data, zentForm) => {
    const data1 = this.outputFormat(data);
    const data2 = this.submitFormat(data1);
    (this.id ? updateCertificateTemplate : createCertificateTemplate)(data2)
      .then(result => {
        hashHistory.goBack();
      })
      .catch(err => {
        Notify.error(err);
      });
  }

  inputFormat = data => {
    return Object.keys(data).reduce((obj, key) => {
      const item = data[key];
      switch (key) {
        case 'sourceId':
        case 'issueType':
          obj.course = Object.assign(obj.course || {}, { [key]: item });
          break;
        case 'showConsumeCount':
        case 'showCheckinDays':
          obj.show = (obj.show || []).concat(item ? [key] : []);
          break;
        case 'bgNo':
        case 'bgUrl':
          obj.style = Object.assign(obj.style || {}, { [key]: item });
          break;
        case 'beforeDays':
        case 'issuePercentage':
          obj.issue = Object.assign(obj.issue || {}, { [key]: item });
          break;
        default:
          obj[key] = item;
          break;
      }
      return obj;
    }, {});
  };

  outputFormat = data => {
    return Object.keys(data).reduce((obj, key) => {
      const item = data[key];
      switch (key) {
        case 'course':
          obj.sourceId = item.sourceId;
          if (item.appendix && item.appendix.course) {
            // 课程的售卖类型
            obj.issueType = item.appendix.course.courseSellType;
          }
          if (item.appendix && item.appendix.product) {
            // 课程的名称
            obj.sourceTitle = item.appendix.product.title;
            // 课程的发放节点的限制（按期/按课时/按时段），副作用
            switch (obj.issueType) {
              // 按时段(天/月/年)
              case 2:
                this.issueLimit = item.appendix.product.stocks.reduce((min, stock) => {
                  const regEx = /^([0-9]+)(.*)$/.exec(stock.courseProp);
                  let value = 0;
                  switch (regEx && regEx[2]) {
                    case '天':
                      value = regEx[1];
                      break;
                    case '月':
                    case '个月':
                      value = regEx[1] * 30;
                      break;
                    case '季':
                      value = regEx[1] * 90;
                      break;
                    case '年':
                      value = regEx[1] * 365;
                      break;
                    default:
                      break;
                  }
                  return (min === 0 || value < min) ? value : min;
                }, 0);
                break;
              // 按期
              case 3:
                const _issueLimit = item.appendix.product.stocks.reduce((min, stock) => {
                  const startTime = (stock.eduClassDTO && stock.eduClassDTO.startTime) || 0;
                  const endTime = (stock.eduClassDTO && stock.eduClassDTO.endTime) || 0;
                  const expired = endTime - startTime;
                  return (min === 0 || (expired && (expired < min))) ? expired : min;
                }, 0);
                this.issueLimit = Math.round(_issueLimit / 86400000);
                break;
              default:
                break;
            }
          }
          break;
        case 'style':
        case 'issue':
          obj = Object.assign(obj, item);
          break;
        case 'show':
          obj = item.reduce((_obj, itemName) => Object.assign(_obj, { [itemName]: 1 }), obj);
          break;
        case 'shopInfo':
          obj.applyType = item.applicableCampusType;
          obj.campusShopList = item.applicableCampusList;
          break;
        default:
          obj[key] = item;
          break;
      }
      return obj;
    }, {});
  }

  submitFormat = data => {
    const extData = {
      id: this.id,
      kdtId: window._global.kdtId,
      sourceType: 1,
      type: 2,
      campusKdtIds: map(data.campusShopList, item => item.kdtId),
    };
    return Object.assign({}, data, extData);
  }
}

export default withRouter(Editor);
