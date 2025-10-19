// app/(logined-users)/profile/page.tsx
import { Tooltip } from 'react-tooltip'
import ProfileHeader from '@/components/Profile/ProfileHeader';
import TopicProgress from '@/components/Profile/TopicProgress';
import CorrectAnswersGraph from '@/components/Profile/CorrectAnswersGraph';
import DailyTracker from '@/components/Profile/DailyTracker';
import MatchesHistory from '@/components/Profile/MatchesHistory';
import LeaderboardHistory from '@/components/Profile/LeaderboardHistory';
import NavBar from '@/components/NavBar';
import ActivityTracker from '@/components/Profile/ActivityTracker'; // <-- Import here

export default function ProfilePage() {
  return (
    <>
      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-8">
        <div className="max-w-6xl mx-auto px-4 space-y-8">
          <ProfileHeader />

          <ActivityTracker /> {/* <-- Add the component here */}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-8">
              <TopicProgress />
              <CorrectAnswersGraph />
            </div>
            <div className="space-y-8">
              <DailyTracker />
              <MatchesHistory />
            </div>
          </div>
          <LeaderboardHistory />
        </div>
      </main>
    </>
  );
}