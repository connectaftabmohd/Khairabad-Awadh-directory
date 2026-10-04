import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Search,
  Clock,
  Calendar,
  MapPin,
  CheckCircle,
  Share2,
  ChevronRight,
  ArrowLeft,
  Tag,
  Building,
  Sparkles,
} from 'lucide-react';
import { KHAIRABAD_BLOGS, KhairabadBlog } from '../data/khairabadBlogs';

export const BlogPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeArticle, setActiveArticle] = useState<KhairabadBlog | null>(null);
  const [copied, setCopied] = useState(false);

  const categories = [
    'All',
    'Heritage & Spiritual',
    'History & Figures',
    'Civic & Landmarks',
    'Culture & Crafts',
    'Food & Lifestyle',
  ];

  const filteredBlogs = useMemo(() => {
    return KHAIRABAD_BLOGS.filter((blog) => {
      const matchCategory = selectedCategory === 'All' || blog.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        blog.title.toLowerCase().includes(q) ||
        blog.excerpt.toLowerCase().includes(q) ||
        blog.tags.some((t) => t.toLowerCase().includes(q)) ||
        blog.content.some((c) => c.toLowerCase().includes(q));

      return matchCategory && matchSearch;
    });
  }, [searchQuery, selectedCategory]);

  const handleShare = (blog: KhairabadBlog) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${window.location.origin}/#blog-${blog.slug}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="py-10 px-4 sm:px-6 max-w-7xl mx-auto space-y-10">
      {/* If an article is selected, show Full Article View */}
      {activeArticle ? (
        <article className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-8 p-6 sm:p-10">
          {/* Back button */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <button
              onClick={() => setActiveArticle(null)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 hover:text-amber-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to All 20 Khairabad Blogs</span>
            </button>

            <button
              onClick={() => handleShare(activeArticle)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copied ? 'Link Copied!' : 'Share Article'}</span>
            </button>
          </div>

          {/* Article Header */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs text-slate-500 flex-wrap">
              <span className="font-bold text-amber-800">{activeArticle.category}</span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{activeArticle.readTime}</span>
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{activeArticle.publishDate}</span>
              </span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-700 font-medium flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Verified Historical Factsheet</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-display text-slate-900 leading-tight">
              {activeArticle.title}
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
              {activeArticle.excerpt}
            </p>
          </div>

          {/* Feature Image */}
          <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm relative h-64 sm:h-80 bg-slate-900">
            <img
              src={activeArticle.image}
              alt={activeArticle.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-3 left-4 bg-black/60 backdrop-blur-sm text-white text-[11px] px-3 py-1 rounded-md">
              📍 {activeArticle.visitorInfo.location}
            </div>
          </div>

          {/* Visitor Guide Box */}
          <div className="p-5 bg-amber-50/70 border border-amber-200 rounded-2xl grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-amber-950">
            <div className="space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-amber-900">
                <MapPin className="w-4 h-4 text-amber-600" />
                <span>Location &amp; Address</span>
              </div>
              <div className="text-slate-700">{activeArticle.visitorInfo.location}</div>
            </div>

            <div className="space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-amber-900">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>Visiting Hours</span>
              </div>
              <div className="text-slate-700">{activeArticle.visitorInfo.timings}</div>
            </div>

            <div className="space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-amber-900">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Best Time to Visit</span>
              </div>
              <div className="text-slate-700">{activeArticle.visitorInfo.bestTimeToVisit}</div>
            </div>

            <div className="space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-amber-900">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Entry &amp; Access</span>
              </div>
              <div className="text-slate-700">{activeArticle.visitorInfo.entryFee}</div>
            </div>
          </div>

          {/* Article Paragraphs */}
          <div className="space-y-4 text-slate-700 text-sm sm:text-base leading-relaxed">
            {activeArticle.content.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          {/* Key Highlights Bullet points */}
          <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 font-display">
              Key Historical Highlights
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
              {activeArticle.keyHighlights.map((highlight, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold shrink-0">✓</span>
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tags */}
          <div className="flex items-center gap-2 pt-4 border-t border-slate-100 flex-wrap text-xs text-slate-500">
            <Tag className="w-3.5 h-3.5 text-slate-400" />
            <span>Tags:</span>
            {activeArticle.tags.map((tag, index) => (
              <span key={index} className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md">
                #{tag}
              </span>
            ))}
          </div>

          {/* Bottom Navigation */}
          <div className="pt-6 border-t border-slate-200 flex justify-between items-center">
            <button
              onClick={() => setActiveArticle(null)}
              className="px-5 py-2.5 bg-slate-950 text-amber-400 border border-slate-900 rounded-xl text-xs font-bold hover:bg-black transition-colors"
            >
              &larr; Back to All Blogs
            </button>
          </div>
        </article>
      ) : (
        /* Blog List & Archive View */
        <>
          {/* Header Title Banner */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-950 bg-amber-100 border border-amber-300 px-3 py-1 rounded-full">
              <BookOpen className="w-3.5 h-3.5 text-amber-700" />
              <span>Khairabad City Blog &amp; Place Guides</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900 tracking-tight">
              20 Verified Khairabad Place Information Blogs
            </h1>

            <p className="text-sm text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Explore in-depth articles on historic monuments, spiritual shrines, administrative landmarks, traditional bazaars, and local lifestyle across Khairabad, Uttar Pradesh.
            </p>
          </div>

          {/* Search & Category Filter Controls */}
          <div className="space-y-4 max-w-4xl mx-auto">
            {/* Search Bar */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by monument, history, shrine, street or keyword..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 bg-white text-xs sm:text-sm outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 shadow-sm"
              />
            </div>

            {/* Category Segmented Buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? 'bg-slate-950 text-white shadow-xs font-bold ring-1 ring-amber-400'
                      : 'bg-white hover:bg-amber-50/50 text-slate-700 border border-slate-200 hover:border-amber-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Blog Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlogs.map((blog) => (
              <article
                key={blog.id}
                onClick={() => setActiveArticle(blog)}
                className="bg-white rounded-3xl border border-slate-200 hover:border-amber-400 transition-all overflow-hidden flex flex-col justify-between hover:shadow-md cursor-pointer group"
              >
                <div>
                  {/* Thumbnail Image */}
                  <div className="h-44 bg-slate-900 overflow-hidden relative">
                    <img
                      src={blog.image}
                      alt={blog.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-md">
                      {blog.category}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-2.5">
                    {/* Zero-Pill Quiet Metadata */}
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span>{blog.readTime}</span>
                      <span aria-hidden="true">·</span>
                      <span>{blog.publishDate}</span>
                    </div>

                    <h2 className="text-base font-bold text-slate-900 font-display group-hover:text-amber-800 transition-colors leading-snug line-clamp-2">
                      {blog.title}
                    </h2>

                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {blog.excerpt}
                    </p>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="px-5 pb-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1 text-[11px] text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span className="truncate max-w-[150px]">{blog.visitorInfo.location}</span>
                  </span>

                  <span className="font-bold text-slate-900 group-hover:text-amber-800 group-hover:underline flex items-center gap-0.5 shrink-0">
                    <span>Read Guide</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </article>
            ))}
          </div>

          {filteredBlogs.length === 0 && (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
              <BookOpen className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-900">No blog articles found</h3>
              <p className="text-xs text-slate-500">
                Try searching with different terms or reset your category filter.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="mt-2 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 border border-amber-500 rounded-xl text-xs font-bold"
              >
                Reset Search
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
