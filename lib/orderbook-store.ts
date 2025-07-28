import { create } from 'zustand';

export interface OrderbookLevel {
  price: number;
  quantity: number;
}

export interface PressureZone {
  price: number;
  intensity: number;
  side: 'bid' | 'ask';
  volume: number;
}

export interface OrderbookData {
  bids: [number, number][];
  asks: [number, number][];
}

interface OrderbookStore {
  // Connection state
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
  setConnectionStatus: (status: 'connecting' | 'connected' | 'disconnected' | 'error') => void;
  
  // Market data
  symbol: string;
  setSymbol: (symbol: string) => void;
  orderbook: OrderbookData;
  setOrderbook: (orderbook: OrderbookData) => void;
  
  // Pressure zones
  pressureZones: PressureZone[];
  setPressureZones: (zones: PressureZone[]) => void;
  
  // UI controls
  selectedVenues: string[];
  toggleVenue: (venueId: string) => void;
  isRotating: boolean;
  setIsRotating: (rotating: boolean) => void;
  showPressureZones: boolean;
  setShowPressureZones: (show: boolean) => void;
  
  // Filters
  timeRange: string;
  setTimeRange: (range: string) => void;
  depthLevels: number;
  setDepthLevels: (levels: number) => void;
  priceRange: number;
  setPriceRange: (range: number) => void;
  quantityThreshold: number;
  setQuantityThreshold: (threshold: number) => void;
  
  // Update tracking
  lastUpdate: number | null;
  setLastUpdate: (timestamp: number) => void;
}

export const useOrderbookStore = create<OrderbookStore>((set, get) => ({
  // Connection state
  connectionStatus: 'disconnected',
  setConnectionStatus: (status) => set({ connectionStatus: status }),
  
  // Market data
  symbol: 'BTCUSDT',
  setSymbol: (symbol) => set({ symbol }),
  orderbook: { bids: [], asks: [] },
  setOrderbook: (orderbook) => {
    // Calculate pressure zones when orderbook updates
    const zones = calculatePressureZones(orderbook);
    set({ 
      orderbook, 
      pressureZones: zones,
      lastUpdate: Date.now()
    });
  },
  
  // Pressure zones
  pressureZones: [],
  setPressureZones: (zones) => set({ pressureZones: zones }),
  
  // UI controls
  selectedVenues: ['binance'],
  toggleVenue: (venueId) => set((state) => ({
    selectedVenues: state.selectedVenues.includes(venueId)
      ? state.selectedVenues.filter(id => id !== venueId)
      : [...state.selectedVenues, venueId]
  })),
  isRotating: true,
  setIsRotating: (rotating) => set({ isRotating: rotating }),
  showPressureZones: true,
  setShowPressureZones: (show) => set({ showPressureZones: show }),
  
  // Filters
  timeRange: '5m',
  setTimeRange: (range) => set({ timeRange: range }),
  depthLevels: 20,
  setDepthLevels: (levels) => set({ depthLevels: levels }),
  priceRange: 5,
  setPriceRange: (range) => set({ priceRange: range }),
  quantityThreshold: 1,
  setQuantityThreshold: (threshold) => set({ quantityThreshold: threshold }),
  
  // Update tracking
  lastUpdate: null,
  setLastUpdate: (timestamp) => set({ lastUpdate: timestamp }),
}));

// Pressure zone calculation algorithm
function calculatePressureZones(orderbook: OrderbookData): PressureZone[] {
  const zones: PressureZone[] = [];
  
  // Calculate zones for bids
  const bidZones = findVolumeConcentrations(orderbook.bids, 'bid');
  zones.push(...bidZones);
  
  // Calculate zones for asks
  const askZones = findVolumeConcentrations(orderbook.asks, 'ask');
  zones.push(...askZones);
  
  return zones.sort((a, b) => b.intensity - a.intensity);
}

function findVolumeConcentrations(levels: [number, number][], side: 'bid' | 'ask'): PressureZone[] {
  const zones: PressureZone[] = [];
  const windowSize = 5; // Look at groups of 5 levels
  
  for (let i = 0; i < levels.length - windowSize; i++) {
    const window = levels.slice(i, i + windowSize);
    const totalVolume = window.reduce((sum, [, qty]) => sum + qty, 0);
    const avgVolume = totalVolume / windowSize;
    const maxVolume = Math.max(...levels.map(([, qty]) => qty));
    
    // Consider it a pressure zone if volume is significantly above average
    if (avgVolume > maxVolume * 0.3) {
      const centerPrice = window[Math.floor(windowSize / 2)][0];
      const intensity = Math.min(avgVolume / maxVolume, 1);
      
      zones.push({
        price: centerPrice,
        intensity,
        side,
        volume: totalVolume
      });
    }
  }
  
  return zones;
}