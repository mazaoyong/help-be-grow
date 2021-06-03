import { getCourseExam } from './apis';
import storeModule from './store';

export function hasExam(alias: string): Promise<any> {
  return new Promise((resolve, reject) => {
    getCourseExam({
      alias,
    })
      .then(res => {
        if (res && res.examId && res.totalExamCount) {
          resolve(res);
        } else {
          reject(false);
        }
      })
      .then(() => reject(false));
  });
}

export function withStore(cpt: any, moduleName: string = 'courseExam') {
  const mixins = cpt.mixins || [];
  mixins.push({
    beforeCreate() {
      const store = this.$store;
      if (store) {
        store.registerModule(moduleName, storeModule);
      }
    },
  });
  return cpt;
}
