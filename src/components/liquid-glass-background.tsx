"use client";

import { useEffect, useRef, ReactNode } from "react";

interface LiquidGlassBackgroundProps {
  children: ReactNode;
  className?: string;
  width?: number;
  height?: number;
}

// Utility functions
function smoothStep(a: number, b: number, t: number) {
  t = Math.max(0, Math.min(1, (t - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

function length(x: number, y: number) {
  return Math.sqrt(x * x + y * y);
}

function roundedRectSDF(
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  const qx = Math.abs(x) - width + radius;
  const qy = Math.abs(y) - height + radius;
  return (
    Math.min(Math.max(qx, qy), 0) +
    length(Math.max(qx, 0), Math.max(qy, 0)) -
    radius
  );
}

function texture(x: number, y: number) {
  return { type: "t", x, y };
}

// Generate unique ID
function generateId() {
  return "liquid-glass-" + Math.random().toString(36).substr(2, 9);
}

// Main Shader class
class Shader {
  private width: number;
  private height: number;
  private fragment: (
    uv: { x: number; y: number },
    mouse: { x: number; y: number }
  ) => { type: string; x: number; y: number };
  private canvasDPI: number;
  private id: string;
  private mouse: { x: number; y: number };
  private mouseUsed: boolean;
  private container!: HTMLDivElement;
  private svg!: SVGElement;
  private canvas!: HTMLCanvasElement;
  private context!: CanvasRenderingContext2D;
  private feImage!: SVGElement;
  private feDisplacementMap!: SVGElement;

  constructor(
    options: {
      width?: number;
      height?: number;
      fragment?: (
        uv: { x: number; y: number },
        mouse: { x: number; y: number }
      ) => { type: string; x: number; y: number };
    } = {}
  ) {
    this.width = options.width || 100;
    this.height = options.height || 100;
    this.fragment =
      options.fragment ||
      ((uv: { x: number; y: number }) => texture(uv.x, uv.y));
    this.canvasDPI = 1;
    this.id = generateId();

    this.mouse = { x: 0, y: 0 };
    this.mouseUsed = false;

    this.createElement();
    this.setupEventListeners();
    this.updateShader();
  }

  private createElement() {
    // Create container
    this.container = document.createElement("div");
    this.container.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      border-radius: inherit;
      backdrop-filter: url(#${this.id}_filter) blur(0.25px);
      background: rgba(255, 255, 255, 0.12);
      pointer-events: none;
    `;

    // Create SVG filter
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    this.svg.setAttribute("width", "0");
    this.svg.setAttribute("height", "0");
    this.svg.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      pointer-events: none;
    `;

    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    const filter = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "filter"
    );
    filter.setAttribute("id", `${this.id}_filter`);
    filter.setAttribute("filterUnits", "userSpaceOnUse");
    filter.setAttribute("colorInterpolationFilters", "sRGB");
    filter.setAttribute("x", "0");
    filter.setAttribute("y", "0");
    filter.setAttribute("width", this.width.toString());
    filter.setAttribute("height", this.height.toString());

    this.feImage = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "feImage"
    );
    this.feImage.setAttribute("id", `${this.id}_map`);
    this.feImage.setAttribute("width", this.width.toString());
    this.feImage.setAttribute("height", this.height.toString());

    this.feDisplacementMap = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "feDisplacementMap"
    );
    this.feDisplacementMap.setAttribute("in", "SourceGraphic");
    this.feDisplacementMap.setAttribute("in2", `${this.id}_map`);
    this.feDisplacementMap.setAttribute("xChannelSelector", "R");
    this.feDisplacementMap.setAttribute("yChannelSelector", "G");

    filter.appendChild(this.feImage);
    filter.appendChild(this.feDisplacementMap);
    defs.appendChild(filter);
    this.svg.appendChild(defs);

    // Create canvas for displacement map (hidden)
    this.canvas = document.createElement("canvas");
    this.canvas.width = this.width * this.canvasDPI;
    this.canvas.height = this.height * this.canvasDPI;
    this.canvas.style.display = "none";

    this.context = this.canvas.getContext("2d")!;
  }

  private setupEventListeners() {
    // Update mouse/touch position for shader
    const updatePosition = (e: MouseEvent | TouchEvent) => {
      const rect = this.container.getBoundingClientRect();
      let clientX: number, clientY: number;

      if (e instanceof TouchEvent) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      this.mouse.x = (clientX - rect.left) / rect.width;
      this.mouse.y = (clientY - rect.top) / rect.height;

      if (this.mouseUsed) {
        this.updateShader();
      }
    };

    // Mouse events for desktop
    this.container.addEventListener("mousemove", updatePosition);
    this.container.addEventListener("mouseenter", updatePosition);

    // Touch events for mobile
    this.container.addEventListener("touchmove", updatePosition, {
      passive: true,
    });
    this.container.addEventListener("touchstart", updatePosition, {
      passive: true,
    });
  }

  private updateShader() {
    const mouseProxy = new Proxy(this.mouse, {
      get: (target, prop) => {
        this.mouseUsed = true;
        return target[prop as keyof typeof target];
      },
    });

    this.mouseUsed = false;

    const w = Math.floor(this.width * this.canvasDPI);
    const h = Math.floor(this.height * this.canvasDPI);

    // Ensure dimensions are valid
    if (w <= 0 || h <= 0) {
      return;
    }

    const data = new Uint8ClampedArray(w * h * 4);

    let maxScale = 0;
    const rawValues: number[] = [];

    for (let i = 0; i < data.length; i += 4) {
      const x = (i / 4) % w;
      const y = Math.floor(i / 4 / w);
      const pos = this.fragment({ x: x / w, y: y / h }, mouseProxy);
      const dx = pos.x * w - x;
      const dy = pos.y * h - y;
      maxScale = Math.max(maxScale, Math.abs(dx), Math.abs(dy));
      rawValues.push(dx, dy);
    }

    maxScale *= 0.1;

    let index = 0;
    for (let i = 0; i < data.length; i += 4) {
      const r = rawValues[index++] / maxScale + 0.5;
      const g = rawValues[index++] / maxScale + 0.5;
      data[i] = r * 255;
      data[i + 1] = g * 255;
      data[i + 2] = 0;
      data[i + 3] = 255;
    }

    try {
      this.context.putImageData(new ImageData(data, w, h), 0, 0);
      this.feImage.setAttributeNS(
        "http://www.w3.org/1999/xlink",
        "href",
        this.canvas.toDataURL()
      );
      this.feDisplacementMap.setAttribute(
        "scale",
        (maxScale / this.canvasDPI).toString()
      );
    } catch (error) {
      console.warn("Failed to update shader:", error);
    }
  }

  appendTo(parent: HTMLElement) {
    parent.appendChild(this.svg);
    parent.appendChild(this.container);
  }

  updateSize(newWidth: number, newHeight: number) {
    this.width = newWidth;
    this.height = newHeight;

    // Update canvas size
    this.canvas.width = this.width * this.canvasDPI;
    this.canvas.height = this.height * this.canvasDPI;

    // Update SVG filter dimensions
    const filter = this.svg.querySelector("filter");
    if (filter) {
      filter.setAttribute("width", this.width.toString());
      filter.setAttribute("height", this.height.toString());
    }

    // Update feImage dimensions
    this.feImage.setAttribute("width", this.width.toString());
    this.feImage.setAttribute("height", this.height.toString());

    // Update shader
    this.updateShader();
  }

  destroy() {
    this.svg.remove();
    this.container.remove();
    this.canvas.remove();
  }
}

export default function LiquidGlassBackground({
  children,
  className = "",
  width,
  height,
}: LiquidGlassBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const shaderRef = useRef<Shader | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      const updateShaderSize = () => {
        if (containerRef.current && shaderRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0) {
            shaderRef.current.updateSize(rect.width, rect.height);
          }
        }
      };

      const createShader = () => {
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect || rect.width <= 0 || rect.height <= 0) {
          return;
        }

        if (!shaderRef.current) {
          // Create new shader
          const shader = new Shader({
            width: rect.width,
            height: rect.height,
            fragment: (uv: { x: number; y: number }) => {
              const ix = uv.x - 0.5;
              const iy = uv.y - 0.5;
              const distanceToEdge = roundedRectSDF(ix, iy, 0.3, 0.2, 0.6);
              const displacement = smoothStep(0.6, 0, distanceToEdge - 0.05);
              const scaled = smoothStep(0, 1, displacement);
              return texture(ix * scaled + 0.5, iy * scaled + 0.5);
            },
          });

          shader.appendTo(containerRef.current!);
          shaderRef.current = shader;
        } else {
          // Update existing shader size
          shaderRef.current.updateSize(rect.width, rect.height);
        }
      };

      // Wait for next frame to ensure container is rendered
      requestAnimationFrame(() => {
        createShader();
      });

      // Set up ResizeObserver to watch for size changes
      const resizeObserver = new ResizeObserver(updateShaderSize);
      resizeObserver.observe(containerRef.current);

      return () => {
        resizeObserver.disconnect();
        if (shaderRef.current) {
          shaderRef.current.destroy();
          shaderRef.current = null;
        }
      };
    }
  }, [children]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden rounded-3xl border border-white/20 ${className}`}
      style={
        width && height ? { width: `${width}px`, height: `${height}px` } : {}
      }
    >
      <div className="relative z-10">{children}</div>
    </div>
  );
}
