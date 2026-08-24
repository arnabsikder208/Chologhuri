import React, { useState } from 'react';
import { BookOpen, Plus, Heart, MessageSquare, User, Calendar, Search, ArrowRight, X, Check } from 'lucide-react';
import { Blog, BlogComment } from '../../types/travel';

interface BlogsViewProps {
  blogs: Blog[];
  onAddBlog: (newBlog: Blog) => void;
  selectedBlog: Blog | null;
  onSelectBlog: (b: Blog | null) => void;
}

export const BlogsView: React.FC<BlogsViewProps> = ({
  blogs,
  onAddBlog,
  selectedBlog,
  onSelectBlog,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form state
  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newDestination, setNewDestination] = useState('Sajek Valley');
  const [newCategory, setNewCategory] = useState('Guides & Itineraries');
  const [newContent, setNewContent] = useState('');

  // Comment state
  const [commentText, setCommentText] = useState('');

  const categories = ['All', 'Guides & Itineraries', 'Trekking & Adventure', 'Food & Cultural Stories', 'Budget Tips'];

  const featuredBlog = blogs.find((b) => b.featured) || blogs[0];

  const filteredBlogs = blogs.filter((b) => {
    const matchesCat = selectedCategory === 'All' || b.category === selectedCategory;
    const matchesSearch =
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.destinationName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleCreateBlog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newContent) return;

    const created: Blog = {
      id: `blog-${Date.now()}`,
      title: newTitle,
      subtitle: newSubtitle || newContent.substring(0, 100) + '...',
      author: {
        name: 'Tanvir Hossain',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        role: 'Travel Enthusiast',
      },
      publishDate: 'Just Now',
      category: newCategory,
      destinationName: newDestination,
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80',
      content: newContent,
      readTime: '4 min read',
      likes: 1,
      commentsCount: 0,
      comments: [],
    };

    onAddBlog(created);
    setShowCreateModal(false);
    setNewTitle('');
    setNewSubtitle('');
    setNewContent('');
  };

  const handleAddComment = () => {
    if (!commentText.trim() || !selectedBlog) return;
    const newComm: BlogComment = {
      id: `comm-${Date.now()}`,
      userName: 'Tanvir Hossain',
      userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      text: commentText,
      date: 'Just now',
    };
    selectedBlog.comments.push(newComm);
    selectedBlog.commentsCount += 1;
    setCommentText('');
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header matching Wireframe Page 8 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-emerald-600" />
            <span>BLOGS & TRAVEL STORIES</span>
          </h1>
          <p className="text-xs text-slate-500">Real travel experiences and guides across Chattogram Division</p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Write Travel Post</span>
        </button>
      </div>

      {/* 1. FEATURED BLOG BANNER matching Page 8 Wireframe ("OUR PLACE - DETAILS - Read More") */}
      {featuredBlog && (
        <div className="bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-xl grid grid-cols-1 lg:grid-cols-2 text-white">
          <div className="relative h-64 lg:h-auto overflow-hidden">
            <img src={featuredBlog.image} className="w-full h-full object-cover" alt={featuredBlog.title} />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 lg:from-slate-950/40 via-transparent to-transparent" />
            <span className="absolute top-4 left-4 px-3 py-1 bg-emerald-500 text-slate-950 text-[10px] font-extrabold rounded-full uppercase">
              OUR PLACE FEATURED
            </span>
          </div>

          <div className="p-6 sm:p-8 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-xs text-emerald-400 font-bold uppercase">{featuredBlog.category} • {featuredBlog.destinationName}</span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">{featuredBlog.title}</h2>
              <p className="text-xs text-slate-300 leading-relaxed">{featuredBlog.subtitle}</p>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs">
                <img src={featuredBlog.author.avatar} className="w-7 h-7 rounded-full object-cover" alt={featuredBlog.author.name} />
                <div>
                  <p className="font-bold text-white text-[11px]">{featuredBlog.author.name}</p>
                  <p className="text-[9px] text-slate-400">{featuredBlog.publishDate}</p>
                </div>
              </div>

              <button
                onClick={() => onSelectBlog(featuredBlog)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-2"
              >
                <span>Read More</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Filter & Search Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat ? 'bg-emerald-600 text-white font-bold' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search travel blogs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white text-xs text-slate-900 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
          />
        </div>
      </div>

      {/* 3. BLOG CARDS LIST matching Page 8 wireframe stacked cards ("Read More") */}
      <div className="space-y-4">
        {filteredBlogs.map((b) => (
          <div
            key={b.id}
            className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row gap-5 items-center"
          >
            <img src={b.image} className="w-full md:w-56 h-40 rounded-xl object-cover shrink-0" alt={b.title} />

            <div className="flex-1 space-y-3 w-full">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full uppercase">
                  {b.category} • {b.destinationName}
                </span>
                <span className="text-[11px] text-slate-400">{b.publishDate}</span>
              </div>

              <h3 className="font-bold text-base text-slate-900 hover:text-emerald-700 cursor-pointer" onClick={() => onSelectBlog(b)}>
                {b.title}
              </h3>

              <p className="text-xs text-slate-600 line-clamp-2">{b.subtitle || b.content}</p>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-4 text-slate-500 text-[11px]">
                  <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5 text-red-500" /> {b.likes}</span>
                  <span className="flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5 text-teal-600" /> {b.commentsCount} comments</span>
                  <span>{b.readTime}</span>
                </div>

                <button
                  onClick={() => onSelectBlog(b)}
                  className="px-4 py-1.5 bg-slate-900 hover:bg-emerald-600 text-white font-bold text-xs rounded-lg transition-colors"
                >
                  Read More
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Blog Detail Modal */}
      {selectedBlog && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden border border-emerald-100 max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95">
            <div className="relative h-64 shrink-0">
              <img src={selectedBlog.image} className="w-full h-full object-cover" alt={selectedBlog.title} />
              <button
                onClick={() => onSelectBlog(null)}
                className="absolute top-4 right-4 p-2 bg-slate-900/60 text-white rounded-full hover:bg-slate-900 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-6 right-6 text-white">
                <span className="px-2.5 py-0.5 bg-emerald-500 text-slate-950 font-bold text-[10px] rounded-full uppercase">
                  {selectedBlog.category}
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">{selectedBlog.title}</h2>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-slate-700">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <img src={selectedBlog.author.avatar} className="w-9 h-9 rounded-full object-cover" alt={selectedBlog.author.name} />
                <div>
                  <p className="font-bold text-slate-900 text-xs">{selectedBlog.author.name}</p>
                  <p className="text-[10px] text-slate-500">{selectedBlog.author.role} • {selectedBlog.publishDate}</p>
                </div>
              </div>

              <div className="leading-relaxed space-y-3 whitespace-pre-line text-slate-800 font-normal">
                {selectedBlog.content}
              </div>

              {/* Comments Section */}
              <div className="pt-6 border-t border-slate-200 space-y-4">
                <h3 className="font-bold text-sm text-slate-900">Community Comments ({selectedBlog.commentsCount})</h3>
                
                <div className="space-y-3">
                  {selectedBlog.comments.map((c) => (
                    <div key={c.id} className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-slate-900">{c.userName}</span>
                        <span className="text-slate-400">{c.date}</span>
                      </div>
                      <p className="text-slate-700">{c.text}</p>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 pt-2">
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="flex-1 px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs"
                  />
                  <button
                    onClick={handleAddComment}
                    className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-xl text-xs"
                  >
                    Comment
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Create Blog Post Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-slate-900 text-sm">Publish Travel Story to CholoGhuri</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBlog} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. My Unforgettable Camping Night at Boga Lake"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Destination & Category</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={newDestination}
                    onChange={(e) => setNewDestination(e.target.value)}
                    placeholder="Destination name"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  >
                    {categories.filter((c) => c !== 'All').map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Story Content</label>
                <textarea
                  rows={5}
                  required
                  placeholder="Share your travel experiences, routes, food recommendations, and tips..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 text-white font-bold rounded-xl shadow-xs text-xs"
              >
                Publish Blog Post
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
