<template>
  <div class="share-img">
    <div class="heade-wrap">
      <div
        class="head-img"
        :style="{
          backgroundImage: `url(${drawInfo.img})`}"
      >
        <div class="avatar-head">
          <img class="user-avatar" :src="drawInfo.userAvatar">
          <p>我也在这学</p>
        </div>
      </div>
    </div>
    <div class="footer-wrap">
      <div v-if="drawInfo.price" class="footer-left">
        <div v-if="drawInfo.decreasePrice" class="black-price-content">
          ￥{{ drawInfo.price }}
        </div>
        <div class="red-price-content">
          {{ drawInfo.decreasePrice ? `立减 ￥${drawInfo.decreasePrice}` : `￥${drawInfo.price}` }}
        </div>
      </div>
      <div class="footer-right">
        <div class="main-btn">
          {{ drawInfo.price ? '立即报名' : '立即免费报名' }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    drawInfo: {
      type: Object,
      default: () => {
        return {
          decreasePrice: 0,
          price: 0,
        };
      },
    },
  },
};
</script>

<style scoped>
* {
  padding: 0;
  margin: 0;
}

.share-img {
  width: 185px;
  height: 157px;
  background-color: #FDF2E3;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.share-img__title {
  color: #FFFFFF;
  text-align: center;
  text-shadow: 0 1px 2px rgba(20,144,43,0.64);
  margin-top: 2px;
  line-height: 22px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
}

.share-img__title-text {
  font-size: 16px;
}

.main-price__origin {
  font-size: 15px;
  margin-left: 3px;
  color: #FFE176;
  margin-top: 2px;
}

.origin-price__num {
  font-family: Akrobat;
}

.origin-price__symbol {
  margin-right: -7px;
}

.heade-wrap {
  width: 100%;
  height: 104px;
  position: relative;
  overflow: hidden;
  border-radius: none;
}

.head-img {
  position: relative;
  background-size: cover;
  background-position: center center;
  display: block;
  width: 100%;
  height: 100%;
}

.avatar-head {
  position: absolute;
  top: 8px;
  left: 8px;
  opacity: 0.7;
  background: #FFFFFF;
  border-radius: 32px;
  font-size: 12px;
  font-weight: bold;
  color: #39393A;
  line-height: 18px;
  display: flex;
  align-items: center;
  padding: 4px;
}

.user-avatar {
  width: 18px;
  height: 18px;
  margin-right: 4px;
  border-radius: 100%;
}

.footer-wrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex: 1;
  padding: 0 6px;
}

.footer-left,
.footer-right {
  flex: 1;
}

.black-price-content {
  font-size: 12px;
  color: #323233;
}

.red-price-content {
  font-size: 14px;
  color: #FF5100;
  font-weight: bold;
}

.main-btn {
  width: 100%;
  background-image: linear-gradient(131deg, #FF7B17 0%, #FF2B00 100%);
  border-radius: 16px;
  height: 32px;
  line-height: 32px;
  font-size: 14px;
  color: #FFE5BB;
  text-align: center;
  font-weight: bold;
}

.footer-price__origin {
  font-size: 14px;
  color: #45BF55;
  margin-left: -4px;
  margin-right: 41px;
  font-weight: bold;
}

.footer-price__num {
  font-family: Akrobat;
}

.footer-price__symbol {
  margin-right: -7px;
}
</style>
