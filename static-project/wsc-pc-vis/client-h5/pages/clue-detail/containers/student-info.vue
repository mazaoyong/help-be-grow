<template>
  <div>
    <!-- 学员的详细信息 开始 -->
    <spread class="student-info" @toggle="onToggle">
      <!-- header 开始 -->
      <div class="header">
        <div class="info">
          <img-wrap
            class="avatar"
            :width="'45px'"
            :height="'45px'"
            :src="avatar"
            :cover="true"
            @click.native="onPreview(avatar)"
          />
          <icon
            v-if="sex"
            class="sex"
            :name="sex === '2' ? 'girl' : 'boy'"
            size="16px"
            color="#57a9fa"
          />
          <span class="mobile">{{ mobile }}</span>
          <span class="name-box">
            <span class="name">{{ name }}</span>
          </span>
        </div>
        <div class="btn-box">
          <van-button
            class="edit-clue-btn"
            plain
            round
            hairline
            type="primary"
            @click="onEdit"
          >
            编辑
          </van-button>
          <van-button
            class="clue-status-btn"
            round
            type="primary"
            @click="onChangeStatus"
          >
            {{ statusText }}
            <icon :name="isShow ? 'arrow-up' : 'arrow-down'" size="10px" color="#fff" />
          </van-button>
        </div>
      </div>
      <!-- header 结束 -->

      <!-- body 开始 -->
      <div class="body" :style="bodyStyle">
        <div v-for="(attribute, index) in newAttributes" :key="index" class="attribute-item">
          <span class="left">{{ attribute.attributeTitle }}</span>
          <span class="right" :class=" isSpread ? 'right-one-line' : ''">
            {{ attribute.parsedAttributeValue || '-' }}
            <van-tag
              v-if="attribute.attributeType === 'revisitTime' && attribute.tagText"
              plain
            >{{ attribute.tagText }}</van-tag>
            <a
              v-if="attribute.operation"
              class="watch-detail"
              href="javascript: void(0);"
              @click="onWatchDetail"
            >{{ attribute.operation }}</a>
            <span v-if="attribute.sourceType === 4">
              <span class="source-ext-info">意向体验时间：{{ source.attendTime | formatTime }}</span>
              <span class="source-ext-info">意向体验地点：{{ source.attendAddress || '-' }}</span>
            </span>
            <span v-if="attribute.sourceType === 5 || attribute.sourceType === 6">
              <span class="source-ext-info">报名线下课：{{ source.courseName }}</span>
            </span>
          </span>
        </div>
      </div>
      <!-- body 结束 -->
    </spread>
    <!-- 学员详细信息 结束 -->

    <!-- 更新阶段actionsheet 开始 -->
    <van-actionsheet v-model="isShow" title="更新阶段">
      <p
        v-for="(statusText, index) in activeStatusArr"
        :key="index"
        class="status"
        :class="index === (cloneStatus - 2 ) ? 'active' : ''"
        @click="onSelectStatus(index)"
      >
        {{ statusText }}
        <icon
          v-if="index === (cloneStatus - 2 )"
          class="check"
          name="check"
          size="14px"
          color="#00b389"
        />
      </p>
    </van-actionsheet>
    <!-- 更新阶段actionsheet 结束 -->
  </div>
</template>

<script>
import { Button, Tag, ActionSheet, Toast, ImagePreview } from 'vant';
import { ImgWrap, Icon } from '@youzan/vis-ui';
import { isEduSingleStore } from '@youzan/utils-shop';
import { format, isSameDay, differenceInCalendarMonths, differenceInCalendarDays } from 'date-fns';
import Spread from '../components/spread.vue'; // 折叠面板组件
import router from '../router.js';

const initBodyStyle = {
  // 初始化折叠的max-height
  maxHeight: '76px'
};
// const statusArr = ['默认态', '待分配', '待跟进', '待邀约', '待试听', '已试听', '已成交', '放弃线索'];
const infoStatusArr = ['', '待分配', '待跟进', '待邀约', '待试听', '已试听', '已成交'];
const actionStatusArr = ['', '', '待跟进', '待邀约', '待试听', '已试听', '已成交'];

