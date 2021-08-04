<template>
  <div class="editor" ref="el" />
</template>

<script>
import * as monaco from 'monaco-editor';
import glsl from './glsl-lang';

export default {
  mounted() {
    monaco.languages.register({ id: 'glsl' });
    monaco.languages.setMonarchTokensProvider('glsl', glsl);

    const editor = monaco.editor.create(this.$refs.el, {
      value: this.$store.state.code,
      language: 'glsl',
      minimap: { enabled: false },
      fontSize: 16,
      fontFamily: 'monospace',
      lineHeight: 21,
    });

    editor.getModel().onDidChangeContent(() => {
      this.$store.commit('setCode', editor.getModel().getValue());
    });
  },
};
</script>

<style scoped>
.editor {
  height: 100%;
  overflow: hidden;
}
</style>
