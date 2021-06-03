<template>
  <div class="block-start-exam">
    <vis-popup
      :value="showPopup"
      class="popup"
      :title="popupTitle"
      closeable
      :close-on-click-overlay="false"
      @input="triggerPopup"
    >
      <transition name="fade">
        <course-popup
          v-if="popupName === 'course'"
          :exam-id="examId"
        />
        <student-popup
          v-if="popupName === 'student'"
          :student-list="studentList"
          @selected="onStudentSelected"
        />
        <info-collector
          v-if="popupName === 'infoCollector'"
          :info-collection-items="infoCollectorSettings"
          :info-collect-dto="selectedStudent"
          @submit="onCollectorSubmit"
        />
      </transition>
    </vis-popup>
  </div>
</template>

<script lang="ts">
import { Dialog } from 'vant';
import { Popup as VisPopup } from '@youzan/vis-ui';
import { TYPE_ENUMS } from '@youzan/vis-ui/es/dynamic-form';
import { convertAddressLike, convertMultiSelect } from 'supv/examination/utils';
import InfoCollector from 'components/info-collect-popup/main.vue';
import CoursePopup from '../components/CoursePopup.vue';
import StudentPopup from '../components/StudentPopup.vue';
import { UserRole } from '../types';
import storeModule from '../store';

export default {
  name: 'block-start-exam',

  components: {
    VisPopup,
    CoursePopup,
    StudentPopup,
    InfoCollector,
  },

  rootState: ['examId'],
  state: ['studentList'],
  actions: [
    'fetchStartExam',
    'fetchStudentList',
  ],

  data() {
    return {
      showPopup: false,
      popupName: '',
      popupTitle: '',

      currentStep: -1,
      steps: [] as { name: string, title: string }[],

      infoCollectorSettings: [] as any[],
      collectedInfos: [] as any[],
      selectedStudent: {},
      selectedStudentId: 0,
    };
  },

  beforeCreate() {
    const store = this.$store;
    if (store && !store.state.startExam) {
      store.registerModule('startExam', storeModule);
    }
  },

  methods: {
    nextStep() {
      if (this.currentStep < this.steps.length - 1) {
        this.showPopup = true;
        this.currentStep++;
        const curStep = this.steps[this.currentStep];
        this.popupName = curStep.name;
        this.popupTitle = curStep.title;
      } else {
        this.postStart();
      }
    },

    showCourseList(examId: number) {
      this.steps.push({
        name: 'course',
        title: '',
      });
      this.nextStep();
    },

    reexam(studentId: number) {
      this.postStart(studentId);
    },

    postStart(studentId?: number) {
      if (this.fetching) return;
      this.fetching = true;
      // 所有步骤走完了就初始化考试
      this.fetchStartExam({
        examId: this.examId,
        joinStudentId: studentId || this.selectedStudentId,
        attrItem: this.collectedInfos,
        userRole: this.selectedStudentId ? UserRole.STUDENT : UserRole.CUSTOMER,
      })
        .then(() => {
          this.showPopup = false;
          setTimeout(() => {
            this.$router.push({
              name: 'answer',
              params: {
                mode: 'answer',
              },
              query: {
                examId: this.examId,
                kdt_id: _global.kdt_id + '',
              },
            });
          }, 500);
        })
        .catch((errMsg: string) => {
          Dialog.confirm({
            title: '提示',
            message: errMsg,
            confirmButtonText: '确定',
            confirmButtonColor: '#00b389',
            showCancelButton: false,
          })
            .then(() => {
              window.location.reload();
            });
        })
        .finally(() => {
          this.fetching = false;
        });
    },

    async startExam(
      isReexam: boolean,
      examId: number,
      studentIds = [],
      infoCollectorSettings = [],
    ) {
      if (!isReexam) {
        if (studentIds.length) {
          if (studentIds.length === 1) {
            await this.fetchStudentList(examId);
            this.selectStudent(this.studentList[0]);
          } else {
            this.fetchStudentList(examId);
            this.steps.push({
              name: 'student',
              title: '选择学员',
            });
          }
        }

        if (infoCollectorSettings.length) {
          this.infoCollectorSettings = infoCollectorSettings;
          this.steps.push({
            name: 'infoCollector',
            title: '填写报名信息',
          });
        }
      }

      this.nextStep();
    },

    triggerPopup(show: boolean) {
      this.showPopup = show;
      if (!show) {
        this.steps = [];
        this.currentStep = -1;
      }
    },

    selectStudent(student: any) {
      student.customizeItems = student.customAttributeItems;
      this.selectedStudent = student;
      this.selectedStudentId = student.id;
    },

    onStudentSelected(student: any) {
      this.selectStudent(student);
      this.nextStep();
    },

    onCollectorSubmit(data: any) {
      interface Info {
        attributeId: number;
        attributeKey: string;
        attributeTitle: string;
        createdAt: number;
        value: any;
      }
      const { values } = data;
      this.collectedInfos = this.infoCollectorSettings.reduce((infos: Info[], setting: any) => {
        if (setting.attributeKey in values || setting.attributeId in values) {
          const { dataType } = setting;
          let value = values[setting.attributeKey] || values[setting.attributeId];

          switch (dataType) {
            case TYPE_ENUMS.ADDRESS:
            case TYPE_ENUMS.PROVINCE:
              value = convertAddressLike(value, dataType);
              break;
            case TYPE_ENUMS.MULTISELECT:
              value = convertMultiSelect(value);
              break;
            default: break;
          }

          if (Array.isArray(value)) {
            value = value.join(',');
          }

          infos.push({
            attributeId: setting.attributeId || '',
            attributeKey: setting.attributeKey || '',
            attributeTitle: setting.attributeTitle,
            createdAt: setting.createdAt,
            value,
          });
        }
        return infos;
      }, []);
      this.nextStep();
    },
  } as any,
} as any;
</script>

<style lang="scss">
.block-start-exam {
  .vis-standard-popup__content {
    position: relative;
  }

  .vis-dynamic-form-container {
    width: 100%;
    box-sizing: border-box;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: all .5s ease-in-out;
}

.fade-enter {
  opacity: 0;
  transform: translateX(100%);
}

.fade-leave-to {
  opacity: 0;
  transform: translateX(-100%);
}
</style>
