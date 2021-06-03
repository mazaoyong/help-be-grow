export default {
  // 学员提交表单
  form: function() {
    return {
      avatar: '',
      name: '',
      studentNo: '',
      mobile: '',
      gender: 0,
      bornDate: '',
      age: '',
      grade: '',
      wechatAccount: '',
      address: '',
      _addressArr: [],
      _area: '',
    };
  },
  // 表单字段校验
  rules: function() {
    return {
      name: { required: true, pattern: /^.{1,20}$/, requiredMsg: '请填写学员姓名', errMsg: '学员姓名不能超过20个字' },
      mobile: { required: true, pattern: /^1\d{10}$/, requiredMsg: '请填写手机号', errMsg: '请输入合法的手机号' },
      grade: { required: false, pattern: /^.{0,10}$/, requiredMsg: '请填写年级', errMsg: '年级不能超过10个字' },
      wechatAccount: { required: false, pattern: /^.{0,30}$/, requiredMsg: '请填写微信号', errMsg: '微信号不能超过30个字' },
      _area: { required: false, pattern: /^.{0,100}$/, requiredMsg: '请填写详细地址', errMsg: '详细地址不能超过100个字' },
    };
  },
  // 部分字段
  fields: function() {
    return [
      {
        key: 'mobile',
        label: '联系电话',
        required: true,
        placeholder: '（必填）填写联系电话',
      },
      {
        key: 'gender',
        label: '性别',
      },
      {
        key: 'bornDate',
        label: '生日',
        icon: 'arrow',
        readonly: true,
        required: false,
        placeholder: '学员的生日',
      },
      {
        key: 'age',
        label: '年龄',
        readonly: true,
      },
      {
        key: 'grade',
        label: '年级',
        required: false,
        placeholder: '学员的在读年级',
      },
      {
        key: 'wechatAccount',
        label: '微信号',
        required: false,
        placeholder: '便于老师沟通联系',
      },
      {
        key: 'address',
        label: '联系地址',
        icon: 'arrow',
        readonly: true,
        required: false,
        placeholder: '省份、城市、区县',
      },
      {
        key: '_area',
        label: '',
        required: false,
        placeholder: '街道、楼牌号等',
      },
    ];
  },
};
