import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Input } from 'zent';
import assign from 'lodash/assign';
import ChooseMenu from '../choose-menu';
import ControlGroup from '../control-group';
import Icon from '../icon/index';
import HelpDesc from '../help-desc';
import HelpIcon from 'shared/components/help-icon';

import get from 'lodash/get';

import { getWeappNotSuppertedLinkMessage } from '../utils/weapp-not-supported-link';
import { getH5NotSuppertedLinkMessage } from '../utils/h5-not-supported-link';
import ImageEditor from '../image-editor';
import bem from '../../utils/bem';
import * as Helper from './helper';

import './style/index.scss';

const b = bem('decorate-common-subentry-item');

export default class SubEntryItem extends React.Component {
  static propTypes = {
    globalConfig: PropTypes.object,
    uploadConfig: PropTypes.object,
    settings: PropTypes.object,
    linkMenuItems: PropTypes.array, // 可选链接
    linkDisabled: PropTypes.bool, // 链接不可编辑
    showImage: PropTypes.bool,
    showTitle: PropTypes.bool,
    showDesc: PropTypes.bool,
    showLink: PropTypes.bool,
    showError: PropTypes.bool,
    isClickTrigger: PropTypes.bool, // 顶部导航模板选择微页面
    onChange: PropTypes.func.isRequired,
    onImageEdit: PropTypes.func, // 点击【添加 / 更换图片】时会触发，如果有 onImageEdit 就不会走默认的图片选择了
    onMenuChange: PropTypes.func,
    index: PropTypes.number, // subentry 的位置，会作为 onChange 的参数
    data: PropTypes.object, // subentry 的数据
    error: PropTypes.object,
    titleLabel: PropTypes.node,
    titlePlaceholder: PropTypes.string,
    titleMaxLength: PropTypes.number,
    descLabel: PropTypes.node,
    descPlaceholder: PropTypes.string,
    descMaxLength: PropTypes.number,
    linkLabel: PropTypes.node,
    imageLabel: PropTypes.node,
    imageDesc: PropTypes.node,
    imageHelpText: PropTypes.node,
    chooseLinkDialog: PropTypes.func, // 顶部导航模板有用到
    disableH5Only: PropTypes.bool,
    disableTemplateIds: PropTypes.array,
    helpText: PropTypes.node,
    header: PropTypes.node, // 头部区域
    showHeader: PropTypes.bool,
    showHandler: PropTypes.bool, // 显示拖拽手柄
    showContent: PropTypes.bool, // header 以外的区域
    block: PropTypes.bool, // 一般情况下 image 和 input 是同一行的，而 block 为 true 则会像普通布局
    extra: PropTypes.any, // 额外的东西
  };

  static defaultProps = {
    uploadConfig: {},
    showImage: true,
    showTitle: true,
    showDesc: false,
    showLink: true,
    showContent: true,
    isClickTrigger: false,
    showHeader: false,
    showHandler: false,
    block: false,
    titleLabel: '标题',
    descLabel: '',
    linkLabel: '链接',
    imageLabel: '图片',
  };

  handleInputChange = e => {
    const { onChange, index, data } = this.props;
    const value = e.target.value || '';
    const name = e.target.name || '';
    const itemData = assign({}, data, { [name]: value });
    onChange(itemData, index);
  };

  handleImageChange = (image, imageIndex) => {
    const { onChange, index, data } = this.props;
    const subEntryItemData = Helper.updateImage(image, imageIndex, data);
    onChange(subEntryItemData, index);
  };

  // 删除图片
  handleDeleteChange = imageIndex => {
    const { onChange, index, data } = this.props;
    const { images } = data;
    let subEntryItemData = {};
    if (Array.isArray(images) && images.length) {
      const newImages = images.slice();
      newImages.splice(imageIndex, 1);
      subEntryItemData = {
        ...data,
        images: newImages,
      };
      onChange(subEntryItemData, index);
    }
  };

  onMenuChoose = menuData => {
    const { onChange, onMenuChange, index, data } = this.props;

    if (onMenuChange) {
      menuData = onMenuChange(menuData);

      if (!menuData) {
        console.error('onMenuChange should return something'); // eslint-disable-line no-console
      }
    }

    const subEntryItemData = Helper.updateMenu(menuData, data);

    onChange(subEntryItemData, index);
  };

  /**
   * 唤起 choose-dialog 选择微页面链接
   * disableTemplateIds: 不支持选择的模板ids [Array]
   * 这里顶部导航模板的微页面，不能选择顶部导航、老模版微页面链接
   */
  handleSettingLink = () => {
    const {
      index,
      onChange,
      data,
      chooseLinkDialog,
      disableH5Only,
      disableTemplateIds,
    } = this.props;

    chooseLinkDialog({
      onChoose: val => {
        const subEntryItemData = Helper.updateMenu(data, Helper.handleFeatureData(val[0]));
        onChange(subEntryItemData, index);
      },
      disableH5Only,
      disableTemplateIds,
      config: window._global,
    });
  };

