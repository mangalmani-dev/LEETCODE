// components/ProfileStatsDashboard.jsx
import { useProfileStore } from "../store/useProfileStore";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";

export default function ProfileStatsDashboard() {
  const { profile, loading } = useProfileStore();
  if (loading || !profile) return null;

  const { stats } = profile;

  const barData = [
    { name: "Problems Solved", count: stats.totalSolved || 0 },
    { name: "Submissions", count: stats.totalSubmissions || 0 },
    { name: "Playlists", count: stats.totalPlaylists || 0 },
  ];

  const lineData = stats.submissionHistory || [
    { day: "Mon", submissions: 10 },
    { day: "Tue", submissions: 15 },
    { day: "Wed", submissions: 12 },
    { day: "Thu", submissions: 20 },
    { day: "Fri", submissions: 18 },
    { day: "Sat", submissions: 25 },
    { day: "Sun", submissions: 22 },
  ];

  const areaData = stats.playlistHistory || [
    { week: "Week 1", playlists: 1 },
    { week: "Week 2", playlists: 2 },
    { week: "Week 3", playlists: 3 },
    { week: "Week 4", playlists: 4 },
  ];

  return (
    <div className="w-full">
      {/* keep same padding from ProfilePage: px-4 sm:px-6 lg:px-8 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/95 rounded-xl shadow-lg p-4 h-96">
          <h2 className="text-xl font-semibold mb-4">Overall Stats</h2>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white/95 rounded-xl shadow-lg p-4 h-96">
          <h2 className="text-xl font-semibold mb-4">Submissions Over Time</h2>
          <ResponsiveContainer width="100%" height="85%">
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="submissions" stroke="#82ca9d" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white/95 rounded-xl shadow-lg p-4 md:col-span-2 h-96">
          <h2 className="text-xl font-semibold mb-4">Playlists Completed</h2>
          <ResponsiveContainer width="100%" height="85%">
            <AreaChart data={areaData}>
              <defs>
                <linearGradient id="colorPlaylists" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ffc658" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#ffc658" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="playlists" stroke="#ffc658" fill="url(#colorPlaylists)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
