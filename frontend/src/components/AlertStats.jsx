import React, { useEffect, useState } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

export default function AlertStats() {
  const [stats, setStats] = useState({ Critical: 0, Medium: 0, Low: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch('http://localhost:8000/alerts/alerts')
      .then(res => res.json())
      .then(data => {
        const grouped = { Critical: 0, Medium: 0, Low: 0 };
        data.forEach(alert => {
          const severity = alert.severity.toLowerCase();
          if (severity === 'critical') grouped.Critical++;
          else if (severity === 'medium') grouped.Medium++;
          else if (severity === 'low') grouped.Low++;
        });
        setStats(grouped);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching alerts:', err);
        setError(true);
        setLoading(false);
      });
  }, []);

  const chartData = [
    { name: 'Critical', value: stats.Critical || 0 },
    { name: 'Medium', value: stats.Medium || 0 },
    { name: 'Low', value: stats.Low || 0 },
  ];

  const getColor = (name) => {
    switch (name) {
      case 'Critical': return '#ef4444';  // Tailwind red-500
      case 'Medium': return '#facc15';    // Tailwind yellow-400
      case 'Low': return '#22c55e';       // Tailwind green-500
      default: return '#94a3b8';          // Slate-400 fallback
    }
  };

  const renderCustomLabel = ({
    cx, cy, midAngle, innerRadius, outerRadius, percent, index
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 1.2;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="#f8fafc"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize={10}
        fontWeight="bold"
      >
        {`${chartData[index].name} (${(percent * 100).toFixed(0)}%)`}
      </text>
    );
  };

  if (loading) return <div className="text-gray-400 p-4">Loading...</div>;
  if (error) return <div className="text-red-400 p-4">Failed to load alert data.</div>;

  return (
    <div className="bg-gray-900 shadow-xl rounded-2xl p-6 border border-gray-800">
      <h2 className="text-2xl font-bold text-white mb-2">Alert Severity Overview</h2>
      <p className="text-sm text-gray-400 mb-4">
        Current alert distribution by severity level
      </p>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%" cy="50%"
            outerRadius={90} innerRadius={50}
            paddingAngle={4}
            label={renderCustomLabel}
            labelLine={false}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColor(entry.name)} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: 8 }}
            labelStyle={{ color: '#f1f5f9' }}
            itemStyle={{ color: '#facc15' }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            wrapperStyle={{ color: '#e5e7eb', fontSize: 13 }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
