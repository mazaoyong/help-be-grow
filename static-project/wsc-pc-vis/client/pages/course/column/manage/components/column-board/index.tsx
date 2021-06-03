/* eslint-disable import/no-duplicates */
/* eslint-disable camelcase */
import React, { FC, useCallback } from 'react';
import { Notify, Dialog, Sweetalert } from 'zent';
import { Form } from '@zent/compat';
import { get } from 'lodash';
import ListActionMenu, { IConfigItem } from 'components/list-action-menu';
import { IColumnData } from '../../model';
import InviteFriend from '../../../../components/invite-friend';
import { openDialog as openDeleteDialog } from '../../../../components/pct-delete-dialog';
import { chainSupportHqAndSingleAndMinifyHq } from '../../../../common/chain';
import { updateShareStatus, updateOnSaleStatus, deleteColumn } from '../../../common/api';
import openShortenUrlPromotionDlg from 'components/open-promotion-dialog';
import './style.scss';
import { compareVersion } from 'shared/fns/compare-version';

const { openDialog, closeDialog } = Dialog;
const { createForm } = Form;
const DIALOG_ID = 'invite-friend';

interface IProps {
  data: IColumnData;
  hideBdapp: boolean;
  onGetDetail: () => void;
  onChangeUpdate: () => void;
}

