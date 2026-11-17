import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../supabase';
import './AdminDashboard.css';

const INITIAL_BLOGS = [
  {
    id: 1,
    title: 'Building a Personal Brand',
    thumb: '/images/blog-1.jpg',
    author: 'Margaret',
    avatar: '/images/testimonial-1.jpg',
    is_admin_icon: false,
    read_time: '5 min read',
    publish_date: '16 May, 10:42 AM',
    status: 'Published',
  },
  {
    id: 2,
    title: 'Introduction to AI Ethics',
    thumb: '/images/blog-2.jpg',
    author: 'John Doe',
    avatar: '/images/testimonial-2.jpg',
    is_admin_icon: false,
    read_time: '8 min read',
    publish_date: '16 May, 10:15 AM',
    status: 'Published',
  },
  {
    id: 3,
    title: 'Intro to Data Analysis',
    thumb: '/images/blog-3.jpg',
    author: 'Admin',
    avatar: null,
    is_admin_icon: true,
    read_time: '8 min read',
    publish_date: '14 May, 09:30 AM',
    status: 'Draft',
  },
  {
    id: 4,
    title: 'Designing for Accessibility',
    thumb: '/images/blog-4.jpg',
    author: 'Alice Smith',
    avatar: '/images/testimonial-3.jpg',
    is_admin_icon: false,
    read_time: '6 min read',
    publish_date: '12 May, 11:58 PM',
    status: 'Scheduled',
  },
  {
    id: 5,
    title: 'Modern UI Design Tips',
    thumb: '/images/about-campus.jpg',
    author: 'Bob Johnson',
    avatar: '/images/testimonial-4.jpg',
    is_admin_icon: false,
    read_time: '4 min read',
    publish_date: '10 May, 08:14 PM',
    status: 'Published',
  },
];

const INITIAL_VIDEOS = [
  {
    id: 1,
    title: 'Mastering FastAPI',
    thumb: '/images/blog-2.jpg',
    host: 'John Doe',
    avatar: '/images/testimonial-2.jpg',
    is_admin_icon: false,
    duration: '45 mins',
    session_date: '16 May, 10:15 AM',
    status: 'Published',
  },
  {
    id: 2,
    title: 'Live Q&A: AI Trends',
    thumb: '/images/blog-3.jpg',
    host: 'Alice Smith',
    avatar: '/images/testimonial-3.jpg',
    is_admin_icon: false,
    duration: '60 mins',
    session_date: '12 May, 11:58 PM',
    status: 'Scheduled',
  },
  {
    id: 3,
    title: 'Python for Beginners',
    thumb: '/images/blog-4.jpg',
    host: 'Admin',
    avatar: null,
    is_admin_icon: true,
    duration: '90 mins',
    session_date: '10 May, 03:00 PM',
    status: 'Published',
  },
  {
    id: 4,
    title: 'Building Agentic AI',
    thumb: '/images/blog-1.jpg',
    host: 'Margaret',
    avatar: '/images/testimonial-1.jpg',
    is_admin_icon: false,
    duration: '30 mins',
    session_date: '08 May, 01:20 PM',
    status: 'Draft',
  },
  {
    id: 5,
    title: 'Industry Tech Talk',
    thumb: '/images/about-interview.png',
    host: 'Bob Johnson',
    avatar: '/images/testimonial-4.jpg',
    is_admin_icon: false,
    duration: '50 mins',
    session_date: '05 May, 06:45 PM',
    status: 'Published',
  },
];

const DEFAULT_BLOG_IMAGES = [
  '/images/blog-1.jpg',
  '/images/blog-2.jpg',
  '/images/blog-3.jpg',
];

const DEFAULT_ARTICLE_CONTENT =
  'Choosing the perfect university is a life-changing decision that goes far beyond global rankings and prestige. Our expert advisors and realing prestiges. expert advisors evaluate learning style, anvmystyle, faculty mentorship, and career placement.';