  renderImageEditor() {
    const {
      block,
      imageLabel,
      imageDesc = [],
      imageHelpText,
      globalConfig,
      uploadConfig,
      showError,
      error,
      data,
      onImageEdit,
    } = this.props;
    const { image_url: imageUrl, images = [] } = data;
    let list;
    let descList;

    if (Array.isArray(images) && images.length) {
      list = images;
    } else {
      list = [{ image_url: imageUrl }];
    }

    if (Array.isArray(imageDesc)) {
      descList = imageDesc;
    } else {
      descList = [imageDesc];
    }

    // list: [{ url, desc, canDelete: false }]
    list = list.map((item, index) => ({
      url: item.image_url,
      desc: descList[index] || '',
      canDelete: item.canDelete || false,
    }));

    const editorList = (
      <ImageEditor
        globalConfig={globalConfig}
        uploadConfig={uploadConfig}
        className={b('image')}
        images={list}
        onEdit={onImageEdit}
        onChange={this.handleImageChange}
        onDelete={this.handleDeleteChange}
        showError={showError}
        error={(error && error.image) || ''}
      />
    );

    if (block) {
      return (
        <ControlGroup label={imageLabel} labelColored labelAlign="max-top" normalAlign>
          {editorList}
          {imageHelpText && (
            <HelpDesc className={b('image-help')} inline>
              {imageHelpText}
            </HelpDesc>
          )}
        </ControlGroup>
      );
    }

    return editorList;
  }

  /**
   * 不使用chooseMenu选择链接
   */
  renderClickTriggerContent() {
    const { data, showError, error } = this.props;

    return (
      <ControlGroup label="链接" showError={showError} error={(error && error.link) || ''}>
        {data.link_url ? (
          <div className="choosed-link-content">
            <span className="page-title">{data.link_title}</span>
            <span className="pointer-button" onClick={this.handleSettingLink}>
              修改
            </span>
          </div>
        ) : (
          <div className="setting-link">
            <span className="pointer-button" onClick={this.handleSettingLink}>
              选择微页面
            </span>
          </div>
        )}
      </ControlGroup>
    );
  }

  /**
   * 渲染选择链接
   */
  renderChooseMenu() {
    const {
      data,
      showError,
      error,
      helpText,
      globalConfig,
      settings,
      linkMenuItems,
      linkLabel,
      linkDisabled,
    } = this.props;

    const linkData = {
      link_id: data.link_id,
      link_type: data.link_type,
      link_title: data.link_title,
      link_url: data.link_url,
      alias: data.alias,
      extra_data: data.extra_data || {},
    };

    const weappHelpText = helpText || '该图片在小程序内点击不跳转';
    let help;
    let isWeappHelp = false;

    if (globalConfig.showDesignWeappNotice) {
      if (data && data.link_url) {
        // change: 增加对微信公众号文章链接的匹配
        const isVip = get(_global, 'has_order_weapp.isValid', false);
        if (isVip && data.link_url.match(/^(https||http):\/\/mp.weixin.qq.com\/s/)) {
          help = false;
        } else {
          help = getWeappNotSuppertedLinkMessage(data);
        }

        if (help) {
          isWeappHelp = true;
        } else {
          help = getH5NotSuppertedLinkMessage(data);
        }
      }
    }

    return (
      <ControlGroup
        label={linkLabel}
        labelColored
        normalAlign
        showError={showError}
        error={(error && error.link) || ''}
        helpDesc={
          help ? (
            <div className={b('help')}>
              <HelpIcon help={help} type="error-circle" />{' '}
              {isWeappHelp ? weappHelpText : '该图片只在小程序点击可跳转'}
            </div>
          ) : null
        }
      >
        {linkDisabled ? (
          <div className={b('link-disabled')}>{linkData.link_title}</div>
        ) : (
          <ChooseMenu
            globalConfig={globalConfig}
            settings={settings}
            value={linkData}
            onChange={this.onMenuChoose}
            linkMenuItems={linkMenuItems}
          />
        )}
      </ControlGroup>
    );
  }

  render() {
    const {
      data,
      showImage,
      showTitle,
      showDesc,
      showLink,
      showError,
      showContent,
      error,
      isClickTrigger,
      header: headerNode,
      showHeader,
      showHandler,
      block,
      titleLabel,
      titlePlaceholder,
      titleMaxLength,
      descLabel,
      descPlaceholder,
      descMaxLength,
      extra,
    } = this.props;
    const { title, desc } = data;
    const headerVisible = headerNode || showHeader;

    return (
      <div className={cx(b(), { [b('', 'block')]: block })}>
        {headerVisible && (
          <div className={b('header')}>
            <ControlGroup
              label={showHandler && <Icon className={b('handler')} type="drag-handler" />}
              normalAlign
            >
              {headerNode}
            </ControlGroup>
          </div>
        )}

        {showContent && headerNode && <div className={b('content-divider')} />}

        {showContent && (
          <div className={b('wrap')}>
            {!headerVisible && showHandler && (
              <Icon className={cx(b('handler'), b('handler', 'inline'))} type="drag-handler" />
            )}

            {showImage && !block && this.renderImageEditor()}

            <div className={b('content')}>
              {showTitle && (
                <ControlGroup
                  label={titleLabel}
                  labelColored
                  normalAlign
                  showError={showError}
                  error={(error && error.title) || ''}
                >
                  <Input
                    name="title"
                    value={title || ''}
                    onChange={this.handleInputChange}
                    placeholder={titlePlaceholder || ''}
                    maxLength={titleMaxLength}
                  />
                </ControlGroup>
              )}

              {showDesc && (
                <ControlGroup
                  label={descLabel}
                  labelColored
                  normalAlign
                  showError={showError}
                  error={(error && error.desc) || ''}
                >
                  <Input
                    name="desc"
                    value={desc || ''}
                    onChange={this.handleInputChange}
                    placeholder={descPlaceholder || ''}
                    maxLength={descMaxLength}
                  />
                </ControlGroup>
              )}

              {showImage && block && this.renderImageEditor()}

              {block && extra}

              {(isClickTrigger || showLink) && block && <div className={b('link-divider')} />}

              {isClickTrigger
                ? this.renderClickTriggerContent()
                : showLink && this.renderChooseMenu()}

              {!block && extra}
            </div>
          </div>
        )}
      </div>
    );
  }
}
