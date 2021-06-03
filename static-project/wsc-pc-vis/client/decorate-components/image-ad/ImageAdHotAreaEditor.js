import { Popover } from '@zent/compat';
import React from 'react';
import { findDOMNode } from 'react-dom';
import fullfillImage from '@youzan/utils/fullfillImage';
import cloneDeep from 'lodash/cloneDeep';
import assign from 'lodash/assign';
import noop from 'lodash/noop';
import { Dialog, Button, Notify } from 'zent';
import Rnd from 'react-rnd';
import ChooseMenu from '../common/choose-menu';
import HelpIcon from 'shared/components/help-icon';

import { getWeappNotSuppertedLinkMessage } from '../common/utils/weapp-not-supported-link';
import { getH5NotSuppertedLinkMessage } from '../common/utils/h5-not-supported-link';
import Image from '../common/upload-image';
import * as Helper from './helper';
import * as Constants from './constants';
import { getClipSize } from './visibility-query';

export default class ImageAdHotAreaEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = assign({}, this.state, {
      hotAreas: this.handleInitialHotAreas(props),
      dialogVisible: false,
      popovers: this.handleInitialPopover(props),
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.hotAreas !== nextProps.data.hot_areas) {
      this.setState({
        hotAreas: this.handleInitialHotAreas(nextProps),
        popovers: this.handleInitialPopover(nextProps),
      });
    }
  }

  // 将保存之后的start_x等转成弹窗里图片的尺寸
  handleInitialHotAreas = props => {
    const hotAreas = cloneDeep(props.data.hot_areas);
    const imageWidth = props.data.image_width;
    const scale = this.handleHotAreaDialogImageWidth() / imageWidth; // 图片在弹窗里是固定宽度 要把start_x等等比缩放
    hotAreas.forEach(item => {
      item.start_x = Math.round(item.start_x * scale);
      item.start_y = Math.round(item.start_y * scale);
      item.end_x = Math.round(item.end_x * scale);
      item.end_y = Math.round(item.end_y * scale);
    });
    if (hotAreas.length === 0) {
      hotAreas.push({
        start_x: 10,
        start_y: 10,
        end_x: 125,
        end_y: 125,
        link_type: '',
        link_id: '',
        link_title: '',
        link_url: '',
        alias: '',
      });
    }
    return hotAreas;
  };

  // 初始化每个hotarea对应的popover
  handleInitialPopover = props => {
    if (props.data.hot_areas.length === 0) {
      return [getPopoverInitialState()];
    }
    return props.data.hot_areas.map(() => {
      return getPopoverInitialState();
    });
  };

  uploadImageCallback = data => {
    const { subEntry, index, handleChange } = this.props;
    const subEntryData = Helper.transferHotAreaSubEntry(data)[0];
    const originSubEntry = cloneDeep(subEntry);
    const hotAreas = originSubEntry[index].hot_areas;
    const scale = subEntryData.image_width / originSubEntry[index].image_width;
    hotAreas.forEach(item => {
      item.start_x = Math.round(item.start_x * scale);
      item.start_y = Math.round(item.start_y * scale);
      item.end_x = Math.round(item.end_x * scale);
      item.end_y = Math.round(item.end_y * scale);
    });
    subEntryData.hot_areas = hotAreas;
    originSubEntry[index] = subEntryData;
    handleChange(originSubEntry);
  };

  uploadImage = () => {
    const { globalConfig, uploadConfig } = this.props;
    const options = {
      uploadConfig,
      callback: this.uploadImageCallback,
      imgcdn: globalConfig.url && (globalConfig.url.imgqn || globalConfig.url.imgcdn),
    };
    Image.initialize(options);
  };

  renderDialogHeaderContent = () => {
    return (
      <div className="header-content">
        {Constants.hotAreaEditorSteps.map((item, index) => {
          return (
            <span key={index} className="step-content">
              <span className="step-num">{index + 1}</span>
              <span className="step-text">{item}</span>
              <span>{index !== Constants.hotAreaEditorSteps.length - 1 ? '-' : ''}</span>
            </span>
          );
        })}
      </div>
    );
  };

  handleHotAreaDragStop = (d, index) => {
    const imageElement = document.getElementsByClassName(
      'decorate-hot-area-image-editor__dialog-image'
    )[0];
    const imageWidth = imageElement.clientWidth;
    const imageHeight = imageElement.clientHeight;

    let { x, y } = d;
    const hotAreas = cloneDeep(this.state.hotAreas);
    const item = hotAreas[index];
    const width = item.end_x - item.start_x;
    const height = item.end_y - item.start_y;

    if (x < 0) {
      x = 0;
    } else if (x + width > imageWidth) {
      x = imageWidth - width;
    }

    if (y < 0) {
      y = 0;
    } else if (y + height > imageHeight) {
      y = imageHeight - height;
    }

    item.end_x = x + width;
    item.end_y = y + height;
    item.start_x = x;
    item.start_y = y;
    this.setState({ hotAreas });
    this.triggerAllPopover(false);
  };

  handleHotAreaResize = (ref, direction, index) => {
    const { offsetWidth, offsetHeight } = ref;
    const hotAreas = cloneDeep(this.state.hotAreas);
    const item = hotAreas[index];
    if (direction === 'topRight') {
      item.end_x = item.start_x + offsetWidth;
      item.end_y = item.start_y - offsetHeight;
    } else if (direction === 'bottomRight') {
      item.end_x = item.start_x + offsetWidth;
      item.end_y = item.start_y + offsetHeight;
    } else if (direction === 'topLeft') {
      item.start_x = item.end_x - offsetWidth;
      item.start_y = item.end_y - offsetHeight;
    } else if (direction === 'bottomLeft') {
      item.start_x = item.end_x - offsetWidth;
      item.end_y = item.start_y + offsetHeight;
    } else if (direction === 'top') {
      item.start_y = item.end_y - offsetHeight;
    } else if (direction === 'bottom') {
      item.end_y = item.start_y + offsetHeight;
    } else if (direction === 'left') {
      item.start_x = item.end_x - offsetWidth;
    } else if (direction === 'right') {
      item.end_x = item.start_x + offsetWidth;
    }
    this.setState({ hotAreas });
    this.triggerAllPopover(false);
  };

  handleDoubleClickHotarea = (item, index) => {
    if (!item.link_url) {
      this.triggerPopover(true, index);
    }
  };

  handleClickMenu = (data, index) => {
    const hotAreas = cloneDeep(this.state.hotAreas);
    hotAreas[index] = assign({}, hotAreas[index], data);
    this.setState({ hotAreas });
    this.triggerAllPopover(false);
  };

  // 热区添加链接自定义menu click回调，关掉所有的pop
  handleMenuClick = () => {
    this.triggerAllPopover(false);
  };

  handleDeleteHotarea = index => {
    const hotAreas = cloneDeep(this.state.hotAreas);
    hotAreas.splice(index, 1);
    this.setState({ hotAreas });
  };

  renderLinkText = item => {
    if (item.end_y - item.start_y <= 34 && item.end_x - item.start_x <= 32) {
      return '';
    } else if (!item.link_url) {
      return (
        <div>
          <div>双击设置</div>
          <div>关联链接</div>
        </div>
      );
    }

    const linkType = Constants.hotAreaLinkTitleMap[item.link_type];
    const linkTitle = item.link_title;

    let help;
    let isWeappHelp = false;
    if (this.props.globalConfig.showDesignWeappNotice) {
      if (item && item.link_url) {
        help = getWeappNotSuppertedLinkMessage(item) || chatNotSupporttedInWeapp(item);
        if (help) {
          isWeappHelp = true;
        } else {
          help = getH5NotSuppertedLinkMessage(item);
        }
      }

      help =
        help &&
        `${help}，${isWeappHelp ? '该热区在小程序点击不跳转' : '该热区只在小程序点击可跳转'}`;
    }

    return (
      <span>
        {linkType !== linkTitle ? `${linkType} | ${linkTitle}` : linkType}
        <HelpIcon help={help} type="error-circle" />
      </span>
    );
  };

  handleDialogImageOnLoad = () => {
    this.setState({ hotAreas: this.handleInitialHotAreas(this.props) });
  };

  renderDialogImageContent = () => {
    const { globalConfig, settings, linkMenuItems, data } = this.props;
    const { image_width: imageWidth, image_height: imageHeight } = data;
    const maxHeight = (Constants.hotAreaDialogImageWidth * imageHeight) / imageWidth;

    return (
      <div className="image-content" onScroll={() => this.triggerAllPopover(false)}>
        <img
          id="decorate-hot-area-image-editor__image"
          onLoad={() => this.handleDialogImageOnLoad()}
          className="decorate-hot-area-image-editor__dialog-image"
          draggable={false}
          src={fullfillImage(this.props.data.image_url)}
          width={`${Constants.hotAreaDialogImageWidth}px`}
          alt="hotarea"
          onClick={() => this.triggerAllPopover(false)}
        />
        {this.state.hotAreas.map((item, index) => {
          const popover = this.state.popovers[index];

          return (
            <Rnd
              key={index}
              size={{
                width: item.end_x - item.start_x,
                height: item.end_y - item.start_y,
              }}
              minWidth={32}
              minHeight={20}
              maxWidth={Constants.hotAreaDialogImageWidth}
              maxHeight={maxHeight}
              position={{ x: item.start_x, y: item.start_y }}
              className="hotarea-rnd"
              onDragStop={(e, d) => this.handleHotAreaDragStop(d, index)}
              onDragStart={() => this.triggerAllPopover(false)}
              onResize={(e, direction, ref) => this.handleHotAreaResize(ref, direction, index)}
            >
              <Popover
                position={Popover.Position.AutoBottomLeft}
                visible={popover.visible}
                onVisibleChange={visible => this.triggerPopover(visible, index)}
                cushion={6}
                className="rc-choose-link-menu-popover decorate-hot-area-image-editor__popover"
              >
                <Popover.Trigger.Base>
                  <div
                    className="hotarea-inner"
                    onDoubleClick={() => this.handleDoubleClickHotarea(item, index)}
                  >
                    <div className="hotarea">
                      <div className="hotarea-text">{this.renderLinkText(item)}</div>
                    </div>
                    <div className="hotarea-close" onClick={() => this.handleDeleteHotarea(index)}>
                      ×
                    </div>
                    {item.link_url ? (
                      <div
                        className="hotarea-edit"
                        onClick={() => this.triggerOtherPopover(false, index)}
                      >
                        修改
                      </div>
                    ) : null}
                  </div>
                </Popover.Trigger.Base>
                <Popover.Content>
                  <div onMouseDown={ev => ev.stopPropagation()}>
                    <ChooseMenu
                      globalConfig={globalConfig}
                      settings={settings}
                      value={item}
                      linkMenuItems={linkMenuItems}
                      hasPopoverTrigger={false}
                      onMenuClick={this.handleMenuClick}
                      onChange={data => this.handleClickMenu(data, index)}
                      menuStyle={Helper.getClipHeightStyle(popover.clipHeight)}
                      ref={this.onMenuRefChange(index)}
                    />
                  </div>
                </Popover.Content>
              </Popover>
            </Rnd>
          );
        })}
      </div>
    );
  };

  onMenuRefChange = index => menu => {
    // 说一下逻辑：我们这个菜单是在 Dialog 里面的
    // Dialog 打开的时候 body 是不能滚动的，所以超出屏幕的菜单是看不见的。
    // 为了解决这个问题，每次菜单打开的时候会计算是不是超出屏幕了，如果发现在屏幕外面会计算出一个最大高度
    // 超出这个高度的时候菜单会出现滚动条
    // 有一点需要注意，菜单每次关闭的时候必须把这一次计算出来的高度清除，
    // 否则下面的条件不成立渲染没法跳出死循环。
    if (menu && !this.state.popovers[index].clipHeight) {
      /* eslint-disable */
      const menuNode = findDOMNode(menu);
      getClipSize(menuNode)
        .then(clipHeight => {
          const popovers = this.state.popovers.map((p, idx) => {
            if (idx === index && clipHeight !== p.clipHeight) {
              return {
                ...p,
                clipHeight,
              };
            }

            return p;
          });

          this.setState({
            popovers,
          });
        })
        .catch(noop);
    }
  };

  addHotArea = () => {
    const imageContentElement = document.getElementsByClassName('image-content')[0];
    const hotAreas = cloneDeep(this.state.hotAreas);
    hotAreas.push({
      start_x: 10,
      start_y: imageContentElement ? imageContentElement.scrollTop + 10 : 10,
      end_x: 125,
      end_y: imageContentElement ? imageContentElement.scrollTop + 125 : 125,
      link_type: '',
      link_id: '',
      link_title: '',
      link_url: '',
      alias: '',
    });
    const popovers = cloneDeep(this.state.popovers);
    popovers.push(getPopoverInitialState());
    this.setState({ hotAreas, popovers });
  };

  renderDialogContent = () => {
    return (
      <div className="decorate-hot-area-image-editor__dialog">
        {this.renderDialogHeaderContent()}
        {this.renderDialogImageContent()}
      </div>
    );
  };

  renderDialogFooter = () => {
    return (
      <span>
        <Button type="primary" onClick={this.addHotArea}>
          添加热区
        </Button>
        <Button onClick={this.handleSave}>保存</Button>
      </span>
    );
  };

  handleChangeSubEntry = hotAreas => {
    const { subEntry, index, handleChange } = this.props;
    const originSubEntry = cloneDeep(subEntry);
    originSubEntry[index].hot_areas = hotAreas;
    handleChange(originSubEntry);
  };

  handleSave = () => {
    const imageWidth = this.props.data.image_width;
    const scale = this.handleHotAreaDialogImageWidth() / imageWidth; // 图片在弹窗里是固定宽度 要把start_x等等比缩放
    const hotAreas = cloneDeep(this.state.hotAreas);
    const hasEmptyLink = hotAreas.some(item => {
      return item.link_url === '';
    });
    if (hasEmptyLink) {
      Notify.error('请添加关联链接');
      return;
    }

    hotAreas.forEach(item => {
      item.start_x = Math.round(item.start_x / scale);
      item.start_y = Math.round(item.start_y / scale);
      item.end_x = Math.round(item.end_x / scale);
      item.end_y = Math.round(item.end_y / scale);
    });

    this.handleChangeSubEntry(hotAreas);
    this.triggerDialog(false);
  };

  triggerDialog = visible => {
    this.setState({ dialogVisible: visible });
  };

  triggerPopover = (visible, index) => {
    const popovers = cloneDeep(this.state.popovers);
    const item = popovers[index];
    item.visible = visible;
    clearClipHeightIfNeeded(item);
    this.setState({ popovers });
  };

  // 控制所有popover状态
  triggerAllPopover = visible => {
    const popovers = cloneDeep(this.state.popovers);
    const changedPopovers = popovers.map(p => {
      const item = {
        ...p,
        visible,
      };
      return clearClipHeightIfNeeded(item);
    });
    this.setState({ popovers: changedPopovers });
  };

  // 使其他popover状态与自己相反
  triggerOtherPopover = (visible, index) => {
    const popovers = cloneDeep(this.state.popovers);
    const changedPopovers = popovers.map((i, k) => {
      const item = {
        ...i,
        visible: k !== index ? visible : !visible,
      };
      return clearClipHeightIfNeeded(item);
    });
    this.setState({ popovers: changedPopovers });
  };

  handleCloseDialog = () => {
    this.handleChangeSubEntry(cloneDeep(this.props.data.hot_areas));
    this.triggerDialog(false);
  };

  // 当图片出现滚动条时 需要减去滚动条的宽度
  handleHotAreaDialogImageWidth = () => {
    // const hotAreaDialogImageWidth = Constants.hotAreaDialogImageWidth;
    // const imageWidth = this.props.data.image_width ? this.props.data.image_width : 1;
    // const scale = hotAreaDialogImageWidth / imageWidth;
    // const realImageHeight = Math.round((this.props.data.image_height ? this.props.data.image_height : 1) * scale);
    // if (realImageHeight > 420) { // 420为图片区域的最大高度
    //   return hotAreaDialogImageWidth - 15;
    // }
    // return hotAreaDialogImageWidth;
    const imageElement = document.getElementById(
      'decorate-hot-area-image-editor__image'
    );
    if (imageElement) {
      return imageElement.clientWidth;
    }
    return Constants.hotAreaDialogImageWidth;
  };

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        /* eslint-disable */
        viewRate: this.refs.img.clientWidth / Constants.hotAreaDialogImageWidth,
      });
    }, 0);
  }

  render() {
    const { data } = this.props;
    const { hot_areas: hotAreas } = data;

    return (
      <div className="decorate-hot-area-image-editor">
        <img
          src={fullfillImage(data.image_url)}
          width={`${Constants.hotAreaDialogImageWidth}px`}
          alt="hotarea"
          onClick={() => this.triggerDialog(true)}
          ref="img"
        />
        {this.state.hotAreas.map((item, index) => {
          const { viewRate } = this.state;

          return (
            <Rnd
              key={index}
              size={{
                width: (item.end_x - item.start_x) * viewRate,
                height: (item.end_y - item.start_y) * viewRate,
              }}
              minWidth={32}
              minHeight={20}
              position={{ x: item.start_x * viewRate, y: item.start_y * viewRate }}
              className="hotarea-rnd disabled"
              disableDragging
            >
              <div className="hotarea">
                <div className="hotarea-text">{this.renderLinkText(item)}</div>
              </div>
            </Rnd>
          );
        })}
        <div
          className="decorate-hot-area-image-editor__modify-image"
          onClick={this.uploadImage}
        >
          更换图片
        </div>
        {hotAreas.length > 0 && (
          <div className="decorate-hot-area-image-editor__added-hotarea">{`已添加${
            hotAreas.length
          }个热区`}</div>
        )}
        <Dialog
          visible={this.state.dialogVisible}
          onClose={this.handleCloseDialog}
          title="热区编辑器"
          footer={this.renderDialogFooter()}
          maskClosable={false}
        >
          {this.renderDialogContent()}
        </Dialog>
      </div>
    );
  }
}

function getPopoverInitialState() {
  return {
    visible: false,
    clipHeight: 0,
  };
}

function clearClipHeightIfNeeded(popover) {
  if (!popover.visible) {
    popover.clipHeight = 0;
  }

  return popover;
}

function chatNotSupporttedInWeapp(link) {
  if (link.link_type === 'chat') {
    return '小程序热区暂不支持在线客服';
  }
}
