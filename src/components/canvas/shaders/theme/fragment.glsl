uniform sampler2D uDayTexture1;
uniform sampler2D uNightTexture1;
uniform sampler2D uNightLightTexture1;
uniform sampler2D uDayTexture2;
uniform sampler2D uNightTexture2;
uniform sampler2D uNightLightTexture2;
uniform float uMixRatioTheme;
uniform float uMixRatioLight;
uniform int uTextureSet;

varying vec2 vUv;

void main() {
    vec3 dayColor;
    vec3 nightColor;
    vec3 nightLightColor;
    vec3 finalColor;
    
    if (uTextureSet == 1) {
        dayColor = texture2D(uDayTexture1, vUv).rgb;
        nightColor = texture2D(uNightTexture1, vUv).rgb;
        nightLightColor = texture2D(uNightLightTexture1, vUv).rgb;
    } else if (uTextureSet == 2) {
        dayColor = texture2D(uDayTexture2, vUv).rgb;
        nightColor = texture2D(uNightTexture2, vUv).rgb;
        nightLightColor = texture2D(uNightLightTexture2, vUv).rgb;
    }

    finalColor = mix(dayColor, nightColor, uMixRatioTheme);

    if (uMixRatioTheme == 1.0) {
        finalColor = mix(finalColor, nightLightColor, uMixRatioLight);
    }

    finalColor = pow(finalColor, vec3(1.0/2.2));
    gl_FragColor = vec4(finalColor, 1.0);
}