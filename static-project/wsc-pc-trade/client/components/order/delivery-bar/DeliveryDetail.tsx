import React, { Component } from 'react';
import { BlockLoading, Button, Icon, Notify } from 'zent';
import fullfillImage from '@youzan/utils/fullfillImage';
import { Map, Marker } from 'react-amap';
import uuidV4 from 'uuid/v4';
import api from './api';
import { IFetchCityDetailRes } from './type';
import mapKeysToSnakeCase from '@youzan/utils/string/mapKeysToSnakeCase';

/**
 * 百度 => 高德
 * @param {Array} node
 */
function baiduToGaode(node) {
  const lng = Number(node[0]) - 0.0065;
  const lat = Number(node[1]) - 0.006;

  // @ts-ignore
  return [parseFloat(lng, 10).toFixed(6), parseFloat(lat, 10).toFixed(6)];
}

interface IProps {
  orderNo: string;
  packId: string;
  onlyMap?: boolean;
}

interface IState {
  isLoading: boolean;
  positionInfo: {
    shopLat: IFetchCityDetailRes['shop_lat'];
    shopLng: IFetchCityDetailRes['shop_lng'];
    buyerLat: IFetchCityDetailRes['buyer_lat'];
    buyerLng: IFetchCityDetailRes['buyer_lng'];
    transporterLat: IFetchCityDetailRes['transporter_lat'];
    transporterLng: IFetchCityDetailRes['transporter_lng'];
  } | null;
  recordInfo: IFetchCityDetailRes['record'];
  packInfo: {
    channelStr: IFetchCityDetailRes['channel_str'];
    address: IFetchCityDetailRes['address'];
    items: IFetchCityDetailRes['items'];
    deliveryFee: IFetchCityDetailRes['delivery_fee'];
    tipFee: IFetchCityDetailRes['tip_fee'];
    deductFee: IFetchCityDetailRes['deduct_fee'];
  } | null;
  status: IFetchCityDetailRes['status'] | '';
  refreshLoading: boolean;
}

