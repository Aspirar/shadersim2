import store from '@/store/index';

function getVShaderSrc() {
  return `precision highp float;

    uniform mediump vec2 u_resolution;

    attribute vec2 aPos;
    attribute vec2 aTex;

    varying vec2 vPos;
    varying vec2 vTextureCoord;

    void main() {
      gl_Position = vec4((aPos / u_resolution) * 2. - 1., 0., 1.);
      vPos = aPos;
      vTextureCoord = aTex;
    }
  `;
}

function createShader(gl, type, src) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, src);
  gl.compileShader(shader);

  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    return shader;
  }

  const infoLog = gl.getShaderInfoLog(shader);
  store.commit('setShaderErr', infoLog);
  console.log(infoLog);
  return gl.deleteShader(shader);
}

function createProgram(gl, fShaderSrc) {
  const vShader = createShader(gl, gl.VERTEX_SHADER, getVShaderSrc());
  const fShader = createShader(gl, gl.FRAGMENT_SHADER, fShaderSrc);
  const program = gl.createProgram();
  gl.attachShader(program, vShader);
  gl.attachShader(program, fShader);
  gl.linkProgram(program);

  if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
    return program;
  }

  const infoLog = gl.getProgramInfoLog(program);
  store.commit('setShaderErr', infoLog);
  console.log(infoLog);
  return gl.deleteProgram(program);
}

function getLocs(gl, program) {
  const locs = {
    aPos: gl.getAttribLocation(program, 'aPos'),
    aTex: gl.getAttribLocation(program, 'aTex'),
    u_resolution: gl.getUniformLocation(program, 'u_resolution'),
    time: gl.getUniformLocation(program, 'time'),
    progress: gl.getUniformLocation(program, 'progress'),
  };
  gl.locs = locs;
  return locs;
}

function setVertexArray(gl) {
  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
}

function bufferAttrib(gl, loc, data) {
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(
    loc,
    2,
    gl.FLOAT,
    false,
    0,
    0,
  );
}

function bufferPosAttrib(gl, locs) {
  const { width, height } = gl.canvas;
  bufferAttrib(gl, locs.aPos, [
    0, 0,
    0, height,
    width, 0,
    width, 0,
    0, height,
    width, height,
  ]);
}

function bufferTexAttrib(gl, locs) {
  bufferAttrib(gl, locs.aTex, [
    0, 1,
    0, 0,
    1, 1,
    1, 1,
    0, 0,
    1, 0,
  ]);
}

function bufferImage(gl, image) {
  const texture = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0 + 0);
  gl.bindTexture(gl.TEXTURE_2D, texture);

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    image,
  );
}

function initCanvas(gl) {
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);
}

function setUniforms(gl, locs) {
  gl.uniform2f(locs.u_resolution, gl.canvas.width, gl.canvas.height);
}

function enableBlending(gl) {
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
}

function initWebgl(gl, fShaderSrc, image) {
  store.commit('setShaderErr', '');

  try {
    enableBlending(gl);
    const program = createProgram(gl, fShaderSrc);
    const locs = getLocs(gl, program);
    setVertexArray(gl);
    bufferPosAttrib(gl, locs);
    bufferTexAttrib(gl, locs);
    if (image) bufferImage(gl, image);
    gl.useProgram(program);
    setUniforms(gl, locs);

    initCanvas(gl);

    return { gl, locs };
  } catch (err) {
    console.error(err);
    return null;
  }
}

export default initWebgl;
