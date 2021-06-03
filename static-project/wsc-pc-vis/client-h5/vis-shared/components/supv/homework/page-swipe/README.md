## DEMO

```
import Swipe from './components/swipe';

<Swipe
  showNext={model.hasNext.value}
  nextText="下一个学员"
  showPrev={model.hasPrev.value}
  list={
    model.assignmentList.value.map(assignment => (
      <div class="assignment-detail">
        <div class="card">
          作业详情
        </div>

        <div class="card">
          学生作业
        </div>

        <div class="card">
          老师评语
        </div>
      </div>
    ))
  }
/>
```

## 支持的 Props

```
const initialProps = {
  list: [],
  initialIndex: 0,
  showNext: false,
  showPrev: false,
  nextText: '',
  prevText: '',
  handleNext: (index: number) => {},
  handlePrev: (index: number) => {},
};
```
