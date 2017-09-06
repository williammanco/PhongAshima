precision highp float;

uniform float time;
uniform float noiseValue;
uniform vec3 lightPos;
uniform float fresnelCoef;
uniform float fresnelExponent;
uniform vec3 rimColor;
uniform float rimStart;
uniform float rimEnd;
uniform float rimCoef;
uniform vec3 ambientColor;
uniform vec3 diffuseColor;
uniform vec3 specularColor;
uniform float specularExponent;
uniform vec3 backgroundColor;

varying float displacement;
varying float noise;
varying vec3 fNormal;
varying vec3 normalInterp;
varying vec3 vertPos;

/**
 * Generic random
 */
float random(vec3 scale, float seed) {
  return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed);
}

/**
 * RIM
 * http://roxlu.com/2014/037/opengl-rim-shader
 */
vec3 rim(vec3 color, float start, float end, float coef) {
  vec3 n = normalize(fNormal); // convert normal to view space, u_vm (view matrix), is a rigid body transform.
  vec3 p = vec3(vertPos); // position in view space
  vec3 v = normalize(-p); // eye vector
  float vdn = coef - max(dot(v, n), 0.0); // the rim contribution
  return vec3(smoothstep(start, end, vdn)) * color;
}

/**
 * Generic fresnel
 */
float fresnel(float costheta, float fresnelCoef) {
  return fresnelCoef + (1. - fresnelCoef) * pow(1. - costheta, 5.);
}

/**
 * Custom lighterColorSmooth like photoshop filter
 */
vec3 lighterColorSmooth(vec3 source, vec3 destination) {
  float sourceSum = source.r + source.g + source.b;
  float destinationSum = destination.r + destination.g + destination.b;
  float mixValue = sourceSum - destinationSum;
  return mix(destination, source, smoothstep(.0, 1., mixValue));
}



void main() {
  float noise = noiseValue;
  vec3 color = diffuseColor;
  vec3 normal = normalize(normalInterp);
  color += fresnel(dot(vec3(normal), lightPos), fresnelCoef) * fresnelExponent;
  color += rim(rimColor, rimStart, rimEnd, rimCoef);
  color += noise * (.5 - random(vec3(1.), length(gl_FragCoord)));

	/**
	 * Phong / Blinn Phong Shading
	 * http://www.mathematik.uni-marburg.de/~thormae/lectures/graphics1/code/WebGLShaderLightMat/ShaderLightMat.html
	 */
  float lambertian = max(dot(lightPos, normal), 0.0);
  float specular = 0.0;
  if (lambertian > 0.0) {
    vec3 viewDir = normalize(-vertPos);
    vec3 reflectDir = reflect(-lightPos, normal);
    float specAngle = max(dot(reflectDir, viewDir), 0.0);
    specular = pow(specAngle, specularExponent);
  }
  vec3 finalColor = vec3(displacement * ambientColor +
    lambertian * color +
    specular * specularColor);

  gl_FragColor = vec4(lighterColorSmooth(finalColor, backgroundColor  / vec3(255, 255, 255)), 1.0);
}
