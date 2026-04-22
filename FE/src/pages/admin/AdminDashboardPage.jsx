import React, { useState, useEffect } from 'react';
import { FaGraduationCap, FaUsers, FaTrophy, FaEnvelope, FaCalendarAlt } from 'react-icons/fa';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { dashboardApi } from '../../Api/dashboardApi';
import { pengunjungApi } from '../../Api/pengunjungApi';
import toast from 'react-hot-toast';
import 'animate.css';

const AdminDashboardPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [filterWaktu, setFilterWaktu] = useState('7 Hari Terakhir');
  const [chartData, setChartData] = useState([]);

  const [stats, setStats] = useState({
    total_siswa: 0,
    total_guru: 0,
    total_prestasi: 0,
    pesan_baru: 0,
  });

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

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        let res;
        if (filterWaktu === '7 Hari Terakhir') {
          res = await pengunjungApi.getStats7Hari();
        } else {
          res = await pengunjungApi.getStatsBulanIni();
        }
        setChartData(res || []);
      } catch {
        setChartData([]);
        toast.error('Gagal memuat grafik pengunjung.');
      }
    };
    fetchChartData();
  }, [filterWaktu]);

  const today = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  if (isLoading) {
    // SKELETON BERSIH (TIDAK ADA ISI KONTEN! HANYA BINGKAI/KOSONG)
    return (
      <div className="min-h-screen bg-[#f8f9fa] px-2 py-3 sm:p-4 md:p-6 lg:p-10 animate-fade-in-up">
        {/* HEADER SKELETON */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-4 mb-6 md:mb-10">
          <div className="h-8 w-40 bg-gray-200 rounded-lg animate-pulse mb-2"></div>
          <div className="h-8 w-36 bg-gray-200 rounded-xl animate-pulse"></div>
        </div>

        {/* SUMMARY CARDS SKELETON */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5 lg:gap-6 mb-7 sm:mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white rounded-xl sm:rounded-[20px] p-3 sm:p-5 md:p-6 border border-gray-100 shadow-sm flex flex-col justify-between relative overflow-hidden animate-pulse">
              <div className="h-8 w-8 bg-gray-100 rounded-lg mb-4"></div>
              <div className="h-4 w-24 bg-gray-100 rounded mb-2"></div>
              <div className="h-6 w-20 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>

        {/* GRAFIK SKELETON */}
        <div className="bg-white rounded-xl sm:rounded-[24px] p-2 sm:p-4 md:p-6 border border-gray-100 shadow-sm overflow-x-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 sm:mb-8 gap-4">
            <div className="h-6 w-52 bg-gray-100 rounded mb-2"></div>
            <div className="h-8 w-28 bg-gray-100 rounded-xl"></div>
          </div>
          <div className="w-full h-[180px] min-[340px]:h-[220px] sm:h-[280px] md:h-[350px] min-w-0 flex items-center">
            <div className="w-full h-4/5 bg-gray-100 rounded-xl animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] px-2 py-3 sm:p-4 md:p-6 lg:p-10 animate-fade-in-up">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-4 mb-6 md:mb-10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Halo, Admin!
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-gray-500 font-medium">
            Pantau aktivitas website dan data sekolah dalam satu panel.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-gray-200 shadow-sm text-xs sm:text-sm font-bold text-gray-700">
          <FaCalendarAlt className="text-blue-600" />
          {today}
        </div>
      </div>

      {/* SUMMARY CARDS GRID (DATA DINAMIS) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5 lg:gap-6 mb-7 sm:mb-8">
        {/* Card 1: Siswa */}
        <div className="bg-white rounded-xl sm:rounded-[20px] p-3 sm:p-5 md:p-6 border border-gray-100 shadow-sm flex flex-col justify-between relative overflow-hidden group hover:border-blue-200 transition-colors">
          <div className="flex justify-between items-start mb-2 sm:mb-4">
            <div className="p-2 sm:p-3 bg-blue-50 text-blue-600 rounded-lg sm:rounded-[14px] group-hover:scale-110 transition-transform">
              <FaGraduationCap size={18} className="sm:size-5" />
            </div>
          </div>
          <div>
            <h3 className="text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-0.5 sm:mb-1">
              Total Siswa Aktif
            </h3>
            <p className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900">
              {stats.total_siswa.toLocaleString('id-ID')}
            </p>
          </div>
        </div>

        {/* Card 2: Guru */}
        <div className="bg-white rounded-xl sm:rounded-[20px] p-3 sm:p-5 md:p-6 border border-gray-100 shadow-sm flex flex-col justify-between relative overflow-hidden group hover:border-purple-200 transition-colors">
          <div className="flex justify-between items-start mb-2 sm:mb-4">
            <div className="p-2 sm:p-3 bg-purple-50 text-purple-600 rounded-lg sm:rounded-[14px] group-hover:scale-110 transition-transform">
              <FaUsers size={18} className="sm:size-5" />
            </div>
          </div>
          <div>
            <h3 className="text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-0.5 sm:mb-1">
              Tenaga Pendidik
            </h3>
            <p className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900">
              {stats.total_guru}
            </p>
          </div>
        </div>

        {/* Card 3: Prestasi */}
        <div className="bg-white rounded-xl sm:rounded-[20px] p-3 sm:p-5 md:p-6 border border-gray-100 shadow-sm flex flex-col justify-between relative overflow-hidden group hover:border-amber-200 transition-colors">
          <div className="flex justify-between items-start mb-2 sm:mb-4">
            <div className="p-2 sm:p-3 bg-amber-50 text-amber-500 rounded-lg sm:rounded-[14px] group-hover:scale-110 transition-transform">
              <FaTrophy size={18} className="sm:size-5" />
            </div>
          </div>
          <div>
            <h3 className="text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-0.5 sm:mb-1">
              Total Prestasi
            </h3>
            <p className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900">
              {stats.total_prestasi}
            </p>
          </div>
        </div>

        {/* Card 4: Pesan */}
        <div className="bg-white rounded-xl sm:rounded-[20px] p-3 sm:p-5 md:p-6 border border-gray-100 shadow-sm flex flex-col justify-between relative overflow-hidden group hover:border-emerald-200 transition-colors">
          <div className="flex justify-between items-start mb-2 sm:mb-4">
            <div className="p-2 sm:p-3 bg-emerald-50 text-emerald-500 rounded-lg sm:rounded-[14px] group-hover:scale-110 transition-transform">
              <FaEnvelope size={18} className="sm:size-5" />
            </div>
            {stats.pesan_baru > 0 && (
              <span className="text-[9px] sm:text-xs font-extrabold text-white bg-red-500 px-1.5 py-0.5 rounded-md animate-pulse ml-1">
                Baru!
              </span>
            )}
          </div>
          <div>
            <h3 className="text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-0.5 sm:mb-1">
              Pesan Belum Dibaca
            </h3>
            <p className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900">
              {stats.pesan_baru}
            </p>
          </div>
        </div>
      </div>

      {/* GRAFIK PENGUNJUNG */}
      <div className="bg-white rounded-xl sm:rounded-[24px] p-2 sm:p-4 md:p-6 border border-gray-100 shadow-sm overflow-x-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 sm:mb-8 gap-3 sm:gap-4">
          <h2 className="text-base sm:text-lg font-bold text-gray-900">
            Statistik Pengunjung Website
          </h2>
          <select
            value={filterWaktu}
            onChange={(e) => setFilterWaktu(e.target.value)}
            className="text-xs font-bold text-gray-500 bg-gray-50 border border-gray-200 px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl cursor-pointer outline-none focus:ring-2 focus:ring-blue-500">
            <option>7 Hari Terakhir</option>
            <option>Bulan Ini</option>
          </select>
        </div>

        <div className="w-full h-[180px] min-[340px]:h-[220px] sm:h-[280px] md:h-[350px] min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 5,
                right: 10,
                left: -12,
                bottom: 0,
              }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 10,
                  fill: '#9ca3af',
                  fontWeight: 'bold',
                }}
                dy={5}
                interval="preserveStartEnd"
                minTickGap={2}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 10,
                  fill: '#9ca3af',
                  fontWeight: 'bold',
                }}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: '12px',
                  border: 'none',
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                }}
                labelStyle={{
                  fontWeight: 'bold',
                  color: '#374151',
                  marginBottom: '4px',
                  fontSize: '11px',
                }}
                itemStyle={{
                  fontSize: '11px',
                }}
                cursor={{ stroke: '#e5e7eb', strokeWidth: 2, strokeDasharray: '5 5' }}
              />
              <Line
                type="monotone"
                dataKey="pengunjung"
                name="Pengunjung Aktif"
                stroke="#2563eb"
                strokeWidth={4}
                dot={{ r: 0 }}
                activeDot={{ r: 5, fill: '#2563eb', stroke: '#fff', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
