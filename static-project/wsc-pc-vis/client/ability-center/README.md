# 能力中心目录

## 描述

此目录下按模块提取业务能力（相比 pages 下，舍弃业务域一层），仅存放能力引用而不是将代码 copy 到这里，可见 sample-module

```
ability-center
├── README.md
├── appointment
├── classroom
├── course-evaluation
├── educlass
├── educourse
├── schedule
├── a-sample-module
├── index.ts
└── ...
```

**注意：在能力中心组件不能有调用上下文数据的，比如不能使用 ebiz-state 去获取某个页面全局状态**
