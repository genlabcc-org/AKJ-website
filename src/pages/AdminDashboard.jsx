import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase, BLOG_IMAGES_BUCKET, normalizeBlogRow, packLegacyBlogPayload, getVideoEmbedInfo } from '../supabase';
import './AdminDashboard.css';

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

function extractStoragePathFromUrl(url) {
  if (!url || typeof url !== 'string') return null;
  const marker = `/storage/v1/object/public/${BLOG_IMAGES_BUCKET}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  return decodeURIComponent(url.slice(idx + marker.length));
}

export default function AdminDashboard() {
  const { adminUser, logout } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const contentAreaRef = useRef(null);

  const [activeTab, setActiveTab] = useState('blogs'); // 'blogs' | 'videos'
  const [isCreatingBlog, setIsCreatingBlog] = useState(false);
  const [isCreatingVideo, setIsCreatingVideo] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [blogs, setBlogs] = useState([]);
  const [videos, setVideos] = useState([]);
  const [dbLoading, setDbLoading] = useState(false);
  const [dbNotice, setDbNotice] = useState('');

  // Create / Edit Blog full-page state
  const [editingBlogId, setEditingBlogId] = useState(null);
  const [blogTitle, setBlogTitle] = useState('');
  const [blogCategory, setBlogCategory] = useState('');
  const [blogDate, setBlogDate] = useState(() => formatNowShort());
  const [blogStatus, setBlogStatus] = useState('Published');
  const [blogContent, setBlogContent] = useState('');
  const [blogImages, setBlogImages] = useState([]);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [blogImageError, setBlogImageError] = useState('');
  const [blogError, setBlogError] = useState('');
  const [isPublishingBlog, setIsPublishingBlog] = useState(false);

  // Delete Blog confirmation modal state
  const [blogToDelete, setBlogToDelete] = useState(null);
  const [isDeletingBlog, setIsDeletingBlog] = useState(false);

  // Upload / Edit Video full-page state
  const [editingVideoId, setEditingVideoId] = useState(null);
  const [videoTitle, setVideoTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoDate, setVideoDate] = useState(() => formatNowShort());
  const [videoStatus, setVideoStatus] = useState('Published');
  const [videoUrlError, setVideoUrlError] = useState('');
  const [videoTitleError, setVideoTitleError] = useState('');
  const [isPublishingVideo, setIsPublishingVideo] = useState(false);

  // Delete Video confirmation modal state
  const [videoToDelete, setVideoToDelete] = useState(null);
  const [isDeletingVideo, setIsDeletingVideo] = useState(false);

  const displayName = useMemo(() => {
    if (!adminUser?.name || adminUser.name === 'Administrator') {
      return 'Admin';
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
      } else {
        setBlogs((blogsData || []).map(normalizeBlogRow));
      }

      const { data: videosData, error: videosError } = await supabase
        .from('videos')
        .select('*')
        .order('id', { ascending: false });

      if (!videosError) {
        setVideos(videosData || []);
      }
    } catch {
      setDbNotice('Unable to load data from Supabase.');
    } finally {
      setDbLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    const load = async () => {
      if (!active) return;
      await fetchSupabaseData();
    };
    load();
    return () => {
      active = false;
    };
  }, [fetchSupabaseData]);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login', { replace: true });
  };

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    setIsCreatingBlog(false);
    setIsCreatingVideo(false);
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

  // Image upload handlers for Create / Edit Blog (Supabase Storage)
  const handleFilesSelected = async (files) => {
    if (!files || !files.length) return;
    if (!supabase) {
      setBlogImageError('Supabase is not configured. Cannot upload images.');
      return;
    }

    setBlogImageError('');
    setIsUploadingImages(true);

    try {
      const uploadedUrls = [];
      for (const file of Array.from(files)) {
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
        const filePath = `blogs/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeName}`;

        const { data, error } = await supabase.storage
          .from(BLOG_IMAGES_BUCKET)
          .upload(filePath, file, { cacheControl: '3600', upsert: false });

        if (error) {
          throw error;
        }

        const { data: publicUrlData } = supabase.storage
          .from(BLOG_IMAGES_BUCKET)
          .getPublicUrl(data.path);

        if (publicUrlData?.publicUrl) {
          uploadedUrls.push(publicUrlData.publicUrl);
        }
      }

      setBlogImages((prev) => [...prev, ...uploadedUrls]);
    } catch (err) {
      setBlogImageError(
        err?.message
          ? `Image upload failed: ${err.message}. Ensure the "${BLOG_IMAGES_BUCKET}" bucket and policies exist (see supabase_schema.sql).`
          : 'Failed to upload image to Supabase Storage.'
      );
    } finally {
      setIsUploadingImages(false);
    }
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
    setEditingBlogId(null);
    setBlogTitle('');
    setBlogCategory('');
    setBlogDate(formatNowShort());
    setBlogStatus('Published');
    setBlogContent('');
    setBlogImages([]);
    setBlogImageError('');
    setBlogError('');
    setIsCreatingBlog(true);
  };

  const handleOpenEditBlog = (item) => {
    setEditingBlogId(item.id);
    setBlogTitle(item.title || '');
    setBlogCategory(item.category || '');
    setBlogDate(item.publish_date || item.date || formatNowShort());
    setBlogStatus(item.status || 'Published');
    setBlogContent(item.content || '');
    setBlogImages(
      Array.isArray(item.images) && item.images.length > 0
        ? item.images
        : item.thumb
          ? [item.thumb]
          : []
    );
    setBlogImageError('');
    setBlogError('');
    setIsCreatingBlog(true);
  };

  const handleSaveBlog = async () => {
    if (!blogTitle.trim()) {
      setBlogError('Please enter a blog title.');
      return;
    }

    setBlogError('');
    const finalTitle = blogTitle.trim();
    const finalThumb = blogImages[0] || null;
    const wordsCount = blogContent.trim().split(/\s+/).filter(Boolean).length;
    const estimatedMins = Math.max(1, Math.ceil(wordsCount / 200));

    const existingBlog = editingBlogId !== null
      ? blogs.find((b) => b.id === editingBlogId)
      : null;

    const basePayload = {
      title: finalTitle,
      thumb: finalThumb,
      author: existingBlog?.author || displayName,
      avatar: existingBlog?.avatar ?? null,
      is_admin_icon: existingBlog?.is_admin_icon ?? true,
      read_time: `${estimatedMins} min read`,
      publish_date: blogDate.trim() || formatNowShort(),
      status: blogStatus,
    };

    const extendedPayload = {
      ...basePayload,
      category: blogCategory.trim() || null,
      content: blogContent,
      images: blogImages,
    };

    const packedFallbackPayload = packLegacyBlogPayload(basePayload, {
      category: blogCategory.trim() || null,
      content: blogContent,
      images: blogImages,
    });

    setIsPublishingBlog(true);

    if (editingBlogId !== null) {
      if (supabase) {
        let { data, error } = await supabase
          .from('blogs')
          .update(extendedPayload)
          .eq('id', editingBlogId)
          .select()
          .single();

        if (error) {
          const retry = await supabase
            .from('blogs')
            .update(packedFallbackPayload)
            .eq('id', editingBlogId)
            .select()
            .single();
          data = retry.data;
          error = retry.error;
        }

        const updatedItem =
          !error && data
            ? normalizeBlogRow(data)
            : { ...existingBlog, ...extendedPayload, id: editingBlogId };
        setBlogs((prev) => prev.map((b) => (b.id === editingBlogId ? updatedItem : b)));
      } else {
        setBlogs((prev) =>
          prev.map((b) => (b.id === editingBlogId ? { ...b, ...extendedPayload } : b))
        );
      }
    } else if (supabase) {
      let { data, error } = await supabase
        .from('blogs')
        .insert([extendedPayload])
        .select()
        .single();

      if (error) {
        const retry = await supabase
          .from('blogs')
          .insert([packedFallbackPayload])
          .select()
          .single();
        data = retry.data;
        error = retry.error;
      }

      if (!error && data) {
        setBlogs((prev) => [normalizeBlogRow(data), ...prev]);
      } else {
        setBlogs((prev) => [{ id: Date.now(), ...extendedPayload }, ...prev]);
      }
    } else {
      setBlogs((prev) => [{ id: Date.now(), ...extendedPayload }, ...prev]);
    }

    setIsPublishingBlog(false);
    setEditingBlogId(null);
    setIsCreatingBlog(false);
  };

  const handleConfirmDeleteBlog = async () => {
    if (!blogToDelete) return;
    setIsDeletingBlog(true);

    if (supabase) {
      const candidateUrls = [
        blogToDelete.thumb,
        ...(Array.isArray(blogToDelete.images) ? blogToDelete.images : []),
      ];
      const storagePaths = [...new Set(candidateUrls.map(extractStoragePathFromUrl).filter(Boolean))];

      if (storagePaths.length > 0) {
        await supabase.storage.from(BLOG_IMAGES_BUCKET).remove(storagePaths);
      }

      await supabase.from('blogs').delete().eq('id', blogToDelete.id);
    }

    setBlogs((prev) => prev.filter((b) => b.id !== blogToDelete.id));
    setIsDeletingBlog(false);
    setBlogToDelete(null);
  };

  const handleOpenCreateVideo = () => {
    setEditingVideoId(null);
    setVideoTitle('');
    setVideoUrl('');
    setVideoDate(formatNowShort());
    setVideoStatus('Published');
    setVideoUrlError('');
    setVideoTitleError('');
    setIsCreatingVideo(true);
  };

  const handleOpenEditVideo = (item) => {
    setEditingVideoId(item.id);
    setVideoTitle(item.title || '');
    const existingUrl =
      item.video_url ||
      (typeof item.avatar === 'string' && item.avatar.startsWith('http')
        ? item.avatar
        : '') ||
      (typeof item.thumb === 'string' && item.thumb.startsWith('http')
        ? item.thumb
        : '');
    setVideoUrl(existingUrl);
    setVideoDate(item.session_date || item.date || formatNowShort());
    setVideoStatus(item.status || 'Published');
    setVideoUrlError('');
    setVideoTitleError('');
    setIsCreatingVideo(true);
  };

  const handlePublishVideo = async () => {
    let hasError = false;
    if (!videoTitle.trim()) {
      setVideoTitleError('Please enter a video title.');
      hasError = true;
    }
    if (!videoUrl.trim()) {
      setVideoUrlError('Please paste a video URL.');
      hasError = true;
    }
    if (hasError) return;

    setVideoTitleError('');
    setVideoUrlError('');
    setIsPublishingVideo(true);

    const embedInfo = getVideoEmbedInfo(videoUrl);

    const videoPayload = {
      title: videoTitle.trim(),
      thumb: embedInfo?.thumb || null,
      host: displayName,
      avatar: videoUrl.trim(),
      is_admin_icon: true,
      duration: 'Video Link',
      session_date: videoDate.trim() || formatNowShort(),
      status: videoStatus,
    };

    if (editingVideoId !== null) {
      if (supabase) {
        const { data, error } = await supabase
          .from('videos')
          .update(videoPayload)
          .eq('id', editingVideoId)
          .select()
          .single();

        const updatedItem =
          !error && data ? data : { id: editingVideoId, ...videoPayload };
        setVideos((prev) =>
          prev.map((v) => (v.id === editingVideoId ? updatedItem : v))
        );
      } else {
        setVideos((prev) =>
          prev.map((v) =>
            v.id === editingVideoId ? { ...v, ...videoPayload } : v
          )
        );
      }
    } else if (supabase) {
      const { data, error } = await supabase
        .from('videos')
        .insert([videoPayload])
        .select()
        .single();

      if (!error && data) {
        setVideos((prev) => [data, ...prev]);
      } else {
        setVideos((prev) => [{ id: Date.now(), ...videoPayload }, ...prev]);
      }
    } else {
      setVideos((prev) => [{ id: Date.now(), ...videoPayload }, ...prev]);
    }

    setIsPublishingVideo(false);
    setEditingVideoId(null);
    setIsCreatingVideo(false);
  };

  const handleConfirmDeleteVideo = async () => {
    if (!videoToDelete) return;
    setIsDeletingVideo(true);

    if (supabase) {
      await supabase.from('videos').delete().eq('id', videoToDelete.id);
    }

    setVideos((prev) => prev.filter((v) => v.id !== videoToDelete.id));
    setIsDeletingVideo(false);
    setVideoToDelete(null);
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

  const publishedBlogsCount = blogs.filter((b) => b.status === 'Published').length;
  const draftBlogsCount = blogs.filter((b) => b.status !== 'Published').length;
  const publishedBlogsRate = blogs.length
    ? `${Math.round((publishedBlogsCount / blogs.length) * 100)}% rate`
    : '0% rate';

  const publishedVideosCount = videos.filter((v) => v.status === 'Published').length;
  const scheduledVideosCount = videos.filter((v) => v.status === 'Scheduled').length;

  const previewTitle = blogTitle.trim() || 'Untitled Blog';
  const previewCategory = blogCategory.trim() || 'General';
  const previewDate = blogDate.trim() || formatNowShort();
  const previewImage = blogImages[0] || '';
  const previewExcerpt =
    blogContent.trim().length > 92
      ? `${blogContent.trim().slice(0, 92)}...`
      : blogContent.trim() || 'Article preview will appear here as you write...';

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
              onClick={() => {
                setEditingBlogId(null);
                setIsCreatingBlog(false);
              }}
            >
              <span>&larr;</span>
              <span>Back to Blogs</span>
            </button>

            <div className="logip-create-header">
              <div>
                <h1 className="logip-create-title">
                  {editingBlogId !== null ? 'Edit Blog' : 'Create New Blog'}
                </h1>
                <p className="logip-create-subtitle">
                  {editingBlogId !== null
                    ? 'Update your blog article details and publish status.'
                    : 'Write and publish a new article for your blog feed.'}
                </p>
              </div>

              <div className="logip-create-actions">
                <button
                  type="button"
                  className="logip-cancel-pill"
                  onClick={() => {
                    setEditingBlogId(null);
                    setIsCreatingBlog(false);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="logip-publish-pill"
                  onClick={handleSaveBlog}
                  disabled={isPublishingBlog || isUploadingImages}
                >
                  {isPublishingBlog
                    ? editingBlogId !== null
                      ? 'Saving...'
                      : 'Publishing...'
                    : editingBlogId !== null
                      ? 'Save Changes'
                      : 'Publish Blog'}
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
                    onChange={(e) => {
                      setBlogTitle(e.target.value);
                      if (blogError) setBlogError('');
                    }}
                    placeholder="Enter blog title..."
                  />
                  {blogError && <p className="logip-field-error">{blogError}</p>}
                </div>

                <div className="logip-field-group">
                  <label htmlFor="blog-category-input">Category / Tag</label>
                  <input
                    id="blog-category-input"
                    type="text"
                    className="logip-pill-input"
                    value={blogCategory}
                    onChange={(e) => setBlogCategory(e.target.value)}
                    placeholder="Enter category or tag..."
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
                  <label htmlFor="blog-status-select">Status</label>
                  <select
                    id="blog-status-select"
                    className="logip-pill-input"
                    value={blogStatus}
                    onChange={(e) => setBlogStatus(e.target.value)}
                  >
                    <option value="Published">Published</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>

                <div className="logip-field-group">
                  <label>Blog Images</label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      handleFilesSelected(e.target.files);
                      e.target.value = '';
                    }}
                  />
                  <div
                    className="logip-upload-dropzone"
                    onClick={() => !isUploadingImages && fileInputRef.current?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      if (!isUploadingImages) {
                        handleFilesSelected(e.dataTransfer.files);
                      }
                    }}
                  >
                    {isUploadingImages
                      ? 'Uploading images to Supabase Storage...'
                      : 'Click or drag to upload multiple images'}
                  </div>
                  {blogImageError && <p className="logip-field-error">{blogImageError}</p>}

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
                      {previewImage ? (
                        <img src={previewImage} alt={previewTitle} className="logip-live-card-img" />
                      ) : (
                        <div className="logip-live-card-placeholder">No cover image selected</div>
                      )}
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
        ) : activeTab === 'videos' && isCreatingVideo ? (
          /* UPLOAD / EDIT VIDEO FULL-PAGE VIEW (matches reference image) */
          <section className="logip-main logip-create-blog-main">
            <button
              type="button"
              className="logip-back-to-blogs"
              onClick={() => {
                setEditingVideoId(null);
                setIsCreatingVideo(false);
              }}
            >
              <span>&larr;</span>
              <span>Back to Videos</span>
            </button>

            <div className="logip-create-header">
              <div>
                <h1 className="logip-create-title">
                  {editingVideoId !== null ? 'Edit Video' : 'Upload New Video'}
                </h1>
                <p className="logip-create-subtitle">
                  {editingVideoId !== null
                    ? 'Update your video session details and publish status.'
                    : 'Upload and publish a new video session.'}
                </p>
              </div>

              <div className="logip-create-actions">
                <button
                  type="button"
                  className="logip-cancel-pill"
                  onClick={() => {
                    setEditingVideoId(null);
                    setIsCreatingVideo(false);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="logip-publish-pill"
                  onClick={handlePublishVideo}
                  disabled={isPublishingVideo}
                >
                  {isPublishingVideo
                    ? editingVideoId !== null
                      ? 'Saving...'
                      : 'Publishing...'
                    : editingVideoId !== null
                      ? 'Save Changes'
                      : 'Publish Video'}
                </button>
              </div>
            </div>

            <div className="logip-create-grid">
              {/* LEFT COLUMN: Video Title + Video URL */}
              <div className="logip-create-left">
                <div className="logip-field-group">
                  <label htmlFor="video-title-input">Video Title</label>
                  <input
                    id="video-title-input"
                    type="text"
                    className="logip-pill-input"
                    value={videoTitle}
                    onChange={(e) => {
                      setVideoTitle(e.target.value);
                      if (videoTitleError) setVideoTitleError('');
                    }}
                    placeholder="Enter video title..."
                  />
                  {videoTitleError && <p className="logip-field-error">{videoTitleError}</p>}
                </div>

                <div className="logip-field-group logip-video-url-group">
                  <label htmlFor="video-url-input">Video URL</label>
                  <input
                    id="video-url-input"
                    type="url"
                    className="logip-pill-input"
                    value={videoUrl}
                    onChange={(e) => {
                      setVideoUrl(e.target.value);
                      if (videoUrlError) setVideoUrlError('');
                    }}
                    placeholder="Paste YouTube, Instagram Reel, or video link..."
                  />
                  <p className="logip-video-url-helper">
                    Supports YouTube, YouTube Shorts, Instagram Reels, and direct video links.
                  </p>
                  {videoUrlError && <p className="logip-field-error">{videoUrlError}</p>}
                  <div className="logip-video-url-divider" aria-hidden="true"></div>
                </div>
              </div>

              {/* RIGHT COLUMN: Date of Upload + Status + Live Card Preview */}
              <div className="logip-create-right">
                <div className="logip-field-group">
                  <label htmlFor="video-date-input">Date of Upload</label>
                  <div className="logip-date-input-wrap">
                    <input
                      id="video-date-input"
                      type="text"
                      className="logip-pill-input"
                      value={videoDate}
                      onChange={(e) => setVideoDate(e.target.value)}
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
                  <label htmlFor="video-status-select">Status</label>
                  <select
                    id="video-status-select"
                    className="logip-pill-input"
                    value={videoStatus}
                    onChange={(e) => setVideoStatus(e.target.value)}
                  >
                    <option value="Published">Published</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>

                <div className="logip-field-group logip-preview-group">
                  <label>Live Card Preview</label>
                  <div className="logip-live-card logip-live-video-card">
                    <div className="logip-live-video-wrap">
                      {(() => {
                        const embedInfo = getVideoEmbedInfo(videoUrl);
                        if (!embedInfo) {
                          return (
                            <div className="logip-live-video-placeholder">
                              <span className="logip-video-play-circle" aria-hidden="true">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="#ffffff">
                                  <polygon points="7 4 20 12 7 20 7 4" />
                                </svg>
                              </span>
                              <span>No video selected</span>
                            </div>
                          );
                        }
                        if (embedInfo.type === 'iframe') {
                          return (
                            <iframe
                              src={embedInfo.src}
                              title={videoTitle.trim() || 'Video preview'}
                              className="logip-live-video-iframe"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          );
                        }
                        return (
                          <video
                            src={embedInfo.src}
                            controls
                            muted
                            className="logip-live-video-player"
                          />
                        );
                      })()}
                    </div>
                    <div className="logip-live-video-body">
                      <span className="logip-live-video-date">
                        {videoDate.trim() || formatNowShort()}
                      </span>
                      <h3 className="logip-live-video-title">
                        {videoTitle.trim() || 'Untitled Video'}
                      </h3>
                      <p className="logip-live-video-desc">
                        {videoUrl.trim()
                          ? videoUrl.trim()
                          : 'Video preview will appear here...'}
                      </p>
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
                <span className="logip-date-text">{formatNowShort()}</span>
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
                    <strong className="logip-stat-value">{blogs.length}</strong>
                    <span className="logip-stat-trend text-green">Stored in database</span>
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
                    <strong className="logip-stat-value">{publishedBlogsCount}</strong>
                    <span className="logip-stat-trend text-green">{publishedBlogsRate}</span>
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
                    <span className="logip-stat-label">Drafts / Scheduled</span>
                    <strong className="logip-stat-value">{draftBlogsCount}</strong>
                    <span className="logip-stat-trend text-green">Awaiting publish</span>
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
                    <strong className="logip-stat-value">{videos.length}</strong>
                    <span className="logip-stat-pill pill-green">Stored in database</span>
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
                    <span className="logip-stat-label">Scheduled</span>
                    <strong className="logip-stat-value">{scheduledVideosCount}</strong>
                    <span className="logip-stat-pill pill-blue">Upcoming</span>
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
                    <span className="logip-stat-label">Published</span>
                    <strong className="logip-stat-value">{publishedVideosCount}</strong>
                    <span className="logip-stat-pill pill-green">Live sessions</span>
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
                    handleOpenCreateVideo();
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
                <div className="logip-table logip-table-blogs">
                  <div className="logip-table-head">
                    <span>Content</span>
                    <span>Author</span>
                    <span>Read Time</span>
                    <span>Publish Date</span>
                    <span>Status</span>
                    <span>Actions</span>
                  </div>

                  <div className="logip-table-body">
                    {filteredBlogs.length === 0 ? (
                      <div className="logip-empty-row">
                        {dbLoading ? 'Loading blogs...' : 'No blogs yet. Click "+ New Blog" to create one.'}
                      </div>
                    ) : (
                      filteredBlogs.map((item) => {
                        const isAdminIcon = item.is_admin_icon ?? item.isAdminIcon ?? !item.avatar;
                        const readTime = item.read_time || item.readTime || '—';
                        const publishDate = item.publish_date || item.date;
                        return (
                          <div className="logip-table-row" key={item.id}>
                            <div className="logip-cell-main">
                              {item.thumb ? (
                                <img src={item.thumb} alt={item.title} className="logip-thumb" />
                              ) : (
                                <div className="logip-thumb-placeholder" aria-hidden="true">
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                    <rect x="3" y="3" width="18" height="18" rx="2" />
                                    <circle cx="8.5" cy="8.5" r="1.5" />
                                    <polyline points="21 15 16 10 5 21" />
                                  </svg>
                                </div>
                              )}
                              <span className="logip-item-title">{item.title}</span>
                            </div>

                            <div className="logip-cell-person">
                              {isAdminIcon || !item.avatar ? (
                                <span className="logip-admin-avatar">
                                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                  </svg>
                                </span>
                              ) : (
                                <img src={item.avatar} alt={item.author} className="logip-avatar" />
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
                            <div className="logip-cell-actions">
                              <button
                                type="button"
                                className="logip-action-btn"
                                onClick={() => handleOpenEditBlog(item)}
                                title="Edit blog"
                                aria-label={`Edit ${item.title}`}
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M12 20h9" />
                                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                                </svg>
                              </button>
                              <button
                                type="button"
                                className="logip-action-btn logip-action-delete"
                                onClick={() => setBlogToDelete(item)}
                                title="Delete blog"
                                aria-label={`Delete ${item.title}`}
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <polyline points="3 6 5 6 21 6" />
                                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                                  <path d="M10 11v6" />
                                  <path d="M14 11v6" />
                                  <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              ) : (
                <div className="logip-table logip-table-videos">
                  <div className="logip-table-head">
                    <span>Video Title</span>
                    <span>Video URL</span>
                    <span>Date of Upload</span>
                    <span>Status</span>
                    <span>Actions</span>
                  </div>

                  <div className="logip-table-body">
                    {filteredVideos.length === 0 ? (
                      <div className="logip-empty-row">
                        {dbLoading ? 'Loading videos...' : 'No video sessions yet. Click "+ New Video" to add one.'}
                      </div>
                    ) : (
                      filteredVideos.map((item) => {
                        const sessionDate = item.session_date || item.date || '—';
                        const rawVideoUrl =
                          item.video_url ||
                          (typeof item.avatar === 'string' && item.avatar.startsWith('http')
                            ? item.avatar
                            : '') ||
                          (typeof item.thumb === 'string' && item.thumb.startsWith('http')
                            ? item.thumb
                            : '');
                        const embedInfo = getVideoEmbedInfo(rawVideoUrl);
                        const thumbUrl = embedInfo?.thumb || item.thumb;

                        return (
                          <div className="logip-table-row" key={item.id}>
                            <div className="logip-cell-main">
                              {thumbUrl ? (
                                <img src={thumbUrl} alt={item.title} className="logip-thumb" />
                              ) : (
                                <div className="logip-thumb-placeholder" aria-hidden="true">
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                    <rect x="2" y="6" width="14" height="12" rx="2" />
                                    <path d="M16 10l5-3v10l-5-3" />
                                  </svg>
                                </div>
                              )}
                              <span className="logip-item-title">{item.title}</span>
                            </div>

                            <div className="logip-cell-url">
                              {rawVideoUrl ? (
                                <a
                                  href={rawVideoUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="logip-video-url-link"
                                  title={rawVideoUrl}
                                >
                                  {rawVideoUrl}
                                </a>
                              ) : (
                                <span className="logip-url-empty">—</span>
                              )}
                            </div>

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
                            <div className="logip-cell-actions">
                              <button
                                type="button"
                                className="logip-action-btn"
                                onClick={() => handleOpenEditVideo(item)}
                                title="Edit video"
                                aria-label={`Edit ${item.title}`}
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M12 20h9" />
                                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                                </svg>
                              </button>
                              <button
                                type="button"
                                className="logip-action-btn logip-action-delete"
                                onClick={() => setVideoToDelete(item)}
                                title="Delete video"
                                aria-label={`Delete ${item.title}`}
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <polyline points="3 6 5 6 21 6" />
                                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                                  <path d="M10 11v6" />
                                  <path d="M14 11v6" />
                                  <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}

              {/* PAGINATION FOOTER */}
              <div className="logip-pagination">
                <span className="logip-page-count">
                  {activeTab === 'blogs'
                    ? `Showing ${filteredBlogs.length} of ${blogs.length}`
                    : `Showing ${filteredVideos.length} of ${videos.length}`}
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

      {/* DELETE BLOG CONFIRMATION MODAL */}
      {blogToDelete && (
        <div className="logip-modal-backdrop" onClick={() => !isDeletingBlog && setBlogToDelete(null)}>
          <div className="logip-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Delete Blog</h3>
            <p className="logip-delete-message">
              Are you sure you want to delete <strong>{blogToDelete.title}</strong>? This action cannot be undone.
            </p>
            <div className="logip-modal-actions">
              <button
                type="button"
                onClick={() => setBlogToDelete(null)}
                className="logip-btn-cancel"
                disabled={isDeletingBlog}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteBlog}
                className="logip-btn-delete"
                disabled={isDeletingBlog}
              >
                {isDeletingBlog ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE VIDEO CONFIRMATION MODAL */}
      {videoToDelete && (
        <div className="logip-modal-backdrop" onClick={() => !isDeletingVideo && setVideoToDelete(null)}>
          <div className="logip-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Delete Video</h3>
            <p className="logip-delete-message">
              Are you sure you want to delete <strong>{videoToDelete.title}</strong>? This action cannot be undone.
            </p>
            <div className="logip-modal-actions">
              <button
                type="button"
                onClick={() => setVideoToDelete(null)}
                className="logip-btn-cancel"
                disabled={isDeletingVideo}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteVideo}
                className="logip-btn-delete"
                disabled={isDeletingVideo}
              >
                {isDeletingVideo ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
