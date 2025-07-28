"use client";

import { OrderbookVisualizer } from "@/components/OrderbookVisualizer";

export default function Home() {
  return (
    <div className="w-full h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <OrderbookVisualizer />
    </div>
  );
}