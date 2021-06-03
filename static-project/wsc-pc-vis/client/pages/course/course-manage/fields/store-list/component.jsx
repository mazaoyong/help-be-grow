
import { Select, Form } from '@zent/compat';
import React, { Component } from 'react';
import findIndex from 'lodash/findIndex';
import appCache from '../../common/app-cache';
import { getStoreListApi } from '../../../api/course-manage';

const { getControlGroup } = Form;

class StoreListComponent extends Component {
  constructor(props) {
    super(props);

    let value = [];
    props.value.map(item => {
      value.push(item.id);
    });
    this.state = {
      places: [],
      selectedPlaces: [].concat(props.value),
      value,
    };
  }

  componentDidMount() {
    this.fetchPlaceList();
  }

  // 获取门店列表
  fetchPlaceList = refresh => {
    const places = appCache.get('places');
    if (refresh || places === null) {
      getStoreListApi().then(data => {
        let places = data.map(item => {
          return {
            value: item.id,
            text: item.name,
          };
        });
        this.setState({
          places,
        });
        appCache.set({
          places: places,
        });
        this.filterSelectedPlaces(places);
      });
    } else {
      this.setState({
        places: places,
      });
      this.filterSelectedPlaces(places);
    }
  };

  filterSelectedPlaces = allPlaces => {
    const value = this.props.value;
    value.forEach((selectedPlace, index) => {
      if (
        findIndex(allPlaces, place => {
          return place.value === selectedPlace.id;
        }) === -1
      ) {
        value.splice(index, 1);
        this.props.onChange(value);
        // this.setState({ value });
      }
    });
  };

  onPlaceChange = (evt, data) => {
    let { value } = this.props;
    // selectedPlaces = [...selectedPlaces];
    let newSelected = [];
    if (value.length > 0) {
      if (
        findIndex(value, val => {
          return val.id === data.value;
        }) === -1
      ) {
        newSelected.push({ id: data.value });
      }
    } else {
      value.push({ id: data.value });
    }

    value = value.concat(newSelected);
    this.setState({
      value: this.formatValue(value),
    });
    this.props.onChange(value);
  };

  onPlaceDelete = data => {
    let { value } = this.props;
    value.forEach((item, index) => {
      if (item.id === data.value) {
        value.splice(index, 1);
      }
    });
    this.setState({
      value: this.formatValue(value),
    });
    this.props.onChange(value);
  };

  formatValue(data) {
    let value = [];
    data.forEach(item => {
      value.push(item.id);
    });

    return value;
  }

  render() {
    let { places } = this.state;
    let { value } = this.props;
    let val = [];
    value.map(item => {
      val.push(item.id);
    });
    return (
      <div>
        <Select
          data={places}
          value={val}
          autoWidth
          tags
          filter={(item, keyword) => item.text.indexOf(keyword) > -1}
          placeholder="请选择上课地点"
          className="select-large"
          popupClassName="select-large__popup"
          onChange={this.onPlaceChange}
          onDelete={this.onPlaceDelete}
        />
        <p className="help-inline">
          <a href="javascript:;" onClick={() => this.fetchPlaceList(true)}>
            刷新
          </a>
          <span> | </span>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={`${window._global.url.www}/setting/store/indexv2#/list`}
          >
            新建上课地点
          </a>
        </p>
      </div>
    );
  }
}

export default getControlGroup(StoreListComponent);
