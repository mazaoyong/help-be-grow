import { visAjax } from 'fns/new-ajax';
import { IAttributeDTO } from './types';

interface IGetInfoCollectionSettingsParams {
  sceneId?: number;
}

export function getInfoCollectionSettingsByAlias(params: IGetInfoCollectionSettingsParams) {
  return visAjax<IAttributeDTO[]>('GET', '/course/info-collections/getByAlias.json', params);
};
