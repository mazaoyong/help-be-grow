
import { Form } from '@zent/compat';
import React, { PureComponent } from 'react';
import { Notify } from 'zent';

import Preview from './preview';
import EditForm from './form';
import { getSignInSettings, postSignInSettings, putSignInSettings } from '../../domain/apis/edit';

import './styles.scss';

const { createForm } = Form;

export class SigninEdit extends PureComponent {
  constructor() {
    super();
    this.state = {
      // whether data is initialized
      initialized: false,
      // data last modified, retrieved from server
      initialValue: {
        codeStyle: 1,
        codeType: 1,
        groupOpen: 0,
      },
      // data being editing
      value: {
        codeStyle: 1,
        codeType: 1,
        groupOpen: 0,
      },
      activeTab: 'h5',
      isInit: false,
    };
    // bind the form onChange event
    this.DecoratedForm = createForm({
      scrollToError: true,
      onChange: this.handleFormChange,
    })(EditForm);
  }

  componentDidMount() {
    this.getServerData();
  }

  render() {
    const { DecoratedForm } = this;
    const { initialized, initialValue, value, activeTab, isInit } = this.state;
    return isInit ? (
      <div className="sigin-edit">
        <div className="sigin-edit_preview ">
          <Preview
            value={value}
            onTabChange={this.onTabChange}
          />
        </div>
        <div className="sigin-edit_form">
          <DecoratedForm
            initialized={initialized}
            initialValue={initialValue}
            value={value}
            activeTab={activeTab}
            onInnerSubmit={this.handleSubmit}
          />
        </div>
      </div>
    ) : null;
  }

  handleSubmit = async data => {
    try {
      const { initialized } = this.state;
      if (initialized) {
        await putSignInSettings(data);
      } else {
        await postSignInSettings(data);
        this.setState({ initialized: true });
      }
      await this.getServerData();
      Notify.success('保存成功');
    } catch (err) {
      Notify.error(err);
    }
  }

  handleFormChange = value => {
    this.setState({ value });
  };

  onTabChange = activeTab => {
    this.setState({
      activeTab,
    });
  };

  appendGroup = value => {
    if (!value.guideTitle) {
      value.guideTitle = '添加老师微信';
    }
    if (!value.guideCopy) {
      value.guideCopy = '及时了解课程动向';
    }
    if (!value.buttonCopy) {
      value.buttonCopy = '立即添加';
    }
    return value;
  };

  getServerData = () => {
    return getSignInSettings({ scene: 1 }).then(data => {
      if (data) {
        const modifiedData = this.appendGroup(data);
        this.setState({ initialValue: modifiedData, value: modifiedData, initialized: true, isInit: true });
      } else {
        const modifiedData = this.appendGroup(this.state.value);
        this.setState({ initialValue: modifiedData, value: modifiedData, initialized: false, isInit: true });
      }
    });
  }
}
