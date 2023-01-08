<template>
  <div class="loading-cct">
    <div class="cct-logo">
      <svg class="cct-rect" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8192.14 6922.55">
        <path class="cct-rect-path" stroke="black" stroke-width="100" fill="transparent" d="M6164.91,6918.67c-62.84,6.43-5521.08,4.29-5574.64-2.14-292.81-37.14-512.76-230.67-574.89-505.62-12.86-60-19.29-161.39-12.86-226.38C8.23,6116.68,1091.6,842,1116.59,758.43c78.56-264.95,285-509.91,542.76-644.17,92.84-47.84,150.68-70,249.23-95l75-19.28H7632.49l67.84,18.57c242.81,67.13,407.78,230.67,471.34,467.05,19.28,71.42,26.42,214.25,15,287.8-19.29,125.69-1101.94,5361.12-1119.08,5411.82-27.85,85-69.27,169.26-122.12,248.53-60.7,92.12-207.1,239.95-298.51,302.08-148.54,100-320.65,165.68-482.05,182.82ZM1262.28,5998.85l2317.41,1.43c1327.6,0,2328.84-2.15,2343.84-5.72,48.56-11.42,115-50,155.68-91.41,77.84-77.84,32.85,119.27,560.61-2450.24,392.78-1909.63,475.62-2323.84,472.77-2354.55-7.15-71.41-45-127.83-107.84-161.4l-29.28-15.71H2297.8l-48.57,23.57c-69.27,34.28-127.83,91.41-157.82,154.25-22.86,46.42-65,245.67-500.62,2364.55-261.38,1272.61-474.91,2325.27-474.91,2339.55,0,70.7,45,142.12,110,176.4Z"/>
      </svg>

      <svg class="cct-dot cctBlue--text" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3022.41 3023.75">
        <path fill="currentColor" d="M1374.68,3019.32C1201.86,3002.9,999,2945.76,845.5,2870.06,375.59,2638.68,60.65,2185.91,5.66,1663.87c-11.43-108.55-5-301.37,14.28-407.78C117.07,701.2,511.28,246.28,1043.32,74.17c349.22-112.83,723.43-96.41,1058.37,45.71C2628,342.69,2984.37,846.17,3019.37,1415.34c16.42,272.09-33.57,522.05-152.83,766.29-219.24,447-649.88,758.42-1144.07,828.41C1625.35,3023.61,1462.52,3027.89,1374.68,3019.32Z"/>
      </svg>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({})
export default class LoadingCCT extends Vue {

}
</script>

<style lang="scss" scoped>

@keyframes cct-dot {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes dashdraw {
  0% {}
  25% {
    stroke-dashoffset: 0;
    fill: transparent;
  }
  50% {
    stroke-dashoffset: 0;
    fill: black;
  }
  75% {
    fill: transparent;
  }
  100% {}
}

.cct-logo {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: visible;
  width: 150px;
  padding: 32px 0;
}

.cct-rect {
  height: 100%;
  width: 100%;
  overflow: visible;
}

.cct-rect .cct-rect-path {
  stroke-dasharray: 27000;
  stroke-dashoffset: 27000;
  animation: dashdraw 4s infinite;
  animation-delay: 0s;
}

.cct-dot {
  position: absolute;
  height: 40%;
  width: 40%;
  color: #1e467d;
  z-index: 1;
  opacity: 0;
  /* transform: scale(100); */
  border-radius: 50%;
  animation: cct-dot 1s forwards;
}
</style>