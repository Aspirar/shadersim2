<template>
  <div class="home">
    <div class="left-pane">
      <editor />

      <div v-if="$store.state.shaderErr" class="shader-error">
        {{ $store.state.shaderErr }}
      </div>
    </div>

    <div class="right-pane">
      <output-pane />
    </div>
  </div>
</template>

<script>
import editor from '@/components/editor.vue';
import outputPane from '@/components/output.vue';

export default {
  components: {
    editor,
    outputPane,
  },
};
</script>

<style scoped>
.home {
  height: 100%;
  display: flex;
}

.left-pane,
.right-pane {
  width: 50%;
}

.shader-error {
  position: fixed;
  bottom: 12px;
  left: 12px;
  border-radius: 6px;
  background-color: #e26387;
  color: #89344c;
  font-weight: bold;
  padding: 12px;
}
</style>
