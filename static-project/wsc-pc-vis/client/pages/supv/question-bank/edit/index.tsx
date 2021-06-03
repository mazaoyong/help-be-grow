import React from 'react';
import { Button, FieldModel, Notify } from 'zent';
import { QuestionType, IEditParams } from '@ability-center/supv/question-bank';
import { EasyFormArchive, EditFormHoc } from '@youzan/ebiz-components';
import { ZentForm } from 'zent/es/form/ZentForm';

import SwitchComponent from './blocks/switch-component';
import preSubmitQuestion from './utils/pre-submit-question';
import stashQuestionContent, { resetStashedQuestion } from './utils/stash-question-content';
import separateResponse from './utils/separate-response';
import submitQuestion from './utils/submit-question';

import useModifyQueries from './utils/use-modify-queries';
import useSubscribeEffect from './utils/use-subscribe-effect';
import useBaseSettingConfig from './utils/use-base-setting-config';
import useSubmitButtons from './utils/use-submit-buttons';
import usePackage from './utils/use-package';

import { getQuestionDetail } from '../../api/question-bank';
import { IQuestionEditProps, IQuestionSubmitForm, IQuestionResponse, SubmitEffect } from './types';
import './styles.scss';

const { EditFormHOC: EditFormHOCWrapper, handleRedirect, redirectWithoutConfirm } = EditFormHoc;

const { EasyForm } = EasyFormArchive;

