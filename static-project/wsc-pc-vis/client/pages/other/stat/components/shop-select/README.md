## 店铺选择下拉框

导入路径` client/pages/other/stat/components/shop-select`

### 适用场景

在campus-filter组件中引用，该组件是copy来的。建议不在其他处使用


### 代码演示

![shop-select](https://img.yzcdn.cn/upload_files/2020/03/26/FuIihH2s7z4X00kzdOX5s2WZtY7r.png)

```jsx
  <StatShopSelect
    className={`${clsPrefix}__right`}
    rootShop={_global.shopInfo}
    kdtId={context.subKdtId}
    shopList={showShopList ? shopList : []}
    onChange={onChange}
    onOpen={onOpen}
    divideItems={divideItems}
    filter={showFilter ? (item, keyword) => item.shopName.includes(keyword) : null}
  />
```

### config配置项
略

