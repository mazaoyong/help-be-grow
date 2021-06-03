
import { Form } from '@zent/compat';
import React from 'react';
import { Button } from 'zent';
import { ReactAmap } from '@youzan/react-components';
import './style.scss';

const { getControlGroup } = Form;

class MapField extends React.Component {
  state = {
    query: '',
  };

  search = () => {
    const { location = {}, address = '' } = this.props;
    const { province = '', city = '', area = '' } = location;

    this.setState({
      query: `${province}${city}${area}${address}`,
    });
  };

  onMapChange = (lnglat, addr, location) => {
    const { address, name } = location;
    this.props.changeAddress(`${address}${name}`, location, lnglat);
  };

  render() {
    const { query } = this.state;

    return (
      <div className="shop-map-field">
        <Button onClick={this.search} className="search" style={this.props.style || {}}>
          搜索地图
        </Button>
        <ReactAmap
          width={this.props.width || '492px'}
          height={this.props.height || '315px'}
          defaultValue={''}
          query={query}
          onChange={this.onMapChange}
        />
      </div>
    );
  }
}

export default getControlGroup(MapField);
