/* eslint-disable camelcase */
// 操作按钮
import React, { FC, useCallback } from 'react';
import { Dialog, Notify, Sweetalert } from 'zent';
import { Form } from '@zent/compat';
import { get } from 'lodash';
import { isInStoreCondition } from 'fns/chain';
import ListActionMenu, { IConfigItem } from 'components/list-action-menu';
import { LockWrap } from '@youzan/ebiz-components';
import { LockType } from '@youzan/ebiz-components/es/lock-wrap';
import InvietFriend from '../../../../components/invite-friend';
import { updateShareStatus, updateSerializedStatus, updateOnSaleStatus, deleteColumn } from '../../../common/api';
import { copy, updateShowOrHideStatus } from './api';
import { IColumnItem } from '../../model';
import { chainSupportHqAndSingleAndMinifyHq, chainSupportBranch, chainSupportOnlyHq } from '../../../../common/chain';
import { openDialog as openDeleteDialog } from '../../../../components/pct-delete-dialog';
import openShortenUrlPromotionDlg from 'components/open-promotion-dialog';
import { compareVersion } from 'shared/fns/compare-version';

const { openDialog, closeDialog } = Dialog;
const DIALOG_ID = 'invite-friend-dialog';
const { createForm } = Form;

const isUnifiedShop = isInStoreCondition({ supportUnifiedShop: true });

interface IProps {
  item: IColumnItem;
  hideBdapp: boolean;
  reload: () => void;
}

export const SHOW_IN_STORE = {
  all: '全部',
  0: '隐藏',
  1: '显示',
};

