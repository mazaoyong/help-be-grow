import React from 'react';
import Header from '../header';
import Steps from '../Steps';
import './style.scss';

export default class App extends React.Component {
  render() {
    const { step, children } = this.props;
    return (
      <div className="page-wrapper">
        <Header />
        <Steps current={step}/>
        {children}
      </div>
    );
  }
}
