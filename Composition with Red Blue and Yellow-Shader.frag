// Author: Ahmad Erfani
// Title: Composition with Red Blue and Yellow, Piet Mondriaan
// executable on http://editor.thebookofshaders.com/

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

float doubleStep(in float min , in float max , in float x){
    return step(min,x)*(1.0 - step(max,x));
}

float drawLines(in float mainLinesPos,in float horizLineSmallLeftPos , in float horizLineSmallRightPos , in float verticLineSmallRighttPos , in vec2 st){
       float horizLine = doubleStep(mainLinesPos - 0.015,mainLinesPos + 0.015,st.y);
    float verticLine = doubleStep(mainLinesPos - 0.015,mainLinesPos + 0.015,st.x);
    
     float horizLine2 = doubleStep(horizLineSmallLeftPos - 0.03,horizLineSmallLeftPos + 0.03,st.y);
     horizLine2 *= 1.0 -step(mainLinesPos,st.x);
    
    float horizLine3 = doubleStep(horizLineSmallRightPos - 0.025,horizLineSmallRightPos + 0.025,st.y);
     horizLine3 *= step(verticLineSmallRighttPos,st.x) * (1.0 - step(mainLinesPos,st.y));
    
    float vertLine2 = doubleStep(verticLineSmallRighttPos - 0.015,verticLineSmallRighttPos + 0.015,st.x);
    vertLine2 *= 1.0 -step(mainLinesPos,st.y);
    
    
    return (1.0-horizLine)*(1.0-verticLine)*(1.0-horizLine2) *(1.0-vertLine2) *(1.0-horizLine3);
}

vec3 drawColorInCorners(vec2 pos,vec2 st,vec3 color){
    vec2 site = 1.0 - step(pos,st);
    if (site.x*site.y == 0.0){
        return vec3(1.0,1.0,1.0);
    }
    else{
    return (color * 1.0);
    }
    
}

float remap(float s, float a1, float a2, float b1, float b2)
{
    return b1 + (s-a1)*(b2-b1)/(a2-a1);
}

float sinMove(in float min, in float max,in float speed, in float offset){
    return remap((sin(u_time*speed + offset)),-1.0,1.0,min,max);
}



void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    
    float mainLinesPos=0.240;
    float horizLineSmallLeftPos=0.60;
    float horizLineSmallRightPos=0.136;
    float verticLineSmallRighttPos=0.9;
    
    //Animations
    //mainLinesPos = sinMove(0.0,1.0,1.0,0.0);
    //horizLineSmallLeftPos =  sinMove(0.0,1.0,1.0,3.0);
    //verticLineSmallRighttPos = sinMove(0.0,1.0,1.0,3.0);
    //horizLineSmallRightPos = sinMove(0.0,mainLinesPos,1.5,5.0);
  
   float lines = drawLines(mainLinesPos,horizLineSmallLeftPos,horizLineSmallRightPos,verticLineSmallRighttPos,st);
       
    vec3 blueColor = drawColorInCorners(vec2(mainLinesPos),st,vec3(0.00, 0.35, 0.59));
    vec3 redColor = drawColorInCorners(vec2(1.0 - mainLinesPos),1.0 - st,vec3(0.83, 0.13, 0.07));
    vec3 yellowColor = drawColorInCorners(vec2(1.0 - verticLineSmallRighttPos,horizLineSmallRightPos),vec2(1.0 - st.x , st.y),vec3(0.920,0.839,0.324));
    
    vec3 color = blueColor * redColor *yellowColor;
    color = color * lines;

    gl_FragColor = vec4(color,1.0);
}