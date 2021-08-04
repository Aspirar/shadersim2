import { createStore } from 'vuex';

export default createStore({
  state: {
    code: `#version 300 es
precision highp float;

uniform float uTime;
uniform vec2 uRes;
uniform sampler2D uImage;

in vec2 vTex;
in vec2 vPos;

out vec4 pixel;

void main() {
  vec2 uv = vPos / uRes;
  uv.y *= uRes.y / uRes.x;

  pixel = texture(uImage, vTex);
}
`,

    shaderErr: '',
  },

  mutations: {
    setCode(state, code) {
      state.code = code;
    },

    setShaderErr(state, err) {
      state.shaderErr = err;
    },
  },

  actions: {},
  modules: {},
});
