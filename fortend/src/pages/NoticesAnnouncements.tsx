import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

interface Notice {
  id: string;
  title: string;
  content: string;
  date: string;
  expiryDate?: string;
  category: 'general' | 'academic' | 'exam' | 'holiday' | 'event' | 'urgent';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  attachments?: string[];
  sentTo: string[];
  createdBy: string;
  status: 'draft' | 'published' | 'archived';
  views: number;
  targetAudience: ('students' | 'parents' | 'teachers' | 'staff')[];
}

interface WhatsAppGroup {
  id: string;
  name: string;
  groupId: string;
  phoneNumber: string;
  category: string;
  members: number;
  isActive: boolean;
}

const NoticesAnnouncements: React.FC = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [whatsappGroups, setWhatsappGroups] = useState<WhatsAppGroup[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [sendingWhatsApp, setSendingWhatsApp] = useState(false);
  const [customMessage, setCustomMessage] = useState('');
  const [includeFooter, setIncludeFooter] = useState(true);

  // Static WhatsApp Groups (5 groups)
  const initialWhatsAppGroups: WhatsAppGroup[] = [
    {
      id: 'GRP001',
      name: 'School Management Group',
      groupId: 'management@broadcast',
      phoneNumber: '919876543210',
      category: 'Management',
      members: 15,
      isActive: true
    },
    {
      id: 'GRP002',
      name: 'Teachers Staff Group',
      groupId: 'teachers@broadcast',
      phoneNumber: '919876543211',
      category: 'Teachers',
      members: 45,
      isActive: true
    },
    {
      id: 'GRP003',
      name: 'Parents Group - Class 10th',
      groupId: 'parents10th@broadcast',
      phoneNumber: '919876543212',
      category: 'Parents',
      members: 120,
      isActive: true
    },
    {
      id: 'GRP004',
      name: 'Parents Group - Class 12th',
      groupId: 'parents12th@broadcast',
      phoneNumber: '919876543213',
      category: 'Parents',
      members: 110,
      isActive: true
    },
    {
      id: 'GRP005',
      name: 'Alumni Association',
      groupId: 'alumni@broadcast',
      phoneNumber: '919876543214',
      category: 'Alumni',
      members: 200,
      isActive: true
    },
    {
      id: 'GRP006',
      name: 'Sports Committee',
      groupId: 'sports@broadcast',
      phoneNumber: '919876543215',
      category: 'Sports',
      members: 35,
      isActive: true
    },
    {
      id: 'GRP007',
      name: 'Event Planning Group',
      groupId: 'events@broadcast',
      phoneNumber: '919876543216',
      category: 'Events',
      members: 25,
      isActive: true
    }
  ];

  // Static Notices Data
  const initialNotices: Notice[] = [
    {
      id: 'NOT001',
      title: 'School Reopening After Summer Break',
      content: 'School will reopen on 1st July 2024. All students must report in complete uniform. Summer homework should be submitted on the first day.',
      date: '2024-06-15',
      expiryDate: '2024-07-15',
      category: 'general',
      priority: 'high',
      sentTo: ['GRP001', 'GRP002', 'GRP003', 'GRP004'],
      createdBy: 'Principal Office',
      status: 'published',
      views: 450,
      targetAudience: ['students', 'parents', 'teachers']
    },
    {
      id: 'NOT002',
      title: 'Urgent: Holiday on 25th June',
      content: 'Due to heavy rainfall prediction, the school will remain closed on 25th June 2024. All exams scheduled for that day will be rescheduled.',
      date: '2024-06-24',
      expiryDate: '2024-06-26',
      category: 'holiday',
      priority: 'urgent',
      sentTo: ['GRP001', 'GRP002', 'GRP003', 'GRP004'],
      createdBy: 'Principal Office',
      status: 'published',
      views: 820,
      targetAudience: ['students', 'parents', 'teachers', 'staff']
    },
    {
      id: 'NOT003',
      title: 'Annual Sports Day Registration',
      content: 'Annual Sports Day will be held on 15th August. Last date for registration is 10th August. Interested students should register with their class teachers.',
      date: '2024-07-20',
      expiryDate: '2024-08-15',
      category: 'event',
      priority: 'medium',
      sentTo: ['GRP001', 'GRP002', 'GRP005', 'GRP006'],
      createdBy: 'Sports Department',
      status: 'published',
      views: 320,
      targetAudience: ['students', 'teachers']
    },
    {
      id: 'NOT004',
      title: 'Parent-Teacher Meeting Schedule',
      content: 'Parent-Teacher Meeting for classes 9th-12th will be held on 5th August 2024 from 9 AM to 3 PM. Please bring your child\'s report card.',
      date: '2024-07-25',
      expiryDate: '2024-08-05',
      category: 'academic',
      priority: 'high',
      sentTo: ['GRP001', 'GRP002', 'GRP003', 'GRP004'],
      createdBy: 'Academic Coordinator',
      status: 'published',
      views: 560,
      targetAudience: ['parents', 'teachers']
    },
    {
      id: 'NOT005',
      title: 'Half-Yearly Exam Schedule',
      content: 'Half-yearly examinations will start from 15th September. Detailed timetable has been uploaded on the school portal. Students are advised to prepare well.',
      date: '2024-08-01',
      expiryDate: '2024-09-30',
      category: 'exam',
      priority: 'high',
      sentTo: ['GRP001', 'GRP002', 'GRP003', 'GRP004'],
      createdBy: 'Examination Department',
      status: 'published',
      views: 890,
      targetAudience: ['students', 'parents', 'teachers']
    },
    {
      id: 'NOT006',
      title: 'Urgent: School Bus Route Changes',
      content: 'Due to road construction, some school bus routes have been changed. New route details have been sent to parents via SMS. Please check with the transport department for any queries.',
      date: '2024-08-05',
      expiryDate: '2024-08-20',
      category: 'urgent',
      priority: 'urgent',
      sentTo: ['GRP001', 'GRP002', 'GRP003', 'GRP004'],
      createdBy: 'Transport Department',
      status: 'published',
      views: 410,
      targetAudience: ['parents', 'students']
    },
    {
      id: 'NOT007',
      title: 'Draft: New Fee Structure 2024-25',
      content: 'The new fee structure for academic year 2024-25 is being finalized. Suggestions are welcome from parents before 20th August.',
      date: '2024-08-10',
      category: 'general',
      priority: 'low',
      sentTo: [],
      createdBy: 'Accounts Department',
      status: 'draft',
      views: 0,
      targetAudience: ['parents']
    }
  ];

  useEffect(() => {
    setNotices(initialNotices);
    setWhatsappGroups(initialWhatsAppGroups);
  }, []);

  // Filter notices
  const filteredNotices = notices.filter(notice => {
    const matchesSearch = notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notice.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || notice.category === filterCategory;
    const matchesPriority = filterPriority === 'all' || notice.priority === filterPriority;
    return matchesSearch && matchesCategory && matchesPriority;
  });

  // Handle Add/Update Notice
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const noticeData: Omit<Notice, 'id' | 'views'> = {
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      date: new Date().toISOString().split('T')[0],
      expiryDate: formData.get('expiryDate') as string || undefined,
      category: formData.get('category') as Notice['category'],
      priority: formData.get('priority') as Notice['priority'],
      sentTo: [],
      createdBy: formData.get('createdBy') as string,
      status: formData.get('status') as Notice['status'],
      targetAudience: (formData.getAll('targetAudience') as string[]) as Notice['targetAudience']
    };

    if (editingNotice) {
      setNotices(prev => prev.map(n => 
        n.id === editingNotice.id ? { ...noticeData, id: n.id, views: n.views } : n
      ));
      toast.success('Notice updated successfully!');
    } else {
      const newId = `NOT${String(notices.length + 1).padStart(3, '0')}`;
      setNotices(prev => [{ ...noticeData, id: newId, views: 0 }, ...prev]);
      toast.success('Notice added successfully!');
    }
    
    setShowModal(false);
    setEditingNotice(null);
  };

  // Handle Delete Notice
  const handleDelete = (notice: Notice) => {
    if (window.confirm(`Are you sure you want to delete "${notice.title}"?`)) {
      setNotices(prev => prev.filter(n => n.id !== notice.id));
      toast.success('Notice deleted successfully!');
    }
  };

  // Handle Archive Notice
  const handleArchive = (notice: Notice) => {
    setNotices(prev => prev.map(n => 
      n.id === notice.id ? { ...n, status: 'archived' } : n
    ));
    toast.success('Notice archived successfully!');
  };

  // Simulate sending to WhatsApp
  const sendToWhatsApp = async () => {
    if (!selectedNotice) return;
    if (selectedGroups.length === 0) {
      toast.error('Please select at least one WhatsApp group');
      return;
    }

    setSendingWhatsApp(true);
    
    // Prepare message
    const priorityEmoji = {
      low: 'ℹ️',
      medium: '📢',
      high: '⚠️',
      urgent: '🚨'
    };
    
    const categoryEmoji = {
      general: '📌',
      academic: '📚',
      exam: '✍️',
      holiday: '🎉',
      event: '🎪',
      urgent: '🔴'
    };
    
    let message = `${priorityEmoji[selectedNotice.priority]} *${selectedNotice.title}*\n\n`;
    message += `${selectedNotice.content}\n\n`;
    message += `📅 Date: ${new Date(selectedNotice.date).toLocaleDateString()}\n`;
    if (selectedNotice.expiryDate) {
      message += `⏰ Valid till: ${new Date(selectedNotice.expiryDate).toLocaleDateString()}\n`;
    }
    message += `🏷️ Category: ${categoryEmoji[selectedNotice.category]} ${selectedNotice.category.toUpperCase()}\n`;
    message += `⭐ Priority: ${selectedNotice.priority.toUpperCase()}\n\n`;
    
    if (includeFooter) {
      message += `---\n🏫 *EduManager School*\n📞 Contact: +91-XXXXXXXXXX\n🌐 www.edumanager.edu\n`;
    }
    
    if (customMessage) {
      message += `\n📝 *Additional Note:*\n${customMessage}\n`;
    }

    // Simulate sending to multiple groups
    for (const groupId of selectedGroups) {
      const group = whatsappGroups.find(g => g.id === groupId);
      if (group) {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        console.log(`Sending to ${group.name} (${group.phoneNumber}):`, message);
        
        // In real implementation, you would use WhatsApp Business API
        // const whatsappUrl = `https://api.whatsapp.com/send?phone=${group.phoneNumber}&text=${encodeURIComponent(message)}`;
        // window.open(whatsappUrl, '_blank');
      }
    }
    
    // Update notice with sent groups
    const newSentTo = [...(selectedNotice.sentTo || []), ...selectedGroups];
    setNotices(prev => prev.map(n => 
      n.id === selectedNotice.id ? { ...n, sentTo: [...new Set(newSentTo)] } : n
    ));
    
    setSendingWhatsApp(false);
    setShowWhatsAppModal(false);
    setSelectedGroups([]);
    setCustomMessage('');
    
    toast.success(`Notice sent to ${selectedGroups.length} WhatsApp group(s)!`);
  };

  // Get priority badge color
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <span className="px-2 py-1 text-xs rounded-full bg-red-500/20 text-red-400 animate-pulse">🚨 URGENT</span>;
      case 'high':
        return <span className="px-2 py-1 text-xs rounded-full bg-orange-500/20 text-orange-400">⚠️ HIGH</span>;
      case 'medium':
        return <span className="px-2 py-1 text-xs rounded-full bg-yellow-500/20 text-yellow-400">📢 MEDIUM</span>;
      default:
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-500/20 text-gray-400">ℹ️ LOW</span>;
    }
  };

  // Get category badge
  const getCategoryBadge = (category: string) => {
    const badges: Record<string, string> = {
      general: 'bg-blue-500/20 text-blue-400',
      academic: 'bg-purple-500/20 text-purple-400',
      exam: 'bg-red-500/20 text-red-400',
      holiday: 'bg-green-500/20 text-green-400',
      event: 'bg-pink-500/20 text-pink-400',
      urgent: 'bg-red-500/20 text-red-400'
    };
    const icons: Record<string, string> = {
      general: '📌',
      academic: '📚',
      exam: '✍️',
      holiday: '🎉',
      event: '🎪',
      urgent: '🔴'
    };
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${badges[category]}`}>
        {icons[category]} {category.toUpperCase()}
      </span>
    );
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-500/20 text-green-400">✓ Published</span>;
      case 'draft':
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-500/20 text-gray-400">📝 Draft</span>;
      default:
        return <span className="px-2 py-1 text-xs rounded-full bg-red-500/20 text-red-400">📦 Archived</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
            <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6m0 6a3 3 0 100-6m-6 0a3 3 0 100-6m0 6a3 3 0 100-6" />
            </svg>
            Notices & Announcements
          </h1>
          <p className="text-gray-400 mt-1">Create, manage and share important notices with WhatsApp integration</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Notices</p>
                <p className="text-2xl font-bold text-white">{notices.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-green-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Published</p>
                <p className="text-2xl font-bold text-green-400">
                  {notices.filter(n => n.status === 'published').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-yellow-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Views</p>
                <p className="text-2xl font-bold text-yellow-400">
                  {notices.reduce((sum, n) => sum + n.views, 0).toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-purple-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">WhatsApp Groups</p>
                <p className="text-2xl font-bold text-purple-400">{whatsappGroups.length}</p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <div className="relative w-full sm:w-96">
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search notices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 outline-none"
            />
          </div>
          
          <div className="flex gap-3 w-full sm:w-auto">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 outline-none"
            >
              <option value="all">All Categories</option>
              <option value="general">📌 General</option>
              <option value="academic">📚 Academic</option>
              <option value="exam">✍️ Exam</option>
              <option value="holiday">🎉 Holiday</option>
              <option value="event">🎪 Event</option>
              <option value="urgent">🔴 Urgent</option>
            </select>
            
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 outline-none"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">🚨 Urgent</option>
              <option value="high">⚠️ High</option>
              <option value="medium">📢 Medium</option>
              <option value="low">ℹ️ Low</option>
            </select>
            
            <button
              onClick={() => {
                setEditingNotice(null);
                setShowModal(true);
              }}
              className="px-5 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Notice
            </button>
          </div>
        </div>

        {/* Notices Table */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Title</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Priority</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Views</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">WhatsApp</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredNotices.map((notice) => (
                  <tr key={notice.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-white">{notice.title}</p>
                        <p className="text-xs text-gray-400 line-clamp-1">{notice.content.substring(0, 60)}...</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">{getCategoryBadge(notice.category)}</td>
                    <td className="px-4 py-3">{getPriorityBadge(notice.priority)}</td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-300">{new Date(notice.date).toLocaleDateString()}</div>
                      {notice.expiryDate && (
                        <div className="text-xs text-gray-500">Valid till: {new Date(notice.expiryDate).toLocaleDateString()}</div>
                      )}
                    </td>
                    <td className="px-4 py-3">{getStatusBadge(notice.status)}</td>
                    <td className="px-4 py-3 text-center text-sm text-yellow-400">{notice.views.toLocaleString()}</td>
                    <td className="px-4 py-3 text-center">
                      {notice.status === 'published' && (
                        <button
                          onClick={() => {
                            setSelectedNotice(notice);
                            setShowWhatsAppModal(true);
                          }}
                          className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded-lg transition-all flex items-center gap-1 mx-auto"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          Send
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => {
                            setEditingNotice(notice);
                            setShowModal(true);
                          }}
                          className="p-1 text-yellow-400 hover:text-yellow-300 transition-colors"
                          title="Edit"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        {notice.status === 'published' && (
                          <button
                            onClick={() => handleArchive(notice)}
                            className="p-1 text-blue-400 hover:text-blue-300 transition-colors"
                            title="Archive"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                            </svg>
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(notice)}
                          className="p-1 text-red-400 hover:text-red-300 transition-colors"
                          title="Delete"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredNotices.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400">No notices found</p>
            </div>
          )}
        </div>

        {/* WhatsApp Groups List */}
        <div className="mt-6 bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
            </svg>
            Connected WhatsApp Groups ({whatsappGroups.length})
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {whatsappGroups.map(group => (
              <div key={group.id} className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm">
                    {group.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{group.name}</p>
                    <p className="text-xs text-gray-400">{group.members} members</p>
                  </div>
                </div>
                <div className="text-xs text-gray-500">📱 {group.phoneNumber}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add/Edit Notice Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-gray-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
            <div className="sticky top-0 bg-gray-900 px-6 py-4 border-b border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">
                {editingNotice ? 'Edit Notice' : 'Create New Notice'}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingNotice(null);
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Title *</label>
                <input
                  type="text"
                  name="title"
                  defaultValue={editingNotice?.title}
                  required
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 outline-none"
                  placeholder="Enter notice title..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Content *</label>
                <textarea
                  name="content"
                  defaultValue={editingNotice?.content}
                  required
                  rows={5}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 outline-none"
                  placeholder="Write notice content here..."
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Category *</label>
                  <select
                    name="category"
                    defaultValue={editingNotice?.category || 'general'}
                    required
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 outline-none"
                  >
                    <option value="general">📌 General</option>
                    <option value="academic">📚 Academic</option>
                    <option value="exam">✍️ Exam</option>
                    <option value="holiday">🎉 Holiday</option>
                    <option value="event">🎪 Event</option>
                    <option value="urgent">🔴 Urgent</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Priority *</label>
                  <select
                    name="priority"
                    defaultValue={editingNotice?.priority || 'medium'}
                    required
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 outline-none"
                  >
                    <option value="low">ℹ️ Low</option>
                    <option value="medium">📢 Medium</option>
                    <option value="high">⚠️ High</option>
                    <option value="urgent">🚨 Urgent</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Expiry Date (Optional)</label>
                  <input
                    type="date"
                    name="expiryDate"
                    defaultValue={editingNotice?.expiryDate}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Created By *</label>
                  <input
                    type="text"
                    name="createdBy"
                    defaultValue={editingNotice?.createdBy || 'Principal Office'}
                    required
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Status *</label>
                  <select
                    name="status"
                    defaultValue={editingNotice?.status || 'draft'}
                    required
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 outline-none"
                  >
                    <option value="draft">📝 Draft</option>
                    <option value="published">✓ Publish Now</option>
                  </select>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Target Audience *</label>
                  <div className="grid grid-cols-2 gap-3 p-3 bg-gray-800/50 rounded-lg">
                    {['students', 'parents', 'teachers', 'staff'].map(audience => (
                      <label key={audience} className="flex items-center gap-2 text-sm text-gray-300">
                        <input
                          type="checkbox"
                          name="targetAudience"
                          value={audience}
                          defaultChecked={editingNotice?.targetAudience?.includes(audience as any)}
                          className="rounded border-gray-600 text-blue-500 focus:ring-blue-500"
                        />
                        {audience.charAt(0).toUpperCase() + audience.slice(1)}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all"
                >
                  {editingNotice ? 'Update Notice' : 'Create Notice'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingNotice(null);
                  }}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* WhatsApp Send Modal */}
      {showWhatsAppModal && selectedNotice && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl max-w-2xl w-full border border-gray-700">
            <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Send to WhatsApp
              </h2>
              <button
                onClick={() => {
                  setShowWhatsAppModal(false);
                  setSelectedGroups([]);
                  setCustomMessage('');
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-300 mb-2">Select WhatsApp Groups</h3>
                <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto">
                  {whatsappGroups.map(group => (
                    <label key={group.id} className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedGroups.includes(group.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedGroups([...selectedGroups, group.id]);
                          } else {
                            setSelectedGroups(selectedGroups.filter(id => id !== group.id));
                          }
                        }}
                        className="w-4 h-4 text-green-500 rounded focus:ring-green-500"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-xs">
                            {group.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">{group.name}</p>
                            <p className="text-xs text-gray-400">{group.members} members • {group.category}</p>
                          </div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Additional Message (Optional)
                </label>
                <textarea
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-green-500 outline-none"
                  placeholder="Add any additional message to be sent with the notice..."
                />
              </div>
              
              <div className="mb-4">
                <label className="flex items-center gap-2 text-sm text-gray-300">
                  <input
                    type="checkbox"
                    checked={includeFooter}
                    onChange={(e) => setIncludeFooter(e.target.checked)}
                    className="rounded border-gray-600 text-green-500 focus:ring-green-500"
                  />
                  Include school footer (contact info & website)
                </label>
              </div>
              
              <div className="bg-gray-800/50 rounded-lg p-4 mb-4">
                <p className="text-xs text-gray-400 mb-2">Preview of message:</p>
                <div className="text-sm text-white whitespace-pre-wrap">
                  {selectedNotice.priority === 'urgent' && '🚨 '}
                  {selectedNotice.priority === 'high' && '⚠️ '}
                  {selectedNotice.priority === 'medium' && '📢 '}
                  {selectedNotice.priority === 'low' && 'ℹ️ '}
                  <strong>{selectedNotice.title}</strong>
                  <br /><br />
                  {selectedNotice.content}
                  <br /><br />
                  📅 Date: {new Date(selectedNotice.date).toLocaleDateString()}
                  {selectedNotice.expiryDate && `\n⏰ Valid till: ${new Date(selectedNotice.expiryDate).toLocaleDateString()}`}
                  <br />
                  🏷️ Category: {selectedNotice.category.toUpperCase()}
                  <br /><br />
                  {customMessage && (
                    <>
                      📝 Additional Note:<br />
                      {customMessage}
                      <br /><br />
                    </>
                  )}
                  {includeFooter && (
                    <>
                      ---<br />
                      🏫 EduManager School<br />
                      📞 Contact: +91-XXXXXXXXXX<br />
                      🌐 www.edumanager.edu
                    </>
                  )}
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={sendToWhatsApp}
                  disabled={sendingWhatsApp || selectedGroups.length === 0}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {sendingWhatsApp ? (
                    <>
                      <svg className="animate-spin w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      Send to {selectedGroups.length} Group(s)
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setShowWhatsAppModal(false);
                    setSelectedGroups([]);
                    setCustomMessage('');
                  }}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoticesAnnouncements;