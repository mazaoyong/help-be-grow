import { visAjax } from 'fns/new-ajax';

export function saveCourseSettings(data) {
  return visAjax('POST', '/edu/courseSetting/saveCourseSettings.json', data);
}

export function findCourseSettings() {
  return visAjax('GET', '/edu/courseSetting/findCourseSettings.json');
}
