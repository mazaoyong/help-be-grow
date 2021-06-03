import { Popup } from '@youzan/vis-ui';
import { getThemeColor } from '@youzan/vue-theme-plugin';
import StudentList from './student-list';
import { redircetToEdit } from '../../utils';

const mainColor = getThemeColor('main');

/** @type {({params: { props: { studentList: any[], chosenStudentId?: number, } }}) => Promise<any>} */
export const openStudentListPopup = Popup.getOpenPopup(StudentList, {
  props: {
    title: '选择学员',
    closeable: true,
    buttons: [
      {
        icon: 'plus',
        text: '新增学员',
        color: mainColor,
        onClick() {
          redircetToEdit();
        },
      },
    ],
  },
});
