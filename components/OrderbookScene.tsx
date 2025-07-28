"use client";

import { useRef, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { useOrderbookStore } from '@/lib/orderbook-store';

export function OrderbookScene() {
  const meshRef = useRef<THREE.Group>(null);
  const { orderbook, pressureZones, timeRange, showPressureZones } = useOrderbookStore();

  // Create orderbook visualization geometry
  const { bidBars, askBars, axisLabels } = useMemo(() => {
    const bidBars: JSX.Element[] = [];
    const askBars: JSX.Element[] = [];
    const axisLabels: JSX.Element[] = [];

    // Process bids (green bars on negative X side)
    orderbook.bids.slice(0, 20).forEach((bid, index) => {
      const [price, quantity] = bid;
      const height = Math.log(quantity + 1) * 5; // Logarithmic scaling
      const x = -index * 2 - 5; // Negative X for bids
      const z = (Date.now() % 60000) / 1000; // Time-based Z position

      bidBars.push(
        <mesh key={`bid-${index}`} position={[x, height / 2, z]}>
          <boxGeometry args={[1.5, height, 0.5]} />
          <meshStandardMaterial 
            color="#22c55e" 
            transparent 
            opacity={0.8}
            emissive="#065f46"
            emissiveIntensity={0.2}
          />
        </mesh>
      );

      // Add price labels
      if (index % 5 === 0) {
        axisLabels.push(
          <Text
            key={`bid-label-${index}`}
            position={[x, -2, 0]}
            fontSize={0.8}
            color="#22c55e"
            anchorX="center"
            anchorY="middle"
          >
            {price.toFixed(0)}
          </Text>
        );
      }
    });

    // Process asks (red bars on positive X side)
    orderbook.asks.slice(0, 20).forEach((ask, index) => {
      const [price, quantity] = ask;
      const height = Math.log(quantity + 1) * 5;
      const x = index * 2 + 5; // Positive X for asks
      const z = (Date.now() % 60000) / 1000;

      askBars.push(
        <mesh key={`ask-${index}`} position={[x, height / 2, z]}>
          <boxGeometry args={[1.5, height, 0.5]} />
          <meshStandardMaterial 
            color="#ef4444" 
            transparent 
            opacity={0.8}
            emissive="#7f1d1d"
            emissiveIntensity={0.2}
          />
        </mesh>
      );

      // Add price labels
      if (index % 5 === 0) {
        axisLabels.push(
          <Text
            key={`ask-label-${index}`}
            position={[x, -2, 0]}
            fontSize={0.8}
            color="#ef4444"
            anchorX="center"
            anchorY="middle"
          >
            {price.toFixed(0)}
          </Text>
        );
      }
    });

    return { bidBars, askBars, axisLabels };
  }, [orderbook]);

  // Pressure zones visualization
  const pressureZoneVisuals = useMemo(() => {
    if (!showPressureZones) return [];

    return pressureZones.map((zone, index) => (
      <mesh key={`pressure-${index}`} position={[zone.price * 0.01, 0, 0]}>
        <cylinderGeometry args={[zone.intensity * 2, zone.intensity * 2, 30, 8]} />
        <meshStandardMaterial 
          color="#3b82f6"
          transparent
          opacity={0.3}
          wireframe
        />
      </mesh>
    ));
  }, [pressureZones, showPressureZones]);

  // Animation loop
  useFrame((state) => {
    if (meshRef.current) {
      // Subtle floating animation
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.5;
    }
  });

  return (
    <group ref={meshRef}>
      {/* Axis lines */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2}
            array={new Float32Array([-50, 0, 0, 50, 0, 0])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#64748b" />
      </line>
      
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2}
            array={new Float32Array([0, 0, 0, 0, 50, 0])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#64748b" />
      </line>

      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2}
            array={new Float32Array([0, 0, -30, 0, 0, 30])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#64748b" />
      </line>

      {/* Axis labels */}
      <Text position={[55, 0, 0]} fontSize={2} color="#64748b" anchorX="center">
        Price (Ask)
      </Text>
      <Text position={[-55, 0, 0]} fontSize={2} color="#64748b" anchorX="center">
        Price (Bid)
      </Text>
      <Text position={[0, 55, 0]} fontSize={2} color="#64748b" anchorX="center">
        Quantity
      </Text>
      <Text position={[0, 0, 35]} fontSize={2} color="#64748b" anchorX="center">
        Time
      </Text>

      {/* Orderbook bars */}
      {bidBars}
      {askBars}
      {axisLabels}

      {/* Pressure zones */}
      {pressureZoneVisuals}

      {/* Center spread indicator */}
      <mesh position={[0, 10, 0]}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial 
          color="#fbbf24" 
          emissive="#f59e0b"
          emissiveIntensity={0.5}
        />
      </mesh>
    </group>
  );
}