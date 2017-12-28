#ifdef GL_ES
precision highp float;
#endif

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform float time;
varying vec2 vTextureCoord;

void main() 
{
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition+aVertexNormal*cos(time)*0.1, 1.0);
    vTextureCoord = aTextureCoord;
}
