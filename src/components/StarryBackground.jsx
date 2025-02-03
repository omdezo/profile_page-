import React, { Suspense, useRef, useEffect, useCallback, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, Sparkles, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';

const PARTICLE_COUNT = 500;
const NEBULA_POINTS = 1500;

/**
 * CustomParticleSystem
 * A field of twinkling particles that gently orbit.
 */
const CustomParticleSystem = React.memo(() => {
  // Must be called inside Canvas: useFrame, useMemo
  const instancedMesh = useRef();
  const hovered = useRef(false);
  const particles = useMemo(() => {
    const arr = new Array(PARTICLE_COUNT);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      arr[i] = {
        position: [
          (Math.random() - 0.5) * 50,
          (Math.random() - 0.5) * 50,
          (Math.random() - 0.5) * 50,
        ],
        scale: Math.random() * 0.5 + 0.5,
        speed: Math.random() * 0.2 + 0.1,
      };
    }
    return arr;
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const materialRef = useRef();

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    particles.forEach((particle, i) => {
      const t = elapsed * particle.speed;
      const radius = 2 + Math.sin(t * 0.5) * 0.5;
      const theta = t + i * 0.01;
      dummy.position.set(
        particle.position[0] + Math.cos(theta) * radius,
        particle.position[1] + Math.sin(theta) * radius,
        particle.position[2]
      );
      const scale = hovered.current
        ? particle.scale * (1 + Math.sin(t * 2) * 0.1)
        : particle.scale;
      dummy.scale.setScalar(scale);
      dummy.updateMatrix();
      instancedMesh.current.setMatrixAt(i, dummy.matrix);
    });
    instancedMesh.current.instanceMatrix.needsUpdate = true;
    if (hovered.current && materialRef.current) {
      materialRef.current.opacity = 0.8;
      materialRef.current.needsUpdate = true;
    }
  });

  return (
    <instancedMesh
      ref={instancedMesh}
      args={[null, null, PARTICLE_COUNT]}
      onPointerOver={() => (hovered.current = true)}
      onPointerOut={() => (hovered.current = false)}
    >
      <sphereGeometry args={[0.05, 16, 16]} />
      <meshPhongMaterial
        ref={materialRef}
        color="#cffff6"
        emissive="#00FFD1"
        emissiveIntensity={0.5}
        transparent
        opacity={0.6}
      />
    </instancedMesh>
  );
});

/**
 * Nebula
 * A colorful cloud of points adding depth and vibrancy.
 */
const Nebula = React.memo(() => {
  // Must be called inside Canvas: useMemo
  const geometryRef = useRef();
  const points = useMemo(() => {
    const p = new Float32Array(NEBULA_POINTS * 3);
    const angleMultiplier = Math.PI * 2;
    for (let i = 0; i < NEBULA_POINTS * 3; i += 3) {
      const r = 50;
      const theta = THREE.MathUtils.randFloatSpread(angleMultiplier);
      const phi = THREE.MathUtils.randFloatSpread(angleMultiplier);
      p[i] = r * Math.sin(theta) * Math.cos(phi);
      p[i + 1] = r * Math.sin(theta) * Math.sin(phi);
      p[i + 2] = r * Math.cos(theta);
    }
    return p;
  }, []);

  const colors = useMemo(() => {
    const c = new Float32Array(NEBULA_POINTS * 3);
    const color1 = new THREE.Color('#FF69B4');
    const color2 = new THREE.Color('#00FFD1');
    const tempColor = new THREE.Color();
    for (let i = 0; i < NEBULA_POINTS * 3; i += 3) {
      tempColor.lerpColors(color1, color2, Math.random());
      tempColor.toArray(c, i);
    }
    return c;
  }, []);

  useEffect(() => {
    if (geometryRef.current) {
      geometryRef.current.attributes.position.needsUpdate = true;
      geometryRef.current.attributes.color.needsUpdate = true;
    }
  }, []);

  return (
    <points>
      <bufferGeometry ref={geometryRef}>
        <bufferAttribute
          attach="attributes-position"
          count={NEBULA_POINTS}
          array={points}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={NEBULA_POINTS}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.2}
        vertexColors
        blending={THREE.AdditiveBlending}
        transparent
        opacity={0.2}
        depthWrite={false}
        fog={false} // disable fog to avoid uniform issues
      />
    </points>
  );
});

/**
 * CosmicBodies
 * Two standout cosmic objects with special movement:
 * 
 * - Left Body (Asteroid-like)
 * - Right Body (Star-like)
 */
