"use client";

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useOrderbookStore } from '@/lib/orderbook-store';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Target,
  BarChart3,
  Zap,
  Clock
} from 'lucide-react';

export function DataPanel() {
  const { orderbook, pressureZones, connectionStatus, lastUpdate } = useOrderbookStore();

  const bidVolume = orderbook.bids.slice(0, 10).reduce((sum, [, qty]) => sum + qty, 0);
  const askVolume = orderbook.asks.slice(0, 10).reduce((sum, [, qty]) => sum + qty, 0);
  const imbalance = ((bidVolume - askVolume) / (bidVolume + askVolume) * 100).toFixed(2);

  const bestBid = orderbook.bids[0]?.[0] || 0;
  const bestAsk = orderbook.asks[0]?.[0] || 0;
  const midPrice = (bestBid + bestAsk) / 2;

  return (
    <div className="flex flex-col space-y-4 p-4">
      {/* Market Stats */}
      <Card className="bg-slate-800/80 border-slate-600">
        <CardHeader className="pb-3">
          <CardTitle className="text-white flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Market Stats
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-700/50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-3 h-3 text-green-400" />
                <span className="text-xs text-slate-400">Best Bid</span>
              </div>
              <div className="text-lg font-bold text-green-400">
                {bestBid.toFixed(2)}
              </div>
            </div>
            
            <div className="bg-slate-700/50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <TrendingDown className="w-3 h-3 text-red-400" />
                <span className="text-xs text-slate-400">Best Ask</span>
              </div>
              <div className="text-lg font-bold text-red-400">
                {bestAsk.toFixed(2)}
              </div>
            </div>
          </div>

          <div className="bg-slate-700/50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-3 h-3 text-blue-400" />
              <span className="text-xs text-slate-400">Mid Price</span>
            </div>
            <div className="text-lg font-bold text-white">
              {midPrice.toFixed(2)}
            </div>
          </div>

          <div className="bg-slate-700/50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Activity className="w-3 h-3 text-yellow-400" />
              <span className="text-xs text-slate-400">Imbalance</span>
            </div>
            <div className={`text-lg font-bold ${parseFloat(imbalance) > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {imbalance}%
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Volume Analysis */}
      <Card className="bg-slate-800/80 border-slate-600">
        <CardHeader className="pb-3">
          <CardTitle className="text-white flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Volume (Top 10)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-400 rounded"></div>
              <span className="text-sm text-slate-300">Bid Volume</span>
            </div>
            <span className="text-sm font-bold text-green-400">
              {bidVolume.toFixed(2)}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-400 rounded"></div>
              <span className="text-sm text-slate-300">Ask Volume</span>
            </div>
            <span className="text-sm font-bold text-red-400">
              {askVolume.toFixed(2)}
            </span>
          </div>

          <div className="w-full bg-slate-700 rounded-full h-2">
            <div 
              className="bg-green-400 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(bidVolume / (bidVolume + askVolume)) * 100}%` }}
            ></div>
          </div>
        </CardContent>
      </Card>

      {/* Pressure Zones */}
      <Card className="bg-slate-800/80 border-slate-600">
        <CardHeader className="pb-3">
          <CardTitle className="text-white flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Pressure Zones
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {pressureZones.length === 0 ? (
            <div className="text-slate-400 text-sm">No pressure zones detected</div>
          ) : (
            pressureZones.slice(0, 5).map((zone, index) => (
              <div key={index} className="flex justify-between items-center bg-slate-700/50 rounded-lg p-2">
                <div>
                  <div className="text-sm font-medium text-white">
                    ${zone.price.toFixed(2)}
                  </div>
                  <div className="text-xs text-slate-400">
                    {zone.side}
                  </div>
                </div>
                <Badge 
                  variant="outline" 
                  className={`border-blue-400 text-blue-400 ${
                    zone.intensity > 0.8 ? 'bg-blue-400/20' : 
                    zone.intensity > 0.5 ? 'bg-blue-400/10' : ''
                  }`}
                >
                  {(zone.intensity * 100).toFixed(0)}%
                </Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Connection Status */}
      <Card className="bg-slate-800/80 border-slate-600">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-400">Last Update</span>
            </div>
            <span className="text-sm text-white">
              {lastUpdate ? new Date(lastUpdate).toLocaleTimeString() : 'Never'}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}