import axios from "axios";
import { useEffect, useState } from "react";

import {
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  LineChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface analyticInfo {
  _id: string | null;
  totalClicks: number;
}

interface TopLink {
  _id: string;
  originalUrl: string;
  shortCode: string;
  customAlias: string | null;
  clickCount: number;
}

interface ExtraStats {
  activeLinks: {
    count: number;
  }[];

  reachableLinks: {
    count: number;
  }[];

  totalClicks: {
    total: number;
    _id: string | null;
  }[];

  totalLinks: {
    count: number;
  }[];
}

interface DashboardResponse {
  browser: analyticInfo[];
  operatingSystem: analyticInfo[];
  devices: analyticInfo[];
  topLinks: TopLink[];
  dailyReport: analyticInfo[];
  extraStats: ExtraStats[];
}
interface DashboardProps {
  themeMode: boolean;
}
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

const Dashboard = ({ themeMode }: DashboardProps) => {
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const topLinksData = dashboard?.topLinks || [];
  const browserData = dashboard?.browser || [];
  const operatingSystemData = dashboard?.operatingSystem || [];
  const deviceData = dashboard?.devices || [];
  const dailyReportData = dashboard?.dailyReport || [];

  // =========================
  // EXTRA STATS
  // =========================

  const totalLinks = dashboard?.extraStats?.[0]?.totalLinks?.[0]?.count ?? 0;

  const totalClicks = dashboard?.extraStats?.[0]?.totalClicks?.[0]?.total ?? 0;

  const activeLinks = dashboard?.extraStats?.[0]?.activeLinks?.[0]?.count ?? 0;

  const reachableLinks =
    dashboard?.extraStats?.[0]?.reachableLinks?.[0]?.count ?? 0;

  // =========================
  // API
  // =========================
  const API_URL = import.meta.env.VITE_API_URL;
  const callDashboard = async () => {
    try {
      const response = await axios.get<ApiResponse<DashboardResponse>>(
        `${API_URL}/api/v1/dashboard/`,
      );

      setDashboard(response.data.data);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || error.message);
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Something went wrong");
      }
    }
  };

  useEffect(() => {
    callDashboard();
  }, []);

  // =========================
  // PIE COLORS
  // =========================

  const PIE_COLORS = [
    "#ef4444",
    "#8b5cf6",
    "#ec4899",
    "#f59e0b",
    "#10b981",
    "#06b6d4",
  ];

  return (
    <div
      className={`
      min-h-screen
      p-4
      transition-colors duration-500
      sm:p-6
      lg:p-8
      ${themeMode ? "bg-[#08070f] text-white" : "bg-slate-50 text-slate-900"}
    `}
    >
      {/* =========================
        HEADER
    ========================= */}

      <div className="mb-8">
        <h1
          className={`
          text-2xl font-bold
          transition-colors duration-300
          sm:text-3xl
          ${themeMode ? "text-slate-100" : "text-slate-800"}
        `}
        >
          Analytics Dashboard
        </h1>

        <p
          className={`
          mt-1 text-sm
          transition-colors duration-300
          ${themeMode ? "text-slate-400" : "text-slate-500"}
        `}
        >
          Monitor your short links and click analytics
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-red-100 p-4 text-red-700">
          {error}
        </div>
      )}
      {/* =========================
        STATISTIC CARDS
    ========================= */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Links */}
        <div className="overflow-hidden rounded-2xl bg-red-500 p-5 text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-100">Total Links</p>

              <h2 className="mt-2 text-3xl font-bold">{totalLinks}</h2>
            </div>

            <div className="rounded-xl bg-white/20 p-3 text-2xl">🔗</div>
          </div>
        </div>

        {/* Total Clicks */}
        <div className="overflow-hidden rounded-2xl bg-blue-500 p-5 text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-100">Total Clicks</p>

              <h2 className="mt-2 text-3xl font-bold">{totalClicks}</h2>
            </div>

            <div className="rounded-xl bg-white/20 p-3 text-2xl">👆</div>
          </div>
        </div>

        {/* Active Links */}
        <div className="overflow-hidden rounded-2xl bg-emerald-500 p-5 text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-emerald-100">
                Active Links
              </p>

              <h2 className="mt-2 text-3xl font-bold">{activeLinks}</h2>
            </div>

            <div className="rounded-xl bg-white/20 p-3 text-2xl">⚡</div>
          </div>
        </div>

        {/* Reachable Links */}
        <div className="overflow-hidden rounded-2xl bg-orange-500 p-5 text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-100">
                Reachable Links
              </p>

              <h2 className="mt-2 text-3xl font-bold">{reachableLinks}</h2>
            </div>

            <div className="rounded-xl bg-white/20 p-3 text-2xl">🌐</div>
          </div>
        </div>
      </div>

      {/* =========================
        TOP LINKS
    ========================= */}

      <div
        className={`
        mt-6
        rounded-2xl
        border
        p-4
        shadow-sm
        transition-all duration-500
        sm:p-6
        ${
          themeMode
            ? "border-white/10 bg-[#15121f] shadow-black/20"
            : "border-slate-200 bg-white shadow-slate-200/60"
        }
      `}
      >
        <div className="mb-5">
          <h2
            className={`
            text-lg font-bold
            sm:text-xl
            ${themeMode ? "text-slate-100" : "text-slate-800"}
          `}
          >
            Top Links
          </h2>

          <p
            className={
              themeMode ? "text-sm text-slate-400" : "text-sm text-slate-500"
            }
          >
            Your most clicked short links
          </p>
        </div>

        {topLinksData.length > 0 ? (
          <div className="h-[300px] w-full sm:h-[350px] lg:h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={topLinksData}
                layout="vertical"
                margin={{
                  top: 10,
                  right: 20,
                  left: 10,
                  bottom: 10,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={false}
                  stroke={themeMode ? "#ffffff15" : "#e2e8f0"}
                />

                <XAxis
                  type="number"
                  tick={{
                    fontSize: 12,
                    fill: themeMode ? "#94a3b8" : "#64748b",
                  }}
                  axisLine={{
                    stroke: themeMode ? "#ffffff15" : "#e2e8f0",
                  }}
                  tickLine={false}
                />

                <YAxis
                  type="category"
                  dataKey={(item) => item.customAlias || item.shortCode}
                  width={90}
                  tick={{
                    fontSize: 12,
                    fill: themeMode ? "#94a3b8" : "#64748b",
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip
                  contentStyle={{
                    backgroundColor: themeMode ? "#211d2c" : "#ffffff",
                    border: themeMode
                      ? "1px solid rgba(255,255,255,0.1)"
                      : "1px solid #e2e8f0",
                    borderRadius: "12px",
                    color: themeMode ? "#f8fafc" : "#1e293b",
                  }}
                  labelStyle={{
                    color: themeMode ? "#cbd5e1" : "#334155",
                  }}
                />

                <Bar
                  dataKey="clickCount"
                  fill="#ef4444"
                  radius={[0, 8, 8, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div
            className={`
            flex h-[300px] items-center justify-center
            ${themeMode ? "text-slate-500" : "text-slate-400"}
          `}
          >
            No top link data available
          </div>
        )}
      </div>

      {/* =========================
        BROWSER + OS
    ========================= */}

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Browser */}
        <div
          className={`
          rounded-2xl
          border
          p-4
          shadow-sm
          transition-all duration-500
          sm:p-6
          ${
            themeMode
              ? "border-white/10 bg-[#15121f] shadow-black/20"
              : "border-slate-200 bg-white shadow-slate-200/60"
          }
        `}
        >
          <div className="mb-5">
            <h2
              className={`
              text-lg font-bold
              ${themeMode ? "text-slate-100" : "text-slate-800"}
            `}
            >
              Browser Analytics
            </h2>

            <p
              className={
                themeMode ? "text-sm text-slate-400" : "text-sm text-slate-500"
              }
            >
              Clicks by browser
            </p>
          </div>

          {browserData.length > 0 ? (
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={browserData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={themeMode ? "#ffffff15" : "#e2e8f0"}
                  />

                  <XAxis
                    dataKey="_id"
                    tick={{
                      fontSize: 12,
                      fill: themeMode ? "#94a3b8" : "#64748b",
                    }}
                    axisLine={{
                      stroke: themeMode ? "#ffffff15" : "#e2e8f0",
                    }}
                    tickLine={false}
                  />

                  <YAxis
                    tick={{
                      fill: themeMode ? "#94a3b8" : "#64748b",
                    }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <Tooltip
                    contentStyle={{
                      backgroundColor: themeMode ? "#211d2c" : "#ffffff",
                      border: themeMode
                        ? "1px solid rgba(255,255,255,0.1)"
                        : "1px solid #e2e8f0",
                      borderRadius: "12px",
                      color: themeMode ? "#f8fafc" : "#1e293b",
                    }}
                  />

                  <Bar
                    dataKey="totalClicks"
                    fill="#06b6d4"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div
              className={`
              flex h-[300px] items-center justify-center
              ${themeMode ? "text-slate-500" : "text-slate-400"}
            `}
            >
              No browser data available
            </div>
          )}
        </div>

        {/* Operating System */}
        <div
          className={`
          rounded-2xl
          border
          p-4
          shadow-sm
          transition-all duration-500
          sm:p-6
          ${
            themeMode
              ? "border-white/10 bg-[#15121f] shadow-black/20"
              : "border-slate-200 bg-white shadow-slate-200/60"
          }
        `}
        >
          <div className="mb-5">
            <h2
              className={`
              text-lg font-bold
              ${themeMode ? "text-slate-100" : "text-slate-800"}
            `}
            >
              Operating System
            </h2>

            <p
              className={
                themeMode ? "text-sm text-slate-400" : "text-sm text-slate-500"
              }
            >
              Click distribution by OS
            </p>
          </div>

          {operatingSystemData.length > 0 ? (
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={operatingSystemData}
                    dataKey="totalClicks"
                    nameKey="_id"
                    cx="50%"
                    cy="50%"
                    outerRadius="70%"
                    label
                  >
                    {operatingSystemData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={PIE_COLORS[index % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>

                  <Tooltip
                    contentStyle={{
                      backgroundColor: themeMode ? "#211d2c" : "#ffffff",
                      border: themeMode
                        ? "1px solid rgba(255,255,255,0.1)"
                        : "1px solid #e2e8f0",
                      borderRadius: "12px",
                      color: themeMode ? "#f8fafc" : "#1e293b",
                    }}
                  />

                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    wrapperStyle={{
                      color: themeMode ? "#cbd5e1" : "#475569",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div
              className={`
              flex h-[300px] items-center justify-center
              ${themeMode ? "text-slate-500" : "text-slate-400"}
            `}
            >
              No OS data available
            </div>
          )}
        </div>
      </div>

      {/* =========================
        DAILY REPORT
    ========================= */}

      <div
        className={`
        mt-6
        rounded-2xl
        border
        p-4
        shadow-sm
        transition-all duration-500
        sm:p-6
        ${
          themeMode
            ? "border-white/10 bg-[#15121f] shadow-black/20"
            : "border-slate-200 bg-white shadow-slate-200/60"
        }
      `}
      >
        <div className="mb-5">
          <h2
            className={`
            text-lg font-bold
            sm:text-xl
            ${themeMode ? "text-slate-100" : "text-slate-800"}
          `}
          >
            Daily Report
          </h2>

          <p
            className={
              themeMode ? "text-sm text-slate-400" : "text-sm text-slate-500"
            }
          >
            Click activity over time
          </p>
        </div>

        {dailyReportData.length > 0 ? (
          <div className="h-[300px] w-full sm:h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={dailyReportData}
                margin={{
                  top: 10,
                  right: 10,
                  left: 0,
                  bottom: 10,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={themeMode ? "#ffffff15" : "#e2e8f0"}
                />

                <XAxis
                  dataKey="_id"
                  tick={{
                    fontSize: 11,
                    fill: themeMode ? "#94a3b8" : "#64748b",
                  }}
                  axisLine={{
                    stroke: themeMode ? "#ffffff15" : "#e2e8f0",
                  }}
                  tickLine={false}
                />

                <YAxis
                  tick={{
                    fill: themeMode ? "#94a3b8" : "#64748b",
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip
                  contentStyle={{
                    backgroundColor: themeMode ? "#211d2c" : "#ffffff",
                    border: themeMode
                      ? "1px solid rgba(255,255,255,0.1)"
                      : "1px solid #e2e8f0",
                    borderRadius: "12px",
                    color: themeMode ? "#f8fafc" : "#1e293b",
                  }}
                />

                <Line
                  type="monotone"
                  dataKey="totalClicks"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  dot={{
                    r: 4,
                    fill: "#8b5cf6",
                  }}
                  activeDot={{
                    r: 7,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div
            className={`
            flex h-[300px] items-center justify-center
            ${themeMode ? "text-slate-500" : "text-slate-400"}
          `}
          >
            No daily report data available
          </div>
        )}
      </div>

      {/* =========================
        DEVICE ANALYTICS
    ========================= */}

      <div
        className={`
        mt-6
        rounded-2xl
        border
        p-4
        shadow-sm
        transition-all duration-500
        sm:p-6
        ${
          themeMode
            ? "border-white/10 bg-[#15121f] shadow-black/20"
            : "border-slate-200 bg-white shadow-slate-200/60"
        }
      `}
      >
        <div className="mb-5">
          <h2
            className={`
            text-lg font-bold
            sm:text-xl
            ${themeMode ? "text-slate-100" : "text-slate-800"}
          `}
          >
            Device Analytics
          </h2>

          <p
            className={
              themeMode ? "text-sm text-slate-400" : "text-sm text-slate-500"
            }
          >
            Clicks by device type
          </p>
        </div>

        {deviceData.length > 0 ? (
          <div className="h-[300px] w-full sm:h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deviceData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={themeMode ? "#ffffff15" : "#e2e8f0"}
                />

                <XAxis
                  dataKey="_id"
                  tick={{
                    fontSize: 12,
                    fill: themeMode ? "#94a3b8" : "#64748b",
                  }}
                  axisLine={{
                    stroke: themeMode ? "#ffffff15" : "#e2e8f0",
                  }}
                  tickLine={false}
                />

                <YAxis
                  tick={{
                    fill: themeMode ? "#94a3b8" : "#64748b",
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip
                  contentStyle={{
                    backgroundColor: themeMode ? "#211d2c" : "#ffffff",
                    border: themeMode
                      ? "1px solid rgba(255,255,255,0.1)"
                      : "1px solid #e2e8f0",
                    borderRadius: "12px",
                    color: themeMode ? "#f8fafc" : "#1e293b",
                  }}
                />

                <Bar
                  dataKey="totalClicks"
                  fill="#f97316"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div
            className={`
            flex h-[300px] items-center justify-center
            ${themeMode ? "text-slate-500" : "text-slate-400"}
          `}
          >
            No device data available
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
