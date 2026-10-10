export const OPTICS_GLSL = `

const float CORE_FALLOFF    = 130.00;
const float CORE_GAIN       = 1.15;

const float GLOW_FALLOFF    = 16.00;
const float GLOW_GAIN       = 0.28;

const float VEIL_FALLOFF    = 2.20;
const float VEIL_GAIN       = 0.05;

const vec3  CORE_TINT       = vec3(1.00, 1.00, 1.00);
const vec3  MID_TINT        = vec3(1.00, 0.74, 0.48);
const vec3  OUTER_TINT      = vec3(0.55, 0.72, 1.00);
const float MID_START       = 0.030;
const float MID_END         = 0.130;
const float OUTER_END       = 0.480;

const float SHADE_INNER     = 0.150;
const float SHADE_FALLOFF   = 4.50;
const float SHADE_GAIN      = 0.16;
const vec3  SHADE_TINT      = vec3(0.55, 0.45, 0.75);

const float HALO_RADIUS     = 0.300;
const float HALO_EDGE       = 0.002;
const float HALO_TAIL       = 60.00;
const float HALO_GAIN       = 0.09;
const float HALO_DISPERSION = 0.004;
const vec3  HALO_TINT       = vec3(1.00, 0.92, 0.86);

const float STREAK_SHARP    = 3.00;
const float STREAK_FALLOFF  = 9.00;
const float STREAK_GAIN     = 0.16;

float glowFalloff(float dist) {
  return exp(-dist * CORE_FALLOFF) * CORE_GAIN
       + exp(-dist * GLOW_FALLOFF) * GLOW_GAIN
       + exp(-dist * VEIL_FALLOFF) * VEIL_GAIN;
}

vec3 glowTint(float dist) {
  vec3 t = mix(CORE_TINT, MID_TINT, smoothstep(MID_START, MID_END, dist));
  return mix(t, OUTER_TINT, smoothstep(MID_END, OUTER_END, dist));
}

vec3 glareShade(float dist) {
  float ramp = smoothstep(0.0, SHADE_INNER, dist);
  float tail = exp(-max(dist - SHADE_INNER, 0.0) * SHADE_FALLOFF);
  return SHADE_TINT * ramp * tail * SHADE_GAIN;
}

float haloRing(float dist, float radius) {
  float wall = smoothstep(radius - HALO_EDGE, radius + HALO_EDGE, dist);
  float tail = exp(-max(dist - radius, 0.0) * HALO_TAIL);
  return wall * tail * HALO_GAIN;
}

float lightStreaks(vec2 p, float dist) {
  float ang   = atan(p.y, p.x);
  float lobes = pow(abs(cos(ang * 2.0)), STREAK_SHARP);
  float decay = exp(-dist * STREAK_FALLOFF);
  return lobes * decay * STREAK_GAIN;
}

vec3 lightProfile(vec2 p, float haloRadius) {
  float d = length(p);

  vec3 glow   = glowFalloff(d) * glowTint(d);
  vec3 ring   = haloRing(d, haloRadius) * HALO_TINT;
  vec3 streak = lightStreaks(p, d) * CORE_TINT;

  return glow + ring + streak - glareShade(d);
}

vec3 apertureLight(vec2 uv, vec2 center, vec2 axis, float spread) {
  vec2  p    = uv - center;
  float proj = dot(p, axis);
  vec2  off  = axis * spread * proj;

  vec3 r = lightProfile(p + off, HALO_RADIUS - HALO_DISPERSION);
  vec3 g = lightProfile(p,       HALO_RADIUS);
  vec3 b = lightProfile(p - off, HALO_RADIUS + HALO_DISPERSION);

  return vec3(r.r, g.g, b.b);
}
`;
