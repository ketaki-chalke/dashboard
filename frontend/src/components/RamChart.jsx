import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export default function RamChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchRamData = () => {
    fetch('http://localhost:8000/usage/usage')
      .then(res => {
        if (!res.ok) throw new Error('Network error');
        return res.json();
      })
      .then(json => {
        if (Array.isArray(json)) {
          const formatted = json.map(entry => ({
            time: new Date(entry.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            }),
            usage: entry.ram_usage
          }));
          setData(formatted.slice(-10));
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching RAM data:', err);
        setError(true);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchRamData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const newPoint = {
        time: now.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        }),
        usage: Math.floor(30 + Math.random() * 70)
      };
      setData(prev => {
        const updated = [...prev, newPoint];
        return updated.length > 10 ? updated.slice(1) : updated;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gray-900 shadow-xl rounded-2xl p-6 border border-gray-800">
      <h2 className="text-2xl font-bold text-gray-100 mb-4 text-center">RAM Usage Over Time</h2>
      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : error ? (
        <p className="text-red-400">Failed to load RAM data.</p>
      ) : data.length === 0 ? (
        <p className="text-gray-400">No data available.</p>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={data} margin={{ top: 20, right: 20, bottom: 10, left: 0 }}>
            <defs>
              <linearGradient id="ramGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#60a5fa" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#60a5fa" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
            <XAxis
              dataKey="time"
              stroke="#ccc"
              tick={{ fill: '#ccc', fontSize: 12 }}
            />
            <YAxis
              domain={[0, 100]}
              tickFormatter={v => `${v}%`}
              stroke="#ccc"
              tick={{ fill: '#ccc', fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f2937',
                border: 'none',
                borderRadius: 8
              }}
              labelStyle={{ color: '#93c5fd' }}
              itemStyle={{ color: '#facc15' }}
              formatter={(value) => [`${value.toFixed(1)}%`, 'RAM']}
            />
            <Line
              type="monotone"
              dataKey="usage"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={false}
              isAnimationActive={true}
              fill="url(#ramGradient)"
              fillOpacity={1}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
