<template>
  <div class="dynamic-item">
    <div v-if="parsedRecordType === 'date'" class="date">
      <span class="text">{{ date }} {{ week }}</span>
    </div>
    <dynamic-add
      v-else-if="parsedRecordType === 'add'"
      :clue-id="clueId"
      :record-type="recordType"
      :operator-name="operatorName"
      :operate-time="operateTime"
      :operator-school-name="operatorSchoolName"
      :channel="channel"
      :source="source"
      :owners="owners"
      :reg-info="regInfo"
      :attend-time="attendTime"
      :attend-address="attendAddress"
      :course-name="courseName"
      :introduce-name="introduceName"
    />
    <dynamic-student
      v-else-if="parsedRecordType === 'student'"
      :clue-id="clueId"
      :operator-name="operatorName"
      :operate-time="operateTime"
      :operator-school-name="operatorSchoolName"
      :stu-before="stuBefore"
      :stu-after="stuAfter"
    />
    <dynamic-stage
      v-else-if="parsedRecordType === 'stage'"
      :operator-name="operatorName"
      :operate-time="operateTime"
      :operator-school-name="operatorSchoolName"
      :phase-before="phaseBefore"
      :phase-after="phaseAfter"
      :related-order-no="relatedOrderNo"
    />
    <dynamic-tag
      v-else-if="parsedRecordType === 'tag'"
      :clue-id="clueId"
      :operator-name="operatorName"
      :operate-time="operateTime"
      :operator-school-name="operatorSchoolName"
      :before-tags="beforeTags"
      :after-tags="afterTags"
    />
    <dynamic-person
      v-else-if="parsedRecordType === 'person'"
      :operator-name="operatorName"
      :operate-time="operateTime"
      :operator-school-name="operatorSchoolName"
      :before-owner="beforeOwner"
      :after-owner="afterOwner"
      :reason="reason"
    />
    <dynamic-follow
      v-else-if="parsedRecordType === 'follow'"
      :clue-id="clueId"
      :record-id="recordId"
      :operator-name="operatorName"
      :operate-time="operateTime"
      :operator-school-name="operatorSchoolName"
      :record-text="recordText"
      :image-list="imageList"
      :revisit-time="revisitTime"
    />
    <dynamic-source
      v-else-if="parsedRecordType === 'source'"
      :clue-id="clueId"
      :record-id="recordId"
      :operator-name="operatorName"
      :operate-time="operateTime"
      :operator-school-name="operatorSchoolName"
      :after-source="afterSource"
      :before-source="beforeSource"
    />
    <dynamic-role
      v-else-if="parsedRecordType === 'role'"
      :clue-id="clueId"
      :record-id="recordId"
      :operator-name="operatorName"
      :operate-time="operateTime"
      :operator-school-name="operatorSchoolName"
      :after-role="afterRole"
      :before-role="beforeRole"
      :scene="scene"
    />
  </div>
</template>

<script>
import { format, getDay } from 'date-fns';
import dynamicAdd from '../components/dynamic-add.vue';
import dynamicFollow from '../components/dynamic-follow.vue';
import dynamicPerson from '../components/dynamic-person.vue';
import dynamicStage from '../components/dynamic-stage.vue';
import dynamicStudent from '../components/dynamic-student.vue';
import dynamicTag from '../components/dynamic-tag.vue';
import dynamicSource from '../components/dynamic-source.vue';
import dynamicRole from '../components/dynamic-role.vue';

const weekArr = ['日', '一', '二', '三', '四', '五', '六'];

