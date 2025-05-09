import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function CpuLineChart() {
  const [cpuData, setCpuData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch('http://localhost:8000/usage/usage')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const sorted = data
            .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
            .map(entry => ({
              time: new Date(entry.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              }),
              usage: entry.cpu_usage,
            }));
          setCpuData(sorted.slice(-10)); // Keep last 10 points
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching CPU usage:', err);
        setError(true);
        setLoading(false);
      });
  }, []);

  // Simulate live data update
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const newPoint = {
        time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        usage: Math.random() * 100, // Replace with live value if needed
      };

      setCpuData(prev => {
        const updated = [...prev, newPoint];
        return updated.length > 10 ? updated.slice(1) : updated;
      });
    }, 3000); // Every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#0f172a] shadow-lg rounded-2xl p-6 w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-4 text-center">CPU Usage Trend</h2>

      {loading ? (
        <p className="text-gray-400 text-center">Loading...</p>
      ) : error ? (
        <p className="text-red-400 text-center">Error fetching data</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={cpuData} margin={{ top: 20, right: 20, left: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 12, fill: '#cbd5e1' }}
              axisLine={{ stroke: '#475569' }}
              tickLine={{ stroke: '#475569' }}
            />
            <YAxis
              domain={[0, 100]}
              unit="%"
              tick={{ fontSize: 12, fill: '#cbd5e1' }}
              axisLine={{ stroke: '#475569' }}
              tickLine={{ stroke: '#475569' }}
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }}
              labelStyle={{ color: '#4cf0b1', fontWeight: 'bold' }}
              itemStyle={{ color: '#4cf0b1' }}
              formatter={(value) => [`${value.toFixed(2)}%`, 'CPU Usage']}
            />
            <Line
              type="monotone"
              dataKey="usage"
              stroke="#4cf0b1"
              strokeWidth={3}
              dot={{ r: 4, fill: '#4cf0b1', strokeWidth: 2, stroke: '#0f766e' }}
              activeDot={{ r: 7, stroke: '#4cf0b1', strokeWidth: 3, fill: '#0f766e' }}
              isAnimationActive={true}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