const ActionBar: FC<IProps> = (props) => {
  const { onChangeUpdate, data, onGetDetail, hideBdapp } = props;
  const {
    alias,
    cover,
    contentsCount,
    price,
    status,
    summary,
    title,
    isUpdate,
    isShared,
    publishAt,
    redirectUrl,
    subscriptionsCount,
  } = data;

  const deleteColumnItem = useCallback(() => {
    const errMsg = '删除失败';

    deleteColumn({
      alias,
    })
      .then(() => {
        window.location.href = `${window._global.url.v4}/vis/course/column/list`;
      })
      .catch(msg => {
        Notify.error(msg || errMsg);
      });
  }, [alias]);

  const handleDeleteColumnClick = useCallback(() => {
    openDeleteDialog({
      alias,
      type: 'column',
      onDelete: deleteColumnItem,
    });
  }, [alias, deleteColumnItem]);

  const publish = useCallback((updateStatus) => {
    const errMsg = `${status === 1 ? '上架' : '下架'}失败`;
    updateOnSaleStatus(alias, updateStatus)
      .then(() => {
        onGetDetail();
      })
      .catch(msg => {
        Notify.error(msg || errMsg);
      });
  }, [alias, status, onGetDetail]);

  const handlePublishClick = useCallback(() => {
    const updateStatus = status === 1 ? 2 : 1;
    if (updateStatus === 1) {
      publish(updateStatus);
      return;
    }

    Sweetalert.confirm({
      content:
        '专栏下架后，已购买专栏的用户仍旧可以查看本专栏。未购买的用户将无法购买此专栏，确定下架吗？',
      title: '下架专栏',
      className: 'dialog-450',
      closeBtn: true,
      onConfirm: () => {
        publish(updateStatus);
      },
    });
  }, [status, publish]);

  const inviteFriend = useCallback((formVal?) => {
    const errMsg = `${status === 0 ? '开启请好友看' : '关闭请好友看'}失败`;

    updateShareStatus({
      alias,
      isShared: isShared === 0 ? 1 : 0,
      everyFriendContentCount: get(formVal, 'every_friend_content_count', null),
      everyContentFriendCount: get(formVal, 'every_content_friend_count', null),
    })
      .then(() => {
        onGetDetail();
      })
      .catch(msg => {
        Notify.error(msg || errMsg);
      });
  }, [alias, isShared, status, onGetDetail]);

  const handleInviteFriend = useCallback(() => {
    if (isShared === 1) {
      inviteFriend();
      return;
    }
    const WrappedForm = createForm({ scrollToError: true })(InviteFriend);
    openDialog({
      dialogId: DIALOG_ID,
      title: '开启请好友看',
      children: (
        <WrappedForm
          closeClick={() => closeDialog(DIALOG_ID)}
          submitForm={inviteFriend}
        />
      ),
      className: 'dialog-535',
    });
  }, [isShared, inviteFriend]);

  const recommendUrl =
    `/v4/vis/pct/page#/goods-recommend/preview/?mode=0&alias=${alias}&relatedAlias=&type=1`;
  const webViewPath = `packages/edu/webview/index?targetUrl=${encodeURIComponent(
    `https://h5.youzan.com/wscvis/course/detail/${alias}?kdt_id=${_global.kdtId}`,
  )}`;
  const weappVersion = get(window._global, 'weappVersion.releasedVersion');
  const hasWeappBinded = weappVersion && compareVersion(weappVersion, '2.37.5') >= 0;
  const config: IConfigItem[] = [
    {
      title: (
        // <Promotion
        //   data={{
        //     url: redirectUrl,
        //     alias,
        //     name: title,
        //     pagepath: `packages/edu/webview/index?targetUrl=${encodeURIComponent(
        //       `https://h5.youzan.com/wscvis/course/detail/${alias}?kdt_id=${_global.kdtId}`,
        //     )}`,
        //     webviewPath: `/packages/edu/webview/index?targetUrl=${encodeURIComponent(
        //       `https://h5.youzan.com/wscvis/course/detail/${alias}?kdt_id=${_global.kdtId}`,
        //     )}`,
        //     hideBdapp: hideBdapp,
        //   }}
        // >
        //   <span>推广</span>
        // </Promotion>
        <a onClick={() => openShortenUrlPromotionDlg({
          h5Url: redirectUrl,
          mode: 'qrcode',
          title,
          supportBaiduApp: !hideBdapp,
          supportWeapp: hasWeappBinded,
          weappConfig: {
            hasBoundApp: hasWeappBinded,
            hasOrderedApp: hasWeappBinded,
          },
          weappUrl: `pages/common/blank-page/index?weappSharePath=${encodeURIComponent(webViewPath)}`,
          baiduAppUrl: `/${webViewPath}`,
          weAppProps: {
            path: webViewPath,
            alias,
          },
          baiduAppProps: {
            path: webViewPath,
            alias,
          }
        })}>
          推广
        </a>
      ),
    },
    {
      title: isShared === 0 ? '开启请好友看' : '关闭请好友看',
      onClick: handleInviteFriend,
      show: chainSupportHqAndSingleAndMinifyHq,
    },
    {
      title: '编辑',
      onClick: () => {
        window.open(`${window._global.url.v4}/vis/course/column/edit/${alias}`);
      },
      show: chainSupportHqAndSingleAndMinifyHq,
    },
    {
      title: '关联商品推荐',
      onClick: () => window.open(recommendUrl),
      show: chainSupportHqAndSingleAndMinifyHq,
    },
    {
      title: status === 1 ? '下架' : '上架',
      onClick: handlePublishClick,
      show: chainSupportHqAndSingleAndMinifyHq,
    },
    {
      title: isUpdate === 1 ? '停止更新' : '开启更新',
      onClick: onChangeUpdate,
      show: chainSupportHqAndSingleAndMinifyHq,
    },
    {
      title: '删除',
      onClick: handleDeleteColumnClick,
      show: chainSupportHqAndSingleAndMinifyHq,
    },
  ];

  return (
    <div className="column-info-wrap">
      <div className="column-info clearfix">
        <div className="cover-box">
          <img src={cover} alt="" role="presentation" />
        </div>
        <div className="column-content">
          <h3 className="title">{title}</h3>
          <span className={`sell-status ${status === 1 ? 'active-status' : 'nagtive-status'}`}>{status === 1 ? '出售中' : '已停售'}</span>
          <span className={`sell-status ${isUpdate === 0 ? 'disable-status' : 'active-status'}`}>{isUpdate === 0 ? '已完结' : '更新中'}</span>
          <p className="summary">{summary}</p>
          <div className="bottom-info">
            <p>
              <span>
                {isUpdate === 1 ? '已更新：' : '共：'} {contentsCount} 期
              </span>
              <span style={{ color: '#C8C9CC' }}>|</span>
              <span>
                已售：
                {subscriptionsCount}
              </span>
              {
                status === 1 && (
                  <>
                    <span style={{ color: '#C8C9CC' }}>|</span>
                    <span>
                      开售时间：
                      {publishAt}
                    </span>
                  </>
                )
              }
            </p>
            <p className="price">¥ {(price / 100).toFixed(2)}</p>
          </div>
          <div className="menus">
            <ListActionMenu config={config} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActionBar;
