import { format } from 'date-fns';
import FeedCard from '@/vis-shared/components/supv/homework/feed-card/index.vue';
import MediaContainer from '@/vis-shared/components/supv/homework/media-container';
import HomeworkScore from '@/vis-shared/components/supv/homework/homework-score';
import Swipe from '@/vis-shared/components/supv/homework/page-swipe';
import { createBlock } from '@youzan/tany-vue';
import AssignmentListModel, { AssignmentListType } from './model';
import { DEFAULT_AVATAR } from 'domain/supv/homework/constants';

import './style';

function AssignmentList(model: AssignmentListType) {
  const currentIndex = model.currentIndex.value;

  return (
    <div class="block-assignment-list">
      <Swipe
        initialIndex={currentIndex}
        showNext={model.hasNext.value}
        showPrev={model.hasPrev.value}
        prevText="上一个学员"
        nextText="下一个学员"
        handlePrev={model.handlePrev}
        handleNext={model.handleNext}
        list={
          model.assignmentList.value.map((item, index) => {
            const {
              homework,
              student,
              submitTime,
              detail,
              score,
              selected,
              comment,
              hasReviewed,
              reviewTime,
            } = item.assignment;

            // 切换作业时，销毁节点，停止音乐播放
            return item.loaded && currentIndex === index
              ? (
                <div
                  class={`assignment-detail
                    ${model.showSelectedBg.value ? 'assignment-detail--selected' : ''}`
                  }
                >
                  <FeedCard
                    title={homework?.title}
                    desc={`布置于 ${format(homework?.publishTime || Date.now(), 'YYYY-MM-DD HH:mm')}`}
                    titleSize="large"
                  >
                    <MediaContainer
                      slot="content"
                      mode="list"
                      overflowStyle="collapse"
                      mediaBlocks={homework?.detail}
                    />
                  </FeedCard>

                  <FeedCard
                    title={`${student?.name || ''}的作业`}
                    leftImage={student?.avatar || DEFAULT_AVATAR}
                    desc={`提交于 ${format(submitTime || Date.now(), 'YYYY-MM-DD HH:mm')}`}
                    titleSize="normal"
                    rounded
                  >
                    <MediaContainer
                      slot="content"
                      model="grid"
                      mediaBlocks={detail}
                    />
                    {
                      score ? (
                        <HomeworkScore
                          slot="badge"
                          scoreRule={homework?.reviewSettings.scoreRule}
                          scoreStyle={homework?.reviewSettings.scoreType}
                          score={score}
                          isExcellent={selected}
                        />
                      ) : null
                    }
                  </FeedCard>

                  {
                    hasReviewed
                      ? (
                        <FeedCard
                          title="老师点评"
                          leftImage={'https://b.yzcdn.cn/public_files/ba83fc15552351bc182c00fc31ece5c9.png'}
                          desc={`批阅于 ${format(
                            reviewTime || Date.now(),
                            'YYYY-MM-DD HH:mm',
                          )}`}
                          titleSize="normal"
                        >
                          <MediaContainer
                            slot="content"
                            model="grid"
                            mediaBlocks={comment}
                          />
                        </FeedCard>
                      )
                      : null
                  }
                </div>
              )
              : null;
          })
        }
      />
    </div>
  );
}

export default createBlock({
  root: AssignmentList,
  model: AssignmentListModel,
});