function formatNowShort() {
  const now = new Date();
  return now.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

export default function AdminDashboard() {
  const { adminUser, logout } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const contentAreaRef = useRef(null);

  const [activeTab, setActiveTab] = useState('blogs'); // 'blogs' | 'videos'
  const [isCreatingBlog, setIsCreatingBlog] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [blogs, setBlogs] = useState(INITIAL_BLOGS);
  const [videos, setVideos] = useState(INITIAL_VIDEOS);
  const [dbLoading, setDbLoading] = useState(false);
  const [dbNotice, setDbNotice] = useState('');

  // Create New Blog full-page state
  const [blogTitle, setBlogTitle] = useState('');
  const [blogCategory, setBlogCategory] = useState('');
  const [blogDate, setBlogDate] = useState('16 May, 2023');
  const [blogContent, setBlogContent] = useState(DEFAULT_ARTICLE_CONTENT);
  const [blogImages, setBlogImages] = useState(DEFAULT_BLOG_IMAGES);
  const [isPublishingBlog, setIsPublishingBlog] = useState(false);

  // Create New Video modal state
  const [showAddVideoModal, setShowAddVideoModal] = useState(false);
  const [isSavingVideo, setIsSavingVideo] = useState(false);
  const [newVideoTitle, setNewVideoTitle] = useState('');
  const [newVideoHost, setNewVideoHost] = useState('');
  const [newVideoDuration, setNewVideoDuration] = useState('');
  const [newVideoStatus, setNewVideoStatus] = useState('Published');

  const displayName = useMemo(() => {
    if (!adminUser?.name || adminUser.name === 'Administrator') {
      return 'Margaret';
    }
    const raw = adminUser.name;
    return raw.charAt(0).toUpperCase() + raw.slice(1);
  }, [adminUser]);

  const fetchSupabaseData = useCallback(async () => {
    if (!supabase) return;
    setDbLoading(true);
    setDbNotice('');

    try {
      const { data: blogsData, error: blogsError } = await supabase
        .from('blogs')
        .select('*')
        .order('id', { ascending: false });

      if (blogsError) {
        setDbNotice('Supabase connected — run supabase_schema.sql in Supabase SQL Editor to create tables.');
      } else if (blogsData && blogsData.length > 0) {
        setBlogs(blogsData);
      } else if (blogsData && blogsData.length === 0) {
        const seedPayload = INITIAL_BLOGS.map(({ id: _id, ...rest }) => rest);
        const { data: seededBlogs } = await supabase.from('blogs').insert(seedPayload).select();
        if (seededBlogs?.length) setBlogs(seededBlogs);
      }

      const { data: videosData, error: videosError } = await supabase
        .from('videos')
        .select('*')
        .order('id', { ascending: false });

      if (!videosError) {
        if (videosData && videosData.length > 0) {
          setVideos(videosData);
        } else if (videosData && videosData.length === 0) {
          const seedVideosPayload = INITIAL_VIDEOS.map(({ id: _id, ...rest }) => rest);
          const { data: seededVideos } = await supabase.from('videos').insert(seedVideosPayload).select();
          if (seededVideos?.length) setVideos(seededVideos);
        }
      }
    } catch {
      // Keep fallback rows
    } finally {
      setDbLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSupabaseData();
  }, [fetchSupabaseData]);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login', { replace: true });
  };

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    setIsCreatingBlog(false);
    setSearchQuery('');
    setStatusFilter('All Status');
  };

  const filteredBlogs = useMemo(() => {
    return blogs.filter((item) => {
      const title = item.title || '';
      const author = item.author || '';
      const matchesSearch =
        title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        author.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'All Status' || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [blogs, searchQuery, statusFilter]);

  const filteredVideos = useMemo(() => {
    return videos.filter((item) => {
      const title = item.title || '';
      const host = item.host || '';
      const matchesSearch =
        title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        host.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'All Status' || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [videos, searchQuery, statusFilter]);

  // Image upload handlers for Create New Blog
  const handleFilesSelected = (files) => {
    if (!files || !files.length) return;
    const newUrls = Array.from(files).map((file) => URL.createObjectURL(file));
    setBlogImages((prev) => [...prev, ...newUrls]);
  };

  const handleRemoveBlogImage = (indexToRemove) => {
    setBlogImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleFormatToolbar = (type) => {
    const textarea = contentAreaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = blogContent.slice(start, end);

    let replacement = selected;
    if (type === 'bold') replacement = `**${selected || 'bold text'}**`;
    else if (type === 'italic') replacement = `*${selected || 'italic text'}*`;
    else if (type === 'heading') replacement = `\n### ${selected || 'Heading'}\n`;
    else if (type === 'list') replacement = `\n• ${selected || 'List item'}`;
    else if (type === 'link') replacement = `[${selected || 'link text'}](https://)`;

    const updated = blogContent.slice(0, start) + replacement + blogContent.slice(end);
    setBlogContent(updated);
    textarea.focus();
  };

  const handleOpenCreateBlog = () => {
    setBlogTitle('');
    setBlogCategory('');
    setBlogDate('16 May, 2023');
    setBlogContent(DEFAULT_ARTICLE_CONTENT);
    setBlogImages(DEFAULT_BLOG_IMAGES);
    setIsCreatingBlog(true);
  };

  const handlePublishNewBlog = async () => {
    const finalTitle = blogTitle.trim() || 'Finding the Right University: A Strategic Approach';
    const finalThumb = blogImages[0] || '/images/blog-1.jpg';
    const wordsCount = blogContent.trim().split(/\s+/).filter(Boolean).length;
    const estimatedMins = Math.max(3, Math.ceil(wordsCount / 40));

    const basePayload = {
      title: finalTitle,
      thumb: finalThumb,
      author: displayName,
      avatar: '/images/testimonial-1.jpg',
      is_admin_icon: false,
      read_time: `${estimatedMins} min read`,
      publish_date: blogDate.trim() || formatNowShort(),
      status: 'Published',
    };

    const extendedPayload = {
      ...basePayload,
      category: blogCategory.trim() || 'University Guide',
      content: blogContent,
    };

    setIsPublishingBlog(true);

    if (supabase) {
      let { data, error } = await supabase
        .from('blogs')
        .insert([extendedPayload])
        .select()
        .single();

      // Fallback if category/content columns aren't added yet in existing table
      if (error) {
        const retry = await supabase.from('blogs').insert([basePayload]).select().single();
        data = retry.data;
        error = retry.error;
      }

      if (!error && data) {
        setBlogs((prev) => [data, ...prev]);
      } else {
        setBlogs((prev) => [{ id: Date.now(), ...extendedPayload }, ...prev]);
      }
    } else {
      setBlogs((prev) => [{ id: Date.now(), ...extendedPayload }, ...prev]);
    }

    setIsPublishingBlog(false);
    setIsCreatingBlog(false);
  };

  const handleAddVideo = async (e) => {
    e.preventDefault();
    if (!newVideoTitle.trim()) return;

    setIsSavingVideo(true);
    const nowStr = formatNowShort();

    const newVideoPayload = {
      title: newVideoTitle.trim(),
      thumb: '/images/blog-2.jpg',
      host: newVideoHost.trim() || displayName,
      avatar: '/images/testimonial-2.jpg',
      is_admin_icon: false,
      duration: newVideoDuration.trim() || '45 mins',
      session_date: nowStr,
      status: newVideoStatus,
    };

    if (supabase) {
      const { data, error } = await supabase
        .from('videos')
        .insert([newVideoPayload])
        .select()
        .single();

      if (!error && data) {
        setVideos((prev) => [data, ...prev]);
      } else {
        setVideos((prev) => [{ id: Date.now(), ...newVideoPayload }, ...prev]);
      }
    } else {
      setVideos((prev) => [{ id: Date.now(), ...newVideoPayload }, ...prev]);
    }

    setIsSavingVideo(false);
    setNewVideoTitle('');
    setNewVideoHost('');
    setNewVideoDuration('');
    setNewVideoStatus('Published');
    setShowAddVideoModal(false);
  };

  const handleCycleStatus = async (item, table) => {
    const order = ['Published', 'Scheduled', 'Draft'];
    const nextStatus = order[(order.indexOf(item.status) + 1) % order.length];

    if (table === 'blogs') {
      setBlogs((prev) =>
        prev.map((b) => (b.id === item.id ? { ...b, status: nextStatus } : b))
      );
    } else {
      setVideos((prev) =>
        prev.map((v) => (v.id === item.id ? { ...v, status: nextStatus } : v))
      );
    }

    if (supabase) {
      await supabase.from(table).update({ status: nextStatus }).eq('id', item.id);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Published':
        return 'status-published';
      case 'Scheduled':
        return 'status-scheduled';
      case 'Draft':
        return 'status-draft';
      default:
        return 'status-published';
    }
  };

  const previewTitle = blogTitle.trim() || 'Finding the Right University: A Strategic Approach';
  const previewCategory = blogCategory.trim() || 'University Guide';
  const previewDate = blogDate.trim() || '16 May, 2023';
  const previewImage = blogImages[0] || '/images/blog-1.jpg';
  const previewExcerpt =
    blogContent.trim().length > 92
      ? `${blogContent.trim().slice(0, 92)}...`
      : blogContent.trim() ||
        'Choosing the perfect university is a life-changing decision that goes far...';

  return (
    <div className="logip-admin-viewport">
      <div className="logip-admin-shell">
        {/* LEFT SIDEBAR */}
        <aside className="logip-sidebar">
          <div className="logip-brand">
            <svg width="26" height="26" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="8" cy="8" r="2.8" fill="#111827" />
              <circle cx="17" cy="6" r="2.8" fill="#111827" />
              <circle cx="7" cy="17" r="2.8" fill="#111827" />
              <circle cx="15" cy="15" r="2.8" fill="#111827" />
              <circle cx="22" cy="13" r="2.8" fill="#111827" />
              <circle cx="6" cy="24" r="2.4" fill="#111827" />
              <circle cx="14" cy="23" r="2.6" fill="#111827" />
              <path
                d="M8 8L15 15M17 6L15 15M7 17L15 15M22 13L15 15M7 17L6 24M15 15L14 23"
                stroke="#111827"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
            </svg>
            <span className="logip-brand-text">logip</span>
          </div>

          <nav className="logip-nav">
            <Link to="/" className="logip-nav-item">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9.5z" />
              </svg>
              <span>Home</span>
            </Link>

            <button
              type="button"
              className={`logip-nav-item ${activeTab === 'blogs' ? 'active' : ''}`}
              onClick={() => handleTabSwitch('blogs')}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="8" y1="13" x2="16" y2="13" />
                <line x1="8" y1="17" x2="13" y2="17" />
              </svg>
              <span>Blogs</span>
            </button>

            <button
              type="button"
              className={`logip-nav-item ${activeTab === 'videos' ? 'active' : ''}`}
              onClick={() => handleTabSwitch('videos')}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="2" y="5" width="15" height="14" rx="2" />
                <polygon points="8 9.5 12.5 12 8 14.5 8 9.5" fill="currentColor" stroke="none" />
                <path d="M17 9.5l5-2.5v10l-5-2.5" />
              </svg>
              <span>Videos</span>
            </button>
          </nav>

          <div className="logip-sidebar-bottom">
            <button type="button" className="logip-bottom-link" onClick={fetchSupabaseData}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              <span>{dbLoading ? 'Syncing Supabase...' : 'Help & Information'}</span>
            </button>

            <button type="button" className="logip-bottom-link" onClick={handleLogout}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 16 16 12 12 8" />
                <line x1="8" y1="12" x2="16" y2="12" />
              </svg>
              <span>Log out</span>
            </button>
          </div>
        </aside>

        {/* MAIN PANEL */}
        {activeTab === 'blogs' && isCreatingBlog ? (
          /* CREATE NEW BLOG FULL-PAGE VIEW (matches reference image) */
          <section className="logip-main logip-create-blog-main">
            <button
              type="button"
              className="logip-back-to-blogs"
              onClick={() => setIsCreatingBlog(false)}
            >
              <span>&larr;</span>
              <span>Back to Blogs</span>
            </button>

            <div className="logip-create-header">
              <div>
                <h1 className="logip-create-title">Create New Blog</h1>
                <p className="logip-create-subtitle">
                  Write and publish a new article for your blog feed.
                </p>
              </div>

              <div className="logip-create-actions">
                <button
                  type="button"
                  className="logip-cancel-pill"
                  onClick={() => setIsCreatingBlog(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="logip-publish-pill"
                  onClick={handlePublishNewBlog}
                  disabled={isPublishingBlog}
                >
                  {isPublishingBlog ? 'Publishing...' : 'Publish Blog'}
                </button>
              </div>
            </div>

            <div className="logip-create-grid">
              {/* LEFT EDITOR COLUMN */}
              <div className="logip-create-left">
                <div className="logip-field-group">
                  <label htmlFor="blog-title-input">Blog Title</label>
                  <input
                    id="blog-title-input"
                    type="text"
                    className="logip-pill-input"
                    value={blogTitle}
                    onChange={(e) => setBlogTitle(e.target.value)}
                    placeholder="e.g., Finding the Right University: A Strategic Approach"
                  />
                </div>

                <div className="logip-field-group">
                  <label htmlFor="blog-category-input">Category / Tag</label>
                  <input
                    id="blog-category-input"
                    type="text"
                    className="logip-pill-input"
                    value={blogCategory}
                    onChange={(e) => setBlogCategory(e.target.value)}
                    placeholder="e.g., University Guide"
                  />
                </div>

                <div className="logip-field-group logip-editor-group">
                  <label htmlFor="blog-content-area">Article Content</label>
                  <div className="logip-rich-editor">
                    <div className="logip-editor-toolbar">
                      <button
                        type="button"
                        className="logip-tool-btn tool-bold"
                        onClick={() => handleFormatToolbar('bold')}
                        title="Bold"
                      >
                        B
                      </button>
                      <button
                        type="button"
                        className="logip-tool-btn tool-italic"
                        onClick={() => handleFormatToolbar('italic')}
                        title="Italic"
                      >
                        I
                      </button>
                      <button
                        type="button"
                        className="logip-tool-btn tool-heading"
                        onClick={() => handleFormatToolbar('heading')}
                        title="Heading"
                      >
                        Ha
                      </button>
                      <button
                        type="button"
                        className="logip-tool-btn"
                        onClick={() => handleFormatToolbar('list')}
                        title="Bullet List"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="8" y1="6" x2="21" y2="6" />
                          <line x1="8" y1="12" x2="21" y2="12" />
                          <line x1="8" y1="18" x2="21" y2="18" />
                          <line x1="3" y1="6" x2="3.01" y2="6" />
                          <line x1="3" y1="12" x2="3.01" y2="12" />
                          <line x1="3" y1="18" x2="3.01" y2="18" />
                        </svg>
                      </button>
                      <span className="logip-toolbar-divider" aria-hidden="true"></span>
                      <button
                        type="button"
                        className="logip-tool-btn"
                        onClick={() => handleFormatToolbar('link')}
                        title="Insert Link"
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                        </svg>
                      </button>
                    </div>

                    <textarea
                      id="blog-content-area"
                      ref={contentAreaRef}
                      className="logip-editor-textarea"
                      value={blogContent}
                      onChange={(e) => setBlogContent(e.target.value)}
                      placeholder="Write your article content here..."
                    />
                  </div>
                </div>
              </div>

              {/* RIGHT META & PREVIEW COLUMN */}
              <div className="logip-create-right">
                <div className="logip-field-group">
                  <label htmlFor="blog-date-input">Date of Upload</label>
                  <div className="logip-date-input-wrap">
                    <input
                      id="blog-date-input"
                      type="text"
                      className="logip-pill-input"
                      value={blogDate}
                      onChange={(e) => setBlogDate(e.target.value)}
                    />
                    <svg
                      className="logip-date-input-icon"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                  </div>
                </div>

                <div className="logip-field-group">
                  <label>Blog Images</label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    style={{ display: 'none' }}
                    onChange={(e) => handleFilesSelected(e.target.files)}
                  />
                  <div
                    className="logip-upload-dropzone"
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      handleFilesSelected(e.dataTransfer.files);
                    }}
                  >
                    Click or drag to upload multiple images
                  </div>

                  <div className="logip-image-thumbs-row">
                    {blogImages.slice(0, 3).map((imgSrc, idx) => (
                      <div className="logip-upload-thumb-box" key={`${imgSrc}-${idx}`}>
                        <img src={imgSrc} alt={`Upload ${idx + 1}`} />
                        <button
                          type="button"
                          className="logip-thumb-remove"
                          onClick={() => handleRemoveBlogImage(idx)}
                          aria-label="Remove image"
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="logip-upload-add-slot"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      + Add
                    </button>
                  </div>
                </div>

                <div className="logip-field-group logip-preview-group">
                  <label>Live Card Preview</label>
                  <div className="logip-live-card">
                    <div className="logip-live-card-img-wrap">
                      <img src={previewImage} alt={previewTitle} className="logip-live-card-img" />
                    </div>
                    <div className="logip-live-card-body">
                      <div className="logip-live-card-meta">
                        <span className="logip-live-tag">{previewCategory}</span>
                        <span className="logip-live-date">{previewDate}</span>
                      </div>
                      <h3 className="logip-live-card-title">{previewTitle}</h3>
                      <p className="logip-live-card-desc">{previewExcerpt}</p>
                      <span className="logip-live-card-link">Read article &rarr;</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : (
          /* BLOGS & VIDEOS LIST VIEW */
          <section className="logip-main">
            {/* Top Greeting & Date */}
            <header className="logip-header">
              <div>
                <h1 className="logip-greeting">Hello, {displayName}</h1>
                <p className="logip-subgreeting">
                  {activeTab === 'blogs'
                    ? 'Manage your blog posts below.'
                    : 'Manage your video sessions below.'}
                  {dbNotice && <span className="logip-db-hint"> ({dbNotice})</span>}
                </p>
              </div>

              <div className="logip-date-box">
                <span className="logip-date-text">16 May, 2023</span>
                <span className="logip-calendar-btn" aria-hidden="true">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </span>
              </div>
            </header>

            {/* KPI STATS ROW */}
            {activeTab === 'blogs' ? (
              <div className="logip-stats-row">
                <div className="logip-stat-card">
                  <div className="logip-stat-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="8" y1="13" x2="16" y2="13" />
                      <line x1="8" y1="17" x2="14" y2="17" />
                    </svg>
                  </div>
                  <div className="logip-stat-info">
                    <span className="logip-stat-label">Total Blogs</span>
                    <strong className="logip-stat-value">48</strong>
                    <span className="logip-stat-trend text-green">+6 this month</span>
                  </div>
                </div>

                <div className="logip-stat-card">
                  <div className="logip-stat-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  </div>
                  <div className="logip-stat-info">
                    <span className="logip-stat-label">Published</span>
                    <strong className="logip-stat-value">42</strong>
                    <span className="logip-stat-trend text-green">87.5% rate</span>
                  </div>
                </div>

                <div className="logip-stat-card">
                  <div className="logip-stat-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </div>
                  <div className="logip-stat-info">
                    <span className="logip-stat-label">Total Reads</span>
                    <strong className="logip-stat-value">12.6k</strong>
                    <span className="logip-stat-trend text-green">+18% vs last week</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="logip-stats-row">
                <div className="logip-stat-card">
                  <div className="logip-stat-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <rect x="2" y="6" width="14" height="12" rx="2" />
                      <path d="M16 10l5-3v10l-5-3" />
                    </svg>
                  </div>
                  <div className="logip-stat-info">
                    <span className="logip-stat-label">Total Videos</span>
                    <strong className="logip-stat-value">32</strong>
                    <span className="logip-stat-pill pill-green">+4 this week</span>
                  </div>
                </div>

                <div className="logip-stat-card">
                  <div className="logip-stat-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <rect x="3" y="4" width="18" height="18" rx="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                      <circle cx="12" cy="15" r="2" />
                    </svg>
                  </div>
                  <div className="logip-stat-info">
                    <span className="logip-stat-label">Live / Scheduled</span>
                    <strong className="logip-stat-value">5</strong>
                    <span className="logip-stat-pill pill-blue">2 upcoming today</span>
                  </div>
                </div>

                <div className="logip-stat-card">
                  <div className="logip-stat-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </div>
                  <div className="logip-stat-info">
                    <span className="logip-stat-label">Total Views</span>
                    <strong className="logip-stat-value">18.4k</strong>
                    <span className="logip-stat-pill pill-green">+14% vs last week</span>
                  </div>
                </div>
              </div>
            )}

            {/* SEARCH & FILTER CONTROLS */}
            <div className="logip-controls-row">
              <div className="logip-search-box">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    activeTab === 'blogs'
                      ? 'Search blogs, authors...'
                      : 'Search video sessions, hosts...'
                  }
                />
              </div>

              <div className="logip-select-wrapper">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  aria-label="Filter by status"
                >
                  <option value="All Status">All Status</option>
                  <option value="Published">Published</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Draft">Draft</option>
                </select>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>

              <button
                type="button"
                className="logip-add-btn"
                onClick={() => {
                  if (activeTab === 'blogs') {
                    handleOpenCreateBlog();
                  } else {
                    setShowAddVideoModal(true);
                  }
                }}
              >
                <span>+</span>
                <span>{activeTab === 'blogs' ? 'New Blog' : 'New Video'}</span>
              </button>
            </div>

            {/* TABLE SECTION */}
            <div className="logip-table-section">
              <h2 className="logip-section-title">
                {activeTab === 'blogs' ? 'Blogs' : 'Videos Sessions'}
              </h2>

              {activeTab === 'blogs' ? (
                <div className="logip-table">
                  <div className="logip-table-head">
                    <span>Content</span>
                    <span>Author</span>
                    <span>Read Time</span>
                    <span>Publish Date</span>
                    <span>Status</span>
                  </div>

                  <div className="logip-table-body">
                    {filteredBlogs.map((item) => {
                      const isAdminIcon = item.is_admin_icon ?? item.isAdminIcon;
                      const readTime = item.read_time || item.readTime;
                      const publishDate = item.publish_date || item.date;
                      return (
                        <div className="logip-table-row" key={item.id}>
                          <div className="logip-cell-main">
                            <img src={item.thumb || '/images/blog-1.jpg'} alt={item.title} className="logip-thumb" />
                            <span className="logip-item-title">{item.title}</span>
                          </div>

                          <div className="logip-cell-person">
                            {isAdminIcon ? (
                              <span className="logip-admin-avatar">
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                  <circle cx="12" cy="7" r="4" />
                                </svg>
                              </span>
                            ) : (
                              <img src={item.avatar || '/images/testimonial-1.jpg'} alt={item.author} className="logip-avatar" />
                            )}
                            <span>{item.author}</span>
                          </div>

                          <div className="logip-cell-text">{readTime}</div>
                          <div className="logip-cell-date">{publishDate}</div>
                          <div>
                            <button
                              type="button"
                              onClick={() => handleCycleStatus(item, 'blogs')}
                              className={`logip-status-badge ${getStatusClass(item.status)}`}
                              title="Click to change status in Supabase"
                            >
                              {item.status}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="logip-table">
                  <div className="logip-table-head">
                    <span>Session</span>
                    <span>Host</span>
                    <span>Duration</span>
                    <span>Session Date</span>
                    <span>Status</span>
                  </div>

                  <div className="logip-table-body">
                    {filteredVideos.map((item) => {
                      const isAdminIcon = item.is_admin_icon ?? item.isAdminIcon;
                      const sessionDate = item.session_date || item.date;
                      return (
                        <div className="logip-table-row" key={item.id}>
                          <div className="logip-cell-main">
                            <img src={item.thumb || '/images/blog-2.jpg'} alt={item.title} className="logip-thumb" />
                            <span className="logip-item-title">{item.title}</span>
                          </div>

                          <div className="logip-cell-person">
                            {isAdminIcon ? (
                              <span className="logip-admin-avatar">
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                  <circle cx="12" cy="7" r="4" />
                                </svg>
                              </span>
                            ) : (
                              <img src={item.avatar || '/images/testimonial-2.jpg'} alt={item.host} className="logip-avatar" />
                            )}
                            <span>{item.host}</span>
                          </div>

                          <div className="logip-cell-text">{item.duration}</div>
                          <div className="logip-cell-date">{sessionDate}</div>
                          <div>
                            <button
                              type="button"
                              onClick={() => handleCycleStatus(item, 'videos')}
                              className={`logip-status-badge ${getStatusClass(item.status)}`}
                              title="Click to change status in Supabase"
                            >
                              {item.status}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* PAGINATION FOOTER */}
              <div className="logip-pagination">
                <span className="logip-page-count">
                  {activeTab === 'blogs' ? 'Showing 1-5 of 80' : 'Showing 1-5 of 32'}
                </span>
                <div className="logip-page-btns">
                  <button type="button" className="logip-page-btn" aria-label="Previous page">
                    &lsaquo;
                  </button>
                  <button type="button" className="logip-page-btn" aria-label="Next page">
                    &rsaquo;
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* ADD NEW VIDEO MODAL */}
      {showAddVideoModal && (
        <div className="logip-modal-backdrop" onClick={() => setShowAddVideoModal(false)}>
          <div className="logip-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Create New Video Session</h3>
            <form onSubmit={handleAddVideo} className="logip-modal-form">
              <label>
                Session Title
                <input
                  type="text"
                  value={newVideoTitle}
                  onChange={(e) => setNewVideoTitle(e.target.value)}
                  placeholder="e.g. Mastering FastAPI"
                  required
                />
              </label>
              <label>
                Host
                <input
                  type="text"
                  value={newVideoHost}
                  onChange={(e) => setNewVideoHost(e.target.value)}
                  placeholder={displayName}
                />
              </label>
              <label>
                Duration
                <input
                  type="text"
                  value={newVideoDuration}
                  onChange={(e) => setNewVideoDuration(e.target.value)}
                  placeholder="45 mins"
                />
              </label>
              <label>
                Status
                <select value={newVideoStatus} onChange={(e) => setNewVideoStatus(e.target.value)}>
                  <option value="Published">Published</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Draft">Draft</option>
                </select>
              </label>
              <div className="logip-modal-actions">
                <button type="button" onClick={() => setShowAddVideoModal(false)} className="logip-btn-cancel">
                  Cancel
                </button>
                <button type="submit" className="logip-btn-save" disabled={isSavingVideo}>
                  {isSavingVideo ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
