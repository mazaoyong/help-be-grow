import { ajax } from '@youzan/vis-ui';
import { ICollectInfoParams, ISubmitAttributesCommand } from 'definitions/api/owl/api/OnlineCourseAttributeFacade/submitAttributes';

export const getCollectInfoSettings = (data: ICollectInfoParams) => {
  return ajax({
    method: 'GET',
    url: '/wscvis/edu/reward/getKnowledgeByAlias.json',
    withCredentials: true,
    data,
  });
};

export const submitCollectInfo = (data: ISubmitAttributesCommand) => {
  return ajax({
    method: 'POST',
    url: '/wscvis/knowledge/submitCollectInfo.json',
    data,
    rawResponse: true,
  });
};
