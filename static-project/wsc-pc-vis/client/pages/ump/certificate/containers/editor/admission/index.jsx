
import { Form } from '@zent/compat';
import React, { PureComponent } from 'react';
import { withRouter, hashHistory } from 'react-router';
import { Notify } from 'zent';
import { map } from 'lodash';

import AdminssionForm from './form';
import AdminssionPreview from './preview';
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
        praiseText: '开学啦！欢迎入学，预祝你在接下来的学习旅程中能够有所收获，让我们一起通往学习的高峰吧！',
        shareText: '精彩课堂，完美名师尽在这里',
        signatureText: _signatureText,
        showCourse: 1,
        showDuration: 1,
        applyType: 0,
        campusShopList: [],
      },
      value: {
        sourceId: 0,
        showAvatar: 1,
        qrType: 0,
        qrUrl: '',
        bgNo: 1,
        praiseText: '开学啦！欢迎入学，预祝你在接下来的学习旅程中能够有所收获，让我们一起通往学习的高峰吧！',
        shareText: '精彩课堂，完美名师尽在这里',
        signatureText: _signatureText,
        showCourse: 1,
        showDuration: 1,
        applyType: 0,
        campusShopList: [],
      },
    };
    this.WrappedForm = createForm({ onChange: this.handleChange })(AdminssionForm);
  }

  componentDidMount() {
    const { id } = (this.props && this.props.router && this.props.router.params) || {};
    if (id) {
      this.id = id;
      getCertificateTemplate({ id }).then(data => {
        const { extSettings, ...restData } = data;
        const _data = Object.assign({}, extSettings, restData);
        this.setState({ initialValue: _data, value: _data });
      });
    }
  }

  render() {
    const { WrappedForm } = this;

    const initialValue = this.inputFormat(this.state.initialValue);
    const value = this.inputFormat(this.state.value);

    const { id } = (this.props && this.props.router && this.props.router.params) || {};

    return (
      <div className="certificate-editor">
        <div className="certificate-editor-preview">
          <AdminssionPreview value={this.state.value} />
        </div>
        <WrappedForm initialValue={initialValue} value={value} editing={!!id} onSubmit={this.handleSubmit} />
      </div>
    );
  }

  handleChange = data => {
    const value = this.outputFormat(data);
    this.setState({ value });
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

  inputFormat = data => Object.keys(data).reduce((obj, key) => {
    const item = data[key];
    switch (key) {
      case 'sourceId':
      case 'issueType':
        obj.course = Object.assign(obj.course || {}, { [key]: item });
        break;
      case 'showCourse':
      case 'showDuration':
        obj.show = (obj.show || []).concat(item ? [key] : []);
        break;
      case 'bgNo':
      case 'bgUrl':
        obj.style = Object.assign(obj.style || {}, { [key]: item });
        break;
      default:
        obj[key] = item;
        break;
    }
    return obj;
  }, {});

  outputFormat = data => {
    const issueType = data.course && data.course.appendix && data.course.appendix.course &&
      data.course.appendix.course.courseSellType;
    return Object.keys(data).reduce((obj, key) => {
      const item = data[key];
      switch (key) {
        case 'course':
          obj.sourceId = item.sourceId;
          if (item.appendix && item.appendix.course) {
            obj.issueType = issueType;
          }
          if (item.appendix && item.appendix.product) {
            obj.sourceTitle = item.appendix.product.title;
          }
          break;
        case 'style':
          obj = Object.assign(obj, item);
          break;
        case 'show':
          const tempShow = item.reduce((_obj, itemName) => Object.assign(_obj, { [itemName]: 1 }), obj);
          obj.showCourse = tempShow.showCourse;
          obj.showDuration = issueType ? tempShow.showDuration : 0;
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
  };

  submitFormat = data => {
    const extData = {
      id: this.id,
      kdtId: window._global.kdtId,
      sourceType: 1,
      type: 1,
      issueType: 0,
      campusKdtIds: map(data.campusShopList, item => item.kdtId),
    };
    return Object.assign({}, data, extData);
  }
}

export default withRouter(Editor);
