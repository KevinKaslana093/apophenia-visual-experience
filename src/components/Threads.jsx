import { useEffect, useRef } from 'react';
import { Color, Mesh, Program, Renderer, Triangle } from 'ogl';

// Adapted from React Bits / Threads (MIT). The shader is used only in the final release chapter.
const vertex = `
attribute vec2 position; attribute vec2 uv; varying vec2 vUv;
void main(){vUv=uv;gl_Position=vec4(position,0.,1.);}`;

const fragment = `
precision highp float;
uniform float iTime; uniform vec3 iResolution; uniform vec3 uColor;
uniform float uAmplitude; uniform float uDistance; uniform float uFade;
#define LINES 28
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+1.),f.x),f.y);}
void main(){
  vec2 uv=gl_FragCoord.xy/iResolution.xy; float strength=0.;
  for(int i=0;i<LINES;i++){
    float p=float(i)/float(LINES-1); float n=noise(vec2(uv.x*2.2+iTime*.09,p*8.));
    float y=.5+(p-.5)*uDistance+(n-.5)*uAmplitude*smoothstep(.04,.92,uv.x);
    float width=mix(.003,.0008,p); strength=max(strength,smoothstep(width,0.,abs(uv.y-y))*(1.-p*.68));
  }
  gl_FragColor=vec4(uColor*strength,strength*uFade);
}`;

export default function Threads({ active, fade = 1, amplitude = 0.68, distance = 0.92 }) {
  const ref = useRef(null);
  const state = useRef({ fade, amplitude, distance });
  state.current = { fade, amplitude, distance };

  useEffect(() => {
    if (!active || !ref.current) return undefined;
    const root = ref.current;
    const renderer = new Renderer({ alpha: true, dpr: 1 });
    const gl = renderer.gl; gl.clearColor(0, 0, 0, 0); root.appendChild(gl.canvas);
    const program = new Program(gl, { vertex, fragment, transparent: true, uniforms: {
      iTime: { value: 0 }, iResolution: { value: new Color(1, 1, 1) }, uColor: { value: new Color(0.94, 0.1, 0.07) },
      uAmplitude: { value: amplitude }, uDistance: { value: distance }, uFade: { value: fade },
    }});
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });
    const resize = () => { renderer.setSize(Math.ceil(root.clientWidth * .72), Math.ceil(root.clientHeight * .72)); program.uniforms.iResolution.value.set(gl.canvas.width, gl.canvas.height, gl.canvas.width / gl.canvas.height); };
    const observer = new ResizeObserver(resize); observer.observe(root); resize(); let frame;
    const draw = (stamp) => { const live = state.current; program.uniforms.iTime.value = stamp * .001; program.uniforms.uFade.value = live.fade; program.uniforms.uAmplitude.value = live.amplitude; program.uniforms.uDistance.value = live.distance; renderer.render({ scene: mesh }); frame = requestAnimationFrame(draw); };
    frame = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(frame); observer.disconnect(); if (root.contains(gl.canvas)) root.removeChild(gl.canvas); gl.getExtension('WEBGL_lose_context')?.loseContext(); };
  }, [active]);

  return <div ref={ref} className="threads" aria-hidden="true" />;
}
