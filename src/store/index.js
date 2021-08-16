import { createStore } from 'vuex';

export default createStore({
  state: {
    code: `precision highp float;

uniform float time;
uniform float progress;
uniform mediump vec2 u_resolution;
uniform sampler2D sTexture;

varying vec2 vTextureCoord;
varying vec2 vPos;

void main() {
  vec2 uv = vPos / u_resolution;
  uv.y *= u_resolution.y / u_resolution.x;

  gl_FragColor = texture2D(sTexture, vTextureCoord);
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
