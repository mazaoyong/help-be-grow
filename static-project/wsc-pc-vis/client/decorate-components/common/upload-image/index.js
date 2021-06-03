import React from 'react';
import ReactDOM from 'react-dom';
import Upload from 'shared/components/upload';

export default {
  initialize(options) {
    let modalEle;

    if (!this._initialized) {
      this._initialized = true;

      modalEle = document.createElement('div');
      modalEle.setAttribute('id', 'upload-container');
      document.body.appendChild(modalEle);
    } else {
      modalEle = document.getElementById('upload-container');
      ReactDOM.unmountComponentAtNode(modalEle);
    }

    ReactDOM.render(
      <Upload
        type={options.type || 'image'}
        materials
        auto
        className="rc-richtext__upload"
        triggerClassName="rc-richtext__upload-trigger"
        {...(options.uploadConfig || {})}
        maxAmount={options.maxAmount}
        maxSize={options.maxSize || 3 * 1024 * 1024}
        imgcdn={options.imgcdn}
        accept={options.accept || 'image/gif, image/jpeg, image/png'}
        onSuccess={data => options.callback.call(this, data)}
      />,
      modalEle
    );
  },
};
