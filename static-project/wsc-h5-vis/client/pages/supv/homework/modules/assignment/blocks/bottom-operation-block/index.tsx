import { createBlock, ModelOf } from '@youzan/tany-vue';
import BottomOperationBlockModel from './model';

import { Button } from 'vant';
import { ImgWrap } from '@youzan/vis-ui';

import './style.scss';

function BottomOperationBlock(model: ModelOf<typeof BottomOperationBlockModel>) {
  const {
    mainColor,

    bottomOperationInfo: {
      avatars,
    },
    jumpToCommunicationRegion,
    openShare,
    jumpToShopIndex,
    isSelfHomework,
    isCanWatchOtherHomework
  } = model;

  return (
    <div class="bottom-operation-block">
      {
        isSelfHomework.value
        ? (
          <div>
            {
              avatars.length > 0 && isCanWatchOtherHomework.value
              ? (
                <div class="bottom-operation-block__communication-region-button" onClick={jumpToCommunicationRegion}>
                  <div class="bottom-operation-block__communication-region-button__avatars">
                    {
                      avatars.map((avatar, idx) => (
                        <div
                          class="avatar__wrapper"
                          style={{
                            zIndex: `${avatars.length - idx + 1}`
                          }}
                        >
                          <ImgWrap
                            src={avatar}
                            width="18px" 
                            height="18px"
                          />
                        </div>
                      ))
                    }
                  </div>
                  <p class="bottom-operation-block__communication-region-button__desc">查看同学的作业</p>
                </div>
              )
              : null
            }
            <Button
              class="bottom-operation-block__share-button"
              round
              block
              color={mainColor} 
              onClick={openShare}
            >
              分享作业
            </Button>
          </div>
        )
        : (
          <div>
            <Button
              round
              block
              color={mainColor} 
              onClick={jumpToShopIndex}
              style={{
                'margin-right': '8px'
              }}
            >
              我也要学习
            </Button>
            <Button
              round
              plain
              block
              color={mainColor} 
              onClick={openShare}
            >
              分享作业
            </Button>
          </div>
        )
      }
    </div>
  );
}

export default createBlock({
  model: BottomOperationBlockModel,
  root: BottomOperationBlock,
});