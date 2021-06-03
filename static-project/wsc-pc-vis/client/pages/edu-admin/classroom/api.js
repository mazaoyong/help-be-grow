import { visAjax } from 'fns/new-ajax';

export function createClassroom(data) {
  return visAjax('POST', '/edu/classroom.json', data);
}

export function updateClassroom(data) {
  return visAjax('PUT', '/edu/classroom.json', data);
}

export function deleteClassroom(data) {
  return visAjax('DELETE', '/edu/classroom.json', data);
}

export function getClassroomById(data) {
  return visAjax('GET', '/edu/classroom.json', data);
}

export function getClassrooms(data) {
  return visAjax('GET', '/edu/classrooms.json', data);
}

export function getStores(data) {
  return visAjax('GET', '/edu/getStoreList.json', data);
}
