<template>
  <div class="output">
    <canvas ref="canvas" width="720" height="1280"></canvas>
  </div>
</template>

<script>
import initWebgl from '@/lib/webgl';

import img from '@/assets/img.jpg';

export default {
  async mounted() {
    const { canvas } = this.$refs;
    const gl = canvas.getContext('webgl2');

    const image = await this.loadImage();
    initWebgl(gl, this.$store.state.code, image);

    function draw(time) {
      gl.uniform1f(gl.locs.uTime, time / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);

    window.addEventListener('keydown', (event) => {
      if (event.code === 'Enter' && event.altKey) {
        initWebgl(gl, this.$store.state.code, image);
      }
    });
  },

  methods: {
    loadImage() {
      return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = reject;
        image.src = img;
      });
    },
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
</style>
