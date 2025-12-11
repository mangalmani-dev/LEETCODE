import { useEffect } from "react";
import { useProfileStore } from "../store/useProfileStore";
import ProfileNavbar from "../components/ProfileNavbar.jsx";
import ProfileCards from "../components/ProfileCards.jsx";
import ProfileStatsChart from "../components/ProfileStatsChart.jsx";
import RecentSubmissions from "../components/RecentSubmission.jsx";
import PlaylistProblems from "../components/PlaylistProblem.jsx";

export default function ProfilePage() {
  const { profile, loading, fetchProfile } = useProfileStore();

  console.log(profile)

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading || !profile)
    return <p className="text-center mt-20">Loading profile...</p>;

  const { user, stats } = profile; // make sure your backend returns stats

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Profile Header */}
      <ProfileNavbar user={user} />

      {/* Stats Cards */}
      <ProfileCards stats={stats} />

      <ProfileStatsChart/>

       <RecentSubmissions />

        <PlaylistProblems playlists={profile.playlists} />
    </div>
  );
}
