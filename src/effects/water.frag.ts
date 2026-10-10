import { OPTICS_GLSL } from "./optics.glsl";

export const WATER_FRAG =
`
precision highp float;

#define MAX_STICKERS 8
` +
  OPTICS_GLSL +
`

uniform sampler2D u_state;
uniform sampler2D u_cursorState;
uniform sampler2D u_bg;
uniform sampler2D u_atlas;
uniform sampler2D u_seabed;
uniform vec2 u_texel;

uniform vec2  u_circleCenter;
uniform vec2  u_opticsAxis;
uniform float u_opticsSpread;
uniform float u_aspect;

uniform float u_depth;

uniform float u_seabedTop;
uniform float u_time;

uniform float u_count;
uniform vec2 u_center[MAX_STICKERS];
uniform vec2 u_size[MAX_STICKERS];
uniform vec2 u_uvMin[MAX_STICKERS];
uniform vec2 u_uvMax[MAX_STICKERS];

varying vec2 v_uv;

const vec2  SHADOW_OFFSET = vec2(0.006, -0.018);
const float SHADOW_ALPHA  = 0.20;

const vec3  LIGHT_TINT    = vec3(0, 0, 0);

const vec3  DEEP_TINT     = vec3(0.18, 0.30, 0.45);

const float SEABED_ASPECT   = 16.0 / 9.0;
const float SEABED_STRENGTH = 0.7;
const float SEABED_REFRACT  = 2.0;
const float SEABED_SWELL    = 0.0016;
const float SEABED_BLUR     = 1.0;
const float SEABED_HOLE     = 0.92;
const vec2  SEABED_HOLE_RADIUS = vec2(0.6, 0.38);
const float SEABED_HOLE_INNER = 0.45;
const float SEABED_HOLE_OUTER = 1.05;
const vec3  SEABED_TONE     = vec3(0.72, 0.8, 0.92);

const bool  DEBUG_SLOPE   = false;
const float SLOPE_UNIT    = 200.0;

const float KNEE_LO       = 1.0;
const float KNEE_HI       = 7.0;

const float REFRACT_SWELL = 0.4;
const float REFRACT_EVENT = 2.3;

const float NORMAL_SCALE  = 200.0;
const float NORMAL_SWELL  = 0.4;
const float NORMAL_EVENT  = 5.0;

const float SPEC_POWER = 70.0;

const float SPEC_INTENSITY    = 0.35;
const float SPEC_BOTTOM_LEFT  = 0.1;
const float SPEC_TOP_LEFT     = 0.1;
const float SPEC_BOTTOM_RIGHT = 0.1;
const float SPEC_CENTER       = 0.1;

float h(vec2 uv) {
  return texture2D(u_state, uv).r
       + texture2D(u_cursorState, uv).r * (1.0 - u_depth);
}

float specular(vec3 n, vec3 viewDir, vec3 lightDir) {
  vec3 hv = normalize(normalize(lightDir) + viewDir);
  return pow(max(dot(n, hv), 0.0), SPEC_POWER);
}

vec3 slopeBand(float m) {
  if (m < 0.5)   return vec3(0.05, 0.05, 0.05);
  if (m < 1.0)   return vec3(0.15, 0.15, 0.45);
  if (m < 2.0)   return vec3(0.20, 0.30, 0.85);
  if (m < 4.0)   return vec3(0.20, 0.75, 0.85);
  if (m < 8.0)   return vec3(0.25, 0.80, 0.30);
  if (m < 16.0)  return vec3(0.90, 0.85, 0.20);
  if (m < 32.0)  return vec3(0.95, 0.55, 0.15);
  if (m < 64.0)  return vec3(0.90, 0.20, 0.20);
  if (m < 128.0) return vec3(0.85, 0.25, 0.85);
  return vec3(1.0);
}

vec4 sampleSticker(vec2 uv, vec2 center, vec2 size, vec2 uvMin, vec2 uvMax) {
  vec2 local = (uv - center) / size + 0.5;
  if (local.x < 0.0 || local.x > 1.0 || local.y < 0.0 || local.y > 1.0) {
    return vec4(0.0);
  }
  return texture2D(u_atlas, mix(uvMin, uvMax, local));
}

vec2 seabedLocal(vec2 uv) {
  return vec2(uv.x, uv.y - (u_seabedTop - 1.0));
}

float seabedInk(vec2 local) {
  if (local.y < -0.05 || local.y > 1.05) return 0.0;

  vec2 c = local - 0.5;
  if (u_aspect > SEABED_ASPECT) {
    c.y *= SEABED_ASPECT / u_aspect;
  } else {
    c.x *= u_aspect / SEABED_ASPECT;
  }
  vec2 st = c + 0.5;

  vec2 px = (1.0 + SEABED_BLUR) / vec2(2048.0, 1024.0);
  float a = texture2D(u_seabed, st, SEABED_BLUR).r * 0.5;
  a += texture2D(u_seabed, st + vec2(px.x, 0.0), SEABED_BLUR).r * 0.125;
  a += texture2D(u_seabed, st - vec2(px.x, 0.0), SEABED_BLUR).r * 0.125;
  a += texture2D(u_seabed, st + vec2(0.0, px.y), SEABED_BLUR).r * 0.125;
  a += texture2D(u_seabed, st - vec2(0.0, px.y), SEABED_BLUR).r * 0.125;

  vec2 cd = (local - 0.5) * vec2(u_aspect, 1.0) / SEABED_HOLE_RADIUS;
  float fill = smoothstep(SEABED_HOLE_INNER, SEABED_HOLE_OUTER, length(cd));
  float hole = 1.0 - SEABED_HOLE * (1.0 - fill);

  return a * hole;
}

void main() {
  float left  = h(v_uv - vec2(u_texel.x, 0.0));
  float right = h(v_uv + vec2(u_texel.x, 0.0));
  float down  = h(v_uv - vec2(0.0, u_texel.y));
  float up    = h(v_uv + vec2(0.0, u_texel.y));

  vec2 slope = vec2(right - left, up - down);

  if (DEBUG_SLOPE) {
    gl_FragColor = vec4(slopeBand(length(slope) * SLOPE_UNIT), 1.0);
    return;
  }

  float mag = length(slope) * SLOPE_UNIT;
  float t   = smoothstep(KNEE_LO, KNEE_HI, mag);

  float refractGain = mix(REFRACT_SWELL, REFRACT_EVENT, t);
  float normalGain  = mix(NORMAL_SWELL,  NORMAL_EVENT,  t);

  vec2 refracted = v_uv + slope * 1.2 * refractGain;

  vec3 color = texture2D(u_bg, refracted).rgb;

  color = mix(color, color * DEEP_TINT, u_depth);

  vec2 aspect = vec2(u_texel.y / u_texel.x, 1.0);

  vec2 shiftedCenter = u_circleCenter + vec2(0.0, 0.15);

  color += apertureLight(
    refracted * aspect, shiftedCenter * aspect,
    u_opticsAxis, u_opticsSpread
  ) * LIGHT_TINT;

  vec2 local = seabedLocal(v_uv);
  if (local.y > -0.1 && local.y < 1.1) {
    float tt = u_time;
    vec2 swell = vec2(
      sin(local.y * 9.0 + tt * 0.9) + sin((local.x + local.y) * 13.0 - tt * 1.3) * 0.6,
      cos(local.x * 8.0 - tt * 0.8) + cos((local.x - local.y) * 11.0 + tt * 1.1) * 0.6
    ) * SEABED_SWELL;
    vec2 floorLocal = local + slope * 1.2 * refractGain * SEABED_REFRACT + swell;
    float ink = seabedInk(floorLocal) * SEABED_STRENGTH * (1.0 - u_depth);
    color = mix(color, color * SEABED_TONE, ink);
  }

  float shadow = 0.0;
  for (int k = 0; k < MAX_STICKERS; k++) {
    if (float(k) < u_count) {
      float a = sampleSticker(
        refracted - SHADOW_OFFSET,
        u_center[k], u_size[k], u_uvMin[k], u_uvMax[k]
      ).a;
      shadow = max(shadow, a);
    }
  }
  color *= 1.0 - shadow * SHADOW_ALPHA * (1.0 - u_depth);

  vec3 n = normalize(vec3(-slope * NORMAL_SCALE * normalGain, 1.0));
  vec3 viewDir = normalize(vec3((v_uv - 0.5) * 1.2, 1.0));

  float spec =
      specular(n, viewDir, vec3(-0.3, -0.4, 0.6)) * SPEC_INTENSITY
    + specular(n, viewDir, vec3( 0.3,  0.4, 0.6)) * SPEC_BOTTOM_LEFT
    + specular(n, viewDir, vec3( 0.3, -0.4, 0.6)) * SPEC_TOP_LEFT
    + specular(n, viewDir, vec3(-0.3,  0.4, 0.6)) * SPEC_BOTTOM_RIGHT
    + specular(n, viewDir, vec3( 0.0,  0.0, 1.0)) * SPEC_CENTER;

  color += vec3(0.7, 0.85, 1.0) * spec;

  for (int k = 0; k < MAX_STICKERS; k++) {
    if (float(k) < u_count) {
      vec4 s = sampleSticker(
        v_uv, u_center[k], u_size[k], u_uvMin[k], u_uvMax[k]
      );
      color = mix(color, s.rgb, s.a * (1.0 - u_depth));
    }
  }

  gl_FragColor = vec4(color, 1.0);
}
`;
