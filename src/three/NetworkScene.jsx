import React, { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Generates a set of nodes in a loose spherical volume, then connects
// nearby nodes with edges — modeling a routing/interaction network rather
// than generic decorative particles.
function useNetworkGeometry(count, radius) {
  return useMemo(() => {
    const nodes = [];
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = radius * (0.55 + Math.random() * 0.45);
      nodes.push(
        new THREE.Vector3(
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.sin(phi) * Math.sin(theta) * 0.55,
          r * Math.cos(phi)
        )
      );
    }

    const edges = [];
    const maxDist = radius * 0.62;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (nodes[i].distanceTo(nodes[j]) < maxDist) {
          edges.push([i, j]);
        }
      }
    }
    return { nodes, edges };
  }, [count, radius]);
}

function NetworkNodes({ nodes }) {
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const phases = useMemo(() => nodes.map(() => Math.random() * Math.PI * 2), [nodes]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    nodes.forEach((pos, i) => {
      const pulse = 0.7 + Math.sin(t * 1.2 + phases[i]) * 0.3;
      dummy.position.copy(pos);
      dummy.scale.setScalar(pulse * 0.045);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, nodes.length]}>
      <sphereGeometry args={[1, 12, 12]} />
      <meshBasicMaterial color="#22D3EE" transparent opacity={0.85} />
    </instancedMesh>
  );
}

function NetworkEdges({ nodes, edges }) {
  const { positions } = useMemo(() => {
    const positions = new Float32Array(edges.length * 6);
    edges.forEach(([a, b], i) => {
      positions[i * 6 + 0] = nodes[a].x;
      positions[i * 6 + 1] = nodes[a].y;
      positions[i * 6 + 2] = nodes[a].z;
      positions[i * 6 + 3] = nodes[b].x;
      positions[i * 6 + 4] = nodes[b].y;
      positions[i * 6 + 5] = nodes[b].z;
    });
    return { positions };
  }, [nodes, edges]);

  return (
    <lineSegments>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <lineBasicMaterial color="#3B4A8C" transparent opacity={0.22} />
    </lineSegments>
  );
}

function RotatingGroup({ children }) {
  const groupRef = useRef();
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.045;
      groupRef.current.rotation.x = Math.sin(Date.now() * 0.00005) * 0.08;
    }
  });
  return <group ref={groupRef}>{children}</group>;
}

function Network({ count = 46, radius = 4.4 }) {
  const { nodes, edges } = useNetworkGeometry(count, radius);
  return (
    <RotatingGroup>
      <NetworkEdges nodes={nodes} edges={edges} />
      <NetworkNodes nodes={nodes} />
    </RotatingGroup>
  );
}

export default function NetworkScene({ className = "" }) {
  return (
    <div className={`absolute inset-0 ${className}`} aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.6} />
        <Network />
      </Canvas>
    </div>
  );
}