const ActionMenu: FC<IProps> = (props: IProps) => {
  const { item, hideBdapp, reload } = props;
  const {
    is_lock: isLock,
    alias,
    goods_id,
    status,
    column_type: columnType,
    is_shared: isShared,
    is_update: isUpdate,
    show_in_store: showInStore,
  } = item;
  const isFxColumn = columnType === 1;

  // 请好友看
  const inviteFriend = useCallback((alias, isShared, formVal?) => {
    updateShareStatus({
      alias,
      isShared: isShared === 0 ? 1 : 0,
      everyFriendContentCount: get(formVal, 'every_friend_content_count', null),
      everyContentFriendCount: get(formVal, 'every_content_friend_count', null),
    })
      .then(() => {
        reload();
      })
      .catch(msg => {
        Notify.error(msg || `${isShared === 0 ? '开启请好友看' : '关闭请好友看'}失败`);
      });
  }, [reload]);

  // 请好友看
  const handleInviteFriend = useCallback(() => {
    if (isShared === 1) {
      inviteFriend(alias, isShared);
      return;
    }
    const WrappedForm = createForm({ scrollToError: true })(InvietFriend);
    openDialog({
      dialogId: DIALOG_ID,
      title: '开启请好友看',
      children: (
        <WrappedForm
          closeClick={() => closeDialog(DIALOG_ID)}
          submitForm={formVal => inviteFriend(alias, isShared, formVal)}
        />
      ),
      className: 'dialog-535',
    });
  }, [alias, isShared, inviteFriend]);

  // 开启、停止更新
  const handleChangeUpdate = useCallback(() => {
    updateSerializedStatus(alias, isUpdate)
      .then(() => {
        reload();
      })
      .catch(msg => {
        Notify.error(msg || `${isUpdate ? '开启更新' : '停止更新'}失败`);
      });
  }, [alias, isUpdate, reload]);

  // 复制专栏
  const duplicateColumn = useCallback(() => {
    copy({ alias })
      .then(data => {
        if (data) {
          Notify.success('复制专栏成功');
          reload();
        }
      })
      .catch(err => {
        Notify.error(err);
      });
  }, [alias, reload]);

  // 上架、停止销售
  const publish = useCallback(() => {
    updateOnSaleStatus(alias, status === 1 ? 2 : 1)
      .then(() => {
        reload();
      })
      .catch(msg => {
        Notify.error(msg || `${status === 1 ? '停止销售' : '上架销售'}失败`);
      });
  }, [alias, status, reload]);

  // 上架、停止销售
  const handleChangePublish = useCallback(() => {
    // 停售状态或未开售状态
    if (status === 2 || status === 3) {
      publish();
      return;
    }

    Sweetalert.confirm({
      content: '停售后已购买专栏的消费者仍旧可以查看，未购买的消费者将无法购买，确定停售吗？',
      title: '确定停售',
      className: 'dialog-450',
      closeBtn: true,
      onConfirm: publish,
    });
  }, [status, publish]);

  // 隐藏
  const hide = useCallback(() => {
    updateShowOrHideStatus({ alias })
      .then(() => {
        reload();
      })
      .catch(msg => {
        Notify.error(msg);
      });
  }, [alias, reload]);

  // 隐藏
  const handleChangeHide = useCallback(() => {
    if (showInStore === 1) {
      Sweetalert.confirm({
        content:
          '隐藏专栏或者内容后，对应的专栏或者内容将不在店铺内显示，但是可以通过链接的方式被访问，确定隐藏？',
        title: '隐藏',
        className: 'dialog-450',
        closeBtn: true,
        onConfirm: hide,
      });
    } else {
      hide();
    }
  }, [showInStore, hide]);

  const deleteItem = useCallback(() => {
    deleteColumn({ alias })
      .then(() => {
        reload();
      })
      .catch(msg => {
        Notify.error(msg || '删除失败');
      });
  }, [alias, reload]);

  const handleDeleteClick = useCallback(() => {
    openDeleteDialog({
      type: 'column',
      alias,
      onDelete: deleteItem,
    });
  }, [alias, deleteItem]);

  const webViewPath = `packages/edu/webview/index?targetUrl=${encodeURIComponent(
    `https://h5.youzan.com/wscvis/course/detail/${alias}?kdt_id=${_global.kdtId}`,
  )}`;
  const weappVersion = get(window._global, 'weappVersion.releasedVersion');
  const hasWeappBinded = weappVersion && compareVersion(weappVersion, '2.37.5') >= 0;

  const config: IConfigItem[] = [
    {
      title: <a href={`/v4/vis/course/column/manage/${alias}`}>内容管理</a>,
      showLock: true,
      isLock,
      show: !isFxColumn,
    },
    {
      title: (
        <a href={`/v4/vis/course/column/edit/${alias}`} rel="noopener noreferrer" target='_blank'>
          编辑
        </a>
      ),
      show: !isFxColumn,
    },
    {
      title: (
        // <Promotion
        //   data={{
        //     url: item.redirect_url,
        //     alias,
        //     name: item.title,
        //     pagepath: `packages/edu/webview/index?targetUrl=${encodeURIComponent(
        //       `https://h5.youzan.com/wscvis/course/detail/${alias}?kdt_id=${_global.kdtId}`,
        //     )}`,
        //     webviewPath: `/packages/edu/webview/index?targetUrl=${encodeURIComponent(
        //       `https://h5.youzan.com/wscvis/course/detail/${alias}?kdt_id=${_global.kdtId}`,
        //     )}`,
        //     hideBdapp,
        //   }}
        // >
        <LockWrap lockType={LockType.PCT_GOODS} isLock={isLock} onClick={() => openShortenUrlPromotionDlg({
          h5Url: item.redirect_url,
          mode: 'qrcode',
          title: item.title,
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
        </LockWrap>
        // </Promotion>
      ),
    },
  ];

  if (chainSupportHqAndSingleAndMinifyHq) {
    config.push({
      title: '学习记录',
      onClick: () => window.open(`${_global.url.v4}/vis/course/column/record?courseType=1&courseId=${goods_id}`),
      showLock: true,
      isLock,
      show: !chainSupportOnlyHq,
    }, {
      title: item.is_shared === 0 ? '开启请好友看' : '关闭请好友看',
      onClick: handleInviteFriend,
      showLock: true,
      isLock,
      show: !isFxColumn,
    }, {
      title: '关联商品推荐',
      onClick: () => window.open(`/v4/vis/pct/page/goodsrecommend#/goods-recommend/preview/?mode=0&alias=${alias}&relatedAlias=&type=1`),
      showLock: true,
      isLock,
      show: !isFxColumn,
    }, {
      title: item.is_update === 0 ? '开启更新' : '停止更新',
      onClick: handleChangeUpdate,
      showLock: true,
      isLock,
      show: !isFxColumn,
    }, {
      title: '复制',
      onClick: duplicateColumn,
      showLock: true,
      isLock,
      show: !columnType,
    }, {
      title: status === 1 ? '停止销售' : '上架销售',
      onClick: handleChangePublish,
      show: !!status,
    }, {
      title: showInStore === 1 ? '隐藏' : '显示',
      onClick: handleChangeHide,
      show: isUnifiedShop,
    }, {
      title: '删除',
      onClick: handleDeleteClick,
    });
  } else if (chainSupportBranch) {
    config.push(
      {
        title: '学习记录',
        onClick: () => window.open(`${_global.url.v4}/vis/course/column/record?courseType=1&courseId=${goods_id}`),
        showLock: true,
        isLock,
        // show: _global.isYZEdu,
      },
      {
        title: status === 1 ? '停止销售' : '上架销售',
        onClick: handleChangePublish,
        show: !!status && isFxColumn,
      },
      {
        title: showInStore === 1 ? '隐藏' : '显示',
        onClick: handleChangeHide,
        show: isUnifiedShop,
      },
      {
        title: '删除',
        onClick: handleDeleteClick,
        show: isFxColumn,
      },
    );
  }

  return (
    <ListActionMenu
      config={config}
    />
  );
};

export default ActionMenu;
