
import { Form } from '@zent/compat';
import React, { Component } from 'react';
import { Richtext } from '@youzan/react-components';
import { SCENES } from '@youzan/ckt-design';
import { isEduSingleStore } from '@youzan/utils-shop';
import { UEDITOR_TOOLBARS_M, UEDITOR_TOOLBARS_S } from 'constants/ueditor-toolbars';
import './style.scss';
import { ArthurContainer } from '@youzan/arthur-scheduler-react';

const { getControlGroup } = Form;

class RichTextField extends Component {
  onChange = val => {
    this.props.onChange(val);
  };

  render() {
    const { v4, cdnStatic } = _global.url;
    const { editorConfig = {} } = this.props;
    const { initialFrameWidth = 680 } = editorConfig;

    let size = 'M';
    if (initialFrameWidth < 680) size = 'S';

    return (
      <ArthurContainer name="common.pictureMaterial" namespace="shop">
        {
          (model) => {
            const maxSize = model.maxSize ? model.maxSize / (1024 * 1024) : 3;
            return <Richtext
              ueditorUrl={`${cdnStatic}/v2/vendor/ueditor/release/ueditor.all.min.202002232235.js`}
              uploadConfig={Object.assign({}, {
                maxSize: maxSize * 1024 * 1024,
                fetchUrl: `${v4}/api/iron/materials/shopPubImg.json`,
                tokenUrl: `${v4}/api/iron/materials/shopPubImgUploadToken.json`,
              }, this.props.ckt ? {
                ckt: isEduSingleStore,
                cktProps: {
                  auth: true,
                  scene: SCENES.LONG_POSTER,
                  chuangKitDesignOption: {
                    show_history_design: 1,
                  },
                },
              } : {})}
              {...this.props}
              editorConfig={{
                wordCount: false,
                fetchImgUrl: `${v4}/api/iron/materials/shopPubImg.json`,
                toolbars: size === 'S' ? UEDITOR_TOOLBARS_S : UEDITOR_TOOLBARS_M,
                initialFrameWidth,
                ...editorConfig,
              }}
            />;
          }
        }
      </ArthurContainer>
    );
  }
}

export default getControlGroup(RichTextField);

export { RichTextField as RichText };