const QuestionEdit: React.FC<IQuestionEditProps> = (props) => {
  const { location, router } = props;
  const [submitLoading, setLoadingState] = React.useState(false);
  const [initialized, setInitialState] = React.useState(false);
  const [createQuestionKey, setCreateQuestionKey] = React.useState<number>(0);
  const [submitEffect, setSubmitEffect] = React.useState<SubmitEffect>(SubmitEffect.Create);
  const [questionType, setQuestionType] = React.useState<QuestionType>(QuestionType.Single);
  // @upgrade: zent8
  const questionSettingFormRef = React.useRef<ZentForm<{type?: any, categoryId: any}> | null>();
  const questionContentFormRef = React.useRef<ZentForm<{}> | null>();

  const [editQuery, createQuery, originQueries, addQuery] = useModifyQueries(location);
  const baseSettingConfig = useBaseSettingConfig(editQuery, createQuery);

  const backToList = React.useCallback(
    (withoutDoubleConfirm?: boolean) =>
      withoutDoubleConfirm
        ? redirectWithoutConfirm(router.createHref('list'))
        : handleRedirect(router.createHref('list')),
    [router],
  );
  const createNext = React.useCallback(() => {
    resetStashedQuestion();
    deleteUEditorInstants();
    setCreateQuestionKey((prevKey) => prevKey + 1);
    questionContentFormRef.current && questionContentFormRef.current.resetValue();
  }, []);
  // 当装载的数据达到上线的值的时候，就触发callback函数
  const [loadPackage, reloadPackage] = usePackage<Record<string, any>>(2, (...forms) => {
    setLoadingState(true);
    // submitQuestion需要兼容弹窗中调用，所以需要有一个参数来标识数据格式化完成之后应该触发
    // 的接口
    submitQuestion('', ...forms)
      .then((success) => {
        if (success) {
          Notify.success(`${titleMap[originQueries.type]}成功`);
          switch (submitEffect) {
            case SubmitEffect.Create:
              backToList(true);
              break;
            case SubmitEffect.CreateNext:
              createNext();
              break;
            default:
              break;
          }
        }
      })
      .catch(Notify.error)
      .finally(() => {
        setLoadingState(false);
      });
  });
  // 提交表单
  const handleSubmit = React.useCallback(
    (effect: SubmitEffect) => {
      if (questionSettingFormRef.current && questionContentFormRef.current) {
        reloadPackage();
        setSubmitEffect(effect);
        questionSettingFormRef.current.submit();
        questionContentFormRef.current.submit();
      }
    },
    [reloadPackage],
  );
  const restSubmitFooterBtn = useSubmitButtons(originQueries, submitLoading, {
    submit: () => handleSubmit(SubmitEffect.Create),
    createNext: () => handleSubmit(SubmitEffect.CreateNext),
  });
  const handleSubmitQuestionSetting = React.useCallback(
    (form: ZentForm<any>) => {
      const settingForm = form.getValue();
      if (editQuery) {
        loadPackage(Object.assign({}, settingForm, { id: editQuery.questionId }));
      } else loadPackage(settingForm);
    },
    [editQuery, loadPackage],
  );
  const handleSubmitQuestionContent = React.useCallback(
    // @upgrade: zent8
    (form: ZentForm<{}>) => {
      const questionContentForm = form.getValue() as IQuestionSubmitForm;
      preSubmitQuestion(questionType, questionContentForm)
        .then(loadPackage)
        .catch((errorMsg) => {
          Notify.error(errorMsg);
        });
    },
    [loadPackage, questionType],
  );

  // 暂存题目设置
  const handleStashQuestionContent = React.useCallback((prevQuestionType: QuestionType) => {
    const questionContentForm = questionContentFormRef.current;
    if (questionContentForm) {
      const questionContentValue = questionContentForm.getValue();
      stashQuestionContent(prevQuestionType, questionContentValue);
    }
  }, []);

  const subscribeEffect = React.useCallback(() => {
    const questionSettingForm = questionSettingFormRef.current;
    if (questionSettingForm) {
      const questionTypeModel: FieldModel<QuestionType> = questionSettingForm.model.get('type');
      // 监听题型的变化
      questionTypeModel &&
        questionTypeModel.value$.subscribe((nextQuestionType) => {
          setQuestionType((prevQuestionType) => {
            if (prevQuestionType !== nextQuestionType) {
              handleStashQuestionContent(prevQuestionType);
              return nextQuestionType;
            }
            return prevQuestionType;
          });
        });
    }
  }, [handleStashQuestionContent]);

  React.useEffect(() => {
    // 进入编辑页面，初始化保存的数据
    resetStashedQuestion();

    // 设置编辑的时候需要初始化的东西
    const questionSettingForm = questionSettingFormRef.current;
    if (questionSettingForm) {
      if (editQuery) {
        const { questionId } = editQuery;
        getQuestionDetail<IQuestionResponse>({ id: questionId })
          .then(separateResponse)
          .then((res) => {
            if (res) {
              const [defaultQuestionSetting, defaultQuestionContent] = res;
              const { categoryName, ...restQuestionSetting } = defaultQuestionSetting;
              // 如果是编辑的时候，需要从详情接口中拿到categoryName，然后触发问题设置的form的重新渲染
              addQuery({ categoryName });
              questionSettingForm.initialize(restQuestionSetting);
              // 延时一下进行
              requestAnimationFrame(() => {
                const questionContentForm = questionContentFormRef.current;
                if (questionContentForm) {
                  questionContentForm.initialize(defaultQuestionContent);
                }
              });
              setInitialState(true);
            }
          })
          .catch((err) => err && Notify.error(err));
      } else {
        // 设置categoryId
        questionSettingForm.initialize({ categoryId: Number(originQueries.categoryId) | 0 });
        setInitialState(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 处理副作用函数
  React.useLayoutEffect(() => subscribeEffect(), [subscribeEffect]);
  // 处理订阅逻辑
  useSubscribeEffect(initialized, questionType, {
    settingFormRef: questionSettingFormRef,
    contentFormRef: questionContentFormRef,
  });

  return (
    <div className="question-bank__edit">
      <section className="question-setting">
        <h1>{titleMap[originQueries.type]}题目</h1>
        <EasyForm
          scrollToError
          layout="horizontal"
          ref={(form) => (questionSettingFormRef.current = form)}
          config={baseSettingConfig}
          onSubmit={handleSubmitQuestionSetting}
        />
      </section>
      <SwitchComponent
        scrollToError
        key={createQuestionKey}
        ref={questionContentFormRef}
        questionType={questionType}
        onSubmit={handleSubmitQuestionContent}
      />
      <div className="submit-footer" role="submit-footer">
        <div>
          <Button onClick={() => backToList()}>取消</Button>
          {restSubmitFooterBtn}
        </div>
      </div>
    </div>
  );
};

export default EditFormHOCWrapper(QuestionEdit);

const titleMap: Record<IEditParams['type'], string> = {
  create: '新建',
  edit: '编辑',
  duplicate: '复制',
};
function deleteUEditorInstants() {
  // 用于保存并新建项目的时候清除实例
  try {
    const instants = (window as any).UE.instants;
    const instantKeys = Object.keys(instants);
    if (instantKeys.length) {
      instantKeys.forEach((key) => delete instants[key]);
    }
  } catch (err) {
    console.error('[delete UEditor instants]删除UEditor实例出错！！！');
  }
}
