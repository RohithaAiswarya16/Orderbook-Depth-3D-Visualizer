"use client";

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stats, Grid, Text } from '@react-three/drei';
import { OrderbookScene } from './OrderbookScene';
import { ControlPanel } from './ControlPanel';
import { DataPanel } from './DataPanel';
import { useOrderbookStore } from '@/lib/orderbook-store';
import { useWebSocketConnection } from '@/hooks/useWebSocketConnection';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Activity, TrendingUp, TrendingDown } from 'lucide-react';

export function OrderbookVisualizer() {
  const [isLoading, setIsLoading] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const {
    symbol,
    orderbook,
    pressureZones,
    connectionStatus,
    selectedVenues,
    isRotating,
    timeRange
  } = useOrderbookStore();

  useWebSocketConnection();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const bestBid = orderbook.bids[0]?.[0] || 0;
  const bestAsk = orderbook.asks[0]?.[0] || 0;
  const spread = bestAsk - bestBid;
  const spreadPercent = ((spread / bestBid) * 100).toFixed(4);

  return (
    <div className="w-full h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex">
      {/* Main 3D Visualization */}
      <div className="flex-1 relative">
        {/* Status Bar */}
        <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Badge variant={connectionStatus === 'connected' ? 'default' : 'destructive'} className="bg-slate-800/80 backdrop-blur-sm">
              <Activity className="w-3 h-3 mr-1" />
              {connectionStatus}
            </Badge>
            <Badge variant="outline" className="bg-slate-800/80 backdrop-blur-sm text-white border-slate-600">
              {symbol}
            </Badge>
            <Badge variant="outline" className="bg-slate-800/80 backdrop-blur-sm text-white border-slate-600">
              {selectedVenues.length} venues
            </Badge>
          </div>
          
          <div className="flex items-center gap-4">
            <Card className="bg-slate-800/80 backdrop-blur-sm border-slate-600 px-3 py-1">
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-green-400">{bestBid.toFixed(2)}</span>
                <span className="text-slate-400">|</span>
                <span className="text-red-400">{bestAsk.toFixed(2)}</span>
                <TrendingDown className="w-4 h-4 text-red-400" />
              </div>
            </Card>
            <Card className="bg-slate-800/80 backdrop-blur-sm border-slate-600 px-3 py-1">
              <div className="text-sm">
                <span className="text-slate-400">Spread:</span>
                <span className="text-white ml-1">{spread.toFixed(2)} ({spreadPercent}%)</span>
              </div>
            </Card>
          </div>
        </div>

        {/* 3D Canvas */}
        <Canvas
          ref={canvasRef}
          camera={{ position: [50, 50, 50], fov: 60 }}
          gl={{ antialias: true, alpha: false }}
          className="w-full h-full"
        >
          <Suspense fallback={null}>
            <ambientLight intensity={0.4} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <pointLight position={[-10, -10, -5]} intensity={0.5} color="#3b82f6" />
            
            <OrderbookScene />
            
            <OrbitControls
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              autoRotate={isRotating}
              autoRotateSpeed={2}
              maxPolarAngle={Math.PI / 2}
              minDistance={20}
              maxDistance={200}
            />
            
            <Grid
              position={[0, -5, 0]}
              args={[100, 100]}
              cellSize={5}
              cellThickness={0.5}
              cellColor="#334155"
              sectionSize={25}
              sectionThickness={1}
              sectionColor="#475569"
            />
            
            <Stats />
          </Suspense>
        </Canvas>

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-20">
            <Card className="bg-slate-800/90 border-slate-600 p-8">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-white">Initializing 3D Orderbook</h3>
                  <p className="text-slate-400">Connecting to real-time data streams...</p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Control Panel */}
      <div className="w-80 bg-slate-900/80 backdrop-blur-sm border-l border-slate-700 flex flex-col">
        <ControlPanel />
        <DataPanel />
      </div>
    </div>
  );
}