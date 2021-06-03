import React, { PureComponent } from 'react';
import Head from './Head';
import List from './List';

export default class Pannel extends PureComponent {
  state = {};

  render() {
    const { lessonNo, profile, statistics, kdtId, getData } = this.props;
    const _value = this.formatListData(profile);
    return (
      <>
        <Head data={_value} lessonNo={lessonNo} statistics={statistics} kdtId={kdtId} getData={getData} />
        <List data={_value} kdtId={kdtId} />
      </>
    );
  }

  formatListData(data) {
    const _data = data || {};
    return Object.keys(_data)
      .map(key => {
        let value = _data[key];
        if (key === 'appointRule') {
          value = value === 1 ? '需预约' : '';
        }
        return { [key]: value };
      })
      .reduce((obj, item) => {
        return Object.assign(obj, item);
      }, {});
  }
}
