"use client";
import { useEffect, useRef } from "react";
import { reduced } from "@/lib/motion/gsap";

const VERT = `attribute vec2 p; void main(){ gl_Position = vec4(p,0.,1.); }`;
// Domain-warped fbm flowing upward like heat haze; reacts to pointer and scroll.
const FRAG = `precision mediump float;
uniform vec2 r; uniform float t; uniform vec2 m; uniform float s;
float h(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
float n(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
  return mix(mix(h(i),h(i+vec2(1,0)),f.x), mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x), f.y); }
float fbm(vec2 p){ float a=.5, v=0.; for(int i=0;i<5;i++){ v+=a*n(p); p*=2.02; a*=.5; } return v; }
void main(){
  vec2 uv = gl_FragCoord.xy / r; vec2 q = uv; q.x *= r.x/r.y;
  float tt = t*.12;
  vec2 w = vec2(fbm(q*2.2 + vec2(0., -tt*2.)), fbm(q*2.2 + vec2(5.2, 1.3) - tt));
  float f = fbm(q*2. + 2.4*w + vec2(0., -tt*3.) + s*.4);
  float md = distance(uv, m); float glow = smoothstep(.5, 0., md) * .5;
  float heat = smoothstep(.15, .95, f + (1.-uv.y)*.55 + glow);
  vec3 c = mix(vec3(.04,.03,.02), vec3(.89,.33,.12), heat);
  c = mix(c, vec3(1.,.62,.28), pow(heat, 3.));
  float a = heat * .85;
  gl_FragColor = vec4(c * a, a);
}`;

/** Raw WebGL fragment shader, no dependencies. Renders at reduced resolution and pauses offscreen. */
export default function EmberShader({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current!;
    if (reduced()) return;
    const gl = cv.getContext("webgl", { premultipliedAlpha: true, alpha: true, antialias: false, powerPreference: "low-power" });
    if (!gl) return;
    const sh = (type: number, src: string) => { const s = gl.createShader(type)!; gl.shaderSource(s, src); gl.compileShader(s); return s; };
    const pr = gl.createProgram()!;
    gl.attachShader(pr, sh(gl.VERTEX_SHADER, VERT));
    gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return;
    gl.useProgram(pr);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(pr, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const U = (n: string) => gl.getUniformLocation(pr, n);
    const uR = U("r"), uT = U("t"), uM = U("m"), uS = U("s");
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    const scale = 0.5;
    const size = () => {
      const w = Math.max(2, Math.floor(cv.clientWidth * scale)), hh = Math.max(2, Math.floor(cv.clientHeight * scale));
      cv.width = w; cv.height = hh; gl.viewport(0, 0, w, hh); gl.uniform2f(uR, w, hh);
    };
    size();
    const mouse = { x: 0.5, y: 0.3, tx: 0.5, ty: 0.3 };
    const onMove = (e: PointerEvent) => { const b = cv.getBoundingClientRect(); mouse.tx = (e.clientX - b.left) / b.width; mouse.ty = 1 - (e.clientY - b.top) / b.height; };
    window.addEventListener("pointermove", onMove);
    const ro = new ResizeObserver(size); ro.observe(cv);

    let raf = 0, visible = true;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) raf = requestAnimationFrame(frame); });
    io.observe(cv);
    const t0 = performance.now();
    function frame(now: number) {
      if (!visible) return;
      mouse.x += (mouse.tx - mouse.x) * 0.05; mouse.y += (mouse.ty - mouse.y) * 0.05;
      gl!.clearColor(0, 0, 0, 0); gl!.clear(gl!.COLOR_BUFFER_BIT);
      gl!.uniform1f(uT, (now - t0) / 1000);
      gl!.uniform2f(uM, mouse.x, mouse.y);
      gl!.uniform1f(uS, window.scrollY / 1000);
      gl!.drawArrays(gl!.TRIANGLES, 0, 3);
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); window.removeEventListener("pointermove", onMove); gl.getExtension("WEBGL_lose_context")?.loseContext(); };
  }, []);
  return <canvas ref={ref} aria-hidden className={className} />;
}
