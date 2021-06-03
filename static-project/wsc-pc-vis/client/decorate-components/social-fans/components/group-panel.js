import { Pop } from '@zent/compat';
import React from 'react';
import { Radio, Icon, Input } from 'zent';
import { ControlGroup, Divider, ImageEditor, ColorPicker } from '../../common';
import fullfillImage from '@youzan/utils/fullfillImage';
import { openLiveQrcode } from './qrcode-dialog';
import {
  LOGO_TYPE,
  DEFAULT_BACKGROUND,
  SCENE,
  PLACEHOLDER_BTN_NAME,
  PLACEHOLDER_TITLE,
} from '../constants';

const prefix = 'decorate-official-account-editor';

const handleImageChange = (onCustomInputChange, filed) => data => {
  onCustomInputChange(filed)(data.attachment_url);
};

const handleChooseQrcode = onChange => () => {
  openLiveQrcode().then(liveQrcode => {
    if (!liveQrcode || !liveQrcode.length) {
      return;
    }

    /**
     * baseQrCodeNum: 1
      id: 3625
      name: "测试"
      remark: ""
      scene: "WeiXinGroup"
      url: "https://img.yzcdn.cn/upload_files/2019/02/18/FokgQMvsmpzyNZLk1Og_NpK5zphY.png"
      */
    const [qrcodeItem] = liveQrcode;
    const { id = 0, url = '', name = '', scene = SCENE.WeiXin } = qrcodeItem;

    onChange({
      scene,
      qrcode: id,
      qrcodeUrl: url,
      qrcodeName: name,
    });
  });
};

export const GroupPanel = props => {
  const {
    value,
    showError,
    validation,
    globalConfig,
    onChange,
    onInputChange,
    onCustomInputChange,
    uploadConfig,
  } = props;
  const {
    qrcodeUrl = '',
    qrcodeName = '',
    btnName,
    title,
    desc,
    logoType = LOGO_TYPE.default,
    logo,
    customLogo,
    scene,
    bgColor = DEFAULT_BACKGROUND,
  } = value;

  let titlePlaceholder = PLACEHOLDER_TITLE.none;
  if (scene) {
    if (scene === SCENE.WeiXin) {
      titlePlaceholder = PLACEHOLDER_TITLE.person;
    } else {
      titlePlaceholder = PLACEHOLDER_TITLE.group;
    }
  }

  return (
    <div>
      <ControlGroup
        label={
          <div>
            添加活码
            <Pop
              trigger="hover"
              content={
                <p>
                  活码是用户推广个人微信号或粉丝群的二维码，适用于线上线下，吸引用户添加好友或粉丝群进行长期维护的场景
                </p>
              }
              centerArrow
            >
              <Icon type="help-circle" className={`${prefix}__help-icon`} />
            </Pop>
          </div>
        }
        focusOnLabelClick={false}
        showError={showError}
        error={validation.qrcode}
        block
      >
        {qrcodeUrl ? (
          <div className={`${prefix}__qrcode`}>
            <div className="has-choosed-image">
              <img
                className="thumb-image"
                src={fullfillImage(qrcodeUrl, '!100x100+2x.jpg', globalConfig.url)}
                alt=""
                width="80"
                height="80"
              />
              <span className="modify-image" onClick={handleChooseQrcode(onChange)}>
                更换活码
              </span>
            </div>
            <span className={`${prefix}__qrcodeName`}>{qrcodeName}</span>
          </div>
        ) : (
          // 这里要加一下活码的标题
          <div className="deco-control-group__content" onClick={handleChooseQrcode(onChange)}>
            <div className="zent-sortable deco-editor-card rc-design-component-image-ad-editor-card">
              <div className="deco-editor-card-add deco-editor-card--disable-drag">
                <i className="zenticon zenticon-plus deco-editor-card-add-icon" />
                <span className="deco-editor-card-add-text">添加活码</span>
              </div>
            </div>
          </div>
        )}
      </ControlGroup>

      <Divider />

      <ControlGroup label="添加文案" />

      <ControlGroup
        label="按钮名称"
        showError={showError || this.getMetaProperty('btnName', 'touched')}
        error={validation.btnName}
        block
        labelColored
        required
      >
        <Input
          name="btnName"
          placeholder={
            scene === SCENE.WeiXinGroup ? PLACEHOLDER_BTN_NAME.group : PLACEHOLDER_BTN_NAME.person
          }
          value={btnName}
          onChange={onInputChange}
        />
      </ControlGroup>

      <ControlGroup
        label="标题"
        showError={showError || this.getMetaProperty('title', 'touched')}
        error={validation.title}
        block
        labelColored
        required
      >
        <Input name="title" placeholder={titlePlaceholder} value={title} onChange={onInputChange} />
      </ControlGroup>

      <ControlGroup
        label="描述"
        showError={showError || this.getMetaProperty('desc', 'touched')}
        error={validation.desc}
        block
        labelColored
        required
      >
        <Input name="desc" placeholder="请添加描述" value={desc} onChange={onInputChange} />
      </ControlGroup>

      <Divider />

      <ControlGroup label="入口图片">
        <Radio.Group onChange={onInputChange} value={logoType}>
          <Radio value={LOGO_TYPE.default} name="logoType">
            默认图片
          </Radio>
          <Radio value={LOGO_TYPE.custom} name="logoType">
            自定义图片
          </Radio>
        </Radio.Group>
      </ControlGroup>

      {logoType === LOGO_TYPE.default && (
        <div className={`${prefix}__logo has-choosed-image`}>
          <img
            className="thumb-image"
            src={fullfillImage(logo, '!160x160+2x.jpg', globalConfig.url)}
            alt=""
            width="80"
            height="80"
          />
        </div>
      )}

      {logoType === LOGO_TYPE.custom && (
        <ControlGroup
          className={`${prefix}__img-ctrl`}
          showError={showError}
          error={validation.logo}
          label="入口图建议比例1：1"
          block
        >
          <ImageEditor
            globalConfig={window._global}
            uploadConfig={uploadConfig}
            className="image-editor"
            imageUrl={customLogo}
            onChange={handleImageChange(onCustomInputChange, 'customLogo')}
          />
        </ControlGroup>
      )}

      <Divider />

      <ControlGroup label="背景颜色" className={`${prefix}__background`} value={bgColor}>
        <ColorPicker
          defaultColor={DEFAULT_BACKGROUND}
          color={bgColor}
          onChange={onCustomInputChange('bgColor')}
        />
      </ControlGroup>
    </div>
  );
};
