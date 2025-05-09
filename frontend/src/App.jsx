// src/App.jsx
import React from 'react';
import CpuGauge from './components/CpuGauge';
import RamChart from './components/RamChart';
import AlertStats from './components/AlertStats';
import AlertPie from './components/AlertPie';
import ServerTable from './components/ServerTable';

export default function App() {
  return (
    <div className="bg-gray-700 text-white shadow-xl rounded-2xl p-6">
      <h1 className="text-3xl font-bold text-white-900 mb-6">Server Monitoring Dashboard</h1>

      {/* Top Stats: Alerts + CPU + Heat Map */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <AlertStats />
        <CpuGauge />
        <AlertPie />
      </div>

      {/* RAM Usage Chart */}
      <div className="mb-6">
        <RamChart />
      </div>

      {/* Server Table */}
      <div>
        <ServerTable />

      </div>

    </div>
  );
}
