"use client";
import { useEffect } from "react";

export default function ParticlesBackground() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = '/particles.min.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      // @ts-ignore
      window.particlesJS("particles-js", {
        "particles": {
          "number": {
            "value": 80,
            "density": {
              "enable": true,
              "value_area": 800
            }
          },
          "color": {
            "value": "#ffffff"
          },
          "shape": {
            "type": "circle"
          },
          "opacity": {
            "value": 0.5,
            "random": false
          },
          "size": {
            "value": 3,
            "random": true
          },
          "line_linked": {
            "enable": true,
            "distance": 150,
            "color": "#ffffff",
            "opacity": 0.4,
            "width": 1
          },
          "move": {
            "enable": true,
            "speed": 6
          }
        },
        "interactivity": {
          "detect_on": "canvas",
          "events": {
            "onhover": {
              "enable": true,
              "mode": "repulse"
            },
            "onclick": {
              "enable": true,
              "mode": "push"
            },
            "resize": true
          }
        },
        "retina_detect": true
      });
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return <div id="particles-js" className="particles-container"></div>;
}