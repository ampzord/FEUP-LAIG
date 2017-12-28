#ifdef GL_ES
precision highp float;
#endif

uniform float selectedRed;
uniform float selectedGreen;
uniform float selectedBlue;
varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform float time;


void main() 
{
    vec4 newcolor = texture2D(uSampler, vTextureCoord);
    float colorFactor = abs(cos(time));
	newcolor.r = colorFactor * selectedRed + (1.0 - colorFactor) * newcolor.r;
	newcolor.g = colorFactor * selectedGreen + (1.0 - colorFactor) * newcolor.g;
	newcolor.b = colorFactor * selectedBlue + (1.0 - colorFactor) * newcolor.b;
	gl_FragColor = newcolor;
}
