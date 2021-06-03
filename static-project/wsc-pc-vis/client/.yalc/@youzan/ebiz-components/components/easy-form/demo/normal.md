---
order: 0
title: 基础用法
subtitle: Basic
---

这里是组件的相关描述

```jsx
import { Button, Validators, ValidateOccasion, Label } from 'zent';
import { EasyForm } from '@youzan/ebiz-components';

const { EasyFormRenderer, list, group } = EasyForm;
const ListTrigger = (props) => {
  const { methods, children, label, required, disabled } = props;
  return (
    <div className="list-container">
      <div className="list-trigger" style={{ display: 'flex', marginBottom: '16px' }}>
        <Label required={required}>{label}</Label>
        <div>
          <Button type="primary" disabled={disabled} onClick={() => methods.add()}>
            添加
          </Button>
          <Button type="danger" disabled={disabled} onClick={() => methods.delete()}>
            删除一个
          </Button>
        </div>
      </div>
      <div className="list-body">{children}</div>
    </div>
  );
};
const favoriteFruitList = [
  { text: '苹果', value: 'apple' },
  { text: '香蕉', value: 'banana' },
  { text: '鳄梨', value: 'avocadoPear' },
];
const BasicDemo = (props) => {
  const formRef = React.useRef(null);

  React.useEffect(() => {
    if (formRef.current) {
      formRef.current.zentForm.initialize({
        studentName: '阿浪',
        favoriteFruit: ['apple'],
      });
    }
  }, [formRef]);

  const handleUpdate = React.useCallback(() => {
    if (formRef.current) {
      formRef.current.easyForm.patchValue({
        studentMobile: 13067768990,
        studentBaseInfo: {
          studentAge: 18,
        },
      });
    }
  }, [formRef]);

  return (
    <div>
      <Button onClick={handleUpdate}>设置年龄和学员手机号</Button>
      <EasyFormRenderer
        preview
        ref={formRef}
        onSubmit={({ zentForm }) => {
          console.log(zentForm.getValue());
        }}
        config={[
          {
            name: 'title',
            type: 'Plain',
            node: <h1>我是大标题</h1>,
          },
          {
            name: 'studentName',
            label: '学员姓名',
            type: 'Input',
            required: true,
            helpDesc: '算命算命，不准不要钱',
            inheritProps: {
              placeholder: '请输入学员姓名',
            },
            validators: [Validators.required('请填写姓名')],
          },
          {
            name: 'studentMobile',
            label: '学员手机号',
            type: 'NumberInput',
            defaultValue: 12398890223,
            inheritProps: { integer: true },
          },
          {
            name: 'hasRegister',
            label: '已经报道',
            type: 'Switch',
            defaultValue: true,
          },
          {
            name: 'favoriteFruit',
            label: '最喜欢的水果',
            type: 'Checkbox',
            options: favoriteFruitList,
            watch: {
              'hobbies[1]'(value, ctx) {
                const favoriteFruits = value.split(',');
                const inputFruits = favoriteFruitList
                  .filter((fruit) => favoriteFruits.includes(fruit.value))
                  .map((fruitOpt) => fruitOpt.value);
                ctx.set({ value: inputFruits });
              },
            },
          },
          group({
            groupName: 'studentBaseInfo',
            groupTitle: '学员基本信息',
            collapse: true,
            config: [
              {
                name: 'studentAge',
                label: '学员年龄',
                type: 'Input',
                defaultValue: 12,
                validateOccasion: ValidateOccasion.Change,
                validators: [Validators.max(120, '你是乌龟还是成仙了？')],
                watch: {
                  'studentBaseInfo.studentGender'(value, ctx) {
                    ctx.set({ value: value === '1' ? 18 : 16 });
                  },
                  'hobbies[0]'(value, ctx) {
                    ctx.set({ value });
                  },
                },
              },
              {
                name: 'hasMarried',
                label: '已婚',
                type: 'Radio',
                options: [
                  { text: '是', value: '1' },
                  { text: '否', value: '0' },
                ],
                required: true,
                visible: false,
                watch: {
                  'studentBaseInfo.studentAge'(value, ctx) {
                    if (value >= 18) {
                      ctx.set({ status: { visible: true } });
                    }
                  },
                },
                validators: [Validators.required('请选择婚姻状况')],
              },
              {
                name: 'studentGender',
                label: '学员性别',
                type: 'Radio',
                defaultValue: '1',
                options: [
                  { text: '男', value: '1', description: '生男生女都一样，计划生育我说好' },
                  { text: '女', value: '0', desc: '女儿也是传家宝，女人能顶半边天' },
                ],
                watch: {
                  'studentBaseInfo.studentAge'(value, ctx) {
                    ctx.set({ status: { disabled: value > 18 } });
                  },
                },
              },
            ],
          }),
          list({
            label: '你的爱好',
            listName: 'hobbies',
            repeatTrigger: ListTrigger,
            repeatConfig: {
              name: 'hobbiesItem',
              label(_, idx) {
                return '爱好' + (idx + 1);
              },
              type: 'Input',
              inheritProps: {
                placeholder: '请输入爱好',
              },
            },
            watch: {
              'studentBaseInfo.studentAge'(value, ctx, easyForm) {
                const formValues = easyForm.getValue();
                if (formValues) {
                  const gender = formValues.studentBaseInfo.studentGender;
                  ctx.set([
                    {
                      props: { placeholder: `${value}岁${gender === '1' ? '男' : '女'}孩的爱好` },
                    },
                  ]);
                }
              },
            },
          }),
        ]}
      />
    </div>
  );
};

ReactDOM.render(<BasicDemo />, mountNode);
```
