"use client";

import { useEffect, useRef } from 'react';
import { useOrderbookStore } from '@/lib/orderbook-store';

export function useWebSocketConnection() {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef(0);
  
  const {
    symbol,
    setConnectionStatus,
    setOrderbook,
    selectedVenues
  } = useOrderbookStore();

  const connectWebSocket = () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    setConnectionStatus('connecting');
    
    // Use Binance WebSocket API (free and reliable)
    const wsUrl = `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@depth@100ms`;
    
    try {
      wsRef.current = new WebSocket(wsUrl);
      
      wsRef.current.onopen = () => {
        console.log('WebSocket connected');
        setConnectionStatus('connected');
        reconnectAttempts.current = 0;
      };
      
      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.e === 'depthUpdate') {
            // Process Binance depth update
            const orderbook = {
              bids: data.b.map((bid: string[]) => [parseFloat(bid[0]), parseFloat(bid[1])]),
              asks: data.a.map((ask: string[]) => [parseFloat(ask[0]), parseFloat(ask[1])])
            };
            
            setOrderbook(orderbook);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };
      
      wsRef.current.onclose = (event) => {
        console.log('WebSocket closed:', event.code, event.reason);
        setConnectionStatus('disconnected');
        
        // Attempt to reconnect with exponential backoff
        if (reconnectAttempts.current < 5) {
          const delay = Math.pow(2, reconnectAttempts.current) * 1000;
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttempts.current++;
            connectWebSocket();
          }, delay);
        }
      };
      
      wsRef.current.onerror = (error) => {
        console.warn('WebSocket connection failed - using mock data for demonstration');
        setConnectionStatus('error');
      };
    } catch (error) {
      console.warn('Failed to create WebSocket connection - using mock data for demonstration');
      setConnectionStatus('error');
    }
  };

  const disconnectWebSocket = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    
    setConnectionStatus('disconnected');
  };

  // Connect on mount and symbol change
  useEffect(() => {
    connectWebSocket();
    
    return () => {
      disconnectWebSocket();
    };
  }, [symbol]);

  // Generate mock data for demonstration when no real connection
  useEffect(() => {
    let mockDataInterval: NodeJS.Timeout;
    
    // Always start with mock data, then switch to real data if connection succeeds
    const startMockData = () => {
      mockDataInterval = setInterval(() => {
        // Only update with mock data if not connected to real WebSocket
        if (useOrderbookStore.getState().connectionStatus !== 'connected') {
        const basePrice = 50000; // Mock BTC price
        const bids: [number, number][] = [];
        const asks: [number, number][] = [];
        
        // Generate mock bid data
        for (let i = 0; i < 20; i++) {
          const price = basePrice - (i * 10) - Math.random() * 5;
          const quantity = Math.random() * 10 + 1;
          bids.push([price, quantity]);
        }
        
        // Generate mock ask data
        for (let i = 0; i < 20; i++) {
          const price = basePrice + (i * 10) + Math.random() * 5;
          const quantity = Math.random() * 10 + 1;
          asks.push([price, quantity]);
        }
        
        setOrderbook({ bids, asks });
        }
      }, 100);
    };
    
    // Start mock data immediately
    startMockData();
    
    return () => {
      if (mockDataInterval) {
        clearInterval(mockDataInterval);
      }
    };
  }, []);

  return {
    connect: connectWebSocket,
    disconnect: disconnectWebSocket
  };
}