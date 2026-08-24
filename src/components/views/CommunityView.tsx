import React, { useState } from 'react';
import {
  Users,
  MessageSquare,
  Compass,
  Plus,
  Heart,
  Share2,
  ShieldCheck,
  UserCheck,
  Search,
  CheckCircle,
  X,
  Sparkles
} from 'lucide-react';
import { CommunityPost, TravelGroup } from '../../types/travel';

interface CommunityViewProps {
  posts: CommunityPost[];
  groups: TravelGroup[];
  onAddPost: (post: CommunityPost) => void;
  onJoinGroup: (groupId: string) => void;
}

export const CommunityView: React.FC<CommunityViewProps> = ({
  posts,
  groups,
  onAddPost,
  onJoinGroup,
}) => {
  const [activeTab, setActiveTab] = useState<'Discussion' | 'Groups' | 'Profiles'>('Discussion');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newContent, setNewContent] = useState('');
  const [newLocation, setNewLocation] = useState('Sajek Valley');
  const [newCategory, setNewCategory] = useState<'Question' | 'Tip' | 'Photo' | 'Meetup'>('Question');

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    const created: CommunityPost = {
      id: `post-${Date.now()}`,
      title: `${newCategory} regarding ${newLocation}`,
      author: {
        name: 'Tanvir Hossain',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        badge: 'Top Contributor',
        persona: 'Solo Travelers',
      },
      content: newContent,
      destinationName: newLocation,
      tags: [newCategory, newLocation],
      date: 'Just now',
      likes: 0,
      commentsCount: 0,
      type: 'Discussion',
    };

    onAddPost(created);
    setShowCreateModal(false);
    setNewContent('');
  };

  const sampleProfiles = [
    { name: 'Dr. Shahriar Rahman', role: 'Adventure Trekker', bio: 'Conquered 12 peaks in Bandarban & Khagrachhari.', trips: 14, badge: 'Verified Guide' },
    { name: 'Nusrat Jahan', role: 'Solo Female Traveler', bio: 'Exploring hidden waterfalls in Mirsarai & Sitakunda.', trips: 9, badge: 'Community Host' },
    { name: 'Alex & Maria', role: 'Foreign Travelers', bio: 'Backpacking across Cox\'s Bazar Marine Drive and Rangamati.', trips: 5, badge: 'Explorer' },
  ];

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header matching Wireframe Page 16 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-emerald-600" />
            <span>COMMUNITY ECOSYSTEM</span>
          </h1>
          <p className="text-xs text-slate-500">Connect with local guides, solo travelers, backpackers, and travel groups</p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Community Post</span>
        </button>
      </div>

      {/* Sub Tabs matching Wireframe Page 16 (TRAVELERS PROFILE, TRAVEL GROUPS, TRAVEL DISCUSSION) */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('Discussion')}
          className={`py-3 px-6 text-xs font-bold border-b-2 transition-colors ${
            activeTab === 'Discussion' ? 'border-emerald-600 text-emerald-800 bg-emerald-50/50' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          TRAVEL DISCUSSION
        </button>
        <button
          onClick={() => setActiveTab('Groups')}
          className={`py-3 px-6 text-xs font-bold border-b-2 transition-colors ${
            activeTab === 'Groups' ? 'border-emerald-600 text-emerald-800 bg-emerald-50/50' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          TRAVEL GROUPS
        </button>
        <button
          onClick={() => setActiveTab('Profiles')}
          className={`py-3 px-6 text-xs font-bold border-b-2 transition-colors ${
            activeTab === 'Profiles' ? 'border-emerald-600 text-emerald-800 bg-emerald-50/50' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          TRAVELERS PROFILE
        </button>
      </div>

      {/* 1. TRAVEL DISCUSSION SECTION */}
      {activeTab === 'Discussion' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {posts.map((p) => (
              <div key={p.id} className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={p.author.avatar} className="w-9 h-9 rounded-full object-cover" alt={p.author.name} />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-xs">{p.author.name}</span>
                        {p.author.badge && (
                          <span className="px-2 py-0.2 bg-emerald-100 text-emerald-800 text-[9px] font-bold rounded-full">
                            {p.author.badge}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400">{p.destinationName} • {p.date}</span>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-md">
                    {p.type}
                  </span>
                </div>

                <h4 className="font-bold text-sm text-slate-900">{p.title}</h4>
                <p className="text-xs text-slate-800 leading-relaxed font-normal">{p.content}</p>

                {p.image && (
                  <img src={p.image} className="w-full h-48 rounded-xl object-cover" alt="Post attachment" />
                )}

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-1 hover:text-red-500">
                      <Heart className="w-4 h-4" /> <span>{p.likes}</span>
                    </button>
                    <button className="flex items-center gap-1 hover:text-teal-600">
                      <MessageSquare className="w-4 h-4" /> <span>{p.commentsCount} Comments</span>
                    </button>
                  </div>
                  <button className="hover:text-emerald-700"><Share2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <div className="bg-emerald-950 text-white p-5 rounded-2xl space-y-3 border border-emerald-900">
              <h3 className="font-bold text-xs text-emerald-300 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Verified Tour Guides</span>
              </h3>
              <p className="text-[11px] text-emerald-100/90 leading-relaxed">
                Connect with licensed hill tract tour guides for Dighinala convoy clearance, Chander Gari arrangements, and indigenous cultural tours.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 2. TRAVEL GROUPS SECTION */}
      {activeTab === 'Groups' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {groups.map((g) => (
            <div key={g.id} className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">
                  {g.membersCount} Members
                </span>
                <h3 className="font-bold text-base text-slate-900">{g.name}</h3>
                <p className="text-xs text-slate-500 line-clamp-2">{g.description}</p>
                <div className="text-[11px] text-slate-600 font-medium pt-1">
                  <span>Target Spot: {g.targetDestination}</span>
                </div>
              </div>

              <button
                onClick={() => onJoinGroup(g.id)}
                className={`w-full py-2 font-bold text-xs rounded-xl transition-colors ${
                  g.isJoined ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-emerald-600 text-white hover:bg-emerald-500'
                }`}
              >
                {g.isJoined ? 'Joined Group ✓' : 'Join Travel Group'}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 3. TRAVELERS PROFILE SECTION */}
      {activeTab === 'Profiles' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {sampleProfiles.map((prof, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xl flex items-center justify-center mx-auto">
                {prof.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">{prof.name}</h3>
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full inline-block mt-1">
                  {prof.badge}
                </span>
              </div>
              <p className="text-xs text-slate-500">{prof.bio}</p>
              <div className="pt-3 border-t border-slate-100 flex justify-between text-xs text-slate-600 font-semibold">
                <span>Trips Completed:</span>
                <span className="text-emerald-800">{prof.trips} Tours</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Community Post Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-slate-900 text-sm">Create Community Post</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePostSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Post Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                >
                  <option value="Question">Question / Query</option>
                  <option value="Tip">Travel Tip</option>
                  <option value="Photo">Photo Sharing</option>
                  <option value="Meetup">Travel Meetup</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Spot Location</label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Your Message / Question</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Ask for jeep sharing partners, hotel advice, or route status..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 text-white font-bold rounded-xl shadow-xs text-xs"
              >
                Publish Post
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
