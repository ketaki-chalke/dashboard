import React, { useEffect, useState } from 'react';

export default function ServerTable() {
  const [servers, setServers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetch('http://localhost:8000/servers/servers')
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch servers');
        }
        return res.json();
      })
      .then(data => {
        console.log('Server data:', data);
        setServers(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load servers:', err);
        setError(true);
        setErrorMessage(err.message || "Unexpected error occurred");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="bg-white shadow-lg rounded-xl p-6 animate-pulse">
        <p className="text-gray-500">Loading server data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow-lg rounded-xl p-6">
        <p className="text-red-600 font-medium">{errorMessage}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 shadow-2xl rounded-2xl p-6 border border-gray-800">
      <h2 className="text-2xl font-bold text-gray-100 mb-6 border-b border-gray-600 pb-2">
        Active Server Instances
      </h2>
      <div className="overflow-x-auto">
        <div className="max-h-72 overflow-y-auto rounded-lg border border-gray-600">
          <table className="min-w-full text-sm text-left text-gray-300">
            <thead className="sticky top-0 bg-gradient-to-r from-gray-700 via-gray-700 to-gray-800 text-xs uppercase text-gray-100 z-10">
              <tr>
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">IP Address</th>
                <th className="px-6 py-3">Location</th>
                <th className="px-6 py-3">Tag</th>
                <th className="px-6 py-3">Provider</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {servers.map(server => (
                <tr
                  key={server.id}
                  className="hover:bg-gray-700 transition duration-200 ease-in-out cursor-pointer"
                >
                  <td className="px-6 py-3 font-semibold text-gray-100">{server.id}</td>
                  <td className="px-6 py-3">{server.name}</td>
                  <td className="px-6 py-3 text-indigo-400 font-medium">{server.ip_address}</td>
                  <td className="px-6 py-3">
                    {server.location && server.location.trim() !== '' ? server.location : <span className="text-gray-500">–</span>}
                  </td>
                  <td className="px-6 py-3">
                    <span className="inline-block bg-indigo-700/20 text-indigo-400 text-xs px-2 py-1 rounded-full">
                      {server.tag}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-gray-300 font-medium">{server.provider}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {servers.length === 0 && (
          <p className="text-gray-500 mt-4 text-center italic">No servers available.</p>
        )}
      </div>
    </div>
  );
  
}
