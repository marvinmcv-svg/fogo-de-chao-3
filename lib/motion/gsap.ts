"use client";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let ready = false;
export function registerGsap() {
  if (ready || typeof window === "undefined") return gsap;
  gsap.registerPlugin(ScrollTrigger);
  ready = true;
  return gsap;
}

export const reduced = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export { gsap, ScrollTrigger };
