import React, { useState, useEffect, useMemo } from 'react';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Unlock,
  User,
  Key,
  LogOut,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Save,
  RotateCcw,
  Eye,
  EyeOff,
  Bell,
  Megaphone,
  FileText,
  Phone,
  Building2,
  Star,
  Download,
  Upload,
  Database,
  ArrowLeft,
  ChevronRight,
  Info,
  Sparkles,
  RefreshCw,
  MapPin,
  Signpost,
  Store,
  Navigation,
  Compass,
  Layers,
  Route,
} from 'lucide-react';
import { CityListing, EmergencyContact, CategoryId, Review } from '../types/directory';
import { CATEGORIES, LOCALITIES, KHAIRABAD_CITY_INFO } from '../data/khairabadData';
import {
  getAllAdminListings,
  updateListingStatus,
  adminUpdateListing,
  adminDeleteListing,
  saveUserListing,
} from '../utils/listingStorage';
import {
  authenticateAdmin,
  isAdminAuthenticated,
  logoutAdmin,
  getAdminCredentials,
  updateAdminCredentials,
  resetAdminCredentialsToDefault,
  DEFAULT_ADMIN_USER_ID,
  DEFAULT_ADMIN_PASSWORD,
} from '../utils/adminAuth';
import {
  getSiteAnnouncement,
  saveSiteAnnouncement,
  SiteAnnouncement,
  getStoredEmergencyContacts,
  saveEmergencyContact,
  deleteEmergencyContact,
  resetEmergencyContactsToDefault,
  getStoredBlogs,
  saveBlogArticle,
  deleteBlogArticle,
  getStoredTownCivicInfo,
  saveTownCivicInfo,
  TownCivicInfo,
  TownMarketItem,
  getStoredMohallas,
  saveOrUpdateMohalla,
  deleteMohalla,
  resetMohallasToDefault,
  getStoredMarkets,
  saveOrUpdateMarket,
  deleteMarket,
  resetMarketsToDefault,
  getStoredChaurahas,
  saveOrUpdateChauraha,
  deleteChauraha,
  resetChaurahasToDefault,
  getStoredRoads,
  saveOrUpdateRoad,
  deleteRoad,
  resetRoadsToDefault,
} from '../utils/siteContentStorage';
import {
  TraditionalMohalla,
  ChaurahaHub,
  RoadConnectivityItem,
} from '../data/roadsConnectivityData';
import { KhairabadBlog } from '../data/khairabadBlogs';
import { syncListingToSupabase, testSupabaseConnection } from '../utils/supabaseClient';
import { KhairabadLogo } from './KhairabadLogo';
import { AdminLocationsManager } from './AdminLocationsManager';

