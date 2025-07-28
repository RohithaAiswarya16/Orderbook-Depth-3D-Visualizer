
# 📈 Orderbook Depth 3D Visualizer

An interactive 3D visualization tool that displays real-time cryptocurrency orderbook data. The graph represents:
- **X-axis**: Price  
- **Y-axis**: Quantity  
- **Z-axis**: Time

Built using **Next.js**, **Three.js**, and **WebSockets**, this tool helps analyze market depth, pressure zones, and venue-specific order flow patterns in real time.

---

## 🚀 Features

<details>
<summary><strong>Click to expand</strong></summary>

### 🔍 3D Orderbook Graph
- Rotating 3D graph with real-time updates.
- Distinct bid (green) and ask (red) bars.
- Manual zoom, rotate, and pan controls.

### 📊 Orderbook Data Visualization
- Bars with height representing quantity.
- Depth visualization with cumulative quantity.
- Scaled tick marks and real-time smooth transitions.

### 🌐 Real-time Data Integration
- Live connection to public crypto exchange APIs.
- Dynamic updates without freezing animation.
- Graceful fallback handling on connection loss.

### 🏷️ Venue Filtering System
- Filter data by trading venues like Binance, OKX, etc.
- Venue-specific colors and toggles.
- Display legend with venue details.

### 🔥 Pressure Zone Analysis
- Highlight zones with high order concentration.
- Heatmap gradients based on intensity.
- Alerts and summary statistics.

### ⚙️ Interactive Controls
- Filter by price range, quantity threshold, or venue.
- Switch between real-time and historical modes.
- Quick search for specific price levels.

### 🧠 Advanced Visuals
- Order flow and trade execution animations.
- Volume profile overlays and spread analysis.
- Order matching and market depth overlays.

### 📱 Responsive & Optimized
- Touch controls for mobile.
- Level-of-detail (LOD) rendering.
- 60 FPS optimized 3D animations.

</details>

---

## 🛠️ Tech Stack

- **Next.js** with **TypeScript**
- **Three.js** for 3D rendering
- **Tailwind CSS** for styling
- **WebSocket** for real-time data
- **Context API** and custom hooks for state management

---

## 📁 Folder Structure

```
project/
├── components/               # Reusable UI components
├── hooks/                   # Custom React hooks (e.g., WebSocket, Toast)
├── pages/                   # Next.js routing pages
│   └── index.tsx            # Main app entry point
├── public/                  # Static assets
├── styles/                  # Tailwind and global CSS
├── .eslintrc.json           # Linting configuration
├── next.config.js           # Next.js config
├── tailwind.config.ts       # Tailwind CSS setup
├── tsconfig.json            # TypeScript config
├── package.json             # Project metadata and scripts
```

---

## 🧪 Getting Started

```bash
git clone https://github.com/RohithaAiswarya16/Orderbook-Depth-3D-Visualizer
cd project
npm install
npm run dev
```

---

## 🔮 Future Improvements

- ML-based pressure zone forecasting
- Orderbook imbalance heatmaps
- Export snapshots and analytics
- Theme toggle (dark/light)

---

## 📄 License

This project is for educational/demonstration purposes only.
