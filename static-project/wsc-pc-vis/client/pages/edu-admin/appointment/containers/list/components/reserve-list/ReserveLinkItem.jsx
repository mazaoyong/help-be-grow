import React, { Component } from 'react';

export default class ReserveLickItem extends Component {
  openPage = url => {
    if (!url) return;
    window.open(url);
  };
  render() {
    const { content, url } = this.props;
    return (
      <div className="reserve-list__link" onClick={() => this.openPage(url)}>
        {content}
      </div>
    );
  }
}
