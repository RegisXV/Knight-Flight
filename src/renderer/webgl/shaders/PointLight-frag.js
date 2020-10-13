module.exports = [
    '#define SHADER_NAME PHASER_POINTLIGHT_FS',
    '',
    'precision mediump float;',
    '',
    'varying vec2 lightPosition;',
    'varying vec4 lightColor;',
    'varying float lightRadius;',
    '',
    'void main()',
    '{',
    '    vec2 res = vec2(800.0, 600.0);',
    '    vec2 center = vec2(lightPosition.x, res.y - lightPosition.y);',
    '',
    '    float distance = length(center.xy - gl_FragCoord.xy);',
    '',
    '    // float intensity = 1.0 - min(distance, lightRadius) / lightRadius;',
    '    float intensity = clamp(1.0 - distance * distance / (lightRadius * lightRadius), 0.0, 1.0);',
    '',
    '    vec4 color = vec4(intensity, intensity, intensity, 0.0) * vec4(lightColor.r, lightColor.g, lightColor.b, 1.0);',
    '',
    '    gl_FragColor = vec4(color.rgb * lightColor.a, color.a);',
    '}',
    ''
].join('\n');