export default {
  name: 'student-info',
  components: {
    'van-button': Button,
    'van-tag': Tag,
    'van-actionsheet': ActionSheet,
    'img-wrap': ImgWrap,
    icon: Icon,
    spread: Spread
  },
  filters: {
    formatTime(time) {
      if (time) {
        return format(time, 'YYYY-MM-DD HH:mm');
      }
      return '-';
    }
  },
  props: {
    clueId: {
      type: Number,
      default: 0
    },
    avatar: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    },
    mobile: {
      type: String,
      default: ''
    },
    sex: {
      type: String,
      default: ''
    },
    status: {
      // 1.待分配 2.待跟进 3.待邀约 4待试听 5 已试听 6 已成交
      type: Number,
      default: 0
    },
    attributes: {
      type: Array,
      default: () => {
        return [];
      }
    },
    revisitTime: {
      type: [String, Number, Boolean],
      default: null
    },
    source: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      isSpread: true, // 是否是折叠状态
      isShow: false, // 跟进状态面板是否隐藏
      bodyStyle: initBodyStyle,
      parsedAttribute: [], // 去掉头像、姓名、手机号、性别
      newAttributes: [],
      parsedRevisitTimeAndSourse: [],
      cloneStatus: this.status,
      filteredAttributes: [] // 因为后端返回的列表是包括姓名，手机号之类的，这些需要去掉
    };
  },
  computed: {
    activeStatusArr() {
      // 过滤了statusArr的前两个空元素
      return actionStatusArr.filter(status => {
        return Boolean(status);
      });
    },
    statusText() {
      return infoStatusArr[this.cloneStatus];
    }
  },
  mounted() {
    this.parsedRevisitTimeAndSourse = this.parseRevisitTimeAndSourse();
    this.filterAttributes();
    this.parseAttributes();
    console.log('attr', this.newAttributes);
  },
  methods: {
    onEdit() {
      window.location.href = `/v4/vis/h5/edu/clue/update-clue?type=edit&clueId=${this.clueId}`;
    },
    onChangeStatus() {
      this.isShow = !this.isShow;
    },
    onSelectStatus(index) {
      const clueId = this.clueId;
      const targetStateCode = index + 2;
      if (targetStateCode === 6) {
        // 前往选择订单页面
        router.push({ name: 'select-order', query: { clueId: this.clueId } });
        return;
      }
      this.$store
        .dispatch('clueDetailModule/changeState', { clueId, targetStateCode })
        .then(res => {
          this.cloneStatus = index + 2;
          Toast('修改成功');
          this.$bus.$emit('refreshRecordList');
        })
        .catch(err => {
          Toast(err);
        });
      this.isShow = false;
    },
    onToggle(bool) {
      // bool -> true 折叠; bool - false 展开
      this.isSpread = bool;
      this.bodyStyle = bool ? initBodyStyle : {};
      this.parseAttributes();
    },
    onWatchDetail() {
      this.$store.dispatch('clueDetailModule/setSignupDetailData', {
        regInfo: this.source.regInfo
      });
      router.push({ name: 'signup-detail', query: { clueId: this.clueId } });
    },
    onPreview(url) {
      ImagePreview({
        images: [url],
        showIndex: false
      });
    },
    filterAttributes() {
      // EDU_STU_NAME(1, "edu_stuName", "姓名"),
      // EDU_STU_AVA(2, "edu_stuAva", "学员头像"),
      // EDU_STU_BIRTH(3, "edu_stuBirth", "学员生日"),
      // EDU_STU_AGE(4, "edu_stuAge", "学员年龄"),
      // EDU_STU_SEX(5, "edu_stuSex", "学员性别"),
      // EDU_STU_CONTRACT_PHONE(6, "edu_stuContractPhone", "联系人手机号"),
      // EDU_STU_CONTRACT_WECHAT(7, "edu_stuContractWeChat", "联系人微信地址"),
      // EDU_STU_ADDRESS(8, "edu_stuAddress", "学员联系地址"),
      // EDU_STU_GRADE(9, "edu_stuGrade", "学员年级");
      const filterArr = ['edu_stuName', 'edu_stuAva', 'edu_stuContractPhone'];
      const parsedAttribute = [];
      this.attributes.forEach(attribute => {
        const { attributeKey, dataType } = attribute || {};
        if (filterArr.indexOf(attributeKey) === -1) {
          switch (attributeKey) {
            // 年龄要根据生日计算得出，因为数据库存的不会变化
            case 'edu_stuAge':
              // 年龄要根据生日计算得出，因为数据库存的不会变化
              const stuBirthArr = this.attributes.filter(attribute => {
                return attributeKey === 'edu_stuBirth';
              });
              if (stuBirthArr && stuBirthArr.length > 0) {
                const stuBirth = stuBirthArr[0].attributeValue;
                attribute.parsedAttributeValue = this.computeStuAge(stuBirth);
              }
              break;
            default:
              break;
          }
          // 添加逻辑：根据dataType来处理多选项和单选项的时候展示问题
          switch (dataType) {
            case 4:
              // 性别
              switch (attribute.attributeValue) {
                case '1':
                  attribute.parsedAttributeValue = '男';
                  break;
                case '2':
                  attribute.parsedAttributeValue = '女';
                  break;
                default:
                  attribute.parsedAttributeValue = '-';
                  break;
              }
              break;
            case 3:
              // PROVINCE;
              // eslint-disable-next-line no-fallthrough
            case 6:
              // ADDRESS:
              let address = attribute.attributeValue || '-';
              if (typeof address === 'string' && address !== '') {
                try {
                  address = (JSON.parse(address) || []).map(item => item.name || '').join('');
                } catch (err) {
                  // eslint-disable-next-line no-console
                  console.error('地址转换出错，使用原有数据进行展示');
                  address = attribute.attributeValue || '-';
                }
              }
              attribute.parsedAttributeValue = address;
              break;
            case 7:
            case 8:
              // dataType 7: 单选 8：多选
              const selecteds = String(attribute.attributeValue).split(',');
              const { attrItem } = attribute;
              if (Array.isArray(attrItem)) {
                if (attrItem.length > 0 && selecteds.length > 0) {
                  const values = selecteds.map(selected => {
                    const target = attrItem.find(item => String(item.id) === selected) || {};
                    return target.value || undefined;
                  });
                  // 需要处理如果都没有合法的选项的时候
                  if (values.every(val => !!val)) {
                    attribute.parsedAttributeValue = values.join(',');
                  }
                  break;
                }
              }
              attribute.parsedAttributeValue = '-';
              break;
            default:
              if (!attribute.parsedAttributeValue) {
                attribute.parsedAttributeValue = attribute.attributeValue;
              }
              break;
          }
          // 产品希望没有值的时候也显示资料项，attributeValue显示-
          parsedAttribute.push(attribute);
          // if (attribute.parsedAttributeValue) { // 有值的时候才push到parsedAttribute数组中
          //   parsedAttribute.push(attribute);
          // }
        }
      });

      this.parsedAttribute = parsedAttribute;
    },
    parseAttributes() {
      // 处理一下attributes，因为回访时间和来源需要合并到attributes的数组中
      if (this.isSpread) {
        // 如果面板为折叠状态，那么只展示回访时间和来源
        this.newAttributes = this.parsedRevisitTimeAndSourse;
      } else {
        // 如果面板为展开状态，那么显示所有的资料项，包括回访时间和来源
        this.newAttributes = [...this.parsedAttribute, ...this.parsedRevisitTimeAndSourse];
      }
    },
    parseRevisitTimeAndSourse() {
      // 将回访时间和来源转换为数组
      const parsedRevisitTimeAndSourse = [];
      if (this.revisitTime) {
        // 不一定存在回访时间
        const revisitTime = {
          attributeTitle: '回访时间',
          attributeType: 'revisitTime',
          parsedAttributeValue: format(this.revisitTime, 'YYYY-MM-DD HH:mm'),
          tagText: this.parseRevisitTimeTagText()
        };
        parsedRevisitTimeAndSourse.push(revisitTime);
      }

      const parsedSourceValue = isEduSingleStore
        ? `${this.source.groupName}/${this.source.name}`
        : `${this.source.groupName}/${this.source.name}(${this.source.schoolName})`;
      const source = {
        attributeTitle: '来源',
        parsedAttributeValue: parsedSourceValue,
        attributeType: 'source',
        // 2：自定义, 3：报名表单, 4：体验课报名, 5：好友助力, 6：公众号海报
        sourceType: this.source.sourceType, // 来源的type
        operation: this.source.operation ||
          this.source.sourceType === 3 // 兼容老数据
          ? '查看报名详情'
          : this.source.sourceType === 7
            ? '查看表单详情'
            : null
      };
      parsedRevisitTimeAndSourse.push(source);

      return parsedRevisitTimeAndSourse;
    },
    parseRevisitTimeTagText() {
      if (!this.revisitTime) {
        return '';
      }
      const currentDateTime = new Date().getTime();
      const revisitTime = new Date(this.revisitTime).getTime();

      const lastDay = parseInt((revisitTime - currentDateTime) / (24 * 60 * 60 * 1000));
      if (lastDay === 0) {
        if (isSameDay(revisitTime, currentDateTime)) {
          return '今天';
        } else {
          return '距今1天';
        }
      } else if (lastDay > 0) {
        return `距今${lastDay}天`;
      }
      return '已逾期';
    },
    computeStuAge(val) {
      if (!val) {
        return '-';
      }
      val = val.replace(/-/g, '/');
      let age = '';
      const selectedDate = new Date(val).getTime();
      const currentDate = new Date().getTime();
      const distanceMonth = differenceInCalendarMonths(currentDate, selectedDate);
      const distanceDay = differenceInCalendarDays(currentDate, selectedDate);
      if (distanceMonth > 11) {
        age = `${parseInt(distanceMonth / 12)}岁`;
      } else if (distanceMonth > 0) {
        age = `${distanceMonth}个月`;
      } else {
        age = `${distanceDay}天`;
      }

      return age;
    }
  }
};
</script>

