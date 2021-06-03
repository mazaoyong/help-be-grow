<template>
  <popup v-model="value" :buttons="buttons" @open="onOpen">
    <h3 class="title">
      答对问题，完成预约!
      <van-icon
        class="close"
        name="clear"
        color="#dcdde0"
        size="22px"
        @click="onClose"
      />
    </h3>
    <van-loading v-if="loading" class="loading" />
    <div v-else>
      <h4 class="question">
        {{ question }}
      </h4>
      <van-radio-group v-model="selected">
        <van-cell-group>
          <van-cell
            v-for="item in answers"
            :key="item.key"
            clickable
            @click="selected = item.key"
          >
            <slot name="title">
              <van-radio :name="item.key">
                <span class="anwser">{{ item.content }}</span>
              </van-radio>
            </slot>
          </van-cell>
        </van-cell-group>
      </van-radio-group>
    </div>
  </popup>
</template>

<script>
import { Icon, RadioGroup, Radio, CellGroup, Cell, Toast, Loading } from 'vant';
import Popup from '../popup';
import { getQuestion } from './api';

export default {
  name: 'question',

  components: {
    [Popup.name]: Popup,
    [Icon.name]: Icon,
    [Radio.name]: Radio,
    [RadioGroup.name]: RadioGroup,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Loading.name]: Loading,
  },

  props: {
    value: {
      type: Boolean,
      required: true,
    },
    id: {
      type: Number,
      required: true,
    },
  },

  data() {
    return {
      loading: true,
      question: '',
      answers: [],
      correctId: null,
      selected: null,
      buttons: [
        {
          text: '答完提交',
          class: 'main-btn',
          onClick: () => { this.submit(); },
        },
      ],
    };
  },

  mounted() {
    // 这个版本的vant的popup还没有open事件。。。
    this.onOpen();
  },

  methods: {
    onOpen() {
      if (!this.question) {
        this.loading = true;
        getQuestion(this.id)
          .then(res => {
            this.question = res.title;
            this.answers = res.options;
            this.correctId = res.answer_key;
          })
          .catch(err => {
            Toast.fail(err);
          })
          .finally(() => {
            this.loading = false;
          });
      }
    },

    submit() {
      if (this.selected === this.correctId) {
        this.$emit('success');
      } else {
        Toast('哎呀，答案不对哦~');
      }
    },

    onClose() {
      this.$emit('close');
    },
  },
};
</script>

<style lang="scss" scoped>
.title {
  position: relative;
  height: 44px;
  line-height: 44px;
  text-align: center;
  font-size: 16px;
  color: #333;
}

.close {
  position: absolute;
  top: 11px;
  right: 16px;
}

.loading {
  margin: 20px auto;
}

.question {
  padding: 20px 16px;
  line-height: 20px;
  background-color: rgba(150, 151, 153, .1);
  font-size: 14px;
  color: #333;
}

.anwser {
  line-height: 40px;
}
</style>
