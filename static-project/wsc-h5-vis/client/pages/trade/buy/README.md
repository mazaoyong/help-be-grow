# 课程下单页

## 目录说明
```
.
├── App.vue
├── README.md
├── api
├── biz-service                 交易/支付相关代码
├── common                      抽取出来的通用/经常改动的代码
├── components                  组件目录，约定这里的组件不能使用store
├── main.js
├── router.js
├── sass                        目前是上云预留的文件
├── store vuex store
├── utils
└── view
```

## 使用 vuex
当前page内文件都支持使用vuex（除了部分popup使用了 quick-open 的弹窗，因为不是当前实例，所以不支持）

### 使用方法
对vuex做了一层封装，使用方法如下
```js
export default {
  name: 'demo',
  // 对应 mapState
  state: ['xxx'],
  // 对应 mapGetters
  getters: ['xxx'],
  // 当前放置的位置无限制，约定放在data的上面
  data() {
    return {};
  },
  methods: {
    onClick() {
      // 等价于 this.store.$commit('xxx')
      this.$commit('XXX');
      // 等价于 this.store.$dispatch('xxx')
      this.$dispatch('XXX');
    }
  }
}
```
