import { useEffect, useRef } from "react";

/**
 * InteractiveBackgroundVideo
 * A smooth, beautiful, interactive background on crisp white with luminous sunny yellow nodes,
 * floating glowing spheres, fluid cursor trails, and connecting elastic lines.
 */
const InteractiveBackgroundVideo = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse coordinates and velocity tracking for interactive trails
    const mouse = {
      x: width / 2,
      y: height / 2,
      targetX: width / 2,
      targetY: height / 2,
      vx: 0,
      vy: 0,
      radius: 220,
      isHovered: false,
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const newX = e.clientX - rect.left;
      const newY = e.clientY - rect.top;
      mouse.vx = newX - mouse.targetX;
      mouse.vy = newY - mouse.targetY;
      mouse.targetX = newX;
      mouse.targetY = newY;
      mouse.isHovered = true;
    };

    const handleMouseLeave = () => {
      mouse.isHovered = false;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    // Dynamic particles in yellow, amber, and subtle warm white tones
    const particleCount = Math.min(Math.floor((width * height) / 14000), 80);
    const particles = [];

    const yellowColors = [
      { r: 250, g: 204, b: 21 },  // primary vibrant yellow
      { r: 253, g: 224, b: 71 },  // bright light yellow
      { r: 234, g: 179, b: 8 },   // warm golden amber
      { r: 254, g: 240, b: 138 }, // pale cream yellow
    ];

    for (let i = 0; i < particleCount; i++) {
      const col = yellowColors[Math.floor(Math.random() * yellowColors.length)];
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.9,
        vy: (Math.random() - 0.5) * 0.9,
        baseRadius: Math.random() * 3 + 2,
        radius: Math.random() * 3 + 2,
        color: col,
        pulseSpeed: 0.02 + Math.random() * 0.03,
        pulseOffset: Math.random() * Math.PI * 2,
      });
    }

    // Floating luminous soft yellow mesh orbs
    const orbs = [
      { x: width * 0.2, y: height * 0.3, radius: 260, color: "rgba(254, 240, 138, 0.45)", vx: 0.2, vy: 0.3 },
      { x: width * 0.8, y: height * 0.4, radius: 320, color: "rgba(253, 224, 71, 0.35)", vx: -0.3, vy: 0.2 },
      { x: width * 0.5, y: height * 0.75, radius: 280, color: "rgba(250, 204, 21, 0.25)", vx: 0.25, vy: -0.2 },
    ];

    let t = 0;

    const render = () => {
      t += 0.02;

      // Mouse inertia
      mouse.x += (mouse.targetX - mouse.x) * 0.1;
      mouse.y += (mouse.targetY - mouse.y) * 0.1;

      // Clear with clean pure white canvas
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);

      // Render floating warm yellow atmospheric luminous orbs
      orbs.forEach((orb) => {
        orb.x += orb.vx;
        orb.y += orb.vy;

        if (orb.x < -orb.radius || orb.x > width + orb.radius) orb.vx *= -1;
        if (orb.y < -orb.radius || orb.y > height + orb.radius) orb.vy *= -1;

        const radial = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.radius);
        radial.addColorStop(0, orb.color);
        radial.addColorStop(1, "rgba(255, 255, 255, 0)");

        ctx.fillStyle = radial;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Interactive Cursor Glow (Light Sunbeam Spotlight on White)
      const mouseGlow = ctx.createRadialGradient(
        mouse.x,
        mouse.y,
        0,
        mouse.x,
        mouse.y,
        mouse.radius * 1.5
      );
      mouseGlow.addColorStop(0, "rgba(250, 204, 21, 0.35)");
      mouseGlow.addColorStop(0.5, "rgba(254, 240, 138, 0.18)");
      mouseGlow.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = mouseGlow;
      ctx.fillRect(0, 0, width, height);

      // Subtle minimalist grid
      ctx.strokeStyle = "rgba(234, 179, 8, 0.04)";
      ctx.lineWidth = 1;
      const gridSize = 64;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Update and connect particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.x += p.vx;
        p.y += p.vy;

        // Bounce walls
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Interactive mouse physics: repel with gentle magnetic spring
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          p.x -= (dx / dist) * force * 4;
          p.y -= (dy / dist) * force * 4;
          p.radius = p.baseRadius * (1 + force * 1.2);
        } else {
          p.radius = p.baseRadius;
        }

        // Pulse scale
        const pulse = Math.sin(t * 2 + p.pulseOffset) * 0.5 + 0.5;
        const currentRadius = p.radius + pulse * 1.2;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentRadius, 0, Math.PI * 2);
        ctx.fillStyle = `rgb(${p.color.r}, ${p.color.g}, ${p.color.b})`;
        ctx.shadowColor = "rgba(250, 204, 21, 0.5)";
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Connect nearby particles with subtle golden yellow lines
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const distNodes = Math.hypot(p.x - p2.x, p.y - p2.y);

          if (distNodes < 140) {
            const alpha = (1 - distNodes / 140) * 0.45;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(234, 179, 8, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }

        // Connect directly to cursor if inside interaction zone
        if (dist < mouse.radius) {
          const lineAlpha = (1 - dist / mouse.radius) * 0.7;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(234, 179, 8, ${lineAlpha})`;
          ctx.lineWidth = 1.4;
          ctx.stroke();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-auto overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{ touchAction: "none" }}
      />
      {/* Light bottom fade to pure white */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white pointer-events-none" />
    </div>
  );
};

export default InteractiveBackgroundVideo;
