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

function formatAppDate(isoString) {
  if (!isoString) return '—';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return String(isoString);
    return d.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return String(isoString);
  }
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

  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'blogs' | 'videos' | 'admission' | 'contact'
  const [admissionChartMode, setAdmissionChartMode] = useState('stages'); // 'stages' | 'timeline'
  const [currentMonthAnchor] = useState(() => new Date());
  const [isCreatingBlog, setIsCreatingBlog] = useState(false);
  const [isCreatingVideo, setIsCreatingVideo] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [blogs, setBlogs] = useState([]);
  const [videos, setVideos] = useState([]);
  const [admissions, setAdmissions] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [dbLoading, setDbLoading] = useState(false);
  const [dbNotice, setDbNotice] = useState('');

  // Admission Modal & Delete states
  const [selectedAdmission, setSelectedAdmission] = useState(null);
  const [modalStatus, setModalStatus] = useState('Pending');
  const [modalNotes, setModalNotes] = useState('');
  const [isUpdatingAdmission, setIsUpdatingAdmission] = useState(false);
  const [admissionToDelete, setAdmissionToDelete] = useState(null);
  const [isDeletingAdmission, setIsDeletingAdmission] = useState(false);

  // Contact Modal & Delete states
  const [selectedContact, setSelectedContact] = useState(null);
  const [contactModalStatus, setContactModalStatus] = useState('New');
  const [contactModalNotes, setContactModalNotes] = useState('');
  const [isUpdatingContact, setIsUpdatingContact] = useState(false);
  const [contactToDelete, setContactToDelete] = useState(null);
  const [isDeletingContact, setIsDeletingContact] = useState(false);

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

      const { data: admissionsData, error: admissionsError } = await supabase
        .from('admissions')
        .select('*')
        .order('id', { ascending: false });

      if (!admissionsError && admissionsData) {
        setAdmissions(admissionsData);
      } else {
        // Fallback to localStorage if table doesn't exist yet
        try {
          const local = JSON.parse(localStorage.getItem('akj_admission_applications') || '[]');
          setAdmissions(
            local.map((item, idx) => ({
              id: item.id || idx + 1,
              ref_id: item.ref_id || item.id,
              first_name: item.first_name || item.firstName,
              last_name: item.last_name || item.lastName,
              email: item.email,
              phone: item.phone,
              date_of_birth: item.date_of_birth || item.dateOfBirth,
              applied_class: item.applied_class || item.appliedClass,
              address: item.address,
              status: item.status || 'Pending',
              notes: item.notes || '',
              created_at: item.created_at || item.submittedAt || new Date().toISOString(),
            }))
          );
        } catch {
          // ignore
        }
      }

      const { data: contactsData, error: contactsError } = await supabase
        .from('contacts')
        .select('*')
        .order('id', { ascending: false });

      if (!contactsError && contactsData) {
        setContacts(contactsData);
      } else {
        try {
          const localContacts = JSON.parse(localStorage.getItem('akj_contact_messages') || '[]');
          setContacts(
            localContacts.map((item, idx) => ({
              id: item.id || idx + 1,
              ref_id: item.ref_id || item.id,
              name: item.name,
              email: item.email,
              phone: item.phone,
              purpose: item.purpose || item.society || '',
              message: item.message,
              status: item.status || 'New',
              notes: item.notes || '',
              created_at: item.created_at || item.submittedAt || new Date().toISOString(),
            }))
          );
        } catch {
          // ignore
        }
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
      const url = item.video_url || '';
      const matchesSearch =
        title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        url.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'All Status' || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [videos, searchQuery, statusFilter]);

  const filteredAdmissions = useMemo(() => {
    return admissions.filter((item) => {
      const studentName = `${item.first_name || item.firstName || ''} ${item.last_name || item.lastName || ''}`.trim();
      const email = item.email || '';
      const phone = item.phone || '';
      const appliedClass = item.applied_class || item.appliedClass || '';
      const refId = item.ref_id || item.id || '';
      const query = searchQuery.toLowerCase();

      const matchesSearch =
        studentName.toLowerCase().includes(query) ||
        email.toLowerCase().includes(query) ||
        phone.toLowerCase().includes(query) ||
        appliedClass.toLowerCase().includes(query) ||
        String(refId).toLowerCase().includes(query);

      const itemStatus = item.status || 'Pending';
      const matchesStatus = statusFilter === 'All Status' || itemStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [admissions, searchQuery, statusFilter]);

  const pendingAdmissionsCount = admissions.filter(
    (a) => (a.status || 'Pending') === 'Pending' || a.status === 'Under Review'
  ).length;
  const approvedAdmissionsCount = admissions.filter((a) => a.status === 'Approved').length;

  const handleOpenAdmissionDetail = (item) => {
    setSelectedAdmission(item);
    setModalStatus(item.status || 'Pending');
    setModalNotes(item.notes || '');
  };

  const handleCycleAdmissionStatus = async (item) => {
    const order = ['Pending', 'Under Review', 'Approved', 'Rejected'];
    const current = item.status || 'Pending';
    const nextStatus = order[(order.indexOf(current) + 1) % order.length];

    setAdmissions((prev) =>
      prev.map((a) => (a.id === item.id ? { ...a, status: nextStatus } : a))
    );

    if (supabase) {
      await supabase.from('admissions').update({ status: nextStatus }).eq('id', item.id);
    }

    try {
      const existing = JSON.parse(localStorage.getItem('akj_admission_applications') || '[]');
      const updated = existing.map((a) =>
        a.id === item.id || a.ref_id === item.ref_id ? { ...a, status: nextStatus } : a
      );
      localStorage.setItem('akj_admission_applications', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleSaveAdmissionModal = async () => {
    if (!selectedAdmission) return;
    setIsUpdatingAdmission(true);

    const updated = {
      ...selectedAdmission,
      status: modalStatus,
      notes: modalNotes,
    };

    setAdmissions((prev) =>
      prev.map((a) => (a.id === selectedAdmission.id ? updated : a))
    );

    if (supabase) {
      await supabase
        .from('admissions')
        .update({ status: modalStatus, notes: modalNotes })
        .eq('id', selectedAdmission.id);
    }

    try {
      const existing = JSON.parse(localStorage.getItem('akj_admission_applications') || '[]');
      const updatedList = existing.map((a) =>
        a.id === selectedAdmission.id || a.ref_id === selectedAdmission.ref_id
          ? { ...a, status: modalStatus, notes: modalNotes }
          : a
      );
      localStorage.setItem('akj_admission_applications', JSON.stringify(updatedList));
    } catch {
      // ignore
    }

    setIsUpdatingAdmission(false);
    setSelectedAdmission(null);
  };

  const handleConfirmDeleteAdmission = async () => {
    if (!admissionToDelete) return;
    setIsDeletingAdmission(true);

    if (supabase) {
      await supabase.from('admissions').delete().eq('id', admissionToDelete.id);
    }

    setAdmissions((prev) => prev.filter((a) => a.id !== admissionToDelete.id));

    try {
      const existing = JSON.parse(localStorage.getItem('akj_admission_applications') || '[]');
      const updated = existing.filter(
        (a) => a.id !== admissionToDelete.id && a.ref_id !== admissionToDelete.ref_id
      );
      localStorage.setItem('akj_admission_applications', JSON.stringify(updated));
    } catch {
      // ignore
    }

    setIsDeletingAdmission(false);
    setAdmissionToDelete(null);
  };

  const handleExportAdmissionsCSV = () => {
    if (!admissions.length) return;
    const headers = [
      'Reference ID',
      'First Name',
      'Last Name',
      'Email',
      'Phone',
      'Date of Birth',
      'Applied Class',
      'Address',
      'Status',
      'Notes',
      'Submitted At',
    ];
    const rows = filteredAdmissions.map((item) => [
      `"${item.ref_id || item.id || ''}"`,
      `"${(item.first_name || item.firstName || '').replace(/"/g, '""')}"`,
      `"${(item.last_name || item.lastName || '').replace(/"/g, '""')}"`,
      `"${(item.email || '').replace(/"/g, '""')}"`,
      `"${(item.phone || '').replace(/"/g, '""')}"`,
      `"${item.date_of_birth || item.dateOfBirth || ''}"`,
      `"${(item.applied_class || item.appliedClass || '').replace(/"/g, '""')}"`,
      `"${(item.address || '').replace(/"/g, '""')}"`,
      `"${item.status || 'Pending'}"`,
      `"${(item.notes || '').replace(/"/g, '""')}"`,
      `"${item.created_at || item.submittedAt || ''}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `akj-admissions-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredContacts = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return contacts.filter((item) => {
      const name = item.name || '';
      const email = item.email || '';
      const phone = item.phone || '';
      const purpose = item.purpose || item.society || '';
      const message = item.message || '';
      const refId = item.ref_id || item.id || '';

      const matchesSearch =
        name.toLowerCase().includes(query) ||
        email.toLowerCase().includes(query) ||
        phone.toLowerCase().includes(query) ||
        purpose.toLowerCase().includes(query) ||
        message.toLowerCase().includes(query) ||
        String(refId).toLowerCase().includes(query);

      const itemStatus = item.status || 'New';
      const matchesStatus = statusFilter === 'All Status' || itemStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [contacts, searchQuery, statusFilter]);

  const openContactsCount = contacts.filter(
    (c) => (c.status || 'New') === 'New' || c.status === 'In Progress'
  ).length;
  const resolvedContactsCount = contacts.filter((c) => c.status === 'Resolved').length;

  const syncLocalContacts = (updater) => {
    try {
      const existing = JSON.parse(localStorage.getItem('akj_contact_messages') || '[]');
      localStorage.setItem('akj_contact_messages', JSON.stringify(updater(existing)));
    } catch {
      // ignore
    }
  };

  const handleOpenContactDetail = (item) => {
    setSelectedContact(item);
    setContactModalStatus(item.status || 'New');
    setContactModalNotes(item.notes || '');
  };

  const handleCycleContactStatus = async (item) => {
    const order = ['New', 'In Progress', 'Resolved'];
    const current = item.status || 'New';
    const nextStatus = order[(order.indexOf(current) + 1) % order.length];

    setContacts((prev) =>
      prev.map((c) => (c.id === item.id ? { ...c, status: nextStatus } : c))
    );

    if (supabase) {
      await supabase.from('contacts').update({ status: nextStatus }).eq('id', item.id);
    }

    syncLocalContacts((existing) =>
      existing.map((c) =>
        c.id === item.id || c.ref_id === item.ref_id ? { ...c, status: nextStatus } : c
      )
    );
  };

  const handleSaveContactModal = async () => {
    if (!selectedContact) return;
    setIsUpdatingContact(true);

    const updated = {
      ...selectedContact,
      status: contactModalStatus,
      notes: contactModalNotes,
    };

    setContacts((prev) =>
      prev.map((c) => (c.id === selectedContact.id ? updated : c))
    );

    if (supabase) {
      await supabase
        .from('contacts')
        .update({ status: contactModalStatus, notes: contactModalNotes })
        .eq('id', selectedContact.id);
    }

    syncLocalContacts((existing) =>
      existing.map((c) =>
        c.id === selectedContact.id || c.ref_id === selectedContact.ref_id
          ? { ...c, status: contactModalStatus, notes: contactModalNotes }
          : c
      )
    );

    setIsUpdatingContact(false);
    setSelectedContact(null);
  };

  const handleConfirmDeleteContact = async () => {
    if (!contactToDelete) return;
    setIsDeletingContact(true);

    if (supabase) {
      await supabase.from('contacts').delete().eq('id', contactToDelete.id);
    }

    setContacts((prev) => prev.filter((c) => c.id !== contactToDelete.id));

    syncLocalContacts((existing) =>
      existing.filter(
        (c) => c.id !== contactToDelete.id && c.ref_id !== contactToDelete.ref_id
      )
    );

    setIsDeletingContact(false);
    setContactToDelete(null);
  };

  const handleExportContactsCSV = () => {
    if (!contacts.length) return;
    const headers = [
      'Reference ID',
      'Name',
      'Email',
      'Phone',
      'Purpose',
      'Message',
      'Status',
      'Notes',
      'Received At',
    ];
    const rows = filteredContacts.map((item) => [
      `"${item.ref_id || item.id || ''}"`,
      `"${(item.name || '').replace(/"/g, '""')}"`,
      `"${(item.email || '').replace(/"/g, '""')}"`,
      `"${(item.phone || '').replace(/"/g, '""')}"`,
      `"${(item.purpose || item.society || '').replace(/"/g, '""')}"`,
      `"${(item.message || '').replace(/"/g, '""')}"`,
      `"${item.status || 'New'}"`,
      `"${(item.notes || '').replace(/"/g, '""')}"`,
      `"${item.created_at || item.submittedAt || ''}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `akj-contacts-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
    const existingUrl = item.video_url || '';
    setVideoUrl(existingUrl);
    setVideoDate(item.session_date || item.date || formatNowShort());
    setVideoStatus(item.status === 'Scheduled' ? 'Draft' : item.status || 'Published');
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
      video_url: videoUrl.trim(),
      thumb: embedInfo?.thumb || null,
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
    const order = table === 'videos' ? ['Published', 'Draft'] : ['Published', 'Scheduled', 'Draft'];
    const currentIndex = order.indexOf(item.status);
    const nextStatus = order[(currentIndex + 1) % order.length];

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
      case 'Approved':
        return 'status-approved';
      case 'Under Review':
        return 'status-under-review';
      case 'Pending':
        return 'status-pending';
      case 'Rejected':
        return 'status-rejected';
      case 'New':
        return 'status-new';
      case 'In Progress':
        return 'status-in-progress';
      case 'Resolved':
        return 'status-resolved';
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
  const draftVideosCount = videos.length - publishedVideosCount;

  const admissionAnalytics = useMemo(() => {
    const statusMap = {
      Approved: 0,
      Pending: 0,
      'Under Review': 0,
      Rejected: 0,
    };
    const stageCounts = {
      'Early Years': 0,
      Primary: 0,
      'Lower Sec': 0,
      IGCSE: 0,
    };

    const months = [];
    for (let i = 5; i >= 0; i -= 1) {
      const d = new Date(
        currentMonthAnchor.getFullYear(),
        currentMonthAnchor.getMonth() - i,
        1
      );
      months.push({
        key: `${d.getFullYear()}-${d.getMonth()}`,
        label: d.toLocaleString('en-US', { month: 'short' }),
        count: 0,
      });
    }

    admissions.forEach((item) => {
      const st = item.status || 'Pending';
      if (Object.prototype.hasOwnProperty.call(statusMap, st)) {
        statusMap[st] += 1;
      } else {
        statusMap.Pending += 1;
      }

      const cls = String(item.applied_class || item.appliedClass || '').toLowerCase();
      if (cls.includes('ey') || cls.includes('pre-kg') || cls.includes('lkg') || cls.includes('ukg')) {
        stageCounts['Early Years'] += 1;
      } else if (/grade\s*[1-5]\b/.test(cls)) {
        stageCounts.Primary += 1;
      } else if (/grade\s*[6-8]\b/.test(cls)) {
        stageCounts['Lower Sec'] += 1;
      } else if (/grade\s*(9|10)\b/.test(cls) || cls.includes('igcse')) {
        stageCounts.IGCSE += 1;
      } else if (cls) {
        stageCounts.Primary += 1;
      }

      const rawDate = item.created_at || item.submittedAt;
      if (rawDate) {
        const parsed = new Date(rawDate);
        if (!Number.isNaN(parsed.getTime())) {
          const monthKey = `${parsed.getFullYear()}-${parsed.getMonth()}`;
          const target = months.find((m) => m.key === monthKey);
          if (target) target.count += 1;
        }
      }
    });

    const total = admissions.length;
    const statusItems = [
      { label: 'Approved', count: statusMap.Approved, color: '#1E459F' },
      { label: 'Pending', count: statusMap.Pending, color: '#CF2A2A' },
      { label: 'Under Review', count: statusMap['Under Review'], color: '#FABD32' },
      { label: 'Rejected', count: statusMap.Rejected, color: '#E1DCCA' },
    ].map((entry) => ({
      ...entry,
      pct: total > 0 ? Math.round((entry.count / total) * 100) : 0,
    }));

    const stageItems = [
      { label: 'Early Years', sub: 'EY1 – EY3', count: stageCounts['Early Years'], color: '#1E459F' },
      { label: 'Primary', sub: 'Grades 1 – 5', count: stageCounts.Primary, color: '#FABD32' },
      { label: 'Lower Sec', sub: 'Grades 6 – 8', count: stageCounts['Lower Sec'], color: '#CF2A2A' },
      { label: 'IGCSE', sub: 'Grades 9 – 10', count: stageCounts.IGCSE, color: '#E1DCCA', stroke: '#B8B09C' },
    ];

    const rawMax = Math.max(
      1,
      ...stageItems.map((s) => s.count),
      ...months.map((m) => m.count)
    );
    const yStep = Math.max(1, Math.ceil(rawMax / 4));
    const yMax = yStep * 4;
    const yTicks = [0, yStep, yStep * 2, yStep * 3, yMax];

    const approvalRate = total > 0 ? Math.round((statusMap.Approved / total) * 100) : 0;

    return {
      total,
      approvalRate,
      statusItems,
      stageItems,
      months,
      yMax,
      yTicks,
    };
  }, [admissions, currentMonthAnchor]);

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
          <Link to="/" className="logip-brand" aria-label="AKJ Home">
            <img
              src="/images/akj-logo.svg"
              alt="AKJ Logo"
              className="logip-brand-logo"
            />
          </Link>

          <nav className="logip-nav">
            <button
              type="button"
              className={`logip-nav-item ${activeTab === 'home' ? 'active' : ''}`}
              onClick={() => handleTabSwitch('home')}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9.5z" />
              </svg>
              <span>Home</span>
            </button>

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

            <button
              type="button"
              className={`logip-nav-item ${activeTab === 'admission' ? 'active' : ''}`}
              onClick={() => handleTabSwitch('admission')}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c0 2 3 3 6 3s6-1 6-3v-5" />
              </svg>
              <span>Admission</span>
            </button>

            <button
              type="button"
              className={`logip-nav-item ${activeTab === 'contact' ? 'active' : ''}`}
              onClick={() => handleTabSwitch('contact')}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <span>Contact</span>
            </button>
          </nav>

          <div className="logip-sidebar-bottom">
            <Link to="/" className="logip-bottom-link">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              <span>Visit Website</span>
            </Link>

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
        ) : activeTab === 'home' ? (
          /* HOME OVERVIEW DASHBOARD */
          <section className="logip-main logip-home-main">
            <header className="logip-header">
              <div>
                <h1 className="logip-greeting">Hello, {displayName}</h1>
                <p className="logip-subgreeting">
                  Overview across Admissions, Contact Inquiries, Blogs, and Videos.
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

            <div className="logip-home-scroll">
              {/* 4 SUMMARY CARDS: ADMISSION, CONTACT, BLOG, VIDEO */}
              <div className="logip-overview-grid">
                <button
                  type="button"
                  className="logip-overview-card card-blue"
                  onClick={() => handleTabSwitch('admission')}
                >
                  <div className="logip-overview-top">
                    <span className="logip-overview-icon icon-blue">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
                        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                        <path d="M6 12v5c0 2 3 3 6 3s6-1 6-3v-5" />
                      </svg>
                    </span>
                    <span className="logip-overview-arrow">&rarr;</span>
                  </div>
                  <div className="logip-overview-body">
                    <span className="logip-overview-label">Admission</span>
                    <strong className="logip-overview-value">{admissions.length}</strong>
                    <span className="logip-overview-meta">
                      {approvedAdmissionsCount} Approved · {pendingAdmissionsCount} Pending
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  className="logip-overview-card card-red"
                  onClick={() => handleTabSwitch('contact')}
                >
                  <div className="logip-overview-top">
                    <span className="logip-overview-icon icon-red">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                    </span>
                    <span className="logip-overview-arrow">&rarr;</span>
                  </div>
                  <div className="logip-overview-body">
                    <span className="logip-overview-label">Contact</span>
                    <strong className="logip-overview-value">{contacts.length}</strong>
                    <span className="logip-overview-meta">
                      {openContactsCount} Open · {resolvedContactsCount} Resolved
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  className="logip-overview-card card-gold"
                  onClick={() => handleTabSwitch('blogs')}
                >
                  <div className="logip-overview-top">
                    <span className="logip-overview-icon icon-gold">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="8" y1="13" x2="16" y2="13" />
                        <line x1="8" y1="17" x2="13" y2="17" />
                      </svg>
                    </span>
                    <span className="logip-overview-arrow">&rarr;</span>
                  </div>
                  <div className="logip-overview-body">
                    <span className="logip-overview-label">Blog</span>
                    <strong className="logip-overview-value">{blogs.length}</strong>
                    <span className="logip-overview-meta">
                      {publishedBlogsCount} Published · {draftBlogsCount} Draft / Sched
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  className="logip-overview-card card-stone"
                  onClick={() => handleTabSwitch('videos')}
                >
                  <div className="logip-overview-top">
                    <span className="logip-overview-icon icon-stone">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
                        <rect x="2" y="5" width="15" height="14" rx="2" />
                        <polygon points="8 9.5 12.5 12 8 14.5 8 9.5" fill="currentColor" stroke="none" />
                        <path d="M17 9.5l5-2.5v10l-5-2.5" />
                      </svg>
                    </span>
                    <span className="logip-overview-arrow">&rarr;</span>
                  </div>
                  <div className="logip-overview-body">
                    <span className="logip-overview-label">Video</span>
                    <strong className="logip-overview-value">{videos.length}</strong>
                    <span className="logip-overview-meta">
                      {publishedVideosCount} Published · {draftVideosCount} Draft
                    </span>
                  </div>
                </button>
              </div>

              {/* ADMISSION GRAPHS */}
              <div className="logip-charts-grid">
                {/* LEFT GRAPH: ADMISSIONS BAR / TREND */}
                <div className="logip-chart-card">
                  <div className="logip-chart-head">
                    <div>
                      <h2 className="logip-chart-title">Admission Applications Graph</h2>
                      <p className="logip-chart-subtitle">
                        {admissionChartMode === 'stages'
                          ? 'Distribution across Cambridge grade stages'
                          : '6-month admission submission trend'}
                      </p>
                    </div>
                    <div className="logip-chart-toggle" role="tablist" aria-label="Admission graph view">
                      <button
                        type="button"
                        role="tab"
                        aria-selected={admissionChartMode === 'stages'}
                        className={`logip-chart-toggle-btn ${admissionChartMode === 'stages' ? 'active' : ''}`}
                        onClick={() => setAdmissionChartMode('stages')}
                      >
                        By Stage
                      </button>
                      <button
                        type="button"
                        role="tab"
                        aria-selected={admissionChartMode === 'timeline'}
                        className={`logip-chart-toggle-btn ${admissionChartMode === 'timeline' ? 'active' : ''}`}
                        onClick={() => setAdmissionChartMode('timeline')}
                      >
                        Monthly
                      </button>
                    </div>
                  </div>

                  <div className="logip-svg-chart-wrap">
                    {(() => {
                      const svgW = 540;
                      const svgH = 220;
                      const padL = 34;
                      const padR = 18;
                      const padT = 18;
                      const padB = 42;
                      const plotW = svgW - padL - padR;
                      const plotH = svgH - padT - padB;
                      const { yMax, yTicks, stageItems, months } = admissionAnalytics;
                      const items = admissionChartMode === 'stages' ? stageItems : months;
                      const slotW = plotW / items.length;
                      const barW = Math.min(48, slotW * 0.46);

                      const points = items.map((item, idx) => {
                        const cx = padL + slotW * idx + slotW / 2;
                        const barH = yMax > 0 ? (item.count / yMax) * plotH : 0;
                        const cy = padT + plotH - barH;
                        return { ...item, cx, cy, barH };
                      });

                      const polylinePts = points.map((p) => `${p.cx},${p.cy}`).join(' ');

                      return (
                        <svg
                          viewBox={`0 0 ${svgW} ${svgH}`}
                          className="logip-admission-svg"
                          role="img"
                          aria-label="Admission applications bar graph"
                        >
                          {/* Horizontal Gridlines & Y-Axis Ticks */}
                          {yTicks.map((tick) => {
                            const y = padT + plotH - (tick / yMax) * plotH;
                            return (
                              <g key={tick}>
                                <line
                                  x1={padL}
                                  y1={y}
                                  x2={svgW - padR}
                                  y2={y}
                                  stroke="#E1DCCA"
                                  strokeWidth="1"
                                  strokeDasharray={tick === 0 ? undefined : '4 4'}
                                />
                                <text
                                  x={padL - 8}
                                  y={y + 4}
                                  textAnchor="end"
                                  fontSize="10.5"
                                  fill="#6b7280"
                                >
                                  {tick}
                                </text>
                              </g>
                            );
                          })}

                          {/* Bars */}
                          {points.map((p, idx) => {
                            const barColor =
                              admissionChartMode === 'stages'
                                ? p.color
                                : idx % 3 === 0
                                  ? '#1E459F'
                                  : idx % 3 === 1
                                    ? '#FABD32'
                                    : '#CF2A2A';
                            const x = p.cx - barW / 2;
                            const safeH = p.count > 0 ? Math.max(6, p.barH) : 0;
                            const y = padT + plotH - safeH;
                            return (
                              <g key={p.label}>
                                <rect
                                  x={x}
                                  y={y}
                                  width={barW}
                                  height={safeH}
                                  rx="6"
                                  fill={barColor}
                                  stroke={p.stroke || 'none'}
                                  strokeWidth={p.stroke ? '1' : '0'}
                                />
                                <text
                                  x={p.cx}
                                  y={Math.max(12, y - 6)}
                                  textAnchor="middle"
                                  fontSize="11.5"
                                  fontWeight="700"
                                  fill="#111827"
                                >
                                  {p.count}
                                </text>
                                <text
                                  x={p.cx}
                                  y={padT + plotH + 17}
                                  textAnchor="middle"
                                  fontSize="11"
                                  fontWeight="600"
                                  fill="#1f2937"
                                >
                                  {p.label}
                                </text>
                                {p.sub && (
                                  <text
                                    x={p.cx}
                                    y={padT + plotH + 31}
                                    textAnchor="middle"
                                    fontSize="9.5"
                                    fill="#6b7280"
                                  >
                                    {p.sub}
                                  </text>
                                )}
                              </g>
                            );
                          })}

                          {/* Trend line overlay for Monthly view */}
                          {admissionChartMode === 'timeline' && points.length > 1 && (
                            <g>
                              <polyline
                                fill="none"
                                stroke="#1E459F"
                                strokeWidth="2.2"
                                strokeLinejoin="round"
                                strokeLinecap="round"
                                points={polylinePts}
                              />
                              {points.map((p) => (
                                <circle
                                  key={`pt-${p.label}`}
                                  cx={p.cx}
                                  cy={p.cy}
                                  r="4"
                                  fill="#FABD32"
                                  stroke="#1E459F"
                                  strokeWidth="2"
                                />
                              ))}
                            </g>
                          )}
                        </svg>
                      );
                    })()}
                  </div>
                </div>

                {/* RIGHT GRAPH: ADMISSION STATUS DONUT */}
                <div className="logip-chart-card">
                  <div className="logip-chart-head">
                    <div>
                      <h2 className="logip-chart-title">Admission Status</h2>
                      <p className="logip-chart-subtitle">
                        Pipeline status across all applications
                      </p>
                    </div>
                    <span className="logip-approval-chip">
                      {admissionAnalytics.approvalRate}% Approved
                    </span>
                  </div>

                  <div className="logip-donut-layout">
                    <div className="logip-donut-wrap">
                      {(() => {
                        const r = 54;
                        const c = 2 * Math.PI * r;
                        const { total, statusItems } = admissionAnalytics;
                        const segments = statusItems.reduce((acc, item) => {
                          const prevTotal =
                            acc.length > 0
                              ? acc[acc.length - 1].cumulativeEnd
                              : 0;
                          const len = total > 0 ? (item.count / total) * c : 0;
                          acc.push({
                            ...item,
                            len,
                            offset: -prevTotal,
                            cumulativeEnd: prevTotal + len,
                          });
                          return acc;
                        }, []);

                        return (
                          <svg viewBox="0 0 140 140" className="logip-donut-svg" role="img" aria-label="Admission status donut chart">
                            <circle
                              cx="70"
                              cy="70"
                              r={r}
                              fill="none"
                              stroke="#E1DCCA"
                              strokeWidth="16"
                            />
                            {total > 0 &&
                              segments.map((seg) =>
                                seg.len > 0 ? (
                                  <circle
                                    key={seg.label}
                                    cx="70"
                                    cy="70"
                                    r={r}
                                    fill="none"
                                    stroke={seg.color}
                                    strokeWidth="16"
                                    strokeDasharray={`${seg.len} ${c - seg.len}`}
                                    strokeDashoffset={seg.offset}
                                    transform="rotate(-90 70 70)"
                                  />
                                ) : null
                              )}
                            <text
                              x="70"
                              y="67"
                              textAnchor="middle"
                              fontSize="22"
                              fontWeight="700"
                              fill="#111827"
                            >
                              {total}
                            </text>
                            <text
                              x="70"
                              y="83"
                              textAnchor="middle"
                              fontSize="10"
                              fontWeight="600"
                              fill="#6b7280"
                            >
                              APPLICANTS
                            </text>
                          </svg>
                        );
                      })()}
                    </div>

                    <div className="logip-donut-legend">
                      {admissionAnalytics.statusItems.map((item) => (
                        <div className="logip-legend-row" key={item.label}>
                          <span
                            className="logip-legend-dot"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="logip-legend-name">{item.label}</span>
                          <strong className="logip-legend-count">{item.count}</strong>
                          <span className="logip-legend-pct">{item.pct}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* RECENT UPDATES ACROSS ALL 4 MODULES */}
              <div className="logip-home-recent-grid">
                <div className="logip-recent-card">
                  <div className="logip-recent-head">
                    <h3>Recent Admissions</h3>
                    <button type="button" onClick={() => handleTabSwitch('admission')}>
                      View all &rarr;
                    </button>
                  </div>
                  <div className="logip-recent-list">
                    {admissions.length === 0 ? (
                      <p className="logip-recent-empty">No admission applications yet.</p>
                    ) : (
                      admissions.slice(0, 3).map((item) => {
                        const name = `${item.first_name || item.firstName || ''} ${item.last_name || item.lastName || ''}`.trim() || 'Applicant';
                        const cls = item.applied_class || item.appliedClass || '—';
                        const status = item.status || 'Pending';
                        return (
                          <button
                            type="button"
                            key={item.id || item.ref_id}
                            className="logip-recent-row"
                            onClick={() => handleOpenAdmissionDetail(item)}
                          >
                            <div className="logip-recent-info">
                              <strong>{name}</strong>
                              <span>{cls} · {item.ref_id || item.id}</span>
                            </div>
                            <span className={`logip-status-badge ${getStatusClass(status)}`}>
                              {status}
                            </span>
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>

                <div className="logip-recent-card">
                  <div className="logip-recent-head">
                    <h3>Recent Contact Inquiries</h3>
                    <button type="button" onClick={() => handleTabSwitch('contact')}>
                      View all &rarr;
                    </button>
                  </div>
                  <div className="logip-recent-list">
                    {contacts.length === 0 ? (
                      <p className="logip-recent-empty">No contact inquiries yet.</p>
                    ) : (
                      contacts.slice(0, 3).map((item) => {
                        const status = item.status || 'New';
                        return (
                          <button
                            type="button"
                            key={item.id || item.ref_id}
                            className="logip-recent-row"
                            onClick={() => handleOpenContactDetail(item)}
                          >
                            <div className="logip-recent-info">
                              <strong>{item.name || 'Sender'}</strong>
                              <span>{item.purpose || item.society || 'General Inquiry'}</span>
                            </div>
                            <span className={`logip-status-badge ${getStatusClass(status)}`}>
                              {status}
                            </span>
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>

                <div className="logip-recent-card">
                  <div className="logip-recent-head">
                    <h3>Latest Blogs</h3>
                    <button type="button" onClick={() => handleTabSwitch('blogs')}>
                      View all &rarr;
                    </button>
                  </div>
                  <div className="logip-recent-list">
                    {blogs.length === 0 ? (
                      <p className="logip-recent-empty">No blog posts yet.</p>
                    ) : (
                      blogs.slice(0, 3).map((item) => (
                        <button
                          type="button"
                          key={item.id}
                          className="logip-recent-row"
                          onClick={() => {
                            setActiveTab('blogs');
                            handleOpenEditBlog(item);
                          }}
                        >
                          <div className="logip-recent-info">
                            <strong>{item.title}</strong>
                            <span>{item.publish_date || item.date || '—'} · {item.author}</span>
                          </div>
                          <span className={`logip-status-badge ${getStatusClass(item.status)}`}>
                            {item.status}
                          </span>
                        </button>
                      ))
                    )}
                  </div>
                </div>

                <div className="logip-recent-card">
                  <div className="logip-recent-head">
                    <h3>Latest Videos</h3>
                    <button type="button" onClick={() => handleTabSwitch('videos')}>
                      View all &rarr;
                    </button>
                  </div>
                  <div className="logip-recent-list">
                    {videos.length === 0 ? (
                      <p className="logip-recent-empty">No video sessions yet.</p>
                    ) : (
                      videos.slice(0, 3).map((item) => (
                        <button
                          type="button"
                          key={item.id}
                          className="logip-recent-row"
                          onClick={() => {
                            setActiveTab('videos');
                            handleOpenEditVideo(item);
                          }}
                        >
                          <div className="logip-recent-info">
                            <strong>{item.title}</strong>
                            <span>{item.session_date || item.date || '—'}</span>
                          </div>
                          <span className={`logip-status-badge ${getStatusClass(item.status)}`}>
                            {item.status}
                          </span>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : (
          /* BLOGS, VIDEOS, ADMISSION & CONTACT LIST VIEW */
          <section className="logip-main">
            {/* Top Greeting & Date */}
            <header className="logip-header">
              <div>
                <h1 className="logip-greeting">Hello, {displayName}</h1>
                <p className="logip-subgreeting">
                  {activeTab === 'blogs'
                    ? 'Manage your blog posts below.'
                    : activeTab === 'videos'
                      ? 'Manage your video sessions below.'
                      : activeTab === 'admission'
                        ? 'Review and manage student admission applications below.'
                        : 'Review and respond to contact form inquiries below.'}
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
              </div>
            ) : activeTab === 'videos' ? (
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
            ) : activeTab === 'admission' ? (
              <div className="logip-stats-row">
                <div className="logip-stat-card">
                  <div className="logip-stat-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </div>
                  <div className="logip-stat-info">
                    <span className="logip-stat-label">Total Applications</span>
                    <strong className="logip-stat-value">{admissions.length}</strong>
                    <span className="logip-stat-pill pill-blue">Stored in database</span>
                  </div>
                </div>

                <div className="logip-stat-card">
                  <div className="logip-stat-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  </div>
                  <div className="logip-stat-info">
                    <span className="logip-stat-label">Pending / Review</span>
                    <strong className="logip-stat-value">{pendingAdmissionsCount}</strong>
                    <span className="logip-stat-pill pill-amber">Awaiting decision</span>
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
                    <span className="logip-stat-label">Approved</span>
                    <strong className="logip-stat-value">{approvedAdmissionsCount}</strong>
                    <span className="logip-stat-pill pill-green">Accepted students</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="logip-stats-row">
                <div className="logip-stat-card">
                  <div className="logip-stat-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </div>
                  <div className="logip-stat-info">
                    <span className="logip-stat-label">Total Inquiries</span>
                    <strong className="logip-stat-value">{contacts.length}</strong>
                    <span className="logip-stat-pill pill-blue">Stored in database</span>
                  </div>
                </div>

                <div className="logip-stat-card">
                  <div className="logip-stat-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  </div>
                  <div className="logip-stat-info">
                    <span className="logip-stat-label">New / In Progress</span>
                    <strong className="logip-stat-value">{openContactsCount}</strong>
                    <span className="logip-stat-pill pill-amber">Needs response</span>
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
                    <span className="logip-stat-label">Resolved</span>
                    <strong className="logip-stat-value">{resolvedContactsCount}</strong>
                    <span className="logip-stat-pill pill-green">Handled</span>
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
                      : activeTab === 'videos'
                        ? 'Search video sessions...'
                        : activeTab === 'admission'
                          ? 'Search student, email, grade, ref ID...'
                          : 'Search name, email, purpose, message...'
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
                  {activeTab === 'admission' ? (
                    <>
                      <option value="Pending">Pending</option>
                      <option value="Under Review">Under Review</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </>
                  ) : activeTab === 'contact' ? (
                    <>
                      <option value="New">New</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </>
                  ) : activeTab === 'videos' ? (
                    <>
                      <option value="Published">Published</option>
                      <option value="Draft">Draft</option>
                    </>
                  ) : (
                    <>
                      <option value="Published">Published</option>
                      <option value="Scheduled">Scheduled</option>
                      <option value="Draft">Draft</option>
                    </>
                  )}
                </select>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>

              {activeTab === 'admission' || activeTab === 'contact' ? (
                <button
                  type="button"
                  className="logip-add-btn"
                  onClick={
                    activeTab === 'admission'
                      ? handleExportAdmissionsCSV
                      : handleExportContactsCSV
                  }
                  title={
                    activeTab === 'admission'
                      ? 'Export admission applications as CSV'
                      : 'Export contact responses as CSV'
                  }
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  <span>Export CSV</span>
                </button>
              ) : (
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
              )}
            </div>

            {/* TABLE SECTION */}
            <div className="logip-table-section">
              <h2 className="logip-section-title">
                {activeTab === 'blogs'
                  ? 'Blogs'
                  : activeTab === 'videos'
                    ? 'Videos Sessions'
                    : activeTab === 'admission'
                      ? 'Admission Applications'
                      : 'Contact Responses'}
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
              ) : activeTab === 'videos' ? (
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
                        const rawVideoUrl = item.video_url || '';
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
              ) : activeTab === 'admission' ? (
                <div className="logip-table logip-table-admissions">
                  <div className="logip-table-head">
                    <span>Applicant</span>
                    <span>Applying Grade</span>
                    <span>Parent Contact</span>
                    <span>Date of Birth</span>
                    <span>Applied Date</span>
                    <span>Status</span>
                    <span>Actions</span>
                  </div>

                  <div className="logip-table-body">
                    {filteredAdmissions.length === 0 ? (
                      <div className="logip-empty-row">
                        {dbLoading ? 'Loading applications...' : 'No admission applications found.'}
                      </div>
                    ) : (
                      filteredAdmissions.map((item) => {
                        const studentName = `${item.first_name || item.firstName || ''} ${item.last_name || item.lastName || ''}`.trim() || 'Unnamed Applicant';
                        const refId = item.ref_id || item.id;
                        const appliedClass = item.applied_class || item.appliedClass || '—';
                        const dob = item.date_of_birth || item.dateOfBirth || '—';
                        const dateStr = formatAppDate(item.created_at || item.submittedAt);
                        const currentStatus = item.status || 'Pending';

                        return (
                          <div className="logip-table-row" key={item.id || refId}>
                            <div className="logip-cell-main">
                              <div className="logip-student-icon" aria-hidden="true">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                  <circle cx="12" cy="7" r="4" />
                                </svg>
                              </div>
                              <div className="logip-applicant-info">
                                <span className="logip-item-title">{studentName}</span>
                                <span className="logip-cell-ref">{refId}</span>
                              </div>
                            </div>

                            <div className="logip-cell-text">
                              <span className="logip-grade-badge">{appliedClass}</span>
                            </div>

                            <div className="logip-contact-line">
                              <a href={`mailto:${item.email}`} className="logip-contact-email" title={item.email}>
                                {item.email}
                              </a>
                              <span className="logip-contact-phone">{item.phone}</span>
                            </div>

                            <div className="logip-cell-date">{dob}</div>

                            <div className="logip-cell-date">{dateStr}</div>

                            <div>
                              <button
                                type="button"
                                onClick={() => handleCycleAdmissionStatus(item)}
                                className={`logip-status-badge ${getStatusClass(currentStatus)}`}
                                title="Click to cycle status (Pending -> Under Review -> Approved -> Rejected)"
                              >
                                {currentStatus}
                              </button>
                            </div>

                            <div className="logip-cell-actions">
                              <button
                                type="button"
                                className="logip-action-btn"
                                onClick={() => handleOpenAdmissionDetail(item)}
                                title="View full details"
                                aria-label={`View details of ${studentName}`}
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                  <circle cx="12" cy="12" r="3" />
                                </svg>
                              </button>
                              <button
                                type="button"
                                className="logip-action-btn logip-action-delete"
                                onClick={() => setAdmissionToDelete(item)}
                                title="Delete application"
                                aria-label={`Delete ${studentName}`}
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
                <div className="logip-table logip-table-contacts">
                  <div className="logip-table-head">
                    <span>Sender</span>
                    <span>Purpose</span>
                    <span>Contact Info</span>
                    <span>Message</span>
                    <span>Received</span>
                    <span>Status</span>
                    <span>Actions</span>
                  </div>

                  <div className="logip-table-body">
                    {filteredContacts.length === 0 ? (
                      <div className="logip-empty-row">
                        {dbLoading ? 'Loading contact inquiries...' : 'No contact responses found.'}
                      </div>
                    ) : (
                      filteredContacts.map((item) => {
                        const senderName = item.name || 'Anonymous';
                        const refId = item.ref_id || item.id;
                        const purpose = item.purpose || item.society || 'General Inquiry';
                        const dateStr = formatAppDate(item.created_at || item.submittedAt);
                        const currentStatus = item.status || 'New';

                        return (
                          <div className="logip-table-row" key={item.id || refId}>
                            <div className="logip-cell-main">
                              <div className="logip-student-icon" aria-hidden="true">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                  <polyline points="22,6 12,13 2,6" />
                                </svg>
                              </div>
                              <div className="logip-applicant-info">
                                <span className="logip-item-title">{senderName}</span>
                                <span className="logip-cell-ref">{refId}</span>
                              </div>
                            </div>

                            <div className="logip-cell-text">
                              <span className="logip-grade-badge">{purpose}</span>
                            </div>

                            <div className="logip-contact-line">
                              <a href={`mailto:${item.email}`} className="logip-contact-email" title={item.email}>
                                {item.email}
                              </a>
                              <span className="logip-contact-phone">{item.phone}</span>
                            </div>

                            <div className="logip-message-preview" title={item.message}>
                              {item.message || '—'}
                            </div>

                            <div className="logip-cell-date">{dateStr}</div>

                            <div>
                              <button
                                type="button"
                                onClick={() => handleCycleContactStatus(item)}
                                className={`logip-status-badge ${getStatusClass(currentStatus)}`}
                                title="Click to cycle status (New -> In Progress -> Resolved)"
                              >
                                {currentStatus}
                              </button>
                            </div>

                            <div className="logip-cell-actions">
                              <button
                                type="button"
                                className="logip-action-btn"
                                onClick={() => handleOpenContactDetail(item)}
                                title="View full message"
                                aria-label={`View message from ${senderName}`}
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                  <circle cx="12" cy="12" r="3" />
                                </svg>
                              </button>
                              <button
                                type="button"
                                className="logip-action-btn logip-action-delete"
                                onClick={() => setContactToDelete(item)}
                                title="Delete response"
                                aria-label={`Delete message from ${senderName}`}
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

      {/* ADMISSION APPLICATION DETAILS MODAL */}
      {selectedAdmission && (
        <div
          className="logip-modal-backdrop"
          onClick={() => !isUpdatingAdmission && setSelectedAdmission(null)}
        >
          <div
            className="logip-modal logip-modal-detail"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="logip-detail-modal-header">
              <div>
                <span className="logip-detail-ref-badge">
                  {selectedAdmission.ref_id || selectedAdmission.id}
                </span>
                <h3 className="logip-detail-modal-title">
                  {selectedAdmission.first_name || selectedAdmission.firstName}{' '}
                  {selectedAdmission.last_name || selectedAdmission.lastName}
                </h3>
              </div>
              <button
                type="button"
                className="logip-modal-close-btn"
                onClick={() => setSelectedAdmission(null)}
                aria-label="Close"
              >
                &times;
              </button>
            </div>

            <div className="logip-detail-grid">
              <div className="logip-detail-item">
                <span className="logip-detail-label">Applying Grade / Class</span>
                <strong className="logip-detail-val">
                  {selectedAdmission.applied_class || selectedAdmission.appliedClass || '—'}
                </strong>
              </div>

              <div className="logip-detail-item">
                <span className="logip-detail-label">Date of Birth</span>
                <span className="logip-detail-val">
                  {selectedAdmission.date_of_birth || selectedAdmission.dateOfBirth || '—'}
                </span>
              </div>

              <div className="logip-detail-item">
                <span className="logip-detail-label">Parent / Guardian Email</span>
                <a
                  href={`mailto:${selectedAdmission.email}`}
                  className="logip-detail-val text-link"
                >
                  {selectedAdmission.email}
                </a>
              </div>

              <div className="logip-detail-item">
                <span className="logip-detail-label">Parent / Guardian Phone</span>
                <a
                  href={`tel:${selectedAdmission.phone}`}
                  className="logip-detail-val text-link"
                >
                  {selectedAdmission.phone}
                </a>
              </div>

              <div className="logip-detail-item full-width">
                <span className="logip-detail-label">Residential Address</span>
                <p className="logip-detail-val logip-address-box">
                  {selectedAdmission.address || 'No address provided'}
                </p>
              </div>

              <div className="logip-detail-item">
                <span className="logip-detail-label">Submitted On</span>
                <span className="logip-detail-val">
                  {formatAppDate(selectedAdmission.created_at || selectedAdmission.submittedAt)}
                </span>
              </div>

              <div className="logip-detail-item">
                <span className="logip-detail-label">Application Status</span>
                <select
                  className="logip-pill-input"
                  value={modalStatus}
                  onChange={(e) => setModalStatus(e.target.value)}
                >
                  <option value="Pending">Pending</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div className="logip-detail-item full-width">
                <span className="logip-detail-label">Internal Admin Notes</span>
                <textarea
                  rows="3"
                  className="logip-notes-input"
                  value={modalNotes}
                  onChange={(e) => setModalNotes(e.target.value)}
                  placeholder="Add notes for this applicant (e.g., Interview scheduled, documents verified, etc.)..."
                />
              </div>
            </div>

            <div className="logip-modal-actions">
              <button
                type="button"
                onClick={() => setSelectedAdmission(null)}
                className="logip-btn-cancel"
                disabled={isUpdatingAdmission}
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleSaveAdmissionModal}
                className="logip-btn-save"
                disabled={isUpdatingAdmission}
              >
                {isUpdatingAdmission ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE ADMISSION CONFIRMATION MODAL */}
      {admissionToDelete && (
        <div
          className="logip-modal-backdrop"
          onClick={() => !isDeletingAdmission && setAdmissionToDelete(null)}
        >
          <div className="logip-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Delete Admission Application</h3>
            <p className="logip-delete-message">
              Are you sure you want to delete the application for{' '}
              <strong>
                {admissionToDelete.first_name || admissionToDelete.firstName}{' '}
                {admissionToDelete.last_name || admissionToDelete.lastName}
              </strong>{' '}
              (Ref: {admissionToDelete.ref_id || admissionToDelete.id})? This action cannot be undone.
            </p>
            <div className="logip-modal-actions">
              <button
                type="button"
                onClick={() => setAdmissionToDelete(null)}
                className="logip-btn-cancel"
                disabled={isDeletingAdmission}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteAdmission}
                className="logip-btn-delete"
                disabled={isDeletingAdmission}
              >
                {isDeletingAdmission ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONTACT INQUIRY DETAILS MODAL */}
      {selectedContact && (
        <div
          className="logip-modal-backdrop"
          onClick={() => !isUpdatingContact && setSelectedContact(null)}
        >
          <div
            className="logip-modal logip-modal-detail"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="logip-detail-modal-header">
              <div>
                <span className="logip-detail-ref-badge">
                  {selectedContact.ref_id || selectedContact.id}
                </span>
                <h3 className="logip-detail-modal-title">
                  {selectedContact.name || 'Contact Inquiry'}
                </h3>
              </div>
              <button
                type="button"
                className="logip-modal-close-btn"
                onClick={() => setSelectedContact(null)}
                aria-label="Close"
              >
                &times;
              </button>
            </div>

            <div className="logip-detail-grid">
              <div className="logip-detail-item">
                <span className="logip-detail-label">Purpose / Inquiry</span>
                <strong className="logip-detail-val">
                  {selectedContact.purpose || selectedContact.society || 'General Inquiry'}
                </strong>
              </div>

              <div className="logip-detail-item">
                <span className="logip-detail-label">Received On</span>
                <span className="logip-detail-val">
                  {formatAppDate(selectedContact.created_at || selectedContact.submittedAt)}
                </span>
              </div>

              <div className="logip-detail-item">
                <span className="logip-detail-label">Email</span>
                <a
                  href={`mailto:${selectedContact.email}`}
                  className="logip-detail-val text-link"
                >
                  {selectedContact.email}
                </a>
              </div>

              <div className="logip-detail-item">
                <span className="logip-detail-label">Phone</span>
                <a
                  href={`tel:${selectedContact.phone}`}
                  className="logip-detail-val text-link"
                >
                  {selectedContact.phone}
                </a>
              </div>

              <div className="logip-detail-item full-width">
                <span className="logip-detail-label">Message</span>
                <p className="logip-detail-val logip-address-box logip-message-box">
                  {selectedContact.message || 'No message provided'}
                </p>
              </div>

              <div className="logip-detail-item">
                <span className="logip-detail-label">Inquiry Status</span>
                <select
                  className="logip-pill-input"
                  value={contactModalStatus}
                  onChange={(e) => setContactModalStatus(e.target.value)}
                >
                  <option value="New">New</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>

              <div className="logip-detail-item full-width">
                <span className="logip-detail-label">Internal Admin Notes</span>
                <textarea
                  rows="3"
                  className="logip-notes-input"
                  value={contactModalNotes}
                  onChange={(e) => setContactModalNotes(e.target.value)}
                  placeholder="Add follow-up notes for this inquiry (e.g., Called back, tour scheduled, etc.)..."
                />
              </div>
            </div>

            <div className="logip-modal-actions">
              <button
                type="button"
                onClick={() => setSelectedContact(null)}
                className="logip-btn-cancel"
                disabled={isUpdatingContact}
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleSaveContactModal}
                className="logip-btn-save"
                disabled={isUpdatingContact}
              >
                {isUpdatingContact ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONTACT CONFIRMATION MODAL */}
      {contactToDelete && (
        <div
          className="logip-modal-backdrop"
          onClick={() => !isDeletingContact && setContactToDelete(null)}
        >
          <div className="logip-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Delete Contact Response</h3>
            <p className="logip-delete-message">
              Are you sure you want to delete the inquiry from{' '}
              <strong>{contactToDelete.name}</strong>{' '}
              (Ref: {contactToDelete.ref_id || contactToDelete.id})? This action cannot be undone.
            </p>
            <div className="logip-modal-actions">
              <button
                type="button"
                onClick={() => setContactToDelete(null)}
                className="logip-btn-cancel"
                disabled={isDeletingContact}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteContact}
                className="logip-btn-delete"
                disabled={isDeletingContact}
              >
                {isDeletingContact ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
