import { useState, useEffect, useCallback, useRef, useMemo, createModel } from '@youzan/tany-react';
import { Notify } from 'zent';
import { IEasyFormInstance } from '@youzan/ebiz-components/es/types/easy-form';

import { useWorkbookRouterModel, workbookEditRoute } from '../../../router';

import WorkbookService from 'domain/workbook-domain/services';
import { visibleRangeType, visibleOccasionType, joinLimit } from 'domain/workbook-domain/types';
import { IWorkbookAdditon } from '../types';
import { BooleanLike } from '../../../../types';

const { getWorkbookDetail } = WorkbookService;

const WorkbookEditModel = () => {
  const { route } = useWorkbookRouterModel();

  const id = route.params?.id;

  const fromEduClassId = route.query?.eduClassId;
  const [boundClass, toggleBoundClass] = useState<boolean>(false);

  const [loading, toggleLoading] = useState(true);

  const isEdit = useMemo(() => workbookEditRoute.path === route?.path, [route]);

  const [workbookAddition, setWorkbookAddition] = useState<IWorkbookAdditon>();

  const [needInfoCollect, toggleNeedInfoCollect] = useState<BooleanLike>(BooleanLike.False);
  // todo: remove when form enables update on patchvalue
  const [infoCollect, setInfoCollect] = useState<any>();
  const [formData, setFormData] = useState<any>();

  const formRef = useRef<IEasyFormInstance>(null);

  const fetchWorkbookDetail = useCallback((id: number) => {
    return getWorkbookDetail({ id }).then((res) => {
      if (res) {
        const {
          id,
          alias,
          kdtId = _global.kdtId,
          status,
          teacherList: rawTeacherList,
          needInfoCollect: rawNeedInfoCollect,
          infoCollect: rawInfoCollect,
          joinType,
        } = res;

        const teacherList = rawTeacherList
          .sort((a, b) => a.serialNo - b.serialNo)
          .map((rawTeacher) => {
            const { teacherId, name, mobile } = rawTeacher;
            return {
              id: teacherId,
              value: teacherId,
              staffName: name,
              mobile,
            };
          });

        const infoCollect = {
          customizeItems: rawInfoCollect?.attributeIds,
          inClue: rawInfoCollect?.inClue,
        };

        setInfoCollect(infoCollect);

        toggleNeedInfoCollect(rawNeedInfoCollect);
        toggleBoundClass(joinType?.type === joinLimit.boundClass);

        const needInfoCollect = rawNeedInfoCollect === BooleanLike.True;

        const conf = { ...res, infoCollect, needInfoCollect, teacherList };

        toggleLoading(false);

        setFormData(conf);
        setWorkbookAddition({
          id,
          alias,
          kdtId,
          status,
        });
      }
    })
      .catch(e => {
        Notify.error(e || '获取作业本详情失败，请稍后重试');
        toggleLoading(false);
      });
  }, []);

  useEffect(() => {
    if (isEdit) {
      // 编辑
      if (!id) {
        Notify.error('请输入作业本id');
        return;
      }
      fetchWorkbookDetail(Number(id));
    } else {
      toggleLoading(false);
    }
  }, [id, isEdit, fetchWorkbookDetail]);

  useEffect(() => {
    if (formData && !loading) {
      formRef.current && formRef.current.easyForm.patchValue(formData);
    }
  }, [formData, loading]);

  const visibleOccasionTextMap = useMemo(
    () => ({
      [visibleOccasionType.submitted]: '作业提交后可查看他人作业',
      [visibleOccasionType.marked]: '作业被批阅后可查看他人作业',
    }),
    [],
  );

  const visibleOccasionDescMap = useMemo(
    () => ({
      [visibleOccasionType.submitted]: '用户提交作业后，即可查看他人作业。',
      [visibleOccasionType.marked]: '老师批改用户作业后，用户才可以查看他人作业。',
    }),
    [],
  );

  const visibleRangeTextMap = useMemo(
    () => ({
      [visibleRangeType.all]: '可查看所有作业',
      [visibleRangeType.goodOnesOnly]: '可查看优秀作业',
    }),
    [],
  );

  const visibleRangeDescMap = useMemo(
    () => ({
      [visibleRangeType.all]: '用户可查看其他人提交的所有作业。',
      [visibleRangeType.goodOnesOnly]: '老师批改用户作业后，用户才可以查看他人作业。',
    }),
    [],
  );

  return {
    route,
    id,
    isEdit,
    workbookAddition,
    formRef,
    boundClass,
    fromEduClassId,
    needInfoCollect,
    visibleOccasionTextMap,
    visibleOccasionDescMap,
    visibleRangeTextMap,
    visibleRangeDescMap,
    loading,
    infoCollect,
  };
};

export default createModel(WorkbookEditModel);
