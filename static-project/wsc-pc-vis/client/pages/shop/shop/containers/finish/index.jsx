import React from 'react';
import { Button, Notify } from 'zent';
import { hashHistory } from 'react-router';
import buildUrl from '@youzan/utils/url/buildUrl';
import PageWrapper from '../../components/page-wrapper';
import Loading from '../../components/loading';
import { getQrcode } from '../../api/index';
import './style.scss';

export default class App extends React.Component {
  state = {
    kdtId: '',
    showLoading: false,
    showSuccess: false,
    autoJumpTimeout: 3,
    previewUrl: '',
  }

  componentDidMount() {
    const { kdtId } = this.props.location.query;
    if (!kdtId) {
      Notify.error('创建失败，请重试或联系人工客服');
      hashHistory.goBack();
    } else {
      this.setState({ showLoading: true, kdtId });
      this.setPreviewUrl(kdtId);
    }
  }

  setPreviewUrl = (kdtId) => {
    getQrcode(buildUrl(`/wscshop/showcase/homepage?kdt_id=${kdtId}`, 'h5', kdtId))
      .then(res => {
        this.setState({
          previewUrl: res
        });
      });
  }

  handleLoadingFinish = () => {
    this.setState({
      showLoading: false,
      showSuccess: true,
    });
    this.timmerId = setInterval(() => {
      if (this.state.autoJumpTimeout > 0) {
        this.setState({ autoJumpTimeout: this.state.autoJumpTimeout - 1 });
      } else {
        clearInterval(this.timmerId);
        // this.handleClickEnterShop();
      }
    }, 1000);
  }

  handleClickEnterShop = () => {
    window.location.href =
      `${window._global.url.www}/account/team/change.html?kdt_id=${this.state.kdtId}`;
  }

  renderFinishHint = () => {
    const { previewUrl } = this.state;
    return (
      <div className='finish-wrapper'>
        <img
          className="success-icon"
          src="https://img.yzcdn.cn/public_files/2019/03/19/aacf843e894bcccf4137bebe1295a6c4.png"
          alt="创建店铺完成"
        />
        <div className="success-title">恭喜，店铺创建成功！</div>
        <div className="homepage-preview">
          <img src={previewUrl} alt="" className="homepage-preview__img"/>
          <p className="homepage-preview__desc">手机扫码 看看你的店铺</p>
        </div>
        <Button
          onClick={() => {
            this.handleClickEnterShop();
          }}
          className="success-button"
          type="primary"
        >
          进入店铺后台
        </Button>
      </div>
    );
  }

  render() {
    const { showLoading, showSuccess } = this.state;
    return (
      <PageWrapper step={3}>
        {showLoading && <Loading onFinish={this.handleLoadingFinish} />}
        {showSuccess && this.renderFinishHint()}
      </PageWrapper>
    );
  }
}
