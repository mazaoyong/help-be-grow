### 约定

- design 目前由node维护，分为 top、pic、main、bottom 四块，方便后期上云
- blocks 内可复用的公共逻辑放在 blocks 的 store 中进行管理，非公共逻辑放在组件内
- rootStore 中不可添加非全局性逻辑
- ./components 内组件不允许使连接 store ，保证可复用
- 新增 block 使用 z-empty 复制
- 模块、组件的显隐逻辑收敛在模块、组件内部，不要在外部判断
- 环境判断尽量用 store 中的 env 字段
- state、getters、rootState、rootGetters 属性写在 data 属性下方，computed 属性上方
- state、getters、rootState、rootGetters 属性间不用换行
- state、getters、rootState、rootGetters 按照此顺序书写