export default {
  name: 'dynamic-item',
  components: {
    'dynamic-add': dynamicAdd,
    'dynamic-follow': dynamicFollow,
    'dynamic-person': dynamicPerson,
    'dynamic-stage': dynamicStage,
    'dynamic-student': dynamicStudent,
    'dynamic-tag': dynamicTag,
    'dynamic-source': dynamicSource,
    'dynamic-role': dynamicRole,
  },
  props: {
    clueId: {
      type: Number,
      default: 0,
    },
    recordId: {
      type: Number,
      default: 0,
    },
    // 动态记录类型, (0,全部),(1,添加线索),(2,更新基本资料),(3,更新阶段),(4,更新标签),(5,变更课程顾问),(6,变更跟进记录),(7,提交报名表单信息),(8,体验课报名),(9,好友助力),(10,公众号海报)
    recordType: {
      type: Number,
      default: 0,
    },
    operatorName: {
      // 操作人
      type: String,
      default: '',
    },
    operateTime: {
      // 操作时间
      type: Number,
      default: 0,
    },
    operatorSchoolName: {
      // 操作人所在的校区
      type: String,
      default: '',
    },
    // 只给recordType === 1, 7, 8, 9, 10的时候用
    channel: {
      // 添加方式
      type: String,
      default: '',
    },
    source: {
      // 来源
      type: String,
      default: '',
    },
    owners: {
      // 线索课程顾问
      type: Array,
      default: () => {
        return [];
      },
    },
    regInfo: {
      // 表单报名资料项
      type: Array,
      default: () => {
        return [];
      },
    },
    attendTime: {
      // 意向上课时间
      type: [String, Number],
      default: '',
    },
    attendAddress: {
      // 意向上课地点
      type: String,
      default: '-',
    },
    courseName: {
      // 线下课名称
      type: String,
      default: '-',
    },
    // 只给recordType === 2的时候用
    stuBefore: {
      // 学院信息变更前
      type: Array,
      default: () => {
        return [];
      },
    },
    stuAfter: {
      // 学院信息变更前
      type: Array,
      default: () => {
        return [];
      },
    },
    // 只给recordType === 3的时候用
    phaseBefore: {
      // 线索阶段变更前
      type: Number,
      default: 0,
    },
    phaseAfter: {
      // 线索阶段变更后
      type: Number,
      default: 0,
    },
    relatedOrderNo: {
      // 成交关联订单
      type: String,
    },
    // 只给recordType === 4的时候用
    beforeTags: {
      // 标签变更前
      type: Array,
      default: () => {
        return [];
      },
    },
    afterTags: {
      // 标签变更后
      type: Array,
      default: () => {
        return [];
      },
    },
    // 只给recordType === 5的时候用
    beforeOwner: {
      // 课程顾问变更前
      type: Array,
      default: () => {
        return [];
      },
    },
    afterOwner: {
      // 课程顾问变更后
      type: Array,
      default: () => {
        return [];
      },
    },
    // 只给recordType === 100 更新来源的时候用
    beforeSource: {
      // 来源变更前
      type: Object,
      default: () => {
        return {};
      },
    },
    afterSource: {
      // 来源变更后
      type: Object,
      default: () => {
        return {};
      },
    },
    reason: {
      // 课程顾问变更原因
      type: String,
      default: '--',
    },
    // 只给recordType === 6的时候用
    recordText: {
      // 跟进记录文本
      type: String,
      default: '',
    },
    imageList: {
      // 跟进记录图片
      type: Array,
      default: () => {
        return [];
      },
    },
    revisitTime: {
      // 回访时间
      type: Number,
      default: 0,
    },
    beforeRole: {
      // 变更前角色
      type: Number,
      default: 0,
    },
    afterRole: {
      // 变更后角色
      type: Number,
      default: 0,
    },
    scene: {
      // 变更角色场景值
      type: String,
      default: '',
    },
    introduceName: {
      type: String,
      default: '',
    }
  },
  data() {
    return {
      date: format(this.operateTime, 'YYYY-MM-DD'),
      week: `星期${weekArr[getDay(this.operateTime)]}`,
    };
  },
  computed: {
    parsedRecordType() {
      let str = '';
      switch (this.recordType) {
        case -1:
          str = 'date';
          break;
        case 1:
        case 7:
        case 8:
        case 9:
        case 10:
        case 12:
          str = 'add';
          break;
        case 2:
          str = 'student';
          break;
        case 3:
          str = 'stage';
          break;
        case 4:
          str = 'tag';
          break;
        case 5:
          str = 'person';
          break;
        case 6:
          str = 'follow';
          break;
        case 100:
          str = 'source';
          break;
        case 101:
          str = 'role';
          break;
        default:
          str = 'add'; // 默认为系统添加
          break;
      }
      return str;
    },
  },
};
</script>

<style lang="scss" scoped>
.dynamic-item {
  .date {
    position: relative;
    padding: 0 0 20px 16px;
    height: 38px;
    border-left: 1px dashed #d0d0d0;
    font-size: 14px;
    font-weight: bold;
    color: #323233;
    &::before {
      display: block;
      position: absolute;
      top: 0;
      left: -4px;
      width: 8px;
      height: 8px;
      content: '';
      border-radius: 4px;
      background-color: #00b389;
    }
    .text {
      position: absolute;
      top: -7px;
      left: 16px;
    }
  }
}
</style>
