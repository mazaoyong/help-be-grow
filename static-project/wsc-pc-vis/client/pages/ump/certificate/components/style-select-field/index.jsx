
import { Form } from '@zent/compat';
import React, { PureComponent } from 'react';
import { Upload } from '@youzan/react-components';
import './styles.scss';

const { getControlGroup } = Form;

const admissionStyleUrls = [
  'https://img.yzcdn.cn/publicPath/20190422/cert-ad-basic.png',
  'https://img.yzcdn.cn/publicPath/20190422/cert-ad-impressive.png',
  'https://img.yzcdn.cn/publicPath/20190422/cert-ad-sweety.png',
];

const graduationStyleUrls = [
  'https://img.yzcdn.cn/publicPath/20190422/cert-post-basic.png',
  'https://img.yzcdn.cn/publicPath/20190422/cert-post-impressive.png',
  'https://img.yzcdn.cn/publicPath/20190422/cert-post-sweety.png',
];

const admissionTemplateLink = 'https://b.yzcdn.cn/public_files/99bfa912b081c5c1d3c15e1b0101e653.psd?attname=入学证书模板.psd';
const graduationTemplateLink = 'https://b.yzcdn.cn/public_files/0542e608007cea040144e490001e3afc.psd?attname=毕业证书模板.psd';

const checkCirle = 'https://b.yzcdn.cn/public_files/4dc2cc7b667ad7e29454ec81496becdb.png';

function StyleImage(props) {
  const { url, onSelect, selected } = props;
  return (
    <a className="certificate-style-item" href="javascript: void(0)" onClick={onSelect}>
      <img src={url} alt="" />
      {selected
        ? <div className="certificate-selected">
          <img src={checkCirle} alt="" />
        </div>
        : null}
    </a>
  );
}

function CustomStyleImage(props) {
  const { value, onAdd, onRemove, onSelect, selected } = props;
  if (value) {
    return (
      <a className="certificate-style-item" href="javascript: void(0)" onClick={onSelect}>
        <img width="80" height="128" src={value} />
        <span className="certificate-upload_a" onClick={onRemove}>
          ×
        </span>
        {selected
          ? <div className="certificate-selected">
            <img src={checkCirle} alt="" />
          </div>
          : null}
      </a>
    );
  }
  return (
    <Upload
      triggerClassName="certificate-upload certificate-style-custom"
      maxSize={1 * 1024 * 1024}
      maxAmount={1}
      materials
      kdtId={window._global.kdtId}
      imgcdn="https://img.yzcdn.cn"
      tokenUrl="https://materials.youzan.com/shop/pubImgUploadToken.json"
      onSuccess={onAdd}
    />
  );
}

class StyleSelectField extends PureComponent {
  render() {
    const { type } = this.props;
    const { bgUrl } = this.props.value || {};
    const { bgNo } = this.props.value || {};

    const isGraduation = type === 'graduation';
    const defaultUrls = isGraduation ? graduationStyleUrls : admissionStyleUrls;
    const templateLink = isGraduation ? graduationTemplateLink : admissionTemplateLink;
    const defaultImages = defaultUrls.map((url, index) => (
      <StyleImage
        key={index}
        index={index}
        url={url}
        onSelect={this.handleSelect(index + 1)}
        selected={bgNo === index + 1}
      />
    ));
    return (
      <>
        <div className="certificate-style-select">
          {defaultImages}
          <CustomStyleImage
            value={bgUrl}
            onAdd={this.handleBgUrlAdd}
            onRemove={this.handleBgUrlRemove}
            onSelect={this.handleSelect(0)}
            selected={bgNo === 0}
          />
        </div>
        <div className="certificate-help-desc">
          建议尺寸：315*500像素
        </div>
        <a className="certificate-download-link" href={templateLink} download>
          下载海报模板
        </a>
      </>
    );
  }

  handleBgUrlAdd = data => {
    const bgUrl = this.replaceHttpsPrefix(data && data[0] && data[0].attachment_url);
    this.handleChange({ bgUrl });
  }

  handleBgUrlRemove = e => {
    e.stopPropagation();
    this.handleChange({ bgNo: 1, bgUrl: '' });
  }

  handleSelect = bgNo => () => {
    this.handleChange({ bgNo });
  }

  handleChange = data => {
    const value = Object.assign({}, this.props.value || {}, data);
    this.props.onChange(value);
  }

  replaceHttpsPrefix(url) {
    return (url || '').replace('http:', 'https:');
  }
}

export default getControlGroup(StyleSelectField);
