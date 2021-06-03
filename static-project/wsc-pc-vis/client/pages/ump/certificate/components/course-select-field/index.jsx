import React, { PureComponent } from 'react';
import { Notify, Grid } from 'zent';
import GoodsSelectButton from 'components/good-selector';
import './styles.scss';
import { getCourseDetail } from '../../api';
import { Img } from '@youzan/ebiz-components';
import cent2yuan from 'fns/currency/cent2yuan';
import getControlGroup from '../../../../../components/form/get-control-group';

const { ImgWrap } = Img;
// variables
const ignoreGroup = {
  online: {
    value: [0, 1, 2, 4],
  },
};
const RECOMMEND_POLITE = 10;
const channels = ['online'];
const kdtId = window._global.kdtId;
const h5 = window._global.url.h5;

class CourseSelectField extends PureComponent {
  static getDerivedStateFromProps(props, state) {
    if (props.value !== state.value) {
      return { value: props.value };
    }
    return null;
  }

  state = {
    value: {},
  };

  componentDidMount() {
    this.setAppendix();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.value.sourceId !== this.state.value.sourceId) {
      this.setAppendix();
    }
  }

  render() {
    const { ext, disabled } = this.props;
    const { id, value } = this.state;
    return (
      <>
        {
          disabled ? null : (
            <GoodsSelectButton
              isOnlyEdu={true}
              isPureEdu={true}
              isOnlyGroup={10}
              singleMode={true}
              hasSku={false}
              activityType={RECOMMEND_POLITE}
              channels={channels}
              ignoreGroup={ignoreGroup}
              className={value.sourceId ? 'certificate-goods-selector-btn' : ''}
              dialogClassName="certificate-goods-selector"
              btnTxt={value.sourceId ? '重新添加' : '添加'}
              selected={value.sourceId ? { id } : {}}
              onChange={this.handleSourceIdChange}
              ext={ext} />
          )
        }
        {
          value.appendix && (
            <div className="certificate-goods-selector-list">
              <Grid rowKey="alias" columns={this.columns} datasets={[value.appendix]} />
            </div>
          )
        }
      </>
    );
  };

  columns = [
    {
      title: '商品',
      bodyRender: row => {
        const img = row.product.pictures && row.product.pictures[0] && row.product.pictures[0].url;
        const title = row.product && row.product.title;
        return (
          <div className="certificate-goods-list-detail">
            <ImgWrap width="45px" height="45px" src={img} fullfill="!100x100.jpg" />
            <a
              className = "certificate-goods-list-desc"
              href={`${h5}/wscvis/edu/prod-detail?alias=${row.alias}&kdt_id=${kdtId}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {title}
            </a>
          </div>
        );
      },
    },
    {
      title: '价格',
      bodyRender: row => {
        const price = '¥' + cent2yuan(row.product && row.product.price, 100);
        return (
          <div className="certificate-goods-list-price">{price}</div>
        );
      },
    },
    {
      title: '操作',
      textAlign: 'right',
      bodyRender: row => this.props.disabled ? null : <a href="javascript: void(0)" onClick={this.handleRemove}>删除</a>,
    },
  ];

  handleSourceIdChange = data => {
    this.setState({ id: data.id });
    this.handleChange({ sourceId: data.alias });
  };

  handleAppendixChange = (appendix, value) => {
    appendix.alias = value;
    this.handleChange({ appendix });
  };

  handleChange = data => {
    const { value } = this.props;
    this.props.onChange(Object.assign({}, value, data));
  };

  handleRemove = () => {
    this.props.onChange({});
  };

  setAppendix() {
    const { sourceId } = this.state.value || {};
    if (sourceId) {
      const params = {
        alias: sourceId,
        kdtId: window._global.kdtId,
      };
      getCourseDetail(params)
        .then(data => {
          this.handleAppendixChange(data, sourceId);
        })
        .catch(err => {
          Notify.error(err);
        });
    }
  };
}

export default getControlGroup(CourseSelectField);
