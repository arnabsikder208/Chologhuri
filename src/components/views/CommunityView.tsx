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
  Sparkles,
  MapPin,
  Calendar,
  Send,
  UserPlus,
  Check,
  Trash2,
  Filter,
} from 'lucide-react';
import { CommunityPost, TravelGroup } from '../../types/travel';

interface CommunityViewProps {
  posts: CommunityPost[];
  groups: TravelGroup[];
  onAddPost: (post: CommunityPost) => void;
  onJoinGroup: (groupId: string) => void;
}

export const CommunityView: React.FC<CommunityViewProps> = ({
  posts: initialPosts,
  groups: initialGroups,
  onAddPost,
  onJoinGroup,
}) => {
  // State for Navigation & Filters
  const [activeTab, setActiveTab] = useState<'Discussion' | 'Groups' | 'Profiles'>('Discussion');
  const [searchQuery, setSearchQuery] = useState('');
  const [postCategoryFilter, setPostCategoryFilter] = useState<string>('All');

  // State for Data Mutability & Interactivity
  const [postsList, setPostsList] = useState<CommunityPost[]>(initialPosts);
  const [groupsList, setGroupsList] = useState<TravelGroup[]>(initialGroups);
  const [likedPostIds, setLikedPostIds] = useState<string[]>([]);
  const [expandedPostComments, setExpandedPostComments] = useState<string[]>([]);
  const [commentInputs, setCommentInputs] = useState<{ [postId: string]: string }>({});
  const [copiedPostId, setCopiedPostId] = useState<string | null>(null);

  // Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newContent, setNewContent] = useState('');
  const [newLocation, setNewLocation] = useState('Sajek Valley');
  const [newCategory, setNewCategory] = useState<'Question' | 'Tip' | 'Photo' | 'Meetup'>('Question');

  // Sync props to internal state
  React.useEffect(() => {
    setPostsList(initialPosts);
  }, [initialPosts]);

  React.useEffect(() => {
    setGroupsList(initialGroups);
  }, [initialGroups]);

  // Handle Post Creation
  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    const created: CommunityPost = {
      id: `post-${Date.now()}`,
      title: `${newCategory}: ${newLocation} Exploration`,
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
    setPostsList((prev) => [created, ...prev]);
    setShowCreateModal(false);
    setNewContent('');
  };

  // Like Toggle Handler
  const handleToggleLike = (postId: string) => {
    const isLiked = likedPostIds.includes(postId);
    setLikedPostIds((prev) =>
      isLiked ? prev.filter((id) => id !== postId) : [...prev, postId]
    );

    setPostsList((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            likes: isLiked ? Math.max(0, p.likes - 1) : p.likes + 1,
          };
        }
        return p;
      })
    );
  };

  // Comment Section Expansion
  const toggleComments = (postId: string) => {
    setExpandedPostComments((prev) =>
      prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]
    );
  };

  // Add Comment Handler
  const handleAddComment = (postId: string) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;

    setPostsList((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            commentsCount: p.commentsCount + 1,
          };
        }
        return p;
      })
    );

    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
  };

  // Join Group Handler with Local Counter Update
  const handleGroupToggle = (groupId: string) => {
    onJoinGroup(groupId);
    setGroupsList((prev) =>
      prev.map((g) => {
        if (g.id === groupId) {
          const nextJoined = !g.isJoined;
          return {
            ...g,
            isJoined: nextJoined,
            membersCount: nextJoined ? g.membersCount + 1 : Math.max(0, g.membersCount - 1),
          };
        }
        return g;
      })
    );
  };

  const handleShare = (postId: string) => {
    setCopiedPostId(postId);
    setTimeout(() => setCopiedPostId(null), 2000);
  };

  // Static Profiles Data
  const sampleProfiles = [
    { name: 'Dr. Shahriar Rahman', role: 'Adventure Trekker', bio: 'Conquered 12 peaks in Bandarban & Khagrachhari.', trips: 14, badge: 'Verified Guide', location: 'Bandarban' },
    { name: 'Nusrat Jahan', role: 'Solo Female Traveler', bio: 'Exploring hidden waterfalls in Mirsarai & Sitakunda.', trips: 9, badge: 'Community Host', location: 'Mirsarai' },
    { name: 'Alex & Maria', role: 'Foreign Travelers', bio: 'Backpacking across Cox\'s Bazar Marine Drive and Rangamati.', trips: 5, badge: 'Explorer', location: 'Cox\'s Bazar' },
  ];

  // Filtered Posts
  const filteredPosts = postsList.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.destinationName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      postCategoryFilter === 'All' || p.tags?.includes(postCategoryFilter) || p.type === postCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Filtered Groups
  const filteredGroups = groupsList.filter((g) =>
    g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.targetDestination.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filtered Profiles
  const filteredProfiles = sampleProfiles.filter((prof) =>
    prof.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    prof.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    prof.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-16 min-h-full font-sans text-slate-900">
      
      {/* ================= HEADER SECTION ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-50 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            Connect & Collaborate
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Users className="w-7 h-7 text-emerald-600 shrink-0" />
            <span>Community Ecosystem</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Connect with verified local guides, solo travelers, backpackers, and travel groups across Chattogram Division
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-2xl shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 self-start sm:self-auto active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>New Community Post</span>
        </button>
      </div>

      {/* ================= NAVIGATION TABS & SEARCH ================= */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center border-b border-slate-200">
        <div className="flex w-full md:w-auto overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('Discussion')}
            className={`py-3.5 px-5 text-xs font-black tracking-wide border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'Discussion'
                ? 'border-emerald-600 text-emerald-800 bg-emerald-50/60'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
            }`}
          >
            TRAVEL DISCUSSIONS
          </button>
          <button
            onClick={() => setActiveTab('Groups')}
            className={`py-3.5 px-5 text-xs font-black tracking-wide border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'Groups'
                ? 'border-emerald-600 text-emerald-800 bg-emerald-50/60'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
            }`}
          >
            TRAVEL GROUPS ({groupsList.length})
          </button>
          <button
            onClick={() => setActiveTab('Profiles')}
            className={`py-3.5 px-5 text-xs font-black tracking-wide border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'Profiles'
                ? 'border-emerald-600 text-emerald-800 bg-emerald-50/60'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
            }`}
          >
            TRAVELER PROFILES
          </button>
        </div>

        {/* Global Search Bar */}
        <div className="relative w-full md:w-64 pb-3 md:pb-0">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={`Search ${activeTab.toLowerCase()}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white text-xs font-medium text-slate-900 placeholder-slate-400 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/40 shadow-xs"
          />
        </div>
      </div>

      {/* ================= 1. TRAVEL DISCUSSION SECTION ================= */}
      {activeTab === 'Discussion' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            
            {/* Category Sub-Filters */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
              <span className="text-slate-400 font-bold text-[11px] flex items-center gap-1 shrink-0">
                <Filter className="w-3 h-3" /> Filter:
              </span>
              {['All', 'Question', 'Tip', 'Meetup', 'Photo'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setPostCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                    postCategoryFilter === cat
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Posts List */}
            {filteredPosts.length > 0 ? (
              filteredPosts.map((p) => {
                const isLiked = likedPostIds.includes(p.id);
                const isCommentsExpanded = expandedPostComments.includes(p.id);

                return (
                  <div
                    key={p.id}
                    className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:shadow-sm transition-all space-y-3.5"
                  >
                    {/* Author Bar */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.author.avatar}
                          className="w-10 h-10 rounded-full object-cover border border-slate-200"
                          alt={p.author.name}
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-slate-900 text-xs">
                              {p.author.name}
                            </span>
                            {p.author.badge && (
                              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[9px] font-extrabold rounded-full">
                                {p.author.badge}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-0.5">
                            <MapPin className="w-3 h-3 text-emerald-600" />
                            <span className="font-semibold text-slate-600">
                              {p.destinationName}
                            </span>
                            <span>•</span>
                            <span>{p.date}</span>
                          </div>
                        </div>
                      </div>

                      <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-[10px] font-extrabold rounded-lg uppercase tracking-wider">
                        {p.type}
                      </span>
                    </div>

                    {/* Content */}
                    <h4 className="font-black text-sm text-slate-900 leading-snug">
                      {p.title}
                    </h4>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {p.content}
                    </p>

                    {p.image && (
                      <div className="rounded-xl overflow-hidden border border-slate-100">
                        <img
                          src={p.image}
                          className="w-full h-52 object-cover hover:scale-102 transition duration-500"
                          alt="Post media"
                        />
                      </div>
                    )}

                    {/* Action Bar */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-bold">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => handleToggleLike(p.id)}
                          className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                            isLiked ? 'text-red-600' : 'hover:text-red-500'
                          }`}
                        >
                          <Heart
                            className={`w-4 h-4 ${
                              isLiked ? 'fill-red-500 text-red-500' : ''
                            }`}
                          />
                          <span>{p.likes} Likes</span>
                        </button>

                        <button
                          onClick={() => toggleComments(p.id)}
                          className="flex items-center gap-1.5 hover:text-emerald-700 transition-colors cursor-pointer"
                        >
                          <MessageSquare className="w-4 h-4 text-emerald-600" />
                          <span>{p.commentsCount} Comments</span>
                        </button>
                      </div>

                      <button
                        onClick={() => handleShare(p.id)}
                        className="hover:text-emerald-700 flex items-center gap-1 transition-colors cursor-pointer"
                        title="Share post"
                      >
                        {copiedPostId === p.id ? (
                          <span className="text-emerald-600 text-[10px]">Copied!</span>
                        ) : (
                          <Share2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    {/* Expandable Comment Input */}
                    {isCommentsExpanded && (
                      <div className="pt-3 border-t border-slate-100 space-y-3 animate-in fade-in duration-200">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Write a response..."
                            value={commentInputs[p.id] || ''}
                            onChange={(e) =>
                              setCommentInputs({ ...commentInputs, [p.id]: e.target.value })
                            }
                            onKeyDown={(e) => e.key === 'Enter' && handleAddComment(p.id)}
                            className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                          />
                          <button
                            onClick={() => handleAddComment(p.id)}
                            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
                <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-700">No discussions found</p>
                <p className="text-[11px] text-slate-400">Try adjusting your filter or search query.</p>
              </div>
            )}
          </div>

          {/* Sidebar Cards */}
          <div className="space-y-4">
            <div className="bg-slate-950 text-white p-6 rounded-3xl space-y-4 border border-slate-800 shadow-xl">
              <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-xs tracking-wider uppercase">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>Verified Tour Guides</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Need licensed hill tract guides for Dighinala convoy clearance, Chander Gari arrangements, or indigenous cultural tours?
              </p>
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[10px] text-slate-400">24 Registered Guides Active</span>
                <button className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] rounded-xl transition-all cursor-pointer">
                  Find Guide
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
              <h3 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-emerald-600" />
                <span>Popular Meetup Destinations</span>
              </h3>
              <div className="flex flex-wrap gap-2 pt-1">
                {['Sajek Valley', 'Nafakhum Waterfall', 'Kechuri Tong', 'Boga Lake', 'Mirsarai Trail'].map((spot) => (
                  <span
                    key={spot}
                    onClick={() => setSearchQuery(spot)}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 text-[10px] font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    #{spot}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= 2. TRAVEL GROUPS SECTION ================= */}
      {activeTab === 'Groups' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {filteredGroups.length > 0 ? (
            filteredGroups.map((g) => (
              <div
                key={g.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-extrabold rounded-full">
                      {g.membersCount} Members
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-emerald-600" />
                      {g.targetDestination}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-base text-slate-900 leading-snug">
                    {g.name}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {g.description}
                  </p>
                </div>

                <button
                  onClick={() => handleGroupToggle(g.id)}
                  className={`w-full py-2.5 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 ${
                    g.isJoined
                      ? 'bg-emerald-50 text-emerald-900 border border-emerald-300'
                      : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-sm'
                  }`}
                >
                  {g.isJoined ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Joined Group</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>Join Travel Group</span>
                    </>
                  )}
                </button>
              </div>
            ))
          ) : (
            <div className="col-span-full rounded-2xl border border-slate-200 bg-white p-10 text-center">
              <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-700">No travel groups match your search</p>
            </div>
          )}
        </div>
      )}

      {/* ================= 3. TRAVELERS PROFILE SECTION ================= */}
      {activeTab === 'Profiles' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {filteredProfiles.length > 0 ? (
            filteredProfiles.map((prof, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:shadow-md transition-all space-y-4 text-center flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="relative inline-block">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 font-black text-xl flex items-center justify-center mx-auto border-2 border-emerald-500/30">
                      {prof.name.charAt(0)}
                    </div>
                    <span className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" title="Online now" />
                  </div>

                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900">{prof.name}</h3>
                    <p className="text-[11px] font-semibold text-slate-500">{prof.role}</p>
                    <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-extrabold rounded-full inline-block mt-1.5 border border-emerald-200/60">
                      {prof.badge}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed px-2">{prof.bio}</p>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <div className="flex justify-between items-center text-xs text-slate-600 font-bold px-1">
                    <span className="text-[11px] text-slate-400">Trips Completed:</span>
                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">{prof.trips} Tours</span>
                  </div>

                  <button className="w-full py-2 bg-slate-900 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl transition-all cursor-pointer">
                    Connect & Message
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full rounded-2xl border border-slate-200 bg-white p-10 text-center">
              <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-700">No traveler profiles found</p>
            </div>
          )}
        </div>
      )}

      {/* ================= CREATE COMMUNITY POST MODAL ================= */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 space-y-4 border border-slate-200 text-slate-900 animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-black text-slate-900 text-base">
                  Create Community Post
                </h3>
                <p className="text-[10px] text-slate-500">
                  Ask queries, share tips, or find meetup partners
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-900 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handlePostSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Post Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                >
                  <option value="Question">Question / Query</option>
                  <option value="Tip">Travel Tip</option>
                  <option value="Photo">Photo Sharing</option>
                  <option value="Meetup">Travel Meetup</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Spot Location
                </label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder="e.g. Sajek Valley, Sitakunda, Rangamati"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Your Message / Question *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Ask for jeep sharing partners, hotel advice, or route status..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-3 border border-slate-200 bg-white text-slate-700 font-bold rounded-xl text-xs hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-md shadow-emerald-600/20 text-xs transition-all active:scale-95 cursor-pointer"
                >
                  Publish Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
