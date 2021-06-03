import React, { Component } from 'react';
import ConsultFormWrap from './components/consult-form';

export default class App extends Component {
  render() {
    return (
      <div className="page-consult">
        <div className="head">
          <a className="logon_link" href="http://www.youzan.com">
            <div className="logo" />
          </a>
        </div>
        <p className="tip">如果你有开店或者续费需求，请填写表单。提交后会有专人和你联系</p>
        <ConsultFormWrap />
        <div className="foot">© 2012 - 2019 Youzan.com 版权所有</div>
      </div>
    );
  }
}
