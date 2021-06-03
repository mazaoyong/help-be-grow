import { useAppModel } from 'supv/homework/App.model';
import { useAssignmentModuleModel } from '../../model';
import { openShareButtonPopup } from 'vis-shared/components/standard-share';

import * as SafeLink from '@youzan/safe-link';
import get from 'lodash/get';
import { setShareData, getShareLink } from '@youzan/wxsdk';
import { getVuePoster } from '@/common/apis/poster';
import { getCommentIcon } from '../../../../utils';
import { getExposeAssignmentBlocks, getExposeCorrectMediaBlocks, getSafeWxAvatar, IExerciseDetailItemDTO } from 'vis-shared/utils/supv/homework/poster';
import AssignmentService from '@/domain/assignment-domain/services/index';
import getQrCode from '@/common/utils/qrcode';
import commonLogin from '@/common/utils/login';

const BottomOperationBlockModel = () => {
  const {
    mainColor,
    track,
  } = useAppModel();

  const {
    bottomOperationInfo,
    jumpToCommunicationRegion,
    isJoined,
    assignmentId,
    studentId,
    assignmentData,
    isSelfHomework,
    isCanWatchOtherHomework,
  } = useAssignmentModuleModel();

  const kdtId = get(window, '_global.kdt_id', 0);
  const wapUrl = get(window, '_global.wap_url.wap', '//h5.youzan.com/v2');
  const h5Url = get(window, '_global.wap_url.h5', '//h5.youzan.com');
  const shareLink = getShareLink(`${h5Url}/wscvis/supv/homework/assignment?assignmentId=${assignmentId.value}&studentId=${studentId.value}&kdt_id=${kdtId}&isShare=1`);
  const isWeapp = get(window, '_global.miniprogram.isWeapp', false);
  const shopLogoUrl = get(window, '_global.mp_data.logo', 'https://img.yzcdn.cn/public_files/2016/05/13/8f9c442de8666f82abaf7dd71574e997.png');
  const commentIcon = getCommentIcon();
  const handleShareApi = () => {
    const assignmentIdNum = Number(assignmentId.value);
    const studentIdNum = Number(studentId.value);
    AssignmentService.shareHomework(assignmentIdNum, studentIdNum);
  };
  const openShare = () => {
    function openPopup() {
      openShareButtonPopup({
        props: {
          copyLink: shareLink,
          getPoster: () => {
            return getQrCode(shareLink, {
              shortenUrl: true,
              ajaxLoading: false,
            })
              .then((url) => {
                return getVuePoster({
                  pathname: 'supv/homework/assignment-poster',
                  data: {
                    avatar: assignmentData.value?.userInfo.avatar && getSafeWxAvatar(assignmentData.value?.userInfo.avatar),
                    shareUserName: assignmentData.value?.userInfo.name,
                    studentName: assignmentData.value?.studentDTO.name,
                    title: assignmentData.value?.homework.title,
                    scoreStyle: assignmentData.value?.homework.scoreStyle,
                    scoreRule: assignmentData.value?.homework.scoreRule,
                    score: assignmentData.value?.reviewDTO?.comment?.score,
                    isExcellent: Boolean(assignmentData.value?.reviewDTO?.comment?.excellentScore),
                    exposeAssignmentBlocks: getExposeAssignmentBlocks((assignmentData.value?.answerDetail || []) as IExerciseDetailItemDTO[]),
                    exposeCorrectMediaBlocks: getExposeCorrectMediaBlocks((assignmentData.value?.reviewDTO?.comment?.comment || []) as IExerciseDetailItemDTO[]),
                    qrCodeUrl: url,
                    mainColor: mainColor,
                    commentIcon: commentIcon,
                  },
                  snapshotConfig: {
                    selector: '.assignment-poster',
                    type: 'png',
                  },
                }).then(res => {
                  if (res) {
                    return res.img;
                  }
                  return '';
                });
              });
          },
        },
        on: {
          share: (type: string) => {
            let image = '';
            assignmentData.value?.homework.detail.some((block) => {
              if (block.richTextItem) {
                const node = document.createElement('div');
                node.innerHTML = block!.richTextItem!.content;
                const result = node.querySelector('img')?.src;
                if (result) {
                  image = result;
                  return true;
                }
                return false;
              }
              return false;
            });
            if (type === 'wechat') {
              handleShareApi();
              if (isWeapp) {
                setShareData({
                  title: assignmentData.value ? assignmentData.value.homework.title : '',
                  cover: image,
                  weappPath: `/packages/edu/webview/index?targetUrl=${encodeURIComponent(shareLink)}`,
                });
              } else {
                const textBlock = assignmentData.value?.homework.detail.find((block) => block.richTextItem);
                let desc = '';
                if (textBlock) {
                  const node = document.createElement('div');
                  node.innerHTML = textBlock!.richTextItem!.content;
                  desc = node.innerText.trim().substr(0, 50);
                }
                setShareData({
                  title: assignmentData.value ? assignmentData.value.homework.title : '',
                  desc,
                  cover: image || shopLogoUrl,
                  link: shareLink,
                });
              }
            } else if (type === 'poster') {
              handleShareApi();
              return Promise.resolve();
            } else if (type === 'link') {
              handleShareApi();
              return Promise.resolve();
            }
          },
        },
      });
    }
    track.collect('assignment:shareType', isSelfHomework.value ? 1 : 2);
    track.runTask('share_homework');
    const hasAuthorized = get(window, '_global.authorized.nicknameAndAvatar', false);
    commonLogin({
      getUser: false,
      forceLogin: false,
      authTypeList: ['nicknameAndAvatar'],
    }).then(() => {
      if (!hasAuthorized && get(window, '_global.authorized.nicknameAndAvatar', false)) {
        location.reload();
      } else {
        openPopup();
      }
    }).catch(() => {
      openPopup();
    });
  };

  const jumpToShopIndex = () => {
    SafeLink.redirect({ url: `${wapUrl}/showcase/homepage?kdt_id=${kdtId}`, kdtId: kdtId });
  };

  return {
    mainColor,

    bottomOperationInfo,
    jumpToCommunicationRegion,
    openShare,
    isJoined,
    jumpToShopIndex,
    isSelfHomework,
    isCanWatchOtherHomework,
  };
};

export default BottomOperationBlockModel;
