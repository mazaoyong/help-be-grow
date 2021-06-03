import { createModule, ModelOf } from '@youzan/tany-vue';
import { List as VanList, Icon as VanIcon } from 'vant';
import Empty from 'components/empty/index.vue';
import ListModuleModel from './Root.model';
import HomeworkCard from './components/homework-card';
import { addBookRoute, detailRoute } from '../../router';
import ScalableButton from '../../components/scalable-button';
import './style.scss';

const Link = addBookRoute.getLinkComponent();
const DetailLink = detailRoute.getLinkComponent();

function App(model: ModelOf<typeof ListModuleModel>) {
  const {
    hasAuthorized,
    homeworkListGroupsArray,
    isFinished,
    isError,
    isLoading,
    fetchHomeworkList
  } = model;

  return (
    <div class="homework-list">
      <VanList
        value={isLoading.value}
        finished={isFinished.value}
        finishedText={ homeworkListGroupsArray.value.length ? '没有更多了' : '' }
        error={isError.value}
        on={{
          load: fetchHomeworkList,
        }}
      >
        {
          homeworkListGroupsArray.value.length
            ? homeworkListGroupsArray.value.map((homeworkListGroup) => {
              return (
                <div class="homework-list__group">
                  <p class="homework-list__group__title">
                    {homeworkListGroup.date}发布
                  </p>
                  {
                    homeworkListGroup.value.map((homework: any) => (
                      <DetailLink params={{ homeworkId: homework.id }}>
                        <HomeworkCard
                          id={homework.id}
                          title={homework.title}
                          status={homework.status}
                          totalNumber={homework.totalNumber}
                          submitNumber={homework.submitNumber}
                        />
                      </DetailLink>
                    ))
                  }
                </div>
              );
            })
            : <Empty desc="暂无作业，快去布置吧" />
        }
      </VanList>

      {
        hasAuthorized.value
          ? (
            <Link
              params={{ workbookId: model.workbookId }}
              props={{
                onClick: () => { model.setBackWhenFinish(true); },
              }}
            >
              <ScalableButton
                class="homework-list__button"
                buttonText="布置作业"
                icon={<VanIcon name="plus" size="18px" color="#fff" />}
              />
            </Link>
          )
          : null
      }
    </div>
  );
};

export default createModule({
  root: App,
  rootModel: ListModuleModel,
});
