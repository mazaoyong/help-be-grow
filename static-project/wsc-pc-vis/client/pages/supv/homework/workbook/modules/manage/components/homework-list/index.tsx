import { React, forwardRef } from '@youzan/tany-react';
import { Button } from 'zent';
import { ArthurContainer } from '@youzan/arthur-scheduler-react';
import { EasyList } from '@youzan/ebiz-components';
import { Button as SamButton } from '@youzan/sam-components';
import redirect from '@youzan/utils/url/redirect';
import { abilityCheck } from 'fns/auth/ability-check-status';
import { IEasyGridColumn, IListContext } from '@youzan/ebiz-components/es/types/easy-list';
import { IHomeworkListDTO } from 'domain/homework-domain/types/homework';

import { APPID, AbilityCode, AppName } from '../../../../../constants';

const LIST_PAGE_SIZE = 10;

const { List, EasyGrid, InlineFilter, Search } = EasyList;

interface IHomeworkListComponentProps {
  onSubmit: () => Promise<any>;
  isAuthorizedTeacher?: boolean;
  homeworkCreateLink: string;
  columns: IEasyGridColumn<IHomeworkListDTO>[];
  emptyLabel?: React.ReactNode;
  customFilter?: React.ReactNode;
  createLoading?: boolean;
  fromEduClass?: boolean;
  classIsEnded?: boolean;
}

const HomeworkListComponent = forwardRef<IListContext, IHomeworkListComponentProps>(
  function HomeworkListWithRef(props, ref) {
    const {
      onSubmit,
      isAuthorizedTeacher,
      homeworkCreateLink,
      columns,
      emptyLabel,
      customFilter,
      createLoading,
      fromEduClass,
      classIsEnded,
    } = props;

    const handleCreate = React.useCallback(() => {
      abilityCheck({
        abilityCode: AbilityCode,
        appId: APPID,
        name: AppName
      }).then(() => {
        fromEduClass ? window.open(homeworkCreateLink) : redirect(homeworkCreateLink);
      });
    }, [fromEduClass, homeworkCreateLink]);

    return (
      <List
        ref={ref}
        mode="none"
        onSubmit={onSubmit}
        defaultFilter={{ pageSize: LIST_PAGE_SIZE }}
        delay={500}
      >
        {customFilter || null}
        <InlineFilter
          left={
            fromEduClass && classIsEnded // 结班
              ? null
              : <ArthurContainer name="createHomework" namespace="督学互动">
                {isAuthorizedTeacher ? (
                  <Button
                    type="primary"
                    onClick={handleCreate}
                    loading={createLoading}
                  >
                    布置作业
                  </Button>
                ) : (
                  <SamButton
                    name="编辑"
                    type="primary"
                    onClick={handleCreate}
                    // target={fromEduClass ? '_blank' : '_self'}
                    loading={createLoading}
                  >
                    布置作业
                  </SamButton>
                )}
              </ArthurContainer>
          }
          right={<Search key="search" name="title" placeholder="搜索作业名称" />}
        />
        <EasyGrid columns={columns} rowKey="id" scroll={{ x: 1311 }} emptyLabel={emptyLabel} />
      </List>
    );
  },
);

export default HomeworkListComponent;
