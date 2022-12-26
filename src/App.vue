<template>
  <div class="container">
    <swiper
        :direction="'vertical'"
        :slidesPerView="1"
        :spaceBetween="0"
        @slideChange="swiperChange"
        :mousewheel="false"
        :allowTouchMove="false"
        @swiper="onSwiper"
        :pagination="{clickable: false}"
        class="mySwiper"
    >
      <swiper-slide v-for="(item, index) in photoList" :key="index">
        <div v-show="index === 0" class="buttonContainer">
          <button :onclick="openReport" class="openReportButton" disabled>开启报告</button>
          <p class="openReportText">数据统计周期截止至2022年12月26日</p>
        </div>
        <div v-show="index !== 0 && index !== 4" class="arrow_down">
          <img src="@/assets/arrow-down.svg" width="10" height="10"/>
          <p style="color: #bfbfbf; font-size: 10px; margin-top: 5px">上滑查看下一页</p>
        </div>
        <img class="img" :style="{backgroundImage: item, width: screenWidth + 'px'}" alt="" src=""/>
      </swiper-slide>
    </swiper>

    <div class="sourceLoading" v-show="!downloadOver">资源下载中，请稍候开启报告...</div>

    <div class="btnMusic" :onclick="toggleMute">
      <img :src="require(isMute ? '@/assets/music_off.svg' : '@/assets/music_on.svg')">
    </div>

    <div v-if="currentIndex === 0" class="div1">
      <p style="color: deeppink">LoveLiveMusicPlayer</p>
      <p style="color: yellow">年度报告</p>
    </div>

    <div v-if="currentIndex === 1" class="div2">
      <p style="color: deeppink">累计用户</p>
      <p style="color: yellow">1270人</p>
    </div>

    <div v-if="currentIndex === 2" class="div3">
      <p style="color: deeppink">启动次数</p>
      <p style="color: yellow">10881次</p>
    </div>

    <div v-if="currentIndex === 3" class="div4">
      <p style="color: deeppink; font-size: 30px">前十名播放最多的歌曲</p>
      <p style="color: #FFAE00">1. 僕らのLIVE 君とのLIFE - 565次</p>
      <p style="color: #00BBFF">2. Snow halation - 355次</p>
      <p style="color: #A8A8A8">3. 永遠の一瞬 - 349次</p>
      <p style="color: #6D56FF">4. Eutopia - 309次</p>
      <p style="color: #FEE115">5. CHASE! - 282次</p>
      <p style="color: #FF6239">6. 未来は風のように - 281次</p>
      <p style="color: #E44FFF">7. Vroom Vroom - 268次</p>
      <p style="color: #44CD41">8. Tiny Stars - 266次</p>
      <p style="color: #FF62DD">9. Blue! - 262次</p>
      <p style="color: yellow">10. stars we chase - 246次</p>
    </div>

    <div v-if="currentIndex === 4" class="div5">
      <p style="color: deeppink; font-size: 30px">2022年11月1日</p>
      <p style="color: deeppink; font-size: 30px">LLMP-M正式上线</p>
      <p style="color: deeppink; font-size: 30px">希望接下来的每分每秒</p>
      <p style="color: deeppink; font-size: 30px">都能带给你开心和悸动</p>
      <img style="width: 150px; height: auto; margin-top: 50px" :src="require('@/assets/bg/6.png')">
    </div>

    <audio :src="require('@/assets/1.mp3')" muted loop id="music_player" hidden/>
  </div>
</template>

<script>
import {Swiper, SwiperSlide} from 'swiper/vue';
import "swiper/css";
import "@/styles/app.css"

export default {
  components: {
    Swiper,
    SwiperSlide,
  },

  mounted() {
    document.onreadystatechange = () => {
      if (document.readyState === 'complete') {
        this.downloadOver = true
        document.querySelector('.openReportButton').disabled = false
      }
    }
  },

  data() {
    document.body.style.overflow = 'hidden'
    return {
      screenWidth: document.documentElement.clientWidth,
      photoList: [
        'url(' + require('@/assets/bg/1.jpg') + ')',
        'url(' + require('@/assets/bg/2.jpg') + ')',
        'url(' + require('@/assets/bg/3.jpg') + ')',
        'url(' + require('@/assets/bg/4.jpg') + ')',
        'url(' + require('@/assets/bg/5.jpg') + ')',
      ],
      mySwiper: null,
      currentIndex: 0,
      downloadOver: false,
      isMute: true
    }
  },

  methods: {
    onSwiper(swiper) {
      this.mySwiper = swiper;
    },

    swiperChange(event) {
      this.mySwiper.allowTouchMove = event.activeIndex > 0
      this.mySwiper.allowSlideNext = event.activeIndex !== this.photoList.length - 1
      this.currentIndex = event.activeIndex
    },

    toggleMute() {
      const music = document.querySelector('#music_player')
      music.muted = !music.muted
      this.isMute = music.muted
    },

    openReport() {
      const music = document.querySelector('#music_player')
      music.volume = 0.3
      music.play()
      this.mySwiper.slideNext()
    }
  }
}
</script>