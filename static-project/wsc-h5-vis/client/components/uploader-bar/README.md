# uploader-bar

owner @云舒

## 组件功能
目前为课程评价上传图片所用
有压缩图片，上传后预览的功能

## 使用方式
\```js
import UploaderBar from 'components/uploader-bar';

<uploader-bar
  :max-size="12 * 1024 * 1024"
  :max-num="4"
  @getImage="onGetImage"
/>

export default {
  methods: {
    onGetImage(imgs) {
      console.log(imgs);
    }
  }
}
\```

### API
|参数|说明|类型|默认值|是否必填|
|---|----|---|-----|-------|
|maxSize|图片大小的最大值|Number|12M|否|
|maxNum|最大上传张数|Number|1|否
|getImage|上传成功后的回调函数