<style lang="scss" scoped>
.student-info {
  .header {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    position: relative;
    padding: 0 0 0 15px;
    border-bottom: 1px solid #f2f2f2;
    .info {
      display: inline-block;
      position: relative;
      width: 172px;
      min-height: 71px;
      .avatar {
        position: absolute;
        top: 13px;
        left: 0;
        border-radius: 50%;
      }
      .sex {
        position: absolute;
        top: 40px;
        left: 30px;
        // border: 1px solid #fff;
        border-radius: 7px;
      }
      .mobile {
        display: block;
        margin-top: 17px;
        margin-left: 55px;
        // position: absolute;
        // top: 17px;
        // left: 55px;
        max-width: 115px;
        font-size: 16px;
        font-weight: bold;
        color: #323233;
        overflow: hidden;
      }
      .name-box {
        display: block;
        margin: 5px 0 5px 55px;
        // position: absolute;
        // top: 37px;
        // left: 55px;
        font-size: 13px;
        color: #323233;
        overflow: hidden;
        .name {
          display: inline-block;
          font-size: 13px;
          color: #323233;
          overflow: hidden;
        }
      }
    }
    .btn-box {
      display: block;
      position: relative;
      margin-right: 15px;
      width: 137px;
      height: 51px;
      .edit-clue-btn {
        position: absolute;
        height: 22px;
        top: 15px;
        right: 81px;
        line-height: 1;
        padding: 0 12px;
        font-size: 12px;
        border: 1px solid #ddd;
        color: #646566;
      }
      .clue-status-btn {
        position: absolute;
        height: 22px;
        top: 15px;
        right: 0;
        line-height: 1;
        padding: 0 10px;
        font-size: 12px;
        background-color: #00b389;
        .vis-icon {
          vertical-align: -0.1em;
        }
      }
    }
  }
  .body {
    padding: 13px;
    overflow: hidden;
    .attribute-item {
      display: flex;
      margin-bottom: 5px;
      .left {
        display: block;
        margin-right: 20px;
        width: 82px;
        font-size: 13px;
        color: #969799;
      }
      .right {
        display: block;
        flex: 1;
        flex-wrap: wrap;
        font-size: 13px;
        color: #323233;
        padding-bottom: 5px;
        min-height: 23px;
      }
      .right-one-line {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .van-tag {
        line-height: 1;
        font-size: 12px;
        color: #00b389;
        background-color: #dcf6e9;
        border: 1px solid #00b389;
      }
      .van-hairline--surround::after {
        border-width: 0;
      }
      .watch-detail {
        display: block;
        line-height: 18px;
        font-size: 13px;
        color: #00b389;
      }
      .source-ext-info {
        display: block;
        color: #969799;
      }
    }
  }
}
.van-action-sheet__content {
  .status {
    position: relative;
    padding-left: 15px;
    line-height: 38px;
    font-size: 13px;
    color: #323233;
    .check {
      position: absolute;
      top: 12px;
      right: 15px;
    }
  }
  .active {
    color: #00b389;
  }
}
</style>