interface AdminPortalProps {
  onBackToDirectory: () => void;
  reviews?: Review[];
  onDeleteReview?: (reviewId: string) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  onBackToDirectory,
  reviews = [],
  onDeleteReview,
}) => {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => isAdminAuthenticated());
  const [loginUserId, setLoginUserId] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'overview' | 'listings' | 'locations' | 'content' | 'reviews' | 'settings'>('overview');

  // Listings state
  const [adminListings, setAdminListings] = useState<CityListing[]>(() => getAllAdminListings());
  const [listingFilterStatus, setListingFilterStatus] = useState<'all' | 'under-review' | 'active' | 'rejected' | 'user-only'>('under-review');
  const [listingSearch, setListingSearch] = useState('');
  const [listingCategoryFilter, setListingCategoryFilter] = useState<string>('all');

  // Modals state
  const [editingListing, setEditingListing] = useState<CityListing | null>(null);
  const [isAddListingModalOpen, setIsAddListingModalOpen] = useState(false);
  const [rejectingListing, setRejectingListing] = useState<CityListing | null>(null);
  const [rejectionReasonInput, setRejectionReasonInput] = useState('');
  const [previewListing, setPreviewListing] = useState<CityListing | null>(null);

  // Content state
  const [contentSubTab, setContentSubTab] = useState<'announcement' | 'emergency' | 'blogs' | 'town-info'>('announcement');
  const [announcement, setAnnouncement] = useState<SiteAnnouncement>(() => getSiteAnnouncement());
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>(() => getStoredEmergencyContacts());
  const [editingEmergency, setEditingEmergency] = useState<EmergencyContact | null>(null);
  const [isAddEmergencyOpen, setIsAddEmergencyOpen] = useState(false);
  const [blogs, setBlogs] = useState<KhairabadBlog[]>(() => getStoredBlogs());
  const [editingBlog, setEditingBlog] = useState<KhairabadBlog | null>(null);
  const [isAddBlogOpen, setIsAddBlogOpen] = useState(false);
  const [townInfo, setTownInfo] = useState<TownCivicInfo>(() => getStoredTownCivicInfo());

  // Credentials settings state
  const [newUserId, setNewUserId] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [securityMessage, setSecurityMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Supabase test status
  const [supabaseStatus, setSupabaseStatus] = useState<string | null>(null);
  const [isSyncingAll, setIsSyncingAll] = useState(false);

  // Toast banner
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'info' | 'error'; text: string } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const refreshListings = () => {
    setAdminListings(getAllAdminListings());
  };

  // Synchronize on load & storage events
  useEffect(() => {
    const handleAuthChange = () => {
      setIsAuthenticated(isAdminAuthenticated());
    };
    const handleListingsUpdate = () => {
      setAdminListings(getAllAdminListings());
    };
    window.addEventListener('khairabad_admin_auth_changed', handleAuthChange);
    window.addEventListener('khairabad_listings_updated', handleListingsUpdate);

    return () => {
      window.removeEventListener('khairabad_admin_auth_changed', handleAuthChange);
      window.removeEventListener('khairabad_listings_updated', handleListingsUpdate);
    };
  }, []);

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const result = authenticateAdmin(loginUserId, loginPassword);
    if (result.success) {
      setIsAuthenticated(true);
      showToast('Welcome to Khairabad Admin Palace! Logged in successfully.', 'success');
    } else {
      setLoginError(result.error || 'Invalid credentials.');
    }
  };

  const handleFillDemoCreds = () => {
    const creds = getAdminCredentials();
    setLoginUserId(creds.userId);
    setLoginPassword(creds.rawPasswordSecret);
    setLoginError(null);
  };

  const handleLogout = () => {
    logoutAdmin();
    setIsAuthenticated(false);
    setLoginUserId('');
    setLoginPassword('');
    setLoginError(null);
    showToast('Logged out of Admin Palace successfully. You can log in again or return to the directory.', 'info');
  };

  // Metrics
  const metrics = useMemo(() => {
    const total = adminListings.length;
    const underReview = adminListings.filter((l) => l.status === 'under-review').length;
    const active = adminListings.filter((l) => l.status === 'active' || (!l.status && l.verified)).length;
    const rejected = adminListings.filter((l) => l.status === 'rejected').length;
    const userSubmitted = adminListings.filter((l) => l.id.startsWith('kh-user-')).length;

    return {
      total,
      underReview,
      active,
      rejected,
      userSubmitted,
      totalReviews: reviews.length,
    };
  }, [adminListings, reviews]);

  // Filtered listings
  const filteredListings = useMemo(() => {
    return adminListings.filter((item) => {
      // Status filter
      if (listingFilterStatus === 'under-review' && item.status !== 'under-review') {
        return false;
      }
      if (listingFilterStatus === 'active') {
        const isActive = item.status === 'active' || (!item.status && item.verified);
        if (!isActive) return false;
      }
      if (listingFilterStatus === 'rejected' && item.status !== 'rejected') {
        return false;
      }
      if (listingFilterStatus === 'user-only' && !item.id.startsWith('kh-user-')) {
        return false;
      }

      // Category filter
      if (listingCategoryFilter !== 'all' && item.category !== listingCategoryFilter) {
        return false;
      }

      // Search filter
      if (listingSearch.trim()) {
        const q = listingSearch.toLowerCase().trim();
        const inName = item.name.toLowerCase().includes(q);
        const inLoc = item.locality.toLowerCase().includes(q);
        const inSub = item.subcategory.toLowerCase().includes(q);
        const inPhone = (item.phone || '').includes(q);
        const inRoad = (item.roadName || '').toLowerCase().includes(q);
        const inMohalla = (item.mohalla || '').toLowerCase().includes(q);
        if (!inName && !inLoc && !inSub && !inPhone && !inRoad && !inMohalla) {
          return false;
        }
      }

      return true;
    });
  }, [adminListings, listingFilterStatus, listingCategoryFilter, listingSearch]);

  // Actions on Listings
  const handleApproveListing = (listing: CityListing) => {
    updateListingStatus(listing.id, 'active', true);
    refreshListings();
    showToast(`Listing "${listing.name}" confirmed and approved successfully!`, 'success');
  };

  const handleOpenRejectModal = (listing: CityListing) => {
    setRejectingListing(listing);
    setRejectionReasonInput('');
  };

  const handleConfirmReject = () => {
    if (!rejectingListing) return;
    const reason = rejectionReasonInput.trim() || 'Details could not be verified by moderator.';
    updateListingStatus(rejectingListing.id, 'rejected', false, reason);
    refreshListings();
    setRejectingListing(null);
    showToast(`Listing "${rejectingListing.name}" marked as rejected.`, 'info');
  };

  const handleResetToUnderReview = (listing: CityListing) => {
    updateListingStatus(listing.id, 'under-review', false);
    refreshListings();
    showToast(`Listing "${listing.name}" moved back to Under Review.`, 'info');
  };

  const handleDeleteListing = (listing: CityListing) => {
    adminDeleteListing(listing.id);
    refreshListings();
    showToast(`Listing "${listing.name}" deleted permanently.`, 'info');
  };

  // Save Announcement
  const handleSaveAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    saveSiteAnnouncement(announcement);
    showToast('Top Announcement Banner updated successfully!', 'success');
  };

  // Save Emergency Contact
  const handleSaveEmergencyContact = (contact: EmergencyContact) => {
    const updated = saveEmergencyContact(contact);
    setEmergencyContacts(updated);
    setEditingEmergency(null);
    setIsAddEmergencyOpen(false);
    showToast(`Emergency contact "${contact.title}" saved.`, 'success');
  };

  const handleDeleteEmergencyContact = (id: string, title: string) => {
    const updated = deleteEmergencyContact(id);
    setEmergencyContacts(updated);
    showToast(`Contact "${title}" removed.`, 'info');
  };

  // Save Blog
  const handleSaveBlog = (blog: KhairabadBlog) => {
    const updated = saveBlogArticle(blog);
    setBlogs(updated);
    setEditingBlog(null);
    setIsAddBlogOpen(false);
    showToast(`Article "${blog.title}" saved.`, 'success');
  };

  const handleDeleteBlog = (id: string, title: string) => {
    const updated = deleteBlogArticle(id);
    setBlogs(updated);
    showToast(`Article "${title}" removed.`, 'info');
  };

  // Save Town Civic Info
  const handleSaveTownInfo = (e: React.FormEvent) => {
    e.preventDefault();
    saveTownCivicInfo(townInfo);
    showToast('Town Civic & Council information saved!', 'success');
  };

  // Change Admin Credentials
  const handleUpdateSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    setSecurityMessage(null);

    if (newPassword !== confirmPassword) {
      setSecurityMessage({ type: 'error', text: 'Passwords do not match.' });
      return;
    }

    const currentCreds = getAdminCredentials();
    const targetUserId = newUserId.trim() || currentCreds.userId;
    const res = updateAdminCredentials(targetUserId, newPassword);

    if (res.success) {
      setSecurityMessage({ type: 'success', text: `Admin credentials updated successfully! New User ID: ${targetUserId}` });
      setNewPassword('');
      setConfirmPassword('');
      showToast('Admin password and credentials updated!', 'success');
    } else {
      setSecurityMessage({ type: 'error', text: res.error || 'Failed to update credentials.' });
    }
  };

  const handleResetCreds = () => {
    resetAdminCredentialsToDefault();
    setNewUserId('');
    setNewPassword('');
    setConfirmPassword('');
    setSecurityMessage({ type: 'success', text: 'Credentials reset to default: User ID: admin / Password: admin@khairabad2026' });
    showToast('Admin credentials reset to defaults.', 'info');
  };

  // Supabase test connection & sync all
  const handleTestSupabase = async () => {
    setSupabaseStatus('Testing connection to Supabase...');
    const res = await testSupabaseConnection();
    if (res.connected) {
      setSupabaseStatus('Connected! Supabase database is active and ready.');
      showToast('Supabase connection verified!', 'success');
    } else {
      setSupabaseStatus(`Connection failed: ${res.error || 'Check internet and keys'}`);
      showToast('Supabase connection check failed', 'error');
    }
  };

  const handleSyncAllToSupabase = async () => {
    setIsSyncingAll(true);
    showToast('Pushing all listings to Supabase cloud...', 'info');
    let synced = 0;
    for (const item of adminListings) {
      const res = await syncListingToSupabase(item);
      if (res.success) synced++;
    }
    setIsSyncingAll(false);
    showToast(`Synced ${synced} / ${adminListings.length} listings to Supabase!`, 'success');
  };

  // =========================================================================
  // LOGIN SCREEN
  // =========================================================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-850 to-slate-950 flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-md">
          {/* Header Back Button */}
          <button
            onClick={onBackToDirectory}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Khairabad Public Directory</span>
          </button>

          {/* Login Card */}
          <div className="bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            {/* Branding */}
            <div className="text-center">
              <div className="inline-flex p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mb-1">
                <Shield className="w-8 h-8" />
              </div>
            </div>

            {/* Error notice */}
            {loginError && (
              <div className="bg-rose-500/15 border border-rose-500/30 text-rose-300 p-3 rounded-xl text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Admin User ID
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={loginUserId}
                    onChange={(e) => setLoginUserId(e.target.value)}
                    placeholder="e.g. admin"
                    required
                    className="w-full bg-slate-800/80 border border-slate-700 text-white text-sm rounded-xl pl-9 pr-3 py-2.5 outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter admin password"
                    required
                    className="w-full bg-slate-800/80 border border-slate-700 text-white text-sm rounded-xl pl-9 pr-10 py-2.5 outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-sm transition-all shadow-lg hover:shadow-amber-400/20 flex items-center justify-center gap-2 mt-2"
              >
                <Unlock className="w-4 h-4 stroke-[2.5]" />
                <span>Login to Admin Palace</span>
              </button>
            </form>

            <div className="text-center pt-2">
              <button
                onClick={onBackToDirectory}
                className="text-xs text-slate-400 hover:text-amber-300 underline transition-colors"
              >
                Return to Khairabad Public City Directory
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // AUTHENTICATED ADMIN DASHBOARD
  // =========================================================================
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 animate-in fade-in slide-in-from-top-3 duration-200">
          <div
            className={`px-4 py-3 rounded-2xl shadow-2xl border text-xs font-bold flex items-center gap-2.5 ${
              toastMessage.type === 'success'
                ? 'bg-emerald-950/90 text-emerald-200 border-emerald-500/50 backdrop-blur-md'
                : toastMessage.type === 'error'
                ? 'bg-rose-950/90 text-rose-200 border-rose-500/50 backdrop-blur-md'
                : 'bg-blue-950/90 text-blue-200 border-blue-500/50 backdrop-blur-md'
            }`}
          >
            {toastMessage.type === 'success' && <CheckCircle className="w-4 h-4 text-emerald-400" />}
            {toastMessage.type === 'error' && <AlertTriangle className="w-4 h-4 text-rose-400" />}
            {toastMessage.type === 'info' && <Info className="w-4 h-4 text-blue-400" />}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Top Admin Bar */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo & Palace Title */}
          <div className="flex items-center gap-3">
            <KhairabadLogo size="sm" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-black text-amber-400 text-base sm:text-lg tracking-tight">
                  Admin Palace
                </span>
                <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-500/30 uppercase tracking-wider">
                  व्यवस्थापक कक्ष
                </span>
              </div>
              <span className="text-[10px] text-slate-400 block leading-tight">
                Khairabad Directory Master Controller
              </span>
            </div>
          </div>

          {/* Quick Actions & Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onBackToDirectory}
              className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-xl font-medium border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">View Public Website</span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="text-xs bg-rose-500/20 hover:bg-rose-500/30 active:bg-rose-500/40 text-rose-200 border border-rose-500/40 px-3.5 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
              title="Logout of Admin Palace"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Admin Nav Tabs */}
      <nav className="bg-slate-900 border-b border-slate-800/80 px-4 sm:px-6 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto flex items-center gap-1 sm:gap-2 overflow-x-auto scrollbar-none py-2 text-xs">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'overview'
                ? 'bg-amber-400 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Dashboard Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('listings')}
            className={`relative px-3.5 py-2 rounded-xl font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'listings'
                ? 'bg-amber-400 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Manage Listings</span>
            {metrics.underReview > 0 && (
              <span className="bg-amber-600 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full min-w-4 text-center">
                {metrics.underReview}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('locations')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'locations'
                ? 'bg-amber-400 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Signpost className="w-3.5 h-3.5" />
            <span>Mohalla, Market, Chauraha &amp; Roads</span>
          </button>

          <button
            onClick={() => setActiveTab('content')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'content'
                ? 'bg-amber-400 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Megaphone className="w-3.5 h-3.5" />
            <span>Website Content Manager</span>
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'reviews'
                ? 'bg-amber-400 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Star className="w-3.5 h-3.5" />
            <span>Reviews Moderation</span>
            <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.2 rounded-full">
              {metrics.totalReviews}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'settings'
                ? 'bg-amber-400 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>Security &amp; Database</span>
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 space-y-6">
        {/* ================================================================= */}
        {/* TAB 1: OVERVIEW / DASHBOARD */}
        {/* ================================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Attention Banner if Pending Listings Exist */}
            {metrics.underReview > 0 && (
              <div className="bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/10 border border-amber-500/40 rounded-3xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-lg shrink-0 shadow-lg">
                    <Clock className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">
                      {metrics.underReview} Listing{metrics.underReview > 1 ? 's' : ''} Awaiting Review (समीक्षाधीन)
                    </h2>
                    <p className="text-xs text-amber-200/80">
                      User submitted places are waiting for verification. You can review, approve, or reject them.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setActiveTab('listings');
                    setListingFilterStatus('under-review');
                  }}
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs transition-colors shadow-md shrink-0 flex items-center gap-1.5"
                >
                  <span>Review Pending Places Now</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Total Directory
                </span>
                <span className="text-2xl font-black text-white">{metrics.total}</span>
                <span className="text-[10px] text-slate-500 block">Total registered places</span>
              </div>

              <div
                onClick={() => {
                  setActiveTab('listings');
                  setListingFilterStatus('under-review');
                }}
                className="bg-slate-900 border border-amber-500/40 hover:border-amber-400 rounded-2xl p-4 space-y-1 cursor-pointer transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider">
                    Under Review
                  </span>
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <span className="text-2xl font-black text-amber-300">{metrics.underReview}</span>
                <span className="text-[10px] text-amber-400/80 block group-hover:underline">Click to moderate</span>
              </div>

              <div
                onClick={() => {
                  setActiveTab('listings');
                  setListingFilterStatus('active');
                }}
                className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-4 space-y-1 cursor-pointer hover:border-emerald-400 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
                    Active &amp; Verified
                  </span>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <span className="text-2xl font-black text-emerald-300">{metrics.active}</span>
                <span className="text-[10px] text-slate-500 block">Live on directory</span>
              </div>

              <div
                onClick={() => {
                  setActiveTab('listings');
                  setListingFilterStatus('rejected');
                }}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1 cursor-pointer hover:border-rose-400 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-rose-400 uppercase tracking-wider">
                    Rejected
                  </span>
                  <XCircle className="w-3.5 h-3.5 text-rose-400" />
                </div>
                <span className="text-2xl font-black text-rose-300">{metrics.rejected}</span>
                <span className="text-[10px] text-slate-500 block">Hidden from public</span>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  User Submissions
                </span>
                <span className="text-2xl font-black text-sky-300">{metrics.userSubmitted}</span>
                <span className="text-[10px] text-slate-500 block">Community additions</span>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Reviews &amp; Ratings
                </span>
                <span className="text-2xl font-black text-purple-300">{metrics.totalReviews}</span>
                <span className="text-[10px] text-slate-500 block">Feedback submissions</span>
              </div>
            </div>

            {/* Quick Actions Shortcuts */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <Building2 className="w-4 h-4" />
                  <span>Listings Moderation</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Review newly submitted shops, hospitals, and services. Edit phone numbers, confirm addresses, or reject spam submissions.
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => {
                      setActiveTab('listings');
                      setListingFilterStatus('under-review');
                    }}
                    className="px-3 py-1.5 bg-amber-400 text-slate-950 font-bold rounded-xl text-xs hover:bg-amber-300 transition-colors"
                  >
                    Moderate ({metrics.underReview})
                  </button>
                  <button
                    onClick={() => {
                      setIsAddListingModalOpen(true);
                    }}
                    className="px-3 py-1.5 bg-slate-800 text-slate-200 hover:text-white font-medium rounded-xl text-xs border border-slate-700 transition-colors"
                  >
                    + Add Place
                  </button>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <Signpost className="w-4 h-4" />
                  <span>Places &amp; Roads Hub</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Manage municipal wards (25 wards), commercial markets &amp; mandis, landmark crossroads (Batto Khan, Khairabad Chauraha), and road networks.
                </p>
                <button
                  onClick={() => setActiveTab('locations')}
                  className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs transition-colors"
                >
                  Manage Places &amp; Roads
                </button>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-sky-400 font-bold text-sm">
                  <Megaphone className="w-4 h-4" />
                  <span>Website Content</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Control the top notice ticker, emergency helplines (112, CHC Khairabad), local historical blog articles, and municipal council details.
                </p>
                <button
                  onClick={() => setActiveTab('content')}
                  className="px-3 py-1.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-xl text-xs transition-colors"
                >
                  Open Content Manager
                </button>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <Database className="w-4 h-4" />
                  <span>Cloud &amp; Security</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Supabase database sync, credential management (update admin password), and instant JSON full directory backups.
                </p>
                <button
                  onClick={() => setActiveTab('settings')}
                  className="px-3 py-1.5 bg-slate-800 text-slate-200 hover:text-white font-bold rounded-xl text-xs border border-slate-700 transition-colors"
                >
                  Open Settings &amp; Cloud
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 2: MANAGE LISTINGS & MODERATION (CORE USER REQUEST) */}
        {/* ================================================================= */}
        {activeTab === 'listings' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Action Bar & Sub-Filters */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 space-y-4">
              <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
                {/* Status Sub-Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
                  <button
                    onClick={() => setListingFilterStatus('under-review')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                      listingFilterStatus === 'under-review'
                        ? 'bg-amber-400 text-slate-950 shadow-md'
                        : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Under Review ({metrics.underReview})</span>
                  </button>

                  <button
                    onClick={() => setListingFilterStatus('active')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                      listingFilterStatus === 'active'
                        ? 'bg-emerald-500 text-white shadow-md'
                        : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Active &amp; Verified ({metrics.active})</span>
                  </button>

                  <button
                    onClick={() => setListingFilterStatus('rejected')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                      listingFilterStatus === 'rejected'
                        ? 'bg-rose-500 text-white shadow-md'
                        : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Rejected ({metrics.rejected})</span>
                  </button>

                  <button
                    onClick={() => setListingFilterStatus('user-only')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                      listingFilterStatus === 'user-only'
                        ? 'bg-sky-500 text-white shadow-md'
                        : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>User Submitted ({metrics.userSubmitted})</span>
                  </button>

                  <button
                    onClick={() => setListingFilterStatus('all')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                      listingFilterStatus === 'all'
                        ? 'bg-slate-100 text-slate-950 shadow-md'
                        : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>All Places ({metrics.total})</span>
                  </button>
                </div>

                {/* Add Listing Button */}
                <button
                  onClick={() => setIsAddListingModalOpen(true)}
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs transition-colors shadow-md flex items-center justify-center gap-1.5 shrink-0"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>+ Add New Listing as Admin</span>
                </button>
              </div>

              {/* Search & Category Filter */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1 border-t border-slate-800/80">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={listingSearch}
                    onChange={(e) => setListingSearch(e.target.value)}
                    placeholder="Search by name, phone, locality, ward..."
                    className="w-full bg-slate-950/80 border border-slate-800 text-white text-xs rounded-xl pl-9 pr-3 py-2 outline-none focus:border-amber-400"
                  />
                  {listingSearch && (
                    <button
                      onClick={() => setListingSearch('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <div>
                  <select
                    value={listingCategoryFilter}
                    onChange={(e) => setListingCategoryFilter(e.target.value)}
                    className="w-full bg-slate-950/80 border border-slate-800 text-white text-xs rounded-xl px-3 py-2 outline-none focus:border-amber-400"
                  >
                    <option value="all">All Categories ({CATEGORIES.length})</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="text-xs text-slate-400 flex items-center justify-end font-medium">
                  Showing <strong>{filteredListings.length}</strong> matching listing{filteredListings.length === 1 ? '' : 's'}
                </div>
              </div>
            </div>

            {/* Listings Table / Cards */}
            {filteredListings.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                  <Search className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-white">No listings found in this filter</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  There are currently no listings matching your selected status or search filter.
                </p>
                <button
                  onClick={() => {
                    setListingFilterStatus('all');
                    setListingSearch('');
                    setListingCategoryFilter('all');
                  }}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold"
                >
                  Reset Listing Filters
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredListings.map((listing) => {
                  const isUnderReview = listing.status === 'under-review';
                  const isRejected = listing.status === 'rejected';
                  const isActive = listing.status === 'active' || (!listing.status && listing.verified);

                  return (
                    <div
                      key={listing.id}
                      className={`bg-slate-900 border rounded-2xl p-4 transition-all space-y-3 ${
                        isUnderReview
                          ? 'border-amber-500/50 bg-amber-950/10'
                          : isRejected
                          ? 'border-rose-900/60 bg-rose-950/10'
                          : 'border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                        {/* Title & Metadata */}
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-base font-bold text-white tracking-tight">{listing.name}</h3>

                            {/* Status Badge */}
                            {isUnderReview && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-950 bg-amber-400 px-2.5 py-0.5 rounded-md shadow-xs animate-pulse">
                                <Clock className="w-3 h-3" />
                                <span>Under Review (समीक्षाधीन)</span>
                              </span>
                            )}
                            {isActive && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-white bg-emerald-600 px-2.5 py-0.5 rounded-md shadow-xs">
                                <ShieldCheck className="w-3 h-3" />
                                <span>Approved &amp; Verified</span>
                              </span>
                            )}
                            {isRejected && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-white bg-rose-600 px-2.5 py-0.5 rounded-md shadow-xs">
                                <XCircle className="w-3 h-3" />
                                <span>Rejected (अस्वीकृत)</span>
                              </span>
                            )}

                            {listing.id.startsWith('kh-user-') && (
                              <span className="text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30 px-2 py-0.5 rounded-md">
                                User Added
                              </span>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-slate-400">
                            <span className="font-medium text-amber-300 capitalize">
                              {listing.category.replace('-', ' ')}
                            </span>
                            <span>·</span>
                            <span>{listing.locality}</span>
                            {listing.roadName && (
                              <>
                                <span>·</span>
                                <span className="text-slate-300">🛣️ {listing.roadName}</span>
                              </>
                            )}
                            {listing.mohalla && (
                              <>
                                <span>·</span>
                                <span className="text-slate-300">🏘️ {listing.mohalla}</span>
                              </>
                            )}
                            {listing.phone && (
                              <>
                                <span>·</span>
                                <span className="text-slate-300">📞 {listing.phone}</span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Moderation & Edit Actions */}
                        <div className="flex items-center gap-1.5 flex-wrap shrink-0">
                          {/* Approve / Confirm Button */}
                          {!isActive && (
                            <button
                              onClick={() => handleApproveListing(listing)}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-colors flex items-center gap-1 shadow-xs"
                              title="Confirm and mark listing as active & verified"
                            >
                              <CheckCircle className="w-3.5 h-3.5 stroke-[2.5]" />
                              <span>Confirm / Approve</span>
                            </button>
                          )}

                          {/* Reject Button */}
                          {!isRejected && (
                            <button
                              onClick={() => handleOpenRejectModal(listing)}
                              className="px-3 py-1.5 bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
                              title="Reject this submission"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Reject</span>
                            </button>
                          )}

                          {/* Reset to Under Review */}
                          {!isUnderReview && (
                            <button
                              onClick={() => handleResetToUnderReview(listing)}
                              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium border border-slate-700 transition-colors flex items-center gap-1"
                              title="Move back to Under Review"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Set Pending</span>
                            </button>
                          )}

                          {/* Edit Listing */}
                          <button
                            onClick={() => setEditingListing(listing)}
                            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium border border-slate-700 transition-colors"
                            title="Edit business details"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete Listing */}
                          <button
                            onClick={() => handleDeleteListing(listing)}
                            className="p-1.5 bg-slate-800 hover:bg-rose-600/30 text-rose-400 rounded-xl text-xs font-medium border border-slate-700 transition-colors"
                            title="Permanently delete listing"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Rejection notice if rejected */}
                      {isRejected && listing.rejectionReason && (
                        <div className="bg-rose-950/40 border border-rose-500/30 rounded-xl p-2.5 text-xs text-rose-200 flex items-start gap-2">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-400 mt-0.5 shrink-0" />
                          <span>
                            <strong>Rejection Note:</strong> {listing.rejectionReason}
                          </span>
                        </div>
                      )}

                      {/* Brief description */}
                      {listing.description && (
                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed bg-slate-950/40 p-2 rounded-lg">
                          {listing.description}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB: MANAGE MOHALLAS, MARKETS, CHAURAHAS & ROADS */}
        {/* ================================================================= */}
        {activeTab === 'locations' && (
          <AdminLocationsManager onToast={showToast} />
        )}

        {/* ================================================================= */}
        {/* TAB 3: MANAGE FULL WEBSITE CONTENT */}
        {/* ================================================================= */}
        {activeTab === 'content' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Content Sub-Navigation */}
            <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-800 pb-3 text-xs">
              <button
                onClick={() => setContentSubTab('announcement')}
                className={`px-3.5 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                  contentSubTab === 'announcement'
                    ? 'bg-amber-400 text-slate-950'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Megaphone className="w-3.5 h-3.5" />
                <span>Notice / Announcement Banner</span>
              </button>

              <button
                onClick={() => setContentSubTab('emergency')}
                className={`px-3.5 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                  contentSubTab === 'emergency'
                    ? 'bg-amber-400 text-slate-950'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Emergency Contacts ({emergencyContacts.length})</span>
              </button>

              <button
                onClick={() => setContentSubTab('blogs')}
                className={`px-3.5 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                  contentSubTab === 'blogs'
                    ? 'bg-amber-400 text-slate-950'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Town Blogs &amp; News ({blogs.length})</span>
              </button>

              <button
                onClick={() => setContentSubTab('town-info')}
                className={`px-3.5 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                  contentSubTab === 'town-info'
                    ? 'bg-amber-400 text-slate-950'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Civic Info &amp; Council</span>
              </button>
            </div>

            {/* Sub-Tab 1: Notice / Announcement Banner */}
            {contentSubTab === 'announcement' && (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Megaphone className="w-4 h-4 text-amber-400" />
                    <span>Top Notice &amp; Announcement Banner</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Manage the public banner displayed at the top of the Khairabad directory.
                  </p>
                </div>

                {/* Live Preview */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Live Banner Preview:
                  </span>
                  <div className={`p-3.5 rounded-2xl border text-xs flex items-center justify-between gap-3 ${
                    announcement.enabled
                      ? 'bg-amber-950/40 border-amber-500/40 text-amber-200'
                      : 'bg-slate-950 border-slate-800 text-slate-500'
                  }`}>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-amber-400 text-slate-950">
                        {announcement.badgeText || 'Notice'}
                      </span>
                      <span>{announcement.hindiText}</span>
                    </div>
                    {!announcement.enabled && (
                      <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
                        (Banner is currently Disabled)
                      </span>
                    )}
                  </div>
                </div>

                {/* Edit Form */}
                <form onSubmit={handleSaveAnnouncement} className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-slate-950/60 rounded-2xl border border-slate-800">
                    <input
                      type="checkbox"
                      id="announcementEnabled"
                      checked={announcement.enabled}
                      onChange={(e) => setAnnouncement({ ...announcement, enabled: e.target.checked })}
                      className="w-4 h-4 rounded text-amber-400 bg-slate-800 border-slate-700"
                    />
                    <label htmlFor="announcementEnabled" className="text-xs font-bold text-white cursor-pointer select-none">
                      Show Announcement Banner on public website
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Banner Badge Text
                      </label>
                      <input
                        type="text"
                        value={announcement.badgeText}
                        onChange={(e) => setAnnouncement({ ...announcement, badgeText: e.target.value })}
                        placeholder="e.g. Official Notice / अलर्ट / Festive Notice"
                        className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-xl p-2.5 outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Notice Type
                      </label>
                      <select
                        value={announcement.type}
                        onChange={(e) => setAnnouncement({ ...announcement, type: e.target.value as SiteAnnouncement['type'] })}
                        className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-xl p-2.5 outline-none focus:border-amber-400"
                      >
                        <option value="notice">Official Notice (Yellow/Amber)</option>
                        <option value="alert">Urgent Alert (Red/Warning)</option>
                        <option value="event">Town Event / Festival</option>
                        <option value="info">General Information</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Hindi Announcement Text
                    </label>
                    <textarea
                      rows={2}
                      value={announcement.hindiText}
                      onChange={(e) => setAnnouncement({ ...announcement, hindiText: e.target.value })}
                      placeholder="नागरिक सूचना या महत्वपूर्ण संदेश हिंदी में लिखें..."
                      className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-xl p-2.5 outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      English Announcement Text
                    </label>
                    <textarea
                      rows={2}
                      value={announcement.englishText}
                      onChange={(e) => setAnnouncement({ ...announcement, englishText: e.target.value })}
                      placeholder="Community message in English..."
                      className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-xl p-2.5 outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow-md"
                    >
                      <Save className="w-4 h-4 stroke-[2.5]" />
                      <span>Save Announcement Banner</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Sub-Tab 2: Emergency Helplines Manager */}
            {contentSubTab === 'emergency' && (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Phone className="w-4 h-4 text-rose-400" />
                      <span>Emergency Helplines &amp; Civic Services</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Add, edit, or remove emergency numbers (Police 112, CHC Khairabad, Fire, Nagar Palika).
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingEmergency({
                          id: `emg-${Date.now()}`,
                          title: '',
                          hindiTitle: '',
                          number: '',
                          description: '',
                          type: 'local',
                          timing: '24/7 Available',
                          category: 'health',
                        });
                        setIsAddEmergencyOpen(true);
                      }}
                      className="px-3.5 py-2 bg-rose-500 hover:bg-rose-400 text-white font-bold rounded-xl text-xs transition-colors shadow-md flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>+ Add New Helpline</span>
                    </button>

                    <button
                      onClick={() => {
                        if (window.confirm('Reset all emergency contacts to default town numbers?')) {
                          const defs = resetEmergencyContactsToDefault();
                          setEmergencyContacts(defs);
                          showToast('Emergency contacts reset to defaults.', 'info');
                        }
                      }}
                      className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs border border-slate-700"
                      title="Reset contacts to default"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Emergency Contacts List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {emergencyContacts.map((item) => (
                    <div
                      key={item.id}
                      className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex items-start justify-between gap-3 hover:border-slate-700 transition-colors"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-white truncate">{item.title}</h4>
                          <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.2 rounded font-semibold uppercase">
                            {item.type}
                          </span>
                        </div>
                        {item.hindiTitle && (
                          <p className="text-[11px] text-amber-300 font-medium">{item.hindiTitle}</p>
                        )}
                        <p className="text-sm font-mono font-bold text-emerald-400">{item.number}</p>
                        <p className="text-[11px] text-slate-400 line-clamp-2">{item.description}</p>
                        <span className="text-[10px] text-slate-500 block">⏰ {item.timing}</span>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => {
                            setEditingEmergency(item);
                            setIsAddEmergencyOpen(true);
                          }}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs"
                          title="Edit Contact"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteEmergencyContact(item.id, item.title)}
                          className="p-1.5 bg-slate-800 hover:bg-rose-500/20 text-rose-400 rounded-lg text-xs"
                          title="Delete Contact"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sub-Tab 3: Blogs & News Articles Manager */}
            {contentSubTab === 'blogs' && (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <FileText className="w-4 h-4 text-amber-400" />
                      <span>Town Heritage Articles &amp; News Guides</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Manage articles on historical figures, monuments (Badi Sangat, Dargahs), and local news.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setEditingBlog({
                        id: `blog-${Date.now()}`,
                        title: '',
                        slug: `article-${Date.now()}`,
                        category: 'Heritage & Spiritual',
                        excerpt: '',
                        content: [''],
                        keyHighlights: [''],
                        visitorInfo: {
                          location: 'Khairabad, Sitapur, UP',
                          timings: 'Open Daily',
                          bestTimeToVisit: 'All year',
                          entryFee: 'Free',
                        },
                        readTime: '3 min read',
                        publishDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
                        author: 'Khairabad Editorial Desk',
                        image: '/images/babbu_hotel_khairabad_1791570399551.jpg',
                        tags: ['Khairabad', 'Guide'],
                      });
                      setIsAddBlogOpen(true);
                    }}
                    className="px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs transition-colors shadow-md flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                    <span>+ Write New Article</span>
                  </button>
                </div>

                {/* Articles List */}
                <div className="space-y-3">
                  {blogs.map((blog) => (
                    <div
                      key={blog.id}
                      className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-slate-700 transition-colors"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded uppercase">
                            {blog.category}
                          </span>
                          <span className="text-[11px] text-slate-500">· {blog.readTime}</span>
                        </div>
                        <h4 className="text-sm font-bold text-white line-clamp-1">{blog.title}</h4>
                        <p className="text-xs text-slate-400 line-clamp-2">{blog.excerpt}</p>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <a
                          href={`/?view=blog&blog=${encodeURIComponent(blog.slug || blog.id)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1.5 bg-slate-800 hover:bg-amber-400 hover:text-slate-950 text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
                          title="View and share article live on website"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>View &amp; Share</span>
                        </a>
                        <button
                          onClick={() => {
                            setEditingBlog(blog);
                            setIsAddBlogOpen(true);
                          }}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteBlog(blog.id, blog.title)}
                          className="p-1.5 bg-slate-800 hover:bg-rose-500/20 text-rose-400 rounded-xl text-xs"
                          title="Delete article"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sub-Tab 4: Civic Info & Council Details */}
            {contentSubTab === 'town-info' && (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-amber-400" />
                    <span>Nagar Palika Parishad &amp; Civic Town Information</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Update Khairabad municipal statistics, government leadership names, and official contacts.
                  </p>
                </div>

                <form onSubmit={handleSaveTownInfo} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Council Chairperson
                      </label>
                      <input
                        type="text"
                        value={townInfo.chairperson}
                        onChange={(e) => setTownInfo({ ...townInfo, chairperson: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-xl p-2.5 outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Chairperson Party
                      </label>
                      <input
                        type="text"
                        value={townInfo.chairpersonParty}
                        onChange={(e) => setTownInfo({ ...townInfo, chairpersonParty: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-xl p-2.5 outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Lok Sabha Member of Parliament (MP)
                      </label>
                      <input
                        type="text"
                        value={townInfo.mpName}
                        onChange={(e) => setTownInfo({ ...townInfo, mpName: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-xl p-2.5 outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Town Population
                      </label>
                      <input
                        type="text"
                        value={townInfo.population}
                        onChange={(e) => setTownInfo({ ...townInfo, population: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-xl p-2.5 outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        PIN Code
                      </label>
                      <input
                        type="text"
                        value={townInfo.pinCode}
                        onChange={(e) => setTownInfo({ ...townInfo, pinCode: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-xl p-2.5 outline-none focus:border-amber-400 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Official Website
                      </label>
                      <input
                        type="text"
                        value={townInfo.website}
                        onChange={(e) => setTownInfo({ ...townInfo, website: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-xl p-2.5 outline-none focus:border-amber-400 font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow-md"
                    >
                      <Save className="w-4 h-4 stroke-[2.5]" />
                      <span>Save Municipal Information</span>
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 4: CUSTOMER REVIEWS MODERATION */}
        {/* ================================================================= */}
        {activeTab === 'reviews' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 flex items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span>Customer Reviews &amp; Ratings Moderation</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Manage ratings submitted by town residents. Delete spam or abusive reviews.
                </p>
              </div>
              <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-xl font-bold">
                {reviews.length} Total Review{reviews.length === 1 ? '' : 's'}
              </span>
            </div>

            {reviews.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-2">
                <Star className="w-8 h-8 text-slate-600 mx-auto" />
                <h4 className="text-sm font-bold text-white">No customer reviews yet</h4>
                <p className="text-xs text-slate-400">
                  Customer feedback submitted through listing detail pages will appear here for admin moderation.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {reviews.map((rev) => {
                  const targetListing = adminListings.find((l) => l.id === rev.listingId);
                  return (
                    <div
                      key={rev.id}
                      className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">{rev.authorName}</span>
                          <span className="text-[11px] text-amber-400 font-bold flex items-center">
                            {'★'.repeat(rev.rating)}
                            <span className="text-slate-600">{'★'.repeat(5 - rev.rating)}</span>
                          </span>
                          <span className="text-[10px] text-slate-500">· {rev.date}</span>
                        </div>
                        {targetListing && (
                          <p className="text-[11px] text-amber-300 font-medium">
                            On: <strong>{targetListing.name}</strong> ({targetListing.locality})
                          </p>
                        )}
                        <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                          &ldquo;{rev.comment}&rdquo;
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {onDeleteReview && (
                          <button
                            type="button"
                            onClick={() => {
                              onDeleteReview(rev.id);
                              showToast('Review deleted successfully.', 'info');
                            }}
                            className="px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white border border-rose-500/30 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete Review</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 5: ADMIN SECURITY & DATABASE SETTINGS */}
        {/* ================================================================= */}
        {activeTab === 'settings' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Credentials Change Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Key className="w-4 h-4 text-amber-400" />
                  <span>Change Admin User ID &amp; Password</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Update your credentials for logging into the Admin Palace.
                </p>
              </div>

              {securityMessage && (
                <div
                  className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                    securityMessage.type === 'success'
                      ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
                      : 'bg-rose-500/15 border border-rose-500/30 text-rose-300'
                  }`}
                >
                  {securityMessage.type === 'success' ? (
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  )}
                  <span>{securityMessage.text}</span>
                </div>
              )}

              <form onSubmit={handleUpdateSecurity} className="space-y-4 max-w-lg">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    New Admin User ID (leave blank to keep current)
                  </label>
                  <input
                    type="text"
                    value={newUserId}
                    onChange={(e) => setNewUserId(e.target.value)}
                    placeholder="Enter new admin username"
                    className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-xl p-2.5 outline-none focus:border-amber-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password (min. 6 characters)"
                    required
                    className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-xl p-2.5 outline-none focus:border-amber-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-type new password"
                    required
                    className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-xl p-2.5 outline-none focus:border-amber-400 font-mono"
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow-md"
                  >
                    <Save className="w-4 h-4 stroke-[2.5]" />
                    <span>Save New Password</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleResetCreds}
                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold border border-slate-700 transition-colors"
                  >
                    Reset to Default Credentials
                  </button>
                </div>
              </form>
            </div>

            {/* Cloud Database (Supabase) Management */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Database className="w-4 h-4 text-emerald-400" />
                    <span>Supabase Cloud Database Synchronization</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Connected to Supabase Project: <code className="text-amber-300 font-mono">vyyuvanyyexkdnjmhkdz</code>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleTestSupabase}
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition-colors"
                >
                  Test Connection
                </button>
              </div>

              {supabaseStatus && (
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 font-mono">
                  {supabaseStatus}
                </div>
              )}

              <div className="pt-2">
                <button
                  onClick={handleSyncAllToSupabase}
                  disabled={isSyncingAll}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-colors flex items-center gap-2 shadow-md disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncingAll ? 'animate-spin' : ''}`} />
                  <span>{isSyncingAll ? 'Pushing to Supabase...' : 'Sync All Listings to Supabase Cloud'}</span>
                </button>
              </div>
            </div>

            {/* Full Website Backup Export */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Download className="w-4 h-4 text-sky-400" />
                <span>Backup &amp; Export Directory Data</span>
              </h3>
              <p className="text-xs text-slate-400">
                Download a complete JSON snapshot of all {adminListings.length} listings, emergency numbers, and blogs for offline safekeeping.
              </p>
              <button
                onClick={() => {
                  const backupData = {
                    version: '1.0',
                    exportDate: new Date().toISOString(),
                    listings: adminListings,
                    emergencyContacts,
                    blogs,
                    announcement,
                    townInfo,
                    reviews,
                  };
                  const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `khairabad-directory-backup-${new Date().toISOString().slice(0, 10)}.json`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                  showToast('Directory backup downloaded successfully!', 'success');
                }}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Full Backup (JSON)</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* ================================================================= */}
      {/* REJECTION REASON MODAL */}
      {/* ================================================================= */}
      {rejectingListing && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-2 text-rose-400">
              <XCircle className="w-5 h-5" />
              <h3 className="text-base font-bold text-white">Reject Listing</h3>
            </div>

            <p className="text-xs text-slate-300">
              You are rejecting <strong>&ldquo;{rejectingListing.name}&rdquo;</strong>. Please provide a reason so the listing status is clear:
            </p>

            <textarea
              rows={3}
              value={rejectionReasonInput}
              onChange={(e) => setRejectionReasonInput(e.target.value)}
              placeholder="e.g. Incomplete address, unverified contact number, duplicate entry, or commercial spam."
              className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-xl p-3 outline-none focus:border-rose-400"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRejectingListing(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* ADMIN EDIT / ADD LISTING MODAL */}
      {/* ================================================================= */}
      {(editingListing || isAddListingModalOpen) && (
        <AdminListingFormModal
          listing={
            editingListing || {
              id: `kh-user-${Date.now()}`,
              name: '',
              category: 'hospitals',
              subcategory: '',
              locality: 'Sitapur Road',
              roadName: '',
              mohalla: '',
              address: '',
              phone: '',
              whatsapp: '',
              website: '',
              openingHours: '9:00 AM – 8:00 PM',
              description: '',
              services: [],
              images: [],
              googleMapsUrl: '',
              verified: true,
              status: 'active',
              isDemo: false,
            }
          }
          isNew={isAddListingModalOpen}
          onClose={() => {
            setEditingListing(null);
            setIsAddListingModalOpen(false);
          }}
          onSave={(saved) => {
            adminUpdateListing(saved);
            refreshListings();
            setEditingListing(null);
            setIsAddListingModalOpen(false);
            showToast(`Listing "${saved.name}" saved successfully!`, 'success');
          }}
        />
      )}

      {/* ================================================================= */}
      {/* EMERGENCY CONTACT EDIT / ADD MODAL */}
      {/* ================================================================= */}
      {isAddEmergencyOpen && editingEmergency && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Phone className="w-4 h-4 text-rose-400" />
              <span>{editingEmergency.title ? 'Edit Emergency Contact' : 'Add New Emergency Helpline'}</span>
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Title (English)</label>
                <input
                  type="text"
                  value={editingEmergency.title}
                  onChange={(e) => setEditingEmergency({ ...editingEmergency, title: e.target.value })}
                  placeholder="e.g. CHC Khairabad Emergency OPD"
                  className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-xl p-2.5 outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Hindi Title</label>
                <input
                  type="text"
                  value={editingEmergency.hindiTitle || ''}
                  onChange={(e) => setEditingEmergency({ ...editingEmergency, hindiTitle: e.target.value })}
                  placeholder="e.g. सामुदायिक स्वास्थ्य केंद्र खैराबाद"
                  className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-xl p-2.5 outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={editingEmergency.number}
                  onChange={(e) => setEditingEmergency({ ...editingEmergency, number: e.target.value })}
                  placeholder="e.g. 05862-252100 or 112"
                  className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-xl p-2.5 outline-none focus:border-amber-400 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Service Level</label>
                  <select
                    value={editingEmergency.type}
                    onChange={(e) => setEditingEmergency({ ...editingEmergency, type: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-xl p-2.5 outline-none focus:border-amber-400"
                  >
                    <option value="local">Local (Khairabad)</option>
                    <option value="state">State (UP Level)</option>
                    <option value="national">National (India)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Availability</label>
                  <input
                    type="text"
                    value={editingEmergency.timing}
                    onChange={(e) => setEditingEmergency({ ...editingEmergency, timing: e.target.value })}
                    placeholder="24/7 Available"
                    className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-xl p-2.5 outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingEmergency.description}
                  onChange={(e) => setEditingEmergency({ ...editingEmergency, description: e.target.value })}
                  placeholder="Details about this emergency service..."
                  className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-xl p-2.5 outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddEmergencyOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!editingEmergency.title || !editingEmergency.number) {
                    alert('Title and Phone Number are required.');
                    return;
                  }
                  handleSaveEmergencyContact(editingEmergency);
                }}
                className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-bold transition-colors"
              >
                Save Helpline
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* BLOG EDIT / ADD MODAL */}
      {/* ================================================================= */}
      {isAddBlogOpen && editingBlog && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-2xl w-full space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-400" />
              <span>{editingBlog.title ? 'Edit Heritage Article' : 'Write New Town Article'}</span>
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Article Title</label>
                <input
                  type="text"
                  value={editingBlog.title}
                  onChange={(e) => setEditingBlog({ ...editingBlog, title: e.target.value })}
                  placeholder="e.g. Badi Sangat Khairabad: The Sacred 400-Year Spiritual Pilgrimage"
                  className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-xl p-2.5 outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    value={editingBlog.category}
                    onChange={(e) => setEditingBlog({ ...editingBlog, category: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-xl p-2.5 outline-none focus:border-amber-400"
                  >
                    <option value="Heritage & Spiritual">Heritage &amp; Spiritual</option>
                    <option value="History & Figures">History &amp; Figures</option>
                    <option value="Civic & Landmarks">Civic &amp; Landmarks</option>
                    <option value="Culture & Crafts">Culture &amp; Crafts</option>
                    <option value="Food & Lifestyle">Food &amp; Lifestyle</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Read Time</label>
                  <input
                    type="text"
                    value={editingBlog.readTime}
                    onChange={(e) => setEditingBlog({ ...editingBlog, readTime: e.target.value })}
                    placeholder="e.g. 4 min read"
                    className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-xl p-2.5 outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Excerpt / Summary</label>
                <textarea
                  rows={2}
                  value={editingBlog.excerpt}
                  onChange={(e) => setEditingBlog({ ...editingBlog, excerpt: e.target.value })}
                  placeholder="Short introductory summary for card view..."
                  className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-xl p-2.5 outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Content Paragraphs (separated by double newline)
                </label>
                <textarea
                  rows={6}
                  value={editingBlog.content.join('\n\n')}
                  onChange={(e) =>
                    setEditingBlog({
                      ...editingBlog,
                      content: e.target.value.split('\n\n').filter((p) => p.trim()),
                    })
                  }
                  placeholder="Write full article body paragraphs here..."
                  className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-xl p-2.5 outline-none focus:border-amber-400 font-sans"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsAddBlogOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!editingBlog.title || !editingBlog.excerpt) {
                    alert('Title and Excerpt are required.');
                    return;
                  }
                  handleSaveBlog(editingBlog);
                }}
                className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-bold transition-colors"
              >
                Publish Article
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// =========================================================================
// ADMIN LISTING FULL FORM MODAL
// =========================================================================
interface AdminListingFormModalProps {
  listing: CityListing;
  isNew: boolean;
  onClose: () => void;
  onSave: (listing: CityListing) => void;
}

const AdminListingFormModal: React.FC<AdminListingFormModalProps> = ({
  listing,
  isNew,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<CityListing>({ ...listing });
  const [servicesInput, setServicesInput] = useState(listing.services.join(', '));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Business or Place Name is required.');
      return;
    }

    const services = servicesInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const finalized: CityListing = {
      ...formData,
      services: services.length > 0 ? services : ['Local Service'],
      status: formData.status || 'active',
      verified: formData.status === 'active' ? true : formData.verified,
    };

    onSave(finalized);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-2xl w-full space-y-5 shadow-2xl max-h-[92vh] overflow-y-auto animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-amber-400" />
              <span>{isNew ? '+ Add New Place Listing (Admin)' : `Edit Listing: ${listing.name}`}</span>
            </h3>
            <p className="text-xs text-slate-400">Directly adjust fields and verification status.</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 text-xs">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Business / Place Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-xl p-2.5 outline-none focus:border-amber-400 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as CategoryId })}
                className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-xl p-2.5 outline-none focus:border-amber-400"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Subcategory / Tag</label>
              <input
                type="text"
                value={formData.subcategory}
                onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                placeholder="e.g. Diagnostic Center / Awadhi Restaurant"
                className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-xl p-2.5 outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Locality Area</label>
              <select
                value={formData.locality}
                onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-xl p-2.5 outline-none focus:border-amber-400"
              >
                {LOCALITIES.map((loc) => (
                  <option key={loc.id} value={loc.name}>
                    {loc.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Road Name</label>
              <input
                type="text"
                value={formData.roadName || ''}
                onChange={(e) => setFormData({ ...formData, roadName: e.target.value })}
                placeholder="e.g. NH-24 / BCM Road / Post Office Road"
                className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-xl p-2.5 outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Mohalla / Ward</label>
              <input
                type="text"
                value={formData.mohalla || ''}
                onChange={(e) => setFormData({ ...formData, mohalla: e.target.value })}
                placeholder="e.g. Joshitola / Sujawalpur / Katra"
                className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-xl p-2.5 outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="e.g. +91 9876543210"
                className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-xl p-2.5 outline-none focus:border-amber-400 font-mono"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Street Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Shop number, landmark, Khairabad PIN 261131"
                className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-xl p-2.5 outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Opening Hours</label>
              <input
                type="text"
                value={formData.openingHours}
                onChange={(e) => setFormData({ ...formData, openingHours: e.target.value })}
                placeholder="e.g. 9:00 AM – 8:00 PM (Mon-Sat)"
                className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-xl p-2.5 outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Moderation Status</label>
              <select
                value={formData.status || 'active'}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as CityListing['status'],
                    verified: e.target.value === 'active',
                  })
                }
                className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-xl p-2.5 outline-none focus:border-amber-400 font-bold"
              >
                <option value="active">Active &amp; Approved (सत्यापित व स्वीकृत)</option>
                <option value="under-review">Under Review (समीक्षाधीन)</option>
                <option value="rejected">Rejected (अस्वीकृत)</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">Services / Highlights (comma separated)</label>
              <input
                type="text"
                value={servicesInput}
                onChange={(e) => setServicesInput(e.target.value)}
                placeholder="e.g. 24/7 Emergency, Blood Tests, Free Parking"
                className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-xl p-2.5 outline-none focus:border-amber-400"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Comprehensive description of place or business..."
                className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-xl p-2.5 outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-bold transition-colors shadow-md flex items-center gap-1.5"
            >
              <Save className="w-4 h-4 stroke-[2.5]" />
              <span>Save Listing</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
