import React from 'react';
import ReactDOM from 'react-dom';
import BrowserNotSupport from '../components/browser-not-support';
import { compatibleBrowser } from '../utils/ua';

export const checkCompatibleBrowser = () => {
  const isCompatibleBrowser = compatibleBrowser();
  if (!isCompatibleBrowser) {
    const browserContainer = document.createElement('div');
    browserContainer.id = 'wsc-decorate-updgrade';
    document.body.appendChild(browserContainer);

    ReactDOM.render(React.createElement(BrowserNotSupport), browserContainer);
  }
};