export default class DeliveryDetail extends Component<IProps, IState> {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      positionInfo: null,
      recordInfo: [],
      packInfo: null,
      status: '',
      refreshLoading: false,
    };
  }

  componentDidMount() {
    this.handleFetchDetail();
  }

  handleFetchDetail = () => {
    api
      .fetchCityDetail({
        orderNo: this.props.orderNo,
        packId: this.props.packId,
      })
      .then(res => {
        const data = mapKeysToSnakeCase(res) || ({} as IFetchCityDetailRes);
        // 买家经纬度是百度的，需要转换成高德
        const transedBuyerNode = baiduToGaode([data.buyer_lng, data.buyer_lat]);
        let transedShopNode = [data.shop_lng, data.shop_lat];
        /**
         * 1 腾讯 2 百度 3 高德
         */
        if (+data.shop_position_source === 2) {
          transedShopNode = baiduToGaode(transedShopNode);
        }
        this.setState({
          isLoading: false,
          status: data.status,
          positionInfo: {
            shopLat: transedShopNode[1],
            shopLng: transedShopNode[0],
            buyerLat: transedBuyerNode[1],
            buyerLng: transedBuyerNode[0],
            transporterLat: data.transporter_lat,
            transporterLng: data.transporter_lng,
          },
          recordInfo: data.record,
          packInfo: {
            channelStr: data.channel_str,
            address: data.address,
            items: data.items,
            deliveryFee: data.delivery_fee, // 配送费
            tipFee: data.tip_fee, // 小费
            deductFee: data.deduct_fee, // 违约金
          },
        });
      })
      .catch(msg => Notify.error(msg));
  };

  handleRefreshPosition = () => {
    this.setState({ refreshLoading: true });
    api
      .fetchCityDetail({
        orderNo: this.props.orderNo,
        packId: this.props.packId,
        location: true,
      })
      .then(data => {
        data = mapKeysToSnakeCase(data);
        this.setState({
          positionInfo: {
            ...this.state.positionInfo!,
            transporterLat: data.transporter_lat,
            transporterLng: data.transporter_lng,
          },
        });
      })
      .catch(msg => Notify.error(msg))
      .finally(() => this.setState({ refreshLoading: false }));
  };

  renderMap() {
    const { buyerLng, buyerLat, transporterLng, transporterLat, shopLng, shopLat } =
      this.state.positionInfo || {};
    return (
      <div className="order-delivery-bar__detail-map">
        <Map
          amapkey="d556dc1b176626ac55ce4a748c5bdb6d"
          version="1.3.0"
          plugins={[
            'MapType',
            'Scale',
            'OverView',
            'ControlBar',
            {
              name: 'ToolBar',
              options: {
                visible: true,
              },
            },
          ]}
          zoom={13}
          resizeEnable
          center={[buyerLng!, buyerLat!]}
        >
          {/* 骑手坐标 */}
          {transporterLng && (
            <Marker
              icon="https://b.yzcdn.cn/v2/image/trade/delivery@2x.png"
              position={{
                longitude: transporterLng,
                latitude: transporterLat!,
              }}
            />
          )}
          {/* 商家坐标 */}
          {shopLng && <Marker position={{ longitude: shopLng, latitude: shopLat! }} />}
          {/* 买家坐标 */}
          {buyerLng && <Marker position={{ longitude: buyerLng, latitude: buyerLat! }} />}
        </Map>
      </div>
    );
  }

  render() {
    if (this.state.isLoading) {
      return <BlockLoading loading />;
    }
    const isShowMap = +this.state.status === 2 || +this.state.status === 3;
    const { onlyMap } = this.props;
    const { items = [], channelStr, address, deliveryFee, tipFee, deductFee } =
      this.state.packInfo || {};
    if (onlyMap) {
      return (
        <div className="order-delivery-bar__detail">
          <div className="order-delivery-bar__detail-main">{isShowMap && this.renderMap()}</div>
        </div>
      );
    } else {
      return (
        <div className="order-delivery-bar__detail">
          <div className="order-delivery-bar__detail-main">
            {isShowMap && this.renderMap()}
            <table className="order-delivery-bar__detail-table">
              <tbody>
                {items.map((itemInfo, index) => {
                  return (
                    <tr key={uuidV4()} className="order-delivery-bar__detail-table-item">
                      <td className="img">
                        <img alt="" src={fullfillImage(itemInfo.img_url, '!100x100.jpg')} />
                      </td>
                      <td className="item-info">
                        <a href={itemInfo.url} rel="noopener noreferrer" target="_blank">
                          {itemInfo.name}
                        </a>
                        <div>{itemInfo.category}</div>
                        <div>
                          商家编码：
                          {itemInfo.business_code}
                        </div>
                      </td>
                      <td className="num">{itemInfo.num}</td>
                      {index === 0 && (
                        <td
                          rowSpan={items.length}
                          className="order-delivery-bar__detail-table-info item"
                        >
                          发货方式：
                          {channelStr}
                          <br />
                          配送地址：
                          {address}
                        </td>
                      )}
                      {index === 0 && (
                        <td
                          rowSpan={items.length}
                          className="order-delivery-bar__detail-table-fee item"
                        >
                          {!!deliveryFee && (
                            <div>
                              配送费
                              <br />¥ {deliveryFee / 100}
                            </div>
                          )}
                          {!!tipFee && (
                            <div>
                              小费
                              <br />¥ {tipFee / 100}
                            </div>
                          )}
                          {!!deductFee && (
                            <div>
                              违约金
                              <br />¥ {deductFee / 100}
                            </div>
                          )}
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="order-delivery-bar__detail-side">
            {isShowMap && (
              <Button
                className="order-delivery-bar__detail-side-btn"
                type="primary"
                loading={this.state.refreshLoading}
                onClick={this.handleRefreshPosition}
              >
                刷新
              </Button>
            )}
            {this.state.recordInfo.map((item, index) => {
              return (
                <div key={uuidV4()} className="record-step">
                  <div className="record-step-bar">
                    <div className="record-step-bar-icon">
                      {index === 0 ? (
                        <Icon type="check-circle" className="current-icon" />
                      ) : (
                        <span className="done-icon" />
                      )}
                    </div>
                    {index !== this.state.recordInfo.length - 1 && (
                      <div className="record-step-bar-tail" />
                    )}
                  </div>
                  <div className="record-step-content">
                    <div className="record-step-content-main">{item.status_str}</div>
                    {item.name && item.phone && (
                      <div className="record-step-content-main">
                        配送员 {item.name}：{item.phone}
                      </div>
                    )}
                    <div className="record-step-content-time">{item.date_time}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }
  }
}
