import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';

const COLORS = {
  Critical: '#3b82f6', // blue-500
  Medium: '#60a5fa',   // blue-400
  Low: '#93c5fd'       // blue-300
};

export default function AlertBar() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8000/alerts/alerts')
      .then(res => res.json())
      .then(alerts => {
        const grouped = { Critical: 0, Medium: 0, Low: 0 };

        const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

        alerts.forEach(alert => {
          const key = capitalize(alert.severity);
          if (grouped[key] !== undefined) {
            grouped[key]++;
          }
        });

        const formatted = Object.entries(grouped).map(([key, value]) => ({
          name: key,
          value,
        }));

        setData(formatted);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching alerts:', err);
        setLoading(false);
      });
  }, []);

  const boxClasses = "bg-[#0f172a] text-white shadow-md rounded-2xl p-6 flex items-center justify-center";

  if (loading) return <div className={boxClasses}>Loading alert bar chart...</div>;
  if (!data.length) return <div className={boxClasses}>No alert data available</div>;

  return (
    <div className={boxClasses} style={{ height: 405 }}>
      <div className="w-full h-full">
        <h2 className="text-2xl font-bold text-white mb-4 text-center">Alert Distribution</h2>
        <ResponsiveContainer width="100%" height={330}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333155" />
            <XAxis dataKey="name" stroke="white" />
            <YAxis allowDecimals={false} stroke="white" />
            <Tooltip
      contentStyle={{ backgroundColor: '#1e293b', border: 'none' }}
      labelStyle={{ color: 'white' }}
      itemStyle={{ color: 'white' }}
    />
            <Legend wrapperStyle={{ color: '#fff' }} />
            <Bar dataKey="value">
              {data.map((entry) => (
                <Cell key={entry.name} fill={COLORS[entry.name]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
