const VERTEX_SOURCE = `
attribute vec2 a_position;
varying vec2 v_uv;
void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const RENDER_VERTEX_SOURCE = `
attribute vec2 a_position;
uniform vec2 u_uvShift;
varying vec2 v_uv;
void main() {
  v_uv = a_position * 0.5 + 0.5 + u_uvShift;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const SHIFT_SOURCE = `
precision highp float;
varying vec2 v_uv;
uniform sampler2D u_state;
uniform vec2 u_offset;
void main() {
  vec2 uv = v_uv + u_offset;
  if (uv.y < 0.0 || uv.y > 1.0) {
    gl_FragColor = vec4(0.0);
    return;
  }
  gl_FragColor = texture2D(u_state, uv);
}
`;

type GLHandle = {
  setFloat(program: WebGLProgram, name: string, v: number): void;
  setVec2(program: WebGLProgram, name: string, x: number, y: number): void;
  setVec2Array(program: WebGLProgram, name: string, values: number[]): void;
  setFloatArray(program: WebGLProgram, name: string, values: number[]): void;
  setAtlas(canvas: HTMLCanvasElement): void;
  simProgram: WebGLProgram;
  cursorProgram: WebGLProgram;
  renderProgram: WebGLProgram;
  use(program: WebGLProgram): void;
  readonly simWidth: number;
  readonly simHeight: number;
  shiftSim(cells: number): void;
  stepSim(): void;
  stepCursorSim(): void;
  drawToScreen(): void;
  dispose(): void;
};

const SIM_WIDTH = 1024;

export function createGL(
  canvas: HTMLCanvasElement,
  simSource: string,
  cursorSource: string,
  renderSource: string,
  bgUrl: string,
  seabedUrl: string
): GLHandle | null {
  const gl = getGL(canvas);
  if (!gl) return null;

  const ext = gl.getExtension("OES_texture_float");
  if (!ext) {
    console.error("OES_texture_float not supported");
    return null;
  }
  gl.getExtension("OES_texture_float_linear");

  const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE) as number;

  const simProgram = createProgram(gl, VERTEX_SOURCE, simSource);
  const cursorProgram = createProgram(gl, VERTEX_SOURCE, cursorSource);
  const renderProgram = createProgram(gl, RENDER_VERTEX_SOURCE, renderSource);
  const shiftProgram = createProgram(gl, VERTEX_SOURCE, SHIFT_SOURCE);
  if (!simProgram || !cursorProgram || !renderProgram || !shiftProgram) {
    return null;
  }

  const buffer = setupFullscreenTriangle(
    gl,
    simProgram,
    cursorProgram,
    renderProgram,
    shiftProgram
  );
  if (!buffer) return null;

  const shiftStateLoc = gl.getUniformLocation(shiftProgram, "u_state");
  const shiftOffsetLoc = gl.getUniformLocation(shiftProgram, "u_offset");

  const bgTexture = createImageTexture(gl, bgUrl, [15, 33, 43, 255]);
  if (!bgTexture) return null;

  const atlasTexture = createEmptyTexture(gl, [0, 0, 0, 0]);
  if (!atlasTexture) return null;

  const seabedTexture = createMipmapImageTexture(gl, seabedUrl, [0, 0, 0, 255]);
  if (!seabedTexture) return null;

  const fbo = gl.createFramebuffer();
  if (!fbo) return null;

  let simW = 0;
  let simH = 0;
  let textures: WebGLTexture[] = [];
  let cursorTextures: WebGLTexture[] = [];
  let current = 0;
  let cursorCurrent = 0;

  const allocSim = (): boolean => {
    const { width, height } = simDims(canvas, maxTextureSize);
    if (width === simW && height === simH) return true;

    const next = [0, 1, 2, 3].map(() => createStateTexture(gl, width, height));
    if (next.some((t) => !t)) {
      next.forEach((t) => t && gl.deleteTexture(t));
      return false;
    }

    textures.forEach((t) => gl.deleteTexture(t));
    cursorTextures.forEach((t) => gl.deleteTexture(t));

    textures = [next[0]!, next[1]!];
    cursorTextures = [next[2]!, next[3]!];
    simW = width;
    simH = height;
    current = 0;
    cursorCurrent = 0;
    return true;
  };

  const setters = createUniformSetters(gl);

  resize(gl, canvas, true);
  if (!allocSim()) return null;

  const onResize = () => {
    resize(gl, canvas);
    allocSim();
  };
  window.addEventListener("resize", onResize);

  const shiftPass = (src: WebGLTexture, dst: WebGLTexture) => {
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      dst,
      0
    );
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, src);
    gl.uniform1i(shiftStateLoc, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  return {
    ...setters,
    simProgram,
    cursorProgram,
    renderProgram,

    get simWidth() {
      return simW;
    },
    get simHeight() {
      return simH;
    },

    use(program: WebGLProgram) {
      gl.useProgram(program);
    },

    setAtlas(source: HTMLCanvasElement) {
      gl.bindTexture(gl.TEXTURE_2D, atlasTexture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        source
      );
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    },

    shiftSim(cells: number) {
      if (cells === 0) return;

      gl.useProgram(shiftProgram);
      gl.uniform2f(shiftOffsetLoc, 0, -cells / simH);
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.viewport(0, 0, simW, simH);

      shiftPass(textures[current]!, textures[1 - current]!);
      current = 1 - current;

      shiftPass(
        cursorTextures[cursorCurrent]!,
        cursorTextures[1 - cursorCurrent]!
      );
      cursorCurrent = 1 - cursorCurrent;
    },

    stepSim() {
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(
        gl.FRAMEBUFFER,
        gl.COLOR_ATTACHMENT0,
        gl.TEXTURE_2D,
        textures[1 - current]!,
        0
      );
      gl.viewport(0, 0, simW, simH);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, textures[current]!);
      gl.uniform1i(gl.getUniformLocation(simProgram, "u_state"), 0);

      gl.drawArrays(gl.TRIANGLES, 0, 3);

      current = 1 - current;
    },

    stepCursorSim() {
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(
        gl.FRAMEBUFFER,
        gl.COLOR_ATTACHMENT0,
        gl.TEXTURE_2D,
        cursorTextures[1 - cursorCurrent]!,
        0
      );
      gl.viewport(0, 0, simW, simH);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, cursorTextures[cursorCurrent]!);
      gl.uniform1i(gl.getUniformLocation(cursorProgram, "u_state"), 0);

      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, atlasTexture);
      gl.uniform1i(gl.getUniformLocation(cursorProgram, "u_atlas"), 1);

      gl.drawArrays(gl.TRIANGLES, 0, 3);

      cursorCurrent = 1 - cursorCurrent;
    },

    drawToScreen() {
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, textures[current]!);
      gl.uniform1i(gl.getUniformLocation(renderProgram, "u_state"), 0);

      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, bgTexture);
      gl.uniform1i(gl.getUniformLocation(renderProgram, "u_bg"), 1);

      gl.activeTexture(gl.TEXTURE2);
      gl.bindTexture(gl.TEXTURE_2D, cursorTextures[cursorCurrent]!);
      gl.uniform1i(gl.getUniformLocation(renderProgram, "u_cursorState"), 2);

      gl.activeTexture(gl.TEXTURE3);
      gl.bindTexture(gl.TEXTURE_2D, atlasTexture);
      gl.uniform1i(gl.getUniformLocation(renderProgram, "u_atlas"), 3);

      gl.activeTexture(gl.TEXTURE4);
      gl.bindTexture(gl.TEXTURE_2D, seabedTexture);
      gl.uniform1i(gl.getUniformLocation(renderProgram, "u_seabed"), 4);

      gl.drawArrays(gl.TRIANGLES, 0, 3);
    },

    dispose() {
      window.removeEventListener("resize", onResize);
      gl.deleteFramebuffer(fbo);
      textures.forEach((t) => gl.deleteTexture(t));
      cursorTextures.forEach((t) => gl.deleteTexture(t));
      gl.deleteTexture(bgTexture);
      gl.deleteTexture(atlasTexture);
      gl.deleteTexture(seabedTexture);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(simProgram);
      gl.deleteProgram(cursorProgram);
      gl.deleteProgram(renderProgram);
      gl.deleteProgram(shiftProgram);
    },
  };
}

function getGL(canvas: HTMLCanvasElement): WebGLRenderingContext | null {
  return canvas.getContext("webgl", { alpha: true, premultipliedAlpha: false });
}

function simDims(
  canvas: HTMLCanvasElement,
  maxSize: number
): { width: number; height: number } {
  const aspect = canvas.clientWidth / Math.max(canvas.clientHeight, 1);
  const width = Math.min(SIM_WIDTH, maxSize);
  const height = Math.min(maxSize, Math.max(1, Math.round(width / aspect)));
  return { width, height };
}

function createStateTexture(
  gl: WebGLRenderingContext,
  width: number,
  height: number
): WebGLTexture | null {
  const tex = gl.createTexture();
  if (!tex) return null;

  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    width,
    height,
    0,
    gl.RGBA,
    gl.FLOAT,
    new Float32Array(width * height * 4)
  );
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  return tex;
}

function createEmptyTexture(
  gl: WebGLRenderingContext,
  fallback: [number, number, number, number]
): WebGLTexture | null {
  const tex = gl.createTexture();
  if (!tex) return null;
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    1,
    1,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    new Uint8Array(fallback)
  );
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  return tex;
}

function createImageTexture(
  gl: WebGLRenderingContext,
  url: string,
  fallback: [number, number, number, number]
): WebGLTexture | null {
  const tex = createEmptyTexture(gl, fallback);
  if (!tex) return null;

  const img = new Image();
  img.onload = () => {
    if (!gl.isTexture(tex)) return;
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  };
  img.onerror = () => console.warn("image load failed:", url);
  img.src = url;

  return tex;
}

function createMipmapImageTexture(
  gl: WebGLRenderingContext,
  url: string,
  fallback: [number, number, number, number]
): WebGLTexture | null {
  const tex = createEmptyTexture(gl, fallback);
  if (!tex) return null;

  const img = new Image();
  img.onload = () => {
    if (!gl.isTexture(tex)) return;
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(
      gl.TEXTURE_2D,
      gl.TEXTURE_MIN_FILTER,
      gl.LINEAR_MIPMAP_LINEAR
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  };
  img.onerror = () => console.warn("image load failed:", url);
  img.src = url;

  return tex;
}

function compileShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string
): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
    console.error(
      source
        .split("\n")
        .map((l, i) => `${i + 1}: ${l}`)
        .join("\n")
    );
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

function createProgram(
  gl: WebGLRenderingContext,
  vertexSource: string,
  fragmentSource: string
): WebGLProgram | null {
  const program = gl.createProgram();
  if (!program) return null;

  const vs = compileShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);

  if (!vs || !fs) {
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    gl.deleteProgram(program);
    return null;
  }

  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  gl.deleteShader(vs);
  gl.deleteShader(fs);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }

  return program;
}

function setupFullscreenTriangle(
  gl: WebGLRenderingContext,
  ...programs: WebGLProgram[]
): WebGLBuffer | null {
  const buffer = gl.createBuffer();
  if (!buffer) return null;

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 3, -1, -1, 3]),
    gl.STATIC_DRAW
  );

  for (const program of programs) {
    const loc = gl.getAttribLocation(program, "a_position");
    if (loc === -1) {
      console.error("a_position attribute not found");
      gl.deleteBuffer(buffer);
      return null;
    }
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  }

  return buffer;
}

function resize(
  gl: WebGLRenderingContext,
  canvas: HTMLCanvasElement,
  force = false
): void {
  const dpr = window.devicePixelRatio || 1;
  const w = Math.round(canvas.clientWidth * dpr);
  const h = Math.round(canvas.clientHeight * dpr);

  if (!force && canvas.width === w && canvas.height === h) return;

  canvas.width = w;
  canvas.height = h;
  gl.viewport(0, 0, w, h);
}

function createUniformSetters(gl: WebGLRenderingContext) {
  const cache = new Map<
    WebGLProgram,
    Map<string, WebGLUniformLocation | null>
  >();

  function loc(program: WebGLProgram, name: string) {
    let m = cache.get(program);
    if (!m) {
      m = new Map();
      cache.set(program, m);
    }
    if (m.has(name)) return m.get(name)!;

    const result = gl.getUniformLocation(program, name);
    m.set(name, result);
    return result;
  }

  return {
    setFloat(program: WebGLProgram, name: string, v: number) {
      gl.uniform1f(loc(program, name), v);
    },
    setVec2Array(program: WebGLProgram, name: string, values: number[]) {
      gl.uniform2fv(loc(program, name), values);
    },
    setFloatArray(program: WebGLProgram, name: string, values: number[]) {
      gl.uniform1fv(loc(program, name), values);
    },
    setVec2(program: WebGLProgram, name: string, x: number, y: number) {
      gl.uniform2f(loc(program, name), x, y);
    },
  };
}
