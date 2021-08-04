<template>
  <img :src="img" ref="img" />

  <div class="output">
    <canvas ref="canvas" width="720" height="1280"></canvas>
  </div>
</template>

<script>
import initWebgl from '@/lib/webgl';

import img from '@/assets/img.jpg';

export default {
  data: () => ({
    img,
  }),

  mounted() {
    const { canvas } = this.$refs;
    const gl = canvas.getContext('webgl2');

    initWebgl(gl, this.$store.state.code, this.$refs.img);

    function draw(time) {
      gl.uniform1f(gl.locs.uTime, time / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);

    window.addEventListener('keydown', (event) => {
      if (event.code === 'Enter' && event.altKey) {
        initWebgl(gl, this.$store.state.code, this.$refs.img);
      }
    });
  },
};
</script>

<style scoped>
.output {
  height: 100%;
  display: flex;
}

canvas {
  border: 4px solid rgba(0, 0, 0, .3);
  max-height: 90%;
  max-width: 90%;
  margin: auto;
  background-color: black;
}

img {
  display: none;
}
</style>
