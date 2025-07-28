"use client";

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useOrderbookStore } from '@/lib/orderbook-store';
import { 
  Settings, 
  Play, 
  Pause, 
  RotateCcw, 
  Target, 
  Layers,
  Clock,
  Filter,
  Zap
} from 'lucide-react';

export function ControlPanel() {
  const {
    symbol,
    setSymbol,
    selectedVenues,
    toggleVenue,
    isRotating,
    setIsRotating,
    showPressureZones,
    setShowPressureZones,
    timeRange,
    setTimeRange,
    depthLevels,
    setDepthLevels,
    priceRange,
    setPriceRange,
    quantityThreshold,
    setQuantityThreshold
  } = useOrderbookStore();

  const venues = [
    { id: 'binance', name: 'Binance', color: '#f0b90b' },
    { id: 'okx', name: 'OKX', color: '#007fff' },
    { id: 'bybit', name: 'Bybit', color: '#f7a600' },
    { id: 'deribit', name: 'Deribit', color: '#ff6b35' },
    { id: 'kraken', name: 'Kraken', color: '#5741d9' }
  ];

  const symbols = ['BTCUSDT', 'ETHUSDT', 'ADAUSDT', 'SOLUSDT', 'DOTUSDT'];
  const timeRanges = [
    { label: '1m', value: '1m' },
    { label: '5m', value: '5m' },
    { label: '15m', value: '15m' },
    { label: '1h', value: '1h' }
  ];

  return (
    <div className="flex flex-col h-full p-4 space-y-4 overflow-y-auto">
      {/* Main Controls */}
      <Card className="bg-slate-800/80 border-slate-600">
        <CardHeader className="pb-3">
          <CardTitle className="text-white flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Controls
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Symbol Selection */}
          <div>
            <label className="text-sm font-medium text-slate-300 mb-2 block">Symbol</label>
            <Select value={symbol} onValueChange={setSymbol}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                {symbols.map((sym) => (
                  <SelectItem key={sym} value={sym} className="text-white hover:bg-slate-600">
                    {sym}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Rotation Control */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-300">Auto Rotate</label>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsRotating(!isRotating)}
                className="border-slate-600 text-white hover:bg-slate-700"
              >
                {isRotating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* Time Range */}
          <div>
            <label className="text-sm font-medium text-slate-300 mb-2 block flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Time Range
            </label>
            <div className="flex gap-1">
              {timeRanges.map((range) => (
                <Button
                  key={range.value}
                  variant={timeRange === range.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeRange(range.value)}
                  className="flex-1 border-slate-600 text-white hover:bg-slate-700"
                >
                  {range.label}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Venue Filters */}
      <Card className="bg-slate-800/80 border-slate-600">
        <CardHeader className="pb-3">
          <CardTitle className="text-white flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Venues
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {venues.map((venue) => (
            <div key={venue.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: venue.color }}
                />
                <span className="text-sm text-slate-300">{venue.name}</span>
              </div>
              <Checkbox
                checked={selectedVenues.includes(venue.id)}
                onCheckedChange={() => toggleVenue(venue.id)}
                className="border-slate-600"
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Visualization Settings */}
      <Card className="bg-slate-800/80 border-slate-600">
        <CardHeader className="pb-3">
          <CardTitle className="text-white flex items-center gap-2">
            <Layers className="w-4 h-4" />
            Visualization
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Pressure Zones */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Pressure Zones
            </label>
            <Switch
              checked={showPressureZones}
              onCheckedChange={setShowPressureZones}
            />
          </div>

          {/* Depth Levels */}
          <div>
            <label className="text-sm font-medium text-slate-300 mb-2 block">
              Depth Levels: {depthLevels}
            </label>
            <Slider
              value={[depthLevels]}
              onValueChange={(value) => setDepthLevels(value[0])}
              max={50}
              min={10}
              step={5}
              className="w-full"
            />
          </div>

          {/* Quantity Threshold */}
          <div>
            <label className="text-sm font-medium text-slate-300 mb-2 block">
              Min Quantity: {quantityThreshold}
            </label>
            <Slider
              value={[quantityThreshold]}
              onValueChange={(value) => setQuantityThreshold(value[0])}
              max={10}
              min={0.1}
              step={0.1}
              className="w-full"
            />
          </div>

          {/* Price Range */}
          <div>
            <label className="text-sm font-medium text-slate-300 mb-2 block">
              Price Range: ±{priceRange}%
            </label>
            <Slider
              value={[priceRange]}
              onValueChange={(value) => setPriceRange(value[0])}
              max={10}
              min={1}
              step={0.5}
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>

      {/* Reset Button */}
      <Button 
        variant="outline" 
        className="w-full border-slate-600 text-white hover:bg-slate-700"
        onClick={() => {
          setIsRotating(true);
          setShowPressureZones(true);
          setDepthLevels(20);
          setQuantityThreshold(1);
          setPriceRange(5);
        }}
      >
        <RotateCcw className="w-4 h-4 mr-2" />
        Reset to Defaults
      </Button>
    </div>
  );
}