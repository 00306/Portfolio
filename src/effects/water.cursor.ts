export const CURSOR_SIM = `
precision highp float;

#define MAX_STICKERS 8
#define ARROW_N 7
#define CURSOR_STEPS 24

uniform sampler2D u_state;
uniform sampler2D u_atlas;
uniform vec2 u_texel;
uniform vec2 u_cursor;
uniform vec2 u_cursorPrev;
uniform float u_cursorActive;
uniform float u_cursorRadius;
uniform float u_cursorDepth;
uniform float u_fade;
uniform float u_stiffness;
uniform float u_aspect;

uniform float u_count;
uniform float u_stickerDepth;
uniform vec2 u_center[MAX_STICKERS];
uniform vec2 u_prev[MAX_STICKERS];
uniform vec2 u_size[MAX_STICKERS];
uniform vec2 u_uvMin[MAX_STICKERS];
uniform vec2 u_uvMax[MAX_STICKERS];

varying vec2 v_uv;

const float ARROW_SCALE = 0.70;
const float ARROW_EDGE  = 0.12;
const float EDGE_BAND   = 0.012;

const float STICKER_PULL = 0.1;

vec2 arrowVertex(int i) {
  if (i == 0) return vec2(0.00,  0.00);
  if (i == 1) return vec2(0.00, -0.75);
  if (i == 2) return vec2(0.20, -0.57);
  if (i == 3) return vec2(0.33, -0.90);
  if (i == 4) return vec2(0.47, -0.84);
  if (i == 5) return vec2(0.34, -0.53);
  return vec2(0.57, -0.52);
}

float arrowSdf(vec2 p) {
  float d = 1e6;
  float s = 1.0;
  for (int i = 0; i < ARROW_N; i++) {
    int j = (i == 0) ? ARROW_N - 1 : i - 1;
    vec2 vi = arrowVertex(i);
    vec2 vj = arrowVertex(j);

    vec2 e = vj - vi;
    vec2 w = p - vi;
    vec2 b = w - e * clamp(dot(w, e) / max(dot(e, e), 1e-8), 0.0, 1.0);
    d = min(d, dot(b, b));

    bvec3 c = bvec3(p.y >= vi.y, p.y < vj.y, e.x * w.y > e.y * w.x);
    if (all(c) || all(not(c))) s = -s;
  }
  return s * sqrt(d);
}

float arrowShape(vec2 uv, vec2 tip, float scale, float aspect) {
  vec2 p = (uv - tip) * vec2(aspect, 1.0) / scale;
  return 1.0 - smoothstep(-ARROW_EDGE, ARROW_EDGE, arrowSdf(p));
}

float stickerAlpha(vec2 uv, vec2 center, vec2 size, vec2 uvMin, vec2 uvMax) {
  vec2 local = (uv - center) / size + 0.5;
  if (local.x < 0.0 || local.x > 1.0 || local.y < 0.0 || local.y > 1.0) {
    return 0.0;
  }
  return texture2D(u_atlas, mix(uvMin, uvMax, local)).a;
}

void main() {
  vec4 s = texture2D(u_state, v_uv);
  float left  = texture2D(u_state, v_uv - vec2(u_texel.x, 0.0)).r;
  float right = texture2D(u_state, v_uv + vec2(u_texel.x, 0.0)).r;
  float down  = texture2D(u_state, v_uv - vec2(0.0, u_texel.y)).r;
  float up    = texture2D(u_state, v_uv + vec2(0.0, u_texel.y)).r;

  float lap = left + right + down + up - 4.0 * s.r;
  float vel = (s.r - s.g) * u_fade;
  float next = s.r + vel + u_stiffness * lap;
  next *= 0.96;

  if (u_cursorActive > 0.0) {
    float scale = u_cursorRadius * ARROW_SCALE;
    float cshape = 0.0;
    for (int j = 0; j <= CURSOR_STEPS; j++) {
      vec2 tip = mix(u_cursorPrev, u_cursor, float(j) / float(CURSOR_STEPS));
      cshape = max(cshape, arrowShape(v_uv, tip, scale, u_aspect));
    }
    if (cshape > 0.0) {
      float force = -u_cursorDepth * cshape;
      if (next > force) {
        next = force;
      }
    }
  }

  float shape = 0.0;
  for (int k = 0; k < MAX_STICKERS; k++) {
    if (float(k) < u_count) {
      vec2 center = u_center[k];
      vec2 prev = u_prev[k];
      vec2 size = u_size[k];
      vec2 uvMin = u_uvMin[k];
      vec2 uvMax = u_uvMax[k];

      for (int j = 0; j <= 4; j++) {
        vec2 c = mix(prev, center, float(j) / 4.0);
        shape = max(shape, stickerAlpha(v_uv, c, size, uvMin, uvMax));
      }
    }
  }

  if (shape > 0.0) {
    float force = -u_stickerDepth * shape;
    if (next > force) {
      next += (force - next) * STICKER_PULL;
    }
  }

  float edge = min(min(v_uv.x, 1.0 - v_uv.x), min(v_uv.y, 1.0 - v_uv.y));
  next *= smoothstep(0.0, EDGE_BAND, edge);
  gl_FragColor = vec4(next, s.r, 0.0, 1.0);
}
`;
