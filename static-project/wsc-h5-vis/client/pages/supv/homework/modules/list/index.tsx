import { createModule, ModelOf } from '@youzan/tany-vue';
import ListModuleModel from './model';

import { 
  Tabs as VanTabs, 
  Tab as VanTab, 
  Tag as VanTag,
  List as VanList,
  Icon as VanIcon
} from 'vant';
import HomeworkCard from './components/homework-card';
import AssignmentCard from './components/assignment-card';
import MpFollow from './fragments/mp-follow';
import WorkbookChooseBlock from './blocks/workbook-choose-block';
import Empty from 'vis-shared/components/empty';

import './style.scss';

function ListModule(model: ModelOf<typeof ListModuleModel>) {
  const {
    mainColor,

    isEmpty,
    emptyLevel,
    emptyDescText,
    emptyShowButton,
    emptyButtonText,
    emptyButtonCallback,
    isUncompletedListError,
    setIsUncompletedListError,
    isUncompletedListFinished,
    isUncompletedListLoading,
    fetchUncompletedList,
    overtimeListGroupsArray,
    unfinishedListGroupsArray,
    isCompletedListError,
    setIsCompletedListError,
    isCompletedListFinished,
    isCompletedListLoading,
    fetchCompletedList,
    completedListGroupsArray,
    showOvertime,
    handleShowOvertime,
    computedUnCompletedTotalNum,
    computedCompletedTotalNum,
    showOverTimeButton
  } = model;

  return (
    <div class="homework-list">
      {
        isEmpty.value && emptyLevel.value === 'page'
        ? (<Empty
            buttonText={emptyButtonText.value}
            infoText={emptyDescText.value}
            showButton={emptyShowButton.value}
            buttonCallback={emptyButtonCallback.value}
          />)
        : (
          <div>
            <WorkbookChooseBlock />
            <VanTabs color={mainColor} >
              <MpFollow />
              <VanTab>
                <template slot='title'>未完成 <VanTag color={mainColor} round>{computedUnCompletedTotalNum.value}</VanTag></template>
                {
                  isEmpty.value && emptyLevel.value === 'list'
                  ? <Empty
                      buttonText={emptyButtonText.value}
                      infoText={emptyDescText.value}
                      showButton={emptyShowButton.value}
                      buttonCallback={emptyButtonCallback.value}
                    />
                  : (
                    <VanList
                      value={isUncompletedListLoading.value}
                      finished={isUncompletedListFinished.value}
                      error={isUncompletedListError.value}
                      errorText="请求失败，点击重新加载"
                      on={{
                        load: fetchUncompletedList.value,
                        'update:error': (v: boolean) => {
                          setIsUncompletedListError(v);
                        }
                      }}
                    >
                      { 
                        unfinishedListGroupsArray.value.map((unfinishedListGroup) => {
                          return (
                            <div class="homework-group">
                              <p class="homework-group__date">{ unfinishedListGroup.date }</p>
                              <div class="homework-group__content">
                                { unfinishedListGroup.value.map((assignment) => {
                                    return (
                                      <HomeworkCard 
                                        title={assignment.title} 
                                        deadline={assignment.deadline}
                                        assignmentId={assignment.assignmentId}
                                        isOvertime={ false }
                                        kdtId={assignment.kdtId}
                                      />
                                    );
                                  })
                                }
                              </div>
                            </div>
                          );
                        }) 
                      }
                      {
                        showOverTimeButton.value
                        ? (
                          <p class="homework-list__show-overtime" onClick={ handleShowOvertime }>
                            { showOvertime.value ? '收起已截止提交的作业' : '查看已截止提交的作业' }
                            { showOvertime.value ?  (<VanIcon name="arrow-up"/>) : (<VanIcon name="arrow-down"/>) }
                          </p>
                        )
                        : null
                      }
                      {
                        showOvertime.value 
                        ? (
                          overtimeListGroupsArray.value.map((overtimeListGroup) => {
                            return (
                              <div class="homework-group">
                                <p class="homework-group__date">{ overtimeListGroup.date }</p>
                                <div class="homework-group__content">
                                  { overtimeListGroup.value.map((assignment) => {
                                      return (
                                        <HomeworkCard 
                                          title={assignment.title} 
                                          deadline={assignment.deadline}
                                          assignmentId={assignment.assignmentId}
                                          isOvertime={true}
                                          kdtId={assignment.kdtId}
                                        />
                                      );
                                    })
                                  }
                                </div>
                              </div>
                            );
                          }) 
                        )
                        : null
                      }
                      {
                        isUncompletedListFinished.value && (showOvertime.value || overtimeListGroupsArray.value.length === 0)
                        ? (<div class="van-list__finished-text">没有更多了</div>)
                        : null
                      }
                    </VanList>
                  )
                }
              </VanTab>
              <VanTab title="已完成">
                <template slot='title'>已完成 {computedCompletedTotalNum.value}</template>
                <VanList
                  value={isCompletedListLoading.value}
                  finished={isCompletedListFinished.value}
                  finishedText="没有更多了"
                  error={isCompletedListError.value}
                  errorText="请求失败，点击重新加载"
                  on={{
                    load: fetchCompletedList.value,
                    'update:error': (v: boolean) => {
                      setIsCompletedListError(v);
                    }
                  }}
                >
                  { 
                    completedListGroupsArray.value.map((completedListGroup) => {
                      return (
                        <div class="homework-group">
                          <p class="homework-group__date">{ completedListGroup.date }</p>
                          <div class="homework-group__content">
                            { completedListGroup.value.map((assignment) => {
                                return (
                                  <AssignmentCard 
                                    title={assignment.title} 
                                    score={`${assignment.score ? assignment.score : ''}${assignment.score && assignment.scoreStyle === 1 ? '分' : ''}`} 
                                    isExcellent={!!assignment.excellentScore}
                                    assignmentId={assignment.assignmentId}
                                    kdtId={assignment.kdtId}
                                  />
                                );
                              })
                            }
                          </div>
                        </div>
                      );
                    }) 
                  }
                </VanList>
              </VanTab>
            </VanTabs>
          </div>
        )
      }
    </div>
  );
};

export default createModule({
  rootModel: ListModuleModel,
  root: ListModule,
});
