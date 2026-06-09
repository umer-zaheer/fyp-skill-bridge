
import React, { useId } from "react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

// Since we might not have tsparticles installed, let's use a pure Canvas approach for simplicity and performance
// without adding new dependencies that might fail build.

export const SparklesCore = (props: {
  id?: string;
  className?: string;
  background?: string;
  minSize?: number;
  maxSize?: number;
  speed?: number;
  particleColor?: string;
  particleDensity?: number;
}) => {
  const {
    id,
    className,
    background = "transparent",
    minSize = 0.6,
    maxSize = 1.4,
    speed = 1,
    particleColor = "#ffffff",
    particleDensity = 100,
  } = props;
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = canvas.parentElement?.clientWidth || window.innerWidth;
    let height = canvas.parentElement?.clientHeight || window.innerHeight;
    let animationId: number;

    canvas.width = width;
    canvas.height = height;

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * (maxSize - minSize) + minSize;
        this.speedX = (Math.random() - 0.5) * speed;
        this.speedY = (Math.random() - 0.5) * speed;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > width) this.x = 0;
        if (this.x < 0) this.x = width;
        if (this.y > height) this.y = 0;
        if (this.y < 0) this.y = height;
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = particleColor;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const initParticles = () => {
      const particleCount = (width * height) / (10000 / particleDensity);
      const particlesArray: Particle[] = [];
      for (let i = 0; i < particleCount; i++) {
        particlesArray.push(new Particle());
      }
      return particlesArray;
    };

    let particles = initParticles();

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });
      animationId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (canvas.parentElement) {
        width = canvas.parentElement.clientWidth;
        height = canvas.parentElement.clientHeight;
        canvas.width = width;
        canvas.height = height;
        particles = initParticles();
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, [maxSize, minSize, particleColor, particleDensity, speed]);

  return (
    <canvas
      ref={canvasRef}
      id={id}
      className={cn("pointer-events-none", className)}
      style={{
        background,
      }}
    />
  );
};
