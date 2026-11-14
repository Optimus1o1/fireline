'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { AlertCircle, Info, Sparkles } from 'lucide-react';

export default function CombustionChamber3D() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    // Check for prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const container = mountRef.current;
    if (!container) return;

    // Dimensions
    const width = container.clientWidth;
    const height = container.clientHeight || 450;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 8.5;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 2. Central Microgravity Spherical Flame Core
    // In zero-g, buoyancy is absent, creating a characteristic spherical diffusion flame
    const flameGroup = new THREE.Group();
    scene.add(flameGroup);

    // Inner glowing sphere (Blue/white core of diffusion flame)
    const coreGeo = new THREE.SphereGeometry(0.85, 32, 32);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0xff604a,
      wireframe: false,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    flameGroup.add(coreMesh);

    // Middle glowing layer (Ember mantle)
    const mantleGeo = new THREE.SphereGeometry(1.15, 32, 32);
    const mantleMat = new THREE.MeshBasicMaterial({
      color: 0xe53935,
      transparent: true,
      opacity: 0.35,
      wireframe: true,
    });
    const mantleMesh = new THREE.Mesh(mantleGeo, mantleMat);
    flameGroup.add(mantleMesh);

    // Outer spherical halo
    const haloGeo = new THREE.SphereGeometry(1.4, 24, 24);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0xf5a742,
      transparent: true,
      opacity: 0.15,
      wireframe: true,
    });
    const haloMesh = new THREE.Mesh(haloGeo, haloMat);
    flameGroup.add(haloMesh);

    // 3. Chamber Rings (Gimbal / diagnostic sensor rings)
    const ringGroup = new THREE.Group();
    scene.add(ringGroup);

    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.12,
      wireframe: true,
    });
    const ringGeo1 = new THREE.TorusGeometry(2.3, 0.02, 16, 100);
    const ringMesh1 = new THREE.Mesh(ringGeo1, ringMat1);
    ringMesh1.rotation.x = Math.PI / 2.5;
    ringGroup.add(ringMesh1);

    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0xff604a,
      transparent: true,
      opacity: 0.25,
      wireframe: true,
    });
    const ringGeo2 = new THREE.TorusGeometry(2.8, 0.015, 16, 100);
    const ringMesh2 = new THREE.Mesh(ringGeo2, ringMat2);
    ringMesh2.rotation.y = Math.PI / 3;
    ringGroup.add(ringMesh2);

    const ringMat3 = new THREE.MeshBasicMaterial({
      color: 0x8b9099,
      transparent: true,
      opacity: 0.15,
      wireframe: true,
    });
    const ringGeo3 = new THREE.TorusGeometry(3.3, 0.015, 16, 100);
    const ringMesh3 = new THREE.Mesh(ringGeo3, ringMat3);
    ringGroup.add(ringMesh3);

    // 4. Drifting Ember Particles
    const particleCount = 140;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const speeds = new Float32Array(particleCount);

    for (let i = 0; i < particleCount * 3; i += 3) {
      const radius = 1.2 + Math.random() * 2.8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i + 2] = radius * Math.cos(phi);

      speeds[i / 3] = 0.2 + Math.random() * 0.8;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0xff604a,
      size: 0.05,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 5. Mouse Parallax Variables
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      targetX = x * 1.5;
      targetY = y * 1.5;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // 6. Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight || 450;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // 7. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Smooth camera parallax
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;
      camera.position.x = mouseX * 2;
      camera.position.y = -mouseY * 2;
      camera.lookAt(scene.position);

      if (!mediaQuery.matches) {
        // Flame breathing pulse
        const pulse = 1 + Math.sin(elapsedTime * 2.5) * 0.06;
        coreMesh.scale.set(pulse, pulse, pulse);
        mantleMesh.scale.set(pulse * 1.05, pulse * 1.05, pulse * 1.05);

        // Slow rotations
        flameGroup.rotation.y = elapsedTime * 0.15;
        flameGroup.rotation.z = elapsedTime * 0.08;

        ringGroup.rotation.x = elapsedTime * 0.05;
        ringGroup.rotation.y = elapsedTime * 0.08;

        // Particle subtle drift
        particles.rotation.y = elapsedTime * 0.04;
        particles.rotation.x = elapsedTime * 0.02;
      }

      renderer.render(scene, camera);
    };

    animate();

    // 8. Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      scene.clear();
    };
  }, []);

  return (
    <div className="relative w-full h-[450px] sm:h-[500px] flex items-center justify-center overflow-hidden rounded-3xl glass-panel border border-ember-border group">
      {/* 3D WebGL Canvas */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Orbiting Research Labels (Overlay Elements) */}
      <div className="absolute inset-0 pointer-events-none p-6 flex flex-col justify-between">
        {/* Top Badges */}
        <div className="flex justify-between items-start">
          <div className="pointer-events-auto">
            <button
              onMouseEnter={() => setActiveTag('SAFFIRE')}
              onMouseLeave={() => setActiveTag(null)}
              className="px-3 py-1.5 rounded-xl glass-panel-elevated border border-flame/30 hover:border-flame-bright text-xs font-mono flex items-center space-x-2 transition-all shadow-ember-sm"
            >
              <span className="w-2 h-2 rounded-full bg-flame-bright animate-ping" />
              <span className="text-white font-bold">SAFFIRE-I</span>
              <span className="text-paper-dim text-[10px]">PSI-98</span>
            </button>
            {activeTag === 'SAFFIRE' && (
              <div className="mt-2 p-3 rounded-xl glass-panel-elevated border border-flame/40 text-[11px] max-w-xs text-paper-muted animate-in fade-in duration-150">
                <strong className="text-white block mb-0.5">Cygnus Flight Test:</strong>
                Large-scale fabric flame spread in microgravity inside an uncrewed resupply vehicle.
              </div>
            )}
          </div>

          <div className="pointer-events-auto text-right">
            <button
              onMouseEnter={() => setActiveTag('BASS')}
              onMouseLeave={() => setActiveTag(null)}
              className="px-3 py-1.5 rounded-xl glass-panel-elevated border border-amberGold/30 hover:border-amberGold text-xs font-mono flex items-center space-x-2 transition-all shadow-ember-sm"
            >
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="text-white font-bold">BASS-II</span>
              <span className="text-paper-dim text-[10px]">PSI-25</span>
            </button>
            {activeTag === 'BASS' && (
              <div className="mt-2 p-3 rounded-xl glass-panel-elevated border border-amberGold/40 text-[11px] max-w-xs text-paper-muted text-left animate-in fade-in duration-150">
                <strong className="text-white block mb-0.5">ISS Glovebox Test:</strong>
                Thin PMMA polymer sheet burning under forced airflow in freefall conditions.
              </div>
            )}
          </div>
        </div>

        {/* Bottom Tag & Mandatory Conceptual Disclaimer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-white/5 pointer-events-auto">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 rounded-lg bg-flame/15 text-flame-bright border border-flame/30 text-[11px] font-mono font-semibold">
              FLEX (PSI-69 Droplet)
            </span>
            <span className="text-paper-dim text-xs font-mono">
              Spherical Diffusion Regime (~10⁻⁶ g)
            </span>
          </div>

          {/* Mandatory Conceptual Visualization Disclaimer */}
          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] text-paper-dim font-mono">
            <Info className="w-3.5 h-3.5 text-flame-bright" />
            <span>Conceptual visualization — not experimental data.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