const CosmicBodies = React.memo(() => {
  // Must be called inside Canvas: useFrame, useTexture
  const leftBody = useRef();
  const rightBody = useRef();
  const scrollPercent = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      scrollPercent.current =
        window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Load asteroid texture within Canvas
  const asteroidTexture = useTexture('/textures/asteroid.jpg');

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();

    // Left Cosmic Body
    if (leftBody.current) {
      const baseX = -20;
      const baseY = 0;
      const radius = 5;
      const angle = elapsed * 0.5 + scrollPercent.current * Math.PI;
      leftBody.current.position.x = baseX + Math.cos(angle) * radius;
      leftBody.current.position.y = baseY + Math.sin(angle) * radius - scrollPercent.current * 10;
      leftBody.current.rotation.x += 0.005;
      leftBody.current.rotation.y += 0.01;
    }

    // Right Cosmic Body
    if (rightBody.current) {
      const baseX = 20;
      const baseY = 10;
      rightBody.current.position.x = baseX + Math.sin(elapsed * 0.4) * 3;
      rightBody.current.position.y =
        baseY + Math.cos(elapsed * 0.4) * 3 - scrollPercent.current * 10;
      rightBody.current.rotation.y += 0.007;
      rightBody.current.rotation.z += 0.005;
    }
  });

  return (
    <>
      {/* Left Cosmic Body: Asteroid-like */}
      <mesh ref={leftBody}>
        <dodecahedronGeometry args={[3.5, 0]} />
        <meshStandardMaterial
          map={asteroidTexture}
          roughness={0.9}
          metalness={0.3}
          emissive="#333333"
          emissiveIntensity={0.4}
        />
      </mesh>

      {/* Right Cosmic Body: Star-like */}
      <mesh ref={rightBody}>
        <sphereGeometry args={[4, 32, 32]} />
        <meshStandardMaterial
          color="#FF4500"
          emissive="#FF8C00"
          emissiveIntensity={2.0}
          transparent
          opacity={0.95}
        />
      </mesh>
    </>
  );
});

/**
 * ScrollSync
 * Smoothly moves the camera based on scroll position.
 */
const ScrollSync = React.memo(() => {
  // Must be called inside Canvas: useFrame, useThree
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3(0, 0, 25));
  const initialPos = useRef(new THREE.Vector3(0, 0, 25));

  const handleScroll = useCallback(() => {
    const scrollPercent =
      window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);

    // Example camera movement: small orbit + z shift on scroll
    targetPos.current.set(
      initialPos.current.x + Math.sin(scrollPercent * Math.PI * 2) * 5,
      initialPos.current.y + Math.cos(scrollPercent * Math.PI * 2) * 5,
      initialPos.current.z - scrollPercent * 10
    );
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useFrame(() => {
    // Smoothly interpolate camera position toward target
    camera.position.lerp(targetPos.current, 0.02);
    camera.lookAt(0, 0, 0);
  });

  return null;
});

/**
 * StableStarryBackground
 * Main component combining everything inside a <Canvas>.
 */
const StableStarryBackground = () => {
  const [isMounted, setIsMounted] = useState(false);

  // Delay mounting to avoid SSR issues in some frameworks
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  return (
    <div className="fixed inset-0 z-0">
      {isMounted && (
        <Canvas
          camera={{ position: [0, 0, 25], fov: 70, near: 0.1, far: 1000 }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
            stencil: false,
            depth: true,
          }}
          dpr={Math.min(window.devicePixelRatio, 2)}
          performance={{ min: 0.5 }}
        >
          {/* Fog, lights, and base components */}
          <fog attach="fog" args={['#000', 30, 100]} />
          <ambientLight intensity={0.1} />
          <pointLight position={[10, 10, 10]} intensity={0.8} color="#00FFD1" />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#FF69B4" />

          {/* Stars, Particles, Nebula */}
          <Stars
            radius={100}
            depth={50}
            count={5000}
            factor={4}
            saturation={0}
            fade
            speed={1}
          />
          <CustomParticleSystem />
          <Nebula />

          {/* Suspense for loading textures */}
          <Suspense fallback={null}>
            <CosmicBodies />
          </Suspense>

          {/* Sparkles and Postprocessing */}
          <Sparkles
            count={100}
            size={2}
            speed={0.2}
            opacity={0.5}
            color="#00FFD1"
            scale={50}
          />
          <EffectComposer multisampling={0}>
            <Bloom
              intensity={1.5}
              kernelSize={3}
              luminanceThreshold={0.2}
              luminanceSmoothing={0.3}
            />
            <ChromaticAberration
              blendFunction={BlendFunction.NORMAL}
              offset={[0.0005, 0.0005]}
            />
          </EffectComposer>

          {/* ScrollSync (camera movement) */}
          <ScrollSync />
        </Canvas>
      )}
    </div>
  );
};

export default React.memo(StableStarryBackground);
