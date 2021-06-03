
import { Form as ZentForm } from '@zent/compat';
import React from 'react';
import Region from '../region-field';
import MapField from '../map-field';
import AddressField from '../address-field';

const { Field } = ZentForm;

function handleParams(params) {
  return { ...params, area: params.district, county_id: params.adcode };
}

export default function MapRegionFields({
  location, address, handleChange, lngAndLat, mapProps = {}, validationMap = {}
}) {
  return (
    <>
      <Field
        name="location"
        label="商家地址："
        value={location}
        placeholder='请选择机构总部所在省 / 市 / 区'
        component={Region}
        validations={{
          validLocation(values, value) {
            if (value && value.county_id > 0) return true;
            return '省 / 市 / 区不能为空';
          },
        }}
        onChange={location => {
          handleChange('location', location);
          handleChange('address', '');
        }}
      />

      <Field
        name="address"
        value={address}
        component={AddressField}
        validations={ validationMap.address || { required: true, maxLength: 100 }}
        className="address-field"
        validationErrors={{ required: '请填写机构详细地址', maxLength: '请控制地址长度在100字符以内' }}
        placeholder="请填写详细地址"
        onChange={value => {
          handleChange('address', value);
        }}
      />
      <Field
        name="lngAndLat"
        changeAddress={(value, locationParams, lnglat) => {
          const params = handleParams(locationParams);
          handleChange('location', params);
          handleChange('address', value);
          handleChange('lngAndLat', lnglat);
        }}
        value={lngAndLat}
        location={location}
        address={address}
        component={MapField}
        validations={ validationMap.lngAndLat || {
          validLocation(values, value) {
            if (value && Object.keys(value).length > 0) return true;
            return '请在地图选择地址';
          },
        }}
        {...mapProps}
      />
    </>
  );
}
