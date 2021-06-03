import { createBlock, ModelOf } from '@youzan/tany-vue';
import WorkbookChooseBlockModel from './model';

import type Workbook from '@/domain/workbook-domain/entities/workbook';

import { List, Cell } from 'vant';
import { Popup } from '@youzan/vis-ui';
import WorkbookCover from '../../../../components/workbook-cover';

import './style.scss';

function WorkbookChooseBlock(model: ModelOf<typeof WorkbookChooseBlockModel>) {
  const {
    loading,
    error,
    finished,
    workbookList,
    onLoad,
    setError,
    showSwitchWorkbook,
    currentWorkbook,
    handleSwitchWorkbook,
    handleChooseWorkbook,
    isPopupOpen,
    setIsPopupOpen
  } = model;

  return (
    <div class="workbook-choose-block">
      {
        showSwitchWorkbook.value
        ? <Cell title={currentWorkbook.value?.title} is-link value="切换" onClick={ handleSwitchWorkbook.value }/>
        : null
      }
      <Popup
        value={isPopupOpen.value}
        title="切换作业本"
        closeable
        on={{
          input: (v: boolean) => {
            setIsPopupOpen(v);
          }
        }}
      >
        <List
          value={loading.value}
          finished={finished.value}
          finishedText="没有更多了"
          error={error.value}
          errorText="请求失败，点击重新加载"
          on={{
            load: onLoad,
            'update:error': (v: boolean) => {
              setError(v);
            }
          }}
        >
          <div class="workbook-grid">
            {
              workbookList.value.map((workbook) => {
                return (
                  <div onClick={handleChooseWorkbook(workbook as Workbook)}>
                    <WorkbookCover title={workbook.title} size="grid" name={workbook.studentList[0].name} />
                    <p>{workbook.title}</p>
                  </div>
                );
              })
            }
          </div>
        </List>
      </Popup>
    </div>
  );
}

export default createBlock({
  root: WorkbookChooseBlock,
  model: WorkbookChooseBlockModel
})