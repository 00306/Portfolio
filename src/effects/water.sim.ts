export const WATER_SIM = `
precision highp float;

uniform sampler2D u_state;
uniform vec2 u_texel;
uniform vec2 u_drop;
uniform float u_dropStrength;
uniform float u_dropRadius;
uniform float u_damping;
uniform float u_aspect;
uniform float u_time;
uniform float u_swellForce;
uniform float u_stirForce;
uniform float u_stirTime;

varying vec2 v_uv;

const float SWELL_FREQ  = 45.0;
const float SWELL_SPEED = 2.2;
const float SWELL_NORM  = 0.180;
const float EDGE_BAND   = 0.012;

const float BREATH_SCALE = 2.5;
const float BREATH_RATE  = 0.8;
const float BREATH_DRIFT = 0.2;

const float STIFFNESS = 0.4;
const float VISC      = 0.03;

float waveTerm(vec2 p, vec2 dir, float freq, float amp, float phase, float t) {
  return sin(dot(p, dir) * freq * SWELL_FREQ + t * sqrt(freq) + phase) * amp;
}

float swellDrive(vec2 uv, float t) {
  vec2 p = uv * vec2(u_aspect, 1.0);

  float h = 0.0;
  h += waveTerm(p, vec2(-0.777,  0.629), 0.573, 1.45, 1.92, t);
  h += waveTerm(p, vec2( 0.990, -0.139), 0.757, 1.20, 3.05, t);
  h += waveTerm(p, vec2( 0.978,  0.208), 1.000, 1.00, 0.00, t);
  h += waveTerm(p, vec2( 0.829, -0.559), 1.318, 0.82, 1.37, t);
  h += waveTerm(p, vec2( 0.545,  0.839), 1.741, 0.68, 2.91, t);
  h += waveTerm(p, vec2( 0.326, -0.946), 2.297, 0.56, 4.62, t);
  h += waveTerm(p, vec2( 0.906,  0.423), 3.031, 0.40, 0.78, t);
  h += waveTerm(p, vec2(-0.105,  0.995), 4.003, 0.28, 5.44, t);

  return h * SWELL_NORM;
}

float hash3(vec3 p) {
  p = fract(p * 0.3183099 + 0.1);
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}

float valueNoise(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  vec3 u = f * f * (3.0 - 2.0 * f);

  float n000 = hash3(i);
  float n100 = hash3(i + vec3(1.0, 0.0, 0.0));
  float n010 = hash3(i + vec3(0.0, 1.0, 0.0));
  float n110 = hash3(i + vec3(1.0, 1.0, 0.0));
  float n001 = hash3(i + vec3(0.0, 0.0, 1.0));
  float n101 = hash3(i + vec3(1.0, 0.0, 1.0));
  float n011 = hash3(i + vec3(0.0, 1.0, 1.0));
  float n111 = hash3(i + vec3(1.0, 1.0, 1.0));

  float n = mix(
    mix(mix(n000, n100, u.x), mix(n010, n110, u.x), u.y),
    mix(mix(n001, n101, u.x), mix(n011, n111, u.x), u.y),
    u.z
  );
  return n * 2.0 - 1.0;
}

float stirDrive(vec2 uv, float t, float since) {
  vec2 p = uv * vec2(u_aspect, 1.0) * BREATH_SCALE;
  float shape  = valueNoise(vec3(p, t * BREATH_DRIFT));
  float breath = sin(since * BREATH_RATE * 6.2832);
  return shape * breath;
}

float bellShape(vec2 uv, vec2 center, float radius) {
  float d = length((uv - center) * vec2(u_aspect, 1.0)) / radius;
  if (d > 2.5) return 0.0;
  return exp(-2.0 * d * d);
}

void main() {
  vec2 dx = vec2(u_texel.x, 0.0);
  vec2 dy = vec2(0.0, u_texel.y);

  vec4 s  = texture2D(u_state, v_uv);
  vec4 sl = texture2D(u_state, v_uv - dx);
  vec4 sr = texture2D(u_state, v_uv + dx);
  vec4 sd = texture2D(u_state, v_uv - dy);
  vec4 su = texture2D(u_state, v_uv + dy);

  float lap     = sl.r + sr.r + sd.r + su.r - 4.0 * s.r;
  float lapPrev = sl.g + sr.g + sd.g + su.g - 4.0 * s.g;

  float vel = (s.r - s.g) * u_damping;
  float next = s.r + vel
             + STIFFNESS * lap
             + VISC * (lap - lapPrev);

  next += swellDrive(v_uv, u_time * SWELL_SPEED) * u_swellForce;

  if (u_stirForce != 0.0) {
    next += stirDrive(v_uv, u_time, u_stirTime) * u_stirForce;
  }

  if (u_dropStrength != 0.0) {
    next -= u_dropStrength * bellShape(v_uv, u_drop, u_dropRadius);
  }

  float edge = min(min(v_uv.x, 1.0 - v_uv.x), min(v_uv.y, 1.0 - v_uv.y));
  next *= smoothstep(0.0, EDGE_BAND, edge);

  gl_FragColor = vec4(next, s.r, 0.0, 1.0);
}
`;
