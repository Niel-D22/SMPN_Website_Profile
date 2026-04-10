import React, { useState, useEffect } from 'react';
import {
  FaGraduationCap,
  FaUsers,
  FaTrophy,
  FaEnvelope,
  FaCalendarAlt,
  FaCircleNotch,
} from 'react-icons/fa';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { dashboardApi } from '../../Api/dashboardApi'; // Import API Dashboard
import { toast } from 'react-toastify';

// --- DATA DUMMY GRAFIK ---
const chartData = [
  { name: 'Sen', pengunjung: 400 },
  { name: 'Sel', pengunjung: 600 },
  { name: 'Rab', pengunjung: 800 },
  { name: 'Kam', pengunjung: 500 },
  { name: 'Jum', pengunjung: 900 },
  { name: 'Sab', pengunjung: 1200 },
  { name: 'Min', pengunjung: 1100 },
];

const AdminDashboardPage = () => {
  const [filterWaktu, setFilterWaktu] = useState('7 Hari Terakhir');
  const [isLoading, setIsLoading] = useState(true);

  // STATE UNTUK MENAMPUNG DATA API
  const [stats, setStats] = useState({
    total_siswa: 0,
    total_guru: 0,
    total_prestasi: 0,
    pesan_baru: 0,
  });

  // MENGAMBIL DATA DARI BACKEND SAAT HALAMAN DIBUKA
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setIsLoading(true);
        const response = await dashboardApi.getStats();
        if (response.success) {
          setStats(response.data);
        }
      } catch (error) {
        toast.error('Gagal memuat statistik dashboard.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  const today = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // Komponen Loading Sederhana
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <FaCircleNotch className="animate-spin text-blue-600 mb-2" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] p-6 lg:p-10 animate-fade-in-up">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Halo, Admin!</h1>
          <p className="mt-1 text-sm text-gray-500 font-medium">
            Pantau aktivitas website dan data sekolah dalam satu panel.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl border border-gray-200 shadow-sm text-sm font-bold text-gray-700">
          <FaCalendarAlt className="text-blue-600" />
          {today}
        </div>
      </div>

      {/* SUMMARY CARDS GRID (DATA DINAMIS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Card 1: Siswa */}
        <div className="bg-white rounded-[20px] p-6 border border-gray-100 shadow-sm flex flex-col justify-between relative overflow-hidden group hover:border-blue-200 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-[14px] group-hover:scale-110 transition-transform">
              <FaGraduationCap size={20} />
            </div>
          </div>
          <div>
            <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
              Total Siswa Aktif
            </h3>
            <p className="text-3xl font-black text-gray-900">
              {stats.total_siswa.toLocaleString('id-ID')}
            </p>
          </div>
        </div>

        {/* Card 2: Guru */}
        <div className="bg-white rounded-[20px] p-6 border border-gray-100 shadow-sm flex flex-col justify-between relative overflow-hidden group hover:border-purple-200 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-[14px] group-hover:scale-110 transition-transform">
              <FaUsers size={20} />
            </div>
          </div>
          <div>
            <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
              Tenaga Pendidik
            </h3>
            <p className="text-3xl font-black text-gray-900">{stats.total_guru}</p>
          </div>
        </div>

        {/* Card 3: Prestasi */}
        <div className="bg-white rounded-[20px] p-6 border border-gray-100 shadow-sm flex flex-col justify-between relative overflow-hidden group hover:border-amber-200 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-amber-50 text-amber-500 rounded-[14px] group-hover:scale-110 transition-transform">
              <FaTrophy size={20} />
            </div>
          </div>
          <div>
            <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
              Total Prestasi
            </h3>
            <p className="text-3xl font-black text-gray-900">{stats.total_prestasi}</p>
          </div>
        </div>

        {/* Card 4: Pesan */}
        <div className="bg-white rounded-[20px] p-6 border border-gray-100 shadow-sm flex flex-col justify-between relative overflow-hidden group hover:border-emerald-200 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-emerald-50 text-emerald-500 rounded-[14px] group-hover:scale-110 transition-transform">
              <FaEnvelope size={20} />
            </div>
            {stats.pesan_baru > 0 && (
              <span className="text-xs font-extrabold text-white bg-red-500 px-2 py-1 rounded-md animate-pulse">
                Baru!
              </span>
            )}
          </div>
          <div>
            <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
              Pesan Belum Dibaca
            </h3>
            <p className="text-3xl font-black text-gray-900">{stats.pesan_baru}</p>
          </div>
        </div>
      </div>

      {/* GRAFIK PENGUNJUNG (Takes full width) */}
      <div className="bg-white rounded-[24px] p-6 sm:p-8 border border-gray-100 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <h2 className="text-lg font-bold text-gray-900">Statistik Pengunjung Website</h2>
          <select
            value={filterWaktu}
            onChange={(e) => setFilterWaktu(e.target.value)}
            className="text-xs font-bold text-gray-500 bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl cursor-pointer outline-none focus:ring-2 focus:ring-blue-500">
            <option>7 Hari Terakhir</option>
            <option>Bulan Ini</option>
          </select>
        </div>

        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#9ca3af', fontWeight: 'bold' }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#9ca3af', fontWeight: 'bold' }}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: '16px',
                  border: 'none',
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                }}
                labelStyle={{ fontWeight: 'bold', color: '#374151', marginBottom: '4px' }}
                cursor={{ stroke: '#e5e7eb', strokeWidth: 2, strokeDasharray: '5 5' }}
              />
              <Line
                type="monotone"
                dataKey="pengunjung"
                name="Pengunjung Aktif"
                stroke="#2563eb"
                strokeWidth={5}
                dot={{ r: 0 }}
                activeDot={{ r: 7, fill: '#2563eb', stroke: '#fff', strokeWidth: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
