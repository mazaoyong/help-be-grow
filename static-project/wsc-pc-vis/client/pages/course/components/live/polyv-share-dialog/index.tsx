import React from 'react';
import { Dialog, Input, CopyButton, Notify } from 'zent';
import './style.scss';

const { openDialog } = Dialog;

function PolyvShareDialog(props) {
  const { url, channelId, code } = props;

  return (
    <div className="polyv-share-dailog">
      <div>
        <span className="polyv-share-dailog__label">网页直播：</span>
        <Input
          value={url}
          inline
          disabled
        />
        <span className="ml-8">
          <CopyButton
            text={url}
            onCopySuccess={() => {
              Notify.success('复制成功');
            }}
            onCopyError={() => {
              Notify.error('复制失败');
            }}
          >
            <span className="ui-link--split">复制</span>
          </CopyButton>
          <a className="ui-link--split" href={url} target="blank">访问链接</a>
        </span>
      </div>
      <div className="mt-16">
        <span className="polyv-share-dailog__label">频道号：</span>
        <span className="polyv-share-dailog__value">{ channelId }</span>
      </div>
      <div className="mt-8">
        <span className="polyv-share-dailog__label">密码：</span>
        <span className="polyv-share-dailog__value">
          {
            code || (
              <span>密码获取失败，请前往 <a className="ui-link--split" href="https://live.polyv.net/#/channel" target="_blank" rel="noopener noreferrer">保利威管理后台</a> 查看</span>
            )
          }
        </span>
      </div>
    </div>
  );
}

export default function showPolyvShareDialog(url, channelId, code) {
  const dialogId = 'polyv-share-dialog';

  openDialog({
    dialogId,
    maskClosable: false,
    title: '前往直播',
    children: <PolyvShareDialog url={url} channelId={channelId} code={code} />,
  });
}
