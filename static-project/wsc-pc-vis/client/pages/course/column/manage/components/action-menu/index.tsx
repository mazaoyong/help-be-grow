import { Pop } from '@zent/compat';
/* eslint-disable camelcase */
// 操作按钮
import React, { FC, useCallback } from 'react';
import { Notify } from 'zent';
import ListActionMenu, { IConfigItem } from 'components/list-action-menu';
import { LockWrap } from '@youzan/ebiz-components';
import { LockType } from '@youzan/ebiz-components/es/lock-wrap';
import { deleteContentDetail, postContentFree } from './api';
import { IColumnItem } from '../../model';
import renderItemStatus from '../../../common/utils/render-item-status';
import { isVideoContent, getTrialText } from '../../../../common/helper';
import { openDialog as openDeleteDialog } from '../../../../components/pct-delete-dialog';
import LiveActionMenu from '../../../../components/live/action-menu';
import { chainSupportHqAndSingleAndMinifyHq } from '../../../../common/chain';
// import { isInStoreCondition } from 'fns/chain';
import { MEDIA_TYPE_MAP } from '../../../../constants/map';
import { ILiveItem } from '../../../../live/list/model';
import openDirectoryMoveDialog from '../directory-move-dialog';
import { directoryMoveContent } from '../../api';
import openShortenUrlPromotionDlg from 'components/open-promotion-dialog';
import { get } from 'lodash';
import { compareVersion } from 'shared/fns/compare-version';

interface IProps {
  item: IColumnItem | ILiveItem;
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
    is_free: isFree,
    media_type: mediaType,
    alias,
    directory_id,
    column_alias: columnAlias,
    redirect_url: redirectUrl,
    title,
  } = item as IColumnItem;
  const deleteContent = useCallback(() => {
    const errMsg = '删除失败';
    deleteContentDetail({ alias })
      .then(() => {
        reload();
      })
      .catch(msg => {
        Notify.error(msg || errMsg);
      });
  }, [alias, reload]);

  const handleDeleteClick = useCallback(() => {
    openDeleteDialog({
      alias,
      type: 'content',
      onDelete: deleteContent,
    });
  }, [alias, deleteContent]);

  const free = useCallback(() => {
    const updateStatus = isFree ? 0 : 1;
    postContentFree({
      alias,
      freeStatus: updateStatus,
    })
      .then(() => {
        reload();
      })
      .catch(msg => {
        Notify.error(msg || `${updateStatus === 1 ? '免费试读' : '取消试读'}失败`);
      });
  }, [alias, isFree, reload]);

  const moveContent = useCallback(() => {
    openDirectoryMoveDialog({
      enableType: 'leaf',
      showUnClassify: true,
      onConfirm: targetNode => {
        const moveContentDTO = {
          id: targetNode.id,
          columnAlias,
          // eslint-disable-next-line camelcase
          contentList: [
            {
              alias,
              mediaType: mediaType,
              directoryId: directory_id,
            },
          ],
        };
        return directoryMoveContent({
          moveContentDTO,
        })
          .then(() => {
            Notify.success('移动内容中，请手动刷新列表');
            reload();
          })
          .catch(err => Notify.error(err || '未找到目录'));
      },
      columnAlias,
    });
  }, [alias, columnAlias, directory_id, mediaType, reload]);

  if (mediaType === 4) {
    return (
      <LiveActionMenu
        isColumn
        maxDisplayItemNum={3}
        item={item as ILiveItem}
        hideBdapp={hideBdapp}
        reload={reload}
        onContentMove={moveContent}
      />
    );
  }

  const trialText = getTrialText(mediaType);
  const isVideo = isVideoContent(item);
  const { videoStatus } = renderItemStatus(item);
  const isVideoOffShelf = isVideo && videoStatus !== 4;
  const recommendUrl =
    `/v4/vis/pct/page/goodsrecommend#/goods-recommend/preview/?` +
    `mode=0&alias=${alias}` +
    `&relatedAlias=${columnAlias || ''}&type=2`;
  const webViewPath = `packages/edu/webview/index?targetUrl=${encodeURIComponent(
    `https://h5.youzan.com/wscvis/course/detail/${alias}?kdt_id=${_global.kdtId}`,
  )}`;
  const weappVersion = get(window._global, 'weappVersion.releasedVersion');
  const hasWeappBinded = weappVersion && compareVersion(weappVersion, '2.37.5') >= 0;

  const config: IConfigItem[] = [
    {
      title: isFree ? (
        `取消${trialText}`
      ) : (
        <Pop
          content="免费后用户无须购买即可看到全部内容，确定免费吗？"
          trigger="click"
          centerArrow
          position="left-center"
          className="popover--inline"
          onConfirm={free}
        >
          <div>
            免费
            {trialText}
          </div>
        </Pop>
      ),
      onClick: isFree ? free : undefined,
      showLock: true,
      isLock,
      show: !isVideoOffShelf && chainSupportHqAndSingleAndMinifyHq,
    },
    {
      title: (
        <LockWrap lockType={LockType.PCT_GOODS} isLock={isLock} onClick={() => openShortenUrlPromotionDlg({
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
        </LockWrap>
      ),
      show: !isVideoOffShelf,
    },
    {
      title: '移动',
      onClick: () => moveContent(),
      show: chainSupportHqAndSingleAndMinifyHq,
    },
    {
      title: (
        <a
          href={`/v4/vis/pct/page/content#/edit/${MEDIA_TYPE_MAP[mediaType]}?alias=${alias}`}
          rel="noopener noreferrer"
          target="_blank"
        >
          编辑
        </a>
      ),
      show: !isVideoOffShelf && chainSupportHqAndSingleAndMinifyHq,
    },
    {
      title: '关联商品推荐',
      onClick: () => window.open(recommendUrl),
      showLock: true,
      isLock,
      show: chainSupportHqAndSingleAndMinifyHq,
    },
    {
      title: '删除',
      onClick: handleDeleteClick,
      show: chainSupportHqAndSingleAndMinifyHq,
    },
  ];

  return <ListActionMenu maxDisplayItemNum={3} config={config} />;
};

export default ActionMenu;
