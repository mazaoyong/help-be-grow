import React, { Component } from 'react';
import { ReactAmap } from '@youzan/react-components';
import { Form } from '@zent/compat';

export interface IProps {
  query: string;
  value: number[] | null; // [lng, lat]
  handleMapChanged: (data) => void;
}
const API_KEY = 'd556dc1b176626ac55ce4a748c5bdb6d';
const mapConfig = {
  zoom: 18,
  resizeEnable: true,
};
/**
 * 地图定位字段组件
 */
class MapComponent extends Component<ZENT_FIELD_COMP<IProps>> {
  onMapChange = (lnglat, address, data) => {
    const detailAddress = this.handleDetailAddress(address, data);
    this.props.handleMapChanged({
      province: data.province,
      city: data.city,
      district: data.district,
      regionId: data.adcode,
      address: detailAddress,
      lng: lnglat.lng + 0.0065,
      lat: lnglat.lat + 0.006,
    });
  };

  handleDetailAddress = (address, data) => {
    let res = address;
    res = this.sliceAddress(res, data.province);
    res = this.sliceAddress(res, data.city);
    res = this.sliceAddress(res, data.district);
    return res;
  };

  sliceAddress(address, value) {
    let res = address;
    if (address.indexOf(value) !== -1) {
      res = address.slice(value.length);
    }
    return res;
  }

  formatLngLat = lnglat => {
    return lnglat && lnglat.length === 2
      ? ([lnglat[0] - 0.0065, lnglat[1] - 0.006] as [number, number])
      : null;
  };

  render() {
    return (
      <div className="map-field">
        <ReactAmap
          className="self-fetch-map"
          idName="amap"
          defaultValue={this.formatLngLat(this.props.value)}
          width="660"
          height="462"
          mapConfig={mapConfig}
          apiKey={API_KEY}
          version="1.4.15"
          query={this.props.query}
          onChange={this.onMapChange}
        />
      </div>
    );
  }
}
// @ts-ignore
export default Form.getControlGroup(MapComponent);
