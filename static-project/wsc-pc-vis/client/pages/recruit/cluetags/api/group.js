// import mockify from '../../clueimport/api/mock/mockify';
import { visAjax } from 'fns/new-ajax';
// import mockGroupList from './mock/group-list';

export function getTagGroupList() {
  return visAjax('GET', '/edu/clue/getTagGroups.json', { needSysGroup: false });
  // return mockify(mockGroupList);
}

export function createTagGroup(payload) {
  return visAjax('POST', '/edu/clue/createTagGroup.json', payload);
  // return mockify({ success: 17, type: 'create' });
}

export function updateTagGroup(payload) {
  return visAjax('PUT', '/edu/clue/updateTagGroup.json', payload);
  // return mockify({ success: 17, type: 'update' });
}

export function deleteTagGroup(payload) {
  return visAjax('DELETE', '/edu/clue/deleteTagGroup.json', payload);
  // return mockify({ success: 17, type: 'delete' });
}
