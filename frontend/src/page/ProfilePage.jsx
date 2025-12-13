import { useEffect } from "react";
import { useProfileStore } from "../store/useProfileStore";
import ProfileNavbar from "../components/ProfileNavbar.jsx";
import ProfileCards from "../components/ProfileCards.jsx";
import ProfileStatsChart from "../components/ProfileStatsChart.jsx";
import RecentSubmissions from "../components/RecentSubmission.jsx";
import PlaylistProblems from "../components/PlaylistProblem.jsx";

export default function ProfilePage() {
  const { profile, loading, fetchProfile } = useProfileStore();

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading || !profile)
    return <p className="text-center mt-20">Loading profile...</p>;

  const { user, stats } = profile;

  return (
    <div className="relative min-h-screen">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 via-white to-yellow-100 overflow-hidden"></div>

      {/* Foreground Content */}
      <div className="relative max-w-5xl mx-auto p-6">
        <ProfileNavbar user={user} />
        <ProfileCards stats={stats} />
        <ProfileStatsChart />
        <RecentSubmissions />
        <PlaylistProblems playlists={profile.playlists} />
      </div>
    </div>
  );
}
