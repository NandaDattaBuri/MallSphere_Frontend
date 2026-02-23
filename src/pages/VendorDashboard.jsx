// pages/VendorDashboard.jsx - Complete version with proper API integration
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { vendorApi } from '../hooks/vendorApi'; 
import {
  FaStore,
  FaChartLine,
  FaTags,
  FaUsers,
  FaCalendarAlt,
  FaSignOutAlt,
  FaBell,
  FaPlus,
  FaEdit,
  FaEye,
  FaShoppingCart,
  FaMapMarkerAlt,
  FaPhone,
  FaClock,
  FaShoppingBag,
  FaMoneyBillWave,
  FaStar,
  FaChartPie,
  FaBullhorn,
  FaQrcode,
  FaRegCalendarCheck,
  FaHistory,
  FaUserFriends,
  FaPercent,
  FaRegChartBar,
  FaCreditCard,
  FaTrophy,
  FaBoxOpen,
  FaWarehouse,
  FaBarcode,
  FaRegClock,
  FaChartArea,
  FaMobileAlt,
  FaRegNewspaper,
  FaGift,
  FaCog,
  FaFileInvoice,
  FaHeadset,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaThumbsUp,
  FaThumbsDown,
  FaInfoCircle,
  FaSpinner,
  FaSearch,
  FaFilter,
  FaSort,
  FaDownload,
  FaPrint,
  FaArrowLeft,
  FaArrowRight
} from 'react-icons/fa';

const VendorDashboard = () => {
  const navigate = useNavigate();
  const [vendorData, setVendorData] = useState(null);
  
  // Stalls data from APIs - Only vendor's own stalls
  const [pendingStalls, setPendingStalls] = useState([]);
  const [approvedStalls, setApprovedStalls] = useState([]);
  const [rejectedStalls, setRejectedStalls] = useState([]);
  const [allStalls, setAllStalls] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  
  // Pagination state
  const [pagination, setPagination] = useState({
    pending: { page: 1, limit: 10, total: 0, totalPages: 1 },
    approved: { page: 1, limit: 10, total: 0, totalPages: 1 },
    rejected: { page: 1, limit: 10, total: 0, totalPages: 1 },
    all: { page: 1, limit: 10, total: 0, totalPages: 1 }
  });

  // Action loading states
  const [actionLoading, setActionLoading] = useState({});
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedStall, setSelectedStall] = useState(null);
  const [stallDetails, setStallDetails] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const checkAuthAndLoadData = async () => {
      console.log('=== DASHBOARD LOADING ===');
      
      if (!vendorApi.isAuthenticated()) {
        navigate('/vendor/login', {
          state: { message: 'Please login to access dashboard' }
        });
        return;
      }

      await loadVendorData();
    };

    checkAuthAndLoadData();
  }, [navigate]);

  // ========== API DATA LOADING FUNCTIONS ==========
  const loadVendorData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Load vendor profile first
      await loadVendorProfile();
      
      // Load all stalls data from APIs - Only vendor's own stalls
      await Promise.all([
        loadPendingStalls(1),
        loadApprovedStalls(1),
        loadRejectedStalls(1)
      ]);
      
    } catch (error) {
      console.error('Failed to load vendor data:', error);
      handleAuthError(error);
    } finally {
      setLoading(false);
    }
  };

  const loadVendorProfile = async () => {
    try {
      let profile;
      try {
        profile = await vendorApi.getVendorAdminProfile();
        console.log('Vendor admin profile loaded:', profile);
      } catch (adminError) {
        console.log('Admin profile failed, trying regular profile:', adminError);
        profile = await vendorApi.getVendorProfile();
        console.log('Vendor profile loaded:', profile);
      }
      
      let vendor = {};
      if (profile.data?.vendor) {
        vendor = profile.data.vendor;
      } else if (profile.data) {
        vendor = profile.data;
      } else if (profile.vendor) {
        vendor = profile.vendor;
      } else {
        vendor = profile;
      }
      
      setVendorData(vendor);
      localStorage.setItem('vendorData', JSON.stringify(vendor));
      
    } catch (error) {
      console.error('Error loading vendor profile:', error);
      // Try to get from localStorage as fallback
      const savedData = localStorage.getItem('vendorData');
      if (savedData) {
        setVendorData(JSON.parse(savedData));
      }
    }
  };

  const loadPendingStalls = async (page = 1) => {
    try {
      setActionLoading(prev => ({ ...prev, pending: true }));
      const response = await vendorApi.getVendorPendingStalls();
      console.log('Pending stalls response:', response);
      
      // Handle response structure
      let stalls = [];
      
      if (response?.success) {
        // Pending stalls are in pendingStalls property
        if (response.pendingStalls && Array.isArray(response.pendingStalls)) {
          stalls = response.pendingStalls;
          console.log('Found pending stalls:', stalls.length);
        }
      }
      
      setPendingStalls(stalls);
      
      setPagination(prev => ({
        ...prev,
        pending: {
          ...prev.pending,
          page,
          total: stalls.length,
          totalPages: Math.ceil(stalls.length / prev.pending.limit) || 1
        }
      }));
      
    } catch (error) {
      console.error('Error loading pending stalls:', error);
      setPendingStalls([]);
      setError('Failed to load pending stalls');
    } finally {
      setActionLoading(prev => ({ ...prev, pending: false }));
    }
  };

  const loadApprovedStalls = async (page = 1) => {
    try {
      setActionLoading(prev => ({ ...prev, approved: true }));
      const response = await vendorApi.getVendorApprovedStalls();
      console.log('Approved stalls response:', response);
      
      // Handle response structure
      let stalls = [];
      
      if (response?.success) {
        // Based on your backend, approved stalls are in pendingStalls property (backend bug)
        if (response.pendingStalls && Array.isArray(response.pendingStalls)) {
          stalls = response.pendingStalls;
          console.log('Found approved stalls:', stalls.length);
        }
      }
      
      setApprovedStalls(stalls);
      
      setPagination(prev => ({
        ...prev,
        approved: {
          ...prev.approved,
          page,
          total: stalls.length,
          totalPages: Math.ceil(stalls.length / prev.approved.limit) || 1
        }
      }));
      
    } catch (error) {
      console.error('Error loading approved stalls:', error);
      setApprovedStalls([]);
      setError('Failed to load approved stalls');
    } finally {
      setActionLoading(prev => ({ ...prev, approved: false }));
    }
  };

  const loadRejectedStalls = async (page = 1) => {
    try {
      setActionLoading(prev => ({ ...prev, rejected: true }));
      const response = await vendorApi.getVendorRejectedStalls();
      console.log('Rejected stalls response:', response);
      
      // Handle response structure
      let stalls = [];
      
      if (response?.success) {
        // Rejected stalls are in rejectedStalls property
        if (response.rejectedStalls && Array.isArray(response.rejectedStalls)) {
          stalls = response.rejectedStalls;
          console.log('Found rejected stalls:', stalls.length);
        }
      }
      
      setRejectedStalls(stalls);
      
      setPagination(prev => ({
        ...prev,
        rejected: {
          ...prev.rejected,
          page,
          total: stalls.length,
          totalPages: Math.ceil(stalls.length / prev.rejected.limit) || 1
        }
      }));
      
    } catch (error) {
      console.error('Error loading rejected stalls:', error);
      setRejectedStalls([]);
      setError('Failed to load rejected stalls');
    } finally {
      setActionLoading(prev => ({ ...prev, rejected: false }));
    }
  };

  // Update all stalls when any of the status lists change
  const updateAllStalls = () => {
    const allStallsList = [
      ...pendingStalls.map(s => ({ ...s, status: 'pending' })),
      ...approvedStalls.map(s => ({ ...s, status: 'approved' })),
      ...rejectedStalls.map(s => ({ ...s, status: 'rejected' }))
    ];
    
    console.log('All stalls combined:', {
      pending: pendingStalls.length,
      approved: approvedStalls.length,
      rejected: rejectedStalls.length,
      total: allStallsList.length
    });
    
    setAllStalls(allStallsList);
    
    setPagination(prev => ({
      ...prev,
      all: {
        ...prev.all,
        total: allStallsList.length,
        totalPages: Math.ceil(allStallsList.length / prev.all.limit) || 1
      }
    }));
  };

  // Update all stalls whenever pending, approved, or rejected stalls change
  useEffect(() => {
    updateAllStalls();
  }, [pendingStalls, approvedStalls, rejectedStalls]);

  const loadStallDetails = async (stallId) => {
    try {
      setActionLoading(prev => ({ ...prev, [stallId]: 'loading' }));
      
      // Find stall in existing data
      const stall = allStalls.find(s => s._id === stallId || s.shopId === stallId);
      
      if (stall) {
        setStallDetails(stall);
        setShowDetailsModal(true);
      } else {
        setError('Stall details not found');
      }
    } catch (error) {
      console.error('Error loading stall details:', error);
      setError('Failed to load stall details');
    } finally {
      setActionLoading(prev => ({ ...prev, [stallId]: false }));
    }
  };

  const handleApproveStall = async (shopId) => {
    if (!window.confirm('Are you sure you want to approve this stall?')) {
      return;
    }

    try {
      setActionLoading(prev => ({ ...prev, [shopId]: 'approving' }));
      const response = await vendorApi.approveStall(shopId);
      console.log('Approve response:', response);
      
      if (response.success) {
        alert('Stall approved successfully!');
        
        // Refresh all lists
        await Promise.all([
          loadPendingStalls(pagination.pending.page),
          loadApprovedStalls(pagination.approved.page),
          loadRejectedStalls(pagination.rejected.page)
        ]);
      }
    } catch (error) {
      console.error('Error approving stall:', error);
      alert(error.message || 'Failed to approve stall');
    } finally {
      setActionLoading(prev => ({ ...prev, [shopId]: false }));
    }
  };

  const handleRejectStall = async () => {
    if (!selectedStall || !rejectionReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }

    try {
      setActionLoading(prev => ({ ...prev, [selectedStall.shopId || selectedStall._id]: 'rejecting' }));
      const response = await vendorApi.rejectStall(selectedStall.shopId || selectedStall._id, rejectionReason);
      console.log('Reject response:', response);
      
      if (response.success) {
        alert('Stall rejected successfully!');
        setShowRejectModal(false);
        setRejectionReason('');
        setSelectedStall(null);
        
        // Refresh all lists
        await Promise.all([
          loadPendingStalls(pagination.pending.page),
          loadApprovedStalls(pagination.approved.page),
          loadRejectedStalls(pagination.rejected.page)
        ]);
      }
    } catch (error) {
      console.error('Error rejecting stall:', error);
      alert(error.message || 'Failed to reject stall');
    } finally {
      setActionLoading(prev => ({ ...prev, [selectedStall?.shopId || selectedStall?._id]: false }));
    }
  };

  const handleLogout = async () => {
    try {
      await vendorApi.logoutVendor();
      navigate('/vendor/login');
    } catch (error) {
      console.error('Logout error:', error);
      vendorApi.clearAuthData();
      navigate('/vendor/login');
    }
  };

  const openRejectModal = (stall) => {
    setSelectedStall(stall);
    setShowRejectModal(true);
  };

  const handleAuthError = (error) => {
    if (error.message.includes('No vendor ID found') || 
        error.message.includes('Unauthorized') ||
        error.message.includes('authentication')) {
      
      vendorApi.clearAuthData();
      setError('Session expired. Please login again.');
      
      setTimeout(() => {
        navigate('/vendor/login', {
          state: { message: 'Your session has expired. Please login again.' }
        });
      }, 2000);
    } else {
      setError('Failed to load dashboard. ' + error.message);
    }
  };

  // Pagination handlers
  const handlePendingPageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pending.totalPages) {
      setPagination(prev => ({
        ...prev,
        pending: { ...prev.pending, page: newPage }
      }));
    }
  };

  const handleApprovedPageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.approved.totalPages) {
      setPagination(prev => ({
        ...prev,
        approved: { ...prev.approved, page: newPage }
      }));
    }
  };

  const handleRejectedPageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.rejected.totalPages) {
      setPagination(prev => ({
        ...prev,
        rejected: { ...prev.rejected, page: newPage }
      }));
    }
  };

  const handleAllStallsPageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.all.totalPages) {
      setPagination(prev => ({
        ...prev,
        all: { ...prev.all, page: newPage }
      }));
    }
  };

  // Filter stalls based on search
  const getFilteredStalls = (stalls) => {
    if (!searchTerm) return stalls;
    
    return stalls.filter(stall => 
      (stall.shopName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (stall.shopId?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (stall.location?.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  // Get paginated stalls for any list
  const getPaginatedStalls = (stalls, page, limit) => {
    const start = (page - 1) * limit;
    const end = start + limit;
    return stalls.slice(start, end);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return <FaCheckCircle className="text-green-500" />;
      case 'rejected':
        return <FaTimesCircle className="text-red-500" />;
      case 'pending':
        return <FaHourglassHalf className="text-yellow-500" />;
      default:
        return <FaInfoCircle className="text-gray-500" />;
    }
  };

  const getRatingStars = (rating) => {
    if (!rating) return null;
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar
          key={i}
          className={`h-3 w-3 ${i <= Math.floor(rating) ? 'text-yellow-500' : 'text-gray-300'}`}
        />
      );
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-indigo-200 rounded-full"></div>
            <div className="w-20 h-20 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
          </div>
          <p className="mt-4 text-gray-600 font-medium">Preparing your dashboard...</p>
          <p className="text-sm text-gray-500 mt-2">Loading your stalls</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-lg sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4 md:py-6">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-3 rounded-2xl shadow-lg">
                <FaStore className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  {vendorData?.shopName || 'Vendor Dashboard'}
                </h1>
                <p className="text-sm text-gray-600 flex items-center">
                  <span className="mr-2">Welcome, {vendorData?.name || 'Vendor'}!</span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                    Verified Vendor
                  </span>
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="relative p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-2xl transition">
                <FaBell className="h-5 w-5" />
                {pendingStalls.length > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>
              <Link to="/vendor/profile" className="flex items-center space-x-3">
                <div className="h-12 w-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="font-bold text-white text-lg">
                    {vendorData?.name?.charAt(0) || 'V'}
                  </span>
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-semibold text-gray-900">{vendorData?.name || 'Vendor'}</p>
                  <p className="text-xs text-gray-500 truncate max-w-[150px]">{vendorData?.email || ''}</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-md sticky top-20 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-4 overflow-x-auto py-4">
            {[
              { id: 'overview', label: 'Overview', icon: FaChartPie },
              { id: 'pending', label: `Pending (${pendingStalls.length})`, icon: FaHourglassHalf },
              { id: 'approved', label: `Approved (${approvedStalls.length})`, icon: FaCheckCircle },
              { id: 'rejected', label: `Rejected (${rejectedStalls.length})`, icon: FaTimesCircle },
              { id: 'all-stalls', label: `All Stalls (${allStalls.length})`, icon: FaStore }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-400 p-6 rounded-r-xl shadow-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FaTimesCircle className="h-6 w-6 text-red-400" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm text-red-800">{error}</p>
              </div>
              <button onClick={() => setError('')} className="ml-auto text-red-500 hover:text-red-700">
                <FaTimesCircle className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { 
              icon: FaHourglassHalf, 
              label: 'Pending Stalls', 
              value: pendingStalls.length, 
              color: 'yellow',
              trend: 'Awaiting approval' 
            },
            { 
              icon: FaCheckCircle, 
              label: 'Approved Stalls', 
              value: approvedStalls.length, 
              color: 'green',
              trend: 'Active stalls' 
            },
            { 
              icon: FaTimesCircle, 
              label: 'Rejected Stalls', 
              value: rejectedStalls.length, 
              color: 'red',
              trend: 'Need attention' 
            },
            { 
              icon: FaStore, 
              label: 'Total Stalls', 
              value: allStalls.length, 
              color: 'blue',
              trend: 'All your stalls' 
            }
          ].map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center">
                <div className={`p-4 rounded-2xl bg-${stat.color}-100 text-${stat.color}-600 mr-4`}>
                  <stat.icon className="h-7 w-7" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.trend}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="space-y-8">
          {/* Pending Stalls Tab */}
          {activeTab === 'pending' && (
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="px-6 py-5 bg-gradient-to-r from-yellow-50 to-orange-50 border-b border-gray-200">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 flex items-center">
                      <FaHourglassHalf className="mr-2 text-yellow-600" />
                      Pending Stalls
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Stalls awaiting your approval ({pendingStalls.length} total)
                    </p>
                  </div>
                  
                  {/* Search Bar */}
                  <div className="mt-4 md:mt-0 flex items-center space-x-3">
                    <div className="relative">
                      <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <input
                        type="text"
                        placeholder="Search stalls..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                {actionLoading.pending ? (
                  <div className="text-center py-12">
                    <FaSpinner className="animate-spin h-8 w-8 text-indigo-600 mx-auto mb-4" />
                    <p className="text-gray-600">Loading pending stalls...</p>
                  </div>
                ) : pendingStalls.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                      <FaHourglassHalf className="h-10 w-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">No Pending Stalls</h3>
                    <p className="text-gray-500">All your stalls have been processed.</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4">
                      {getFilteredStalls(getPaginatedStalls(pendingStalls, pagination.pending.page, pagination.pending.limit)).map((stall) => (
                        <div key={stall._id || stall.shopId} className="border-2 border-gray-100 rounded-2xl p-5 hover:border-yellow-200 hover:shadow-lg transition-all duration-300">
                          <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                            <div className="flex-1">
                              <div className="flex items-start mb-4">
                                <div className="p-3 rounded-xl bg-yellow-50 text-yellow-600 mr-4">
                                  <FaStore className="h-6 w-6" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center flex-wrap gap-2 mb-2">
                                    <h3 className="text-lg font-semibold text-gray-900">{stall.shopName || 'Unnamed Stall'}</h3>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${getStatusColor(stall.approvalStatus || 'pending')}`}>
                                      {getStatusIcon(stall.approvalStatus || 'pending')}
                                      <span className="ml-1">{stall.approvalStatus || 'Pending'}</span>
                                    </span>
                                  </div>
                                  
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                    <div>
                                      <p className="text-xs text-gray-500">Shop ID</p>
                                      <p className="font-medium text-gray-900">{stall.shopId || 'N/A'}</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-gray-500">Location</p>
                                      <p className="font-medium text-gray-900">{stall.location || 'Not specified'}</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-gray-500">Status</p>
                                      <p className={`font-medium ${stall.isActive ? 'text-green-600' : 'text-yellow-600'}`}>
                                        {stall.isActive ? 'Active' : 'Inactive'}
                                      </p>
                                    </div>
                                  </div>

                                  {/* Documents if available */}
                                  {stall.documents && stall.documents.length > 0 && (
                                    <div className="mb-4">
                                      <p className="text-xs text-gray-500 mb-2">Documents</p>
                                      <div className="flex flex-wrap gap-2">
                                        {stall.documents.map((doc, idx) => (
                                          <span key={idx} className="px-3 py-1 bg-gray-100 rounded-lg text-xs text-gray-700">
                                            {typeof doc === 'string' ? doc : doc.name || 'Document'}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-3 mt-4 md:mt-0 md:ml-4">
                              <button
                                onClick={() => loadStallDetails(stall._id || stall.shopId)}
                                disabled={actionLoading[stall._id || stall.shopId] === 'loading'}
                                className="px-4 py-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 font-medium flex items-center"
                              >
                                {actionLoading[stall._id || stall.shopId] === 'loading' ? (
                                  <FaSpinner className="animate-spin h-4 w-4 mr-2" />
                                ) : (
                                  <FaEye className="h-4 w-4 mr-2" />
                                )}
                                View Details
                              </button>
                              <button
                                onClick={() => handleApproveStall(stall.shopId || stall._id)}
                                disabled={actionLoading[stall.shopId || stall._id] === 'approving'}
                                className="px-4 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 font-medium flex items-center"
                              >
                                {actionLoading[stall.shopId || stall._id] === 'approving' ? (
                                  <FaSpinner className="animate-spin h-4 w-4 mr-2" />
                                ) : (
                                  <FaThumbsUp className="h-4 w-4 mr-2" />
                                )}
                                Approve
                              </button>
                              <button
                                onClick={() => openRejectModal(stall)}
                                disabled={actionLoading[stall.shopId || stall._id] === 'rejecting'}
                                className="px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 font-medium flex items-center"
                              >
                                {actionLoading[stall.shopId || stall._id] === 'rejecting' ? (
                                  <FaSpinner className="animate-spin h-4 w-4 mr-2" />
                                ) : (
                                  <FaThumbsDown className="h-4 w-4 mr-2" />
                                )}
                                Reject
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Pagination */}
                    {pagination.pending.totalPages > 1 && (
                      <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                        <div className="text-sm text-gray-500">
                          Showing page {pagination.pending.page} of {pagination.pending.totalPages}
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handlePendingPageChange(pagination.pending.page - 1)}
                            disabled={pagination.pending.page === 1}
                            className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <FaArrowLeft className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handlePendingPageChange(pagination.pending.page + 1)}
                            disabled={pagination.pending.page === pagination.pending.totalPages}
                            className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <FaArrowRight className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {/* Approved Stalls Tab */}
          {activeTab === 'approved' && (
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="px-6 py-5 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-200">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 flex items-center">
                      <FaCheckCircle className="mr-2 text-green-600" />
                      Approved Stalls
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Your approved stalls ({approvedStalls.length} total)
                    </p>
                  </div>
                  
                  {/* Search Bar */}
                  <div className="mt-4 md:mt-0 flex items-center space-x-3">
                    <div className="relative">
                      <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <input
                        type="text"
                        placeholder="Search stalls..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                {actionLoading.approved ? (
                  <div className="text-center py-12">
                    <FaSpinner className="animate-spin h-8 w-8 text-indigo-600 mx-auto mb-4" />
                    <p className="text-gray-600">Loading approved stalls...</p>
                  </div>
                ) : approvedStalls.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                      <FaCheckCircle className="h-10 w-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">No Approved Stalls</h3>
                    <p className="text-gray-500">You don't have any approved stalls yet.</p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {getFilteredStalls(getPaginatedStalls(approvedStalls, pagination.approved.page, pagination.approved.limit)).map((stall) => (
                        <div key={stall._id || stall.shopId} className="border-2 border-gray-100 rounded-2xl p-5 hover:border-green-200 hover:shadow-lg transition-all duration-300">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center">
                              <div className="p-3 rounded-xl bg-green-50 text-green-600 mr-4">
                                <FaStore className="h-6 w-6" />
                              </div>
                              <div>
                                <h3 className="font-bold text-gray-900">{stall.shopName || 'Unnamed Stall'}</h3>
                                <p className="text-sm text-gray-500">{stall.shopId}</p>
                              </div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${getStatusColor('approved')}`}>
                              {getStatusIcon('approved')}
                              <span className="ml-1">Approved</span>
                            </span>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="flex items-center text-sm">
                              <FaMapMarkerAlt className="h-4 w-4 text-gray-400 mr-2" />
                              <span className="text-gray-600">{stall.location || 'Location not specified'}</span>
                            </div>
                            
                            {stall.rating && (
                              <div className="flex items-center">
                                {getRatingStars(stall.rating)}
                                <span className="ml-2 text-sm text-gray-600">{stall.rating}</span>
                              </div>
                            )}
                            
                            <div className="flex items-center justify-between pt-3">
                              <div className="text-sm">
                                <span className="text-gray-500">Active: </span>
                                <span className="font-medium text-green-600">{stall.isActive ? 'Yes' : 'No'}</span>
                              </div>
                              <button
                                onClick={() => loadStallDetails(stall._id || stall.shopId)}
                                className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 font-medium flex items-center"
                              >
                                <FaEye className="h-4 w-4 mr-2" />
                                View Details
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Pagination */}
                    {pagination.approved.totalPages > 1 && (
                      <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                        <div className="text-sm text-gray-500">
                          Showing page {pagination.approved.page} of {pagination.approved.totalPages}
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleApprovedPageChange(pagination.approved.page - 1)}
                            disabled={pagination.approved.page === 1}
                            className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <FaArrowLeft className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleApprovedPageChange(pagination.approved.page + 1)}
                            disabled={pagination.approved.page === pagination.approved.totalPages}
                            className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <FaArrowRight className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {/* Rejected Stalls Tab */}
          {activeTab === 'rejected' && (
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="px-6 py-5 bg-gradient-to-r from-red-50 to-orange-50 border-b border-gray-200">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 flex items-center">
                      <FaTimesCircle className="mr-2 text-red-600" />
                      Rejected Stalls
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Your rejected stalls ({rejectedStalls.length} total)
                    </p>
                  </div>
                  
                  {/* Search Bar */}
                  <div className="mt-4 md:mt-0 flex items-center space-x-3">
                    <div className="relative">
                      <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <input
                        type="text"
                        placeholder="Search stalls..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                {actionLoading.rejected ? (
                  <div className="text-center py-12">
                    <FaSpinner className="animate-spin h-8 w-8 text-indigo-600 mx-auto mb-4" />
                    <p className="text-gray-600">Loading rejected stalls...</p>
                  </div>
                ) : rejectedStalls.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                      <FaTimesCircle className="h-10 w-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">No Rejected Stalls</h3>
                    <p className="text-gray-500">You don't have any rejected stalls.</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4">
                      {getFilteredStalls(getPaginatedStalls(rejectedStalls, pagination.rejected.page, pagination.rejected.limit)).map((stall) => (
                        <div key={stall._id || stall.shopId} className="border-2 border-gray-100 rounded-2xl p-5 hover:border-red-200 hover:shadow-lg transition-all duration-300">
                          <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                            <div className="flex-1">
                              <div className="flex items-start mb-4">
                                <div className="p-3 rounded-xl bg-red-50 text-red-600 mr-4">
                                  <FaStore className="h-6 w-6" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center flex-wrap gap-2 mb-2">
                                    <h3 className="text-lg font-semibold text-gray-900">{stall.shopName || 'Unnamed Stall'}</h3>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${getStatusColor('rejected')}`}>
                                      {getStatusIcon('rejected')}
                                      <span className="ml-1">Rejected</span>
                                    </span>
                                  </div>
                                  
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                      <p className="text-xs text-gray-500">Shop ID</p>
                                      <p className="font-medium text-gray-900">{stall.shopId || 'N/A'}</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-gray-500">Location</p>
                                      <p className="font-medium text-gray-900">{stall.location || 'Not specified'}</p>
                                    </div>
                                  </div>

                                  {stall.rejectedReason && (
                                    <div className="mb-4 p-3 bg-red-50 rounded-xl">
                                      <p className="text-xs text-red-600 font-medium mb-1">Rejection Reason:</p>
                                      <p className="text-sm text-gray-700">{stall.rejectedReason}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-3 mt-4 md:mt-0 md:ml-4">
                              <button
                                onClick={() => loadStallDetails(stall._id || stall.shopId)}
                                className="px-4 py-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 font-medium flex items-center"
                              >
                                <FaEye className="h-4 w-4 mr-2" />
                                View Details
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Pagination */}
                    {pagination.rejected.totalPages > 1 && (
                      <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                        <div className="text-sm text-gray-500">
                          Showing page {pagination.rejected.page} of {pagination.rejected.totalPages}
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleRejectedPageChange(pagination.rejected.page - 1)}
                            disabled={pagination.rejected.page === 1}
                            className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <FaArrowLeft className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleRejectedPageChange(pagination.rejected.page + 1)}
                            disabled={pagination.rejected.page === pagination.rejected.totalPages}
                            className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <FaArrowRight className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {/* All Stalls Tab */}
          {activeTab === 'all-stalls' && (
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="px-6 py-5 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 flex items-center">
                      <FaStore className="mr-2 text-blue-600" />
                      All Your Stalls
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Complete list of all your stalls ({allStalls.length} total)
                    </p>
                  </div>
                  
                  {/* Search Bar */}
                  <div className="mt-4 md:mt-0 flex items-center space-x-3">
                    <div className="relative">
                      <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <input
                        type="text"
                        placeholder="Search stalls..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                {allStalls.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                      <FaStore className="h-10 w-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">No Stalls Found</h3>
                    <p className="text-gray-500">You don't have any stalls registered yet.</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4">
                      {getFilteredStalls(getPaginatedStalls(allStalls, pagination.all.page, pagination.all.limit)).map((stall) => (
                        <div key={stall._id || stall.shopId} className="border-2 border-gray-100 rounded-2xl p-5 hover:border-indigo-200 hover:shadow-lg transition-all duration-300">
                          <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                            <div className="flex-1">
                              <div className="flex items-start mb-4">
                                <div className={`p-3 rounded-xl mr-4 ${
                                  stall.status === 'approved' ? 'bg-green-50 text-green-600' :
                                  stall.status === 'rejected' ? 'bg-red-50 text-red-600' :
                                  'bg-yellow-50 text-yellow-600'
                                }`}>
                                  <FaStore className="h-6 w-6" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center flex-wrap gap-2 mb-2">
                                    <h3 className="text-lg font-semibold text-gray-900">{stall.shopName || 'Unnamed Stall'}</h3>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${getStatusColor(stall.status || stall.approvalStatus)}`}>
                                      {getStatusIcon(stall.status || stall.approvalStatus)}
                                      <span className="ml-1">{stall.status || stall.approvalStatus || 'Unknown'}</span>
                                    </span>
                                  </div>
                                  
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                      <p className="text-xs text-gray-500">Shop ID</p>
                                      <p className="font-medium text-gray-900">{stall.shopId || 'N/A'}</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-gray-500">Location</p>
                                      <p className="font-medium text-gray-900">{stall.location || 'Not specified'}</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-gray-500">Active</p>
                                      <p className={`font-medium ${stall.isActive ? 'text-green-600' : 'text-gray-600'}`}>
                                        {stall.isActive ? 'Yes' : 'No'}
                                      </p>
                                    </div>
                                  </div>

                                  {stall.rejectedReason && (
                                    <div className="mt-3 p-2 bg-red-50 rounded-lg">
                                      <p className="text-xs text-red-600">Reason: {stall.rejectedReason}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex gap-3 mt-4 md:mt-0 md:ml-4">
                              <button
                                onClick={() => loadStallDetails(stall._id || stall.shopId)}
                                className="px-4 py-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 font-medium flex items-center"
                              >
                                <FaEye className="h-4 w-4 mr-2" />
                                Details
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Pagination */}
                    {pagination.all.totalPages > 1 && (
                      <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                        <div className="text-sm text-gray-500">
                          Showing page {pagination.all.page} of {pagination.all.totalPages}
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleAllStallsPageChange(pagination.all.page - 1)}
                            disabled={pagination.all.page === 1}
                            className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <FaArrowLeft className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleAllStallsPageChange(pagination.all.page + 1)}
                            disabled={pagination.all.page === pagination.all.totalPages}
                            className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <FaArrowRight className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-8">
                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex items-center">
                      <div className="p-3 rounded-xl bg-yellow-100 text-yellow-600 mr-4">
                        <FaHourglassHalf className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Pending Approval</p>
                        <p className="text-2xl font-bold text-gray-900">{pendingStalls.length}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex items-center">
                      <div className="p-3 rounded-xl bg-green-100 text-green-600 mr-4">
                        <FaCheckCircle className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Approved</p>
                        <p className="text-2xl font-bold text-gray-900">{approvedStalls.length}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex items-center">
                      <div className="p-3 rounded-xl bg-red-100 text-red-600 mr-4">
                        <FaTimesCircle className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Rejected</p>
                        <p className="text-2xl font-bold text-gray-900">{rejectedStalls.length}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Pending Stalls */}
                {pendingStalls.length > 0 && (
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold text-gray-900">Recent Pending Stalls</h3>
                      <button
                        onClick={() => setActiveTab('pending')}
                        className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
                      >
                        View All
                      </button>
                    </div>
                    <div className="space-y-4">
                      {getPaginatedStalls(pendingStalls, 1, 3).map((stall) => (
                        <div key={stall._id || stall.shopId} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                          <div>
                            <div className="font-medium text-gray-900">{stall.shopName || 'Unnamed Stall'}</div>
                            <div className="text-sm text-gray-500">{stall.shopId}</div>
                          </div>
                          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                            Pending
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recent Approved Stalls */}
                {approvedStalls.length > 0 && (
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold text-gray-900">Recent Approved Stalls</h3>
                      <button
                        onClick={() => setActiveTab('approved')}
                        className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
                      >
                        View All
                      </button>
                    </div>
                    <div className="space-y-4">
                      {getPaginatedStalls(approvedStalls, 1, 3).map((stall) => (
                        <div key={stall._id || stall.shopId} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                          <div>
                            <div className="font-medium text-gray-900">{stall.shopName || 'Unnamed Stall'}</div>
                            <div className="text-sm text-gray-500">{stall.shopId}</div>
                          </div>
                          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                            Approved
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Sidebar */}
              <div className="space-y-8">
                {/* Vendor Profile Card */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
                  <div className="space-y-3">
                    <Link
                      to="/vendor/profile"
                      className="w-full flex items-center p-3 text-left rounded-xl hover:shadow-md transition-all border border-gray-200 hover:border-indigo-300"
                    >
                      <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 mr-3">
                        <FaEdit className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 text-sm">Update Profile</div>
                        <div className="text-xs text-gray-500">Edit your information</div>
                      </div>
                    </Link>
                    
                    {pendingStalls.length > 0 && (
                      <button
                        onClick={() => setActiveTab('pending')}
                        className="w-full flex items-center p-3 text-left rounded-xl hover:shadow-md transition-all border border-gray-200 hover:border-yellow-300"
                      >
                        <div className="p-2 rounded-xl bg-yellow-50 text-yellow-600 mr-3">
                          <FaHourglassHalf className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 text-sm">Review Pending</div>
                          <div className="text-xs text-gray-500">{pendingStalls.length} stalls waiting</div>
                        </div>
                      </button>
                    )}
                    
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center p-3 text-left rounded-xl hover:shadow-md transition-all border border-red-200 hover:border-red-300"
                    >
                      <div className="p-2 rounded-xl bg-red-50 text-red-600 mr-3">
                        <FaSignOutAlt className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-red-700 text-sm">Logout</div>
                        <div className="text-xs text-red-500">Sign out from dashboard</div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Vendor Info Card */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Vendor Information</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-500">Name</p>
                      <p className="font-medium text-gray-900">{vendorData?.name || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="font-medium text-gray-900">{vendorData?.email || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Phone</p>
                      <p className="font-medium text-gray-900">{vendorData?.phoneNumber || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Shop Name</p>
                      <p className="font-medium text-gray-900">{vendorData?.shopName || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Address</p>
                      <p className="font-medium text-gray-900">{vendorData?.shopAddress || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && selectedStall && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Reject Stall</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to reject <span className="font-semibold">{selectedStall.shopName}</span>?
            </p>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rejection Reason *
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Please provide a reason for rejection..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 min-h-[100px]"
                required
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleRejectStall}
                disabled={!rejectionReason.trim() || actionLoading[selectedStall.shopId || selectedStall._id] === 'rejecting'}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 font-medium disabled:opacity-50 flex items-center justify-center"
              >
                {actionLoading[selectedStall.shopId || selectedStall._id] === 'rejecting' ? (
                  <>
                    <FaSpinner className="animate-spin h-4 w-4 mr-2" />
                    Rejecting...
                  </>
                ) : (
                  'Confirm Rejection'
                )}
              </button>
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setSelectedStall(null);
                  setRejectionReason('');
                }}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stall Details Modal */}
      {showDetailsModal && stallDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Stall Details</h3>
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setStallDetails(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimesCircle className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Shop Name</p>
                  <p className="font-medium text-gray-900">{stallDetails.shopName || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Shop ID</p>
                  <p className="font-medium text-gray-900">{stallDetails.shopId || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <div className="flex items-center mt-1">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium inline-flex items-center ${getStatusColor(stallDetails.approvalStatus || stallDetails.status)}`}>
                      {getStatusIcon(stallDetails.approvalStatus || stallDetails.status)}
                      <span className="ml-1">{stallDetails.approvalStatus || stallDetails.status}</span>
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Active</p>
                  <p className="font-medium text-gray-900">{stallDetails.isActive ? 'Yes' : 'No'}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-medium text-gray-900">{stallDetails.location || 'N/A'}</p>
                </div>
                {stallDetails.rating && (
                  <div className="col-span-2">
                    <p className="text-sm text-gray-500">Rating</p>
                    <div className="flex items-center mt-1">
                      {getRatingStars(stallDetails.rating)}
                      <span className="ml-2 text-sm text-gray-600">{stallDetails.rating}</span>
                    </div>
                  </div>
                )}
              </div>

              {stallDetails.documents && stallDetails.documents.length > 0 && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">Documents</p>
                  <div className="flex flex-wrap gap-2">
                    {stallDetails.documents.map((doc, idx) => (
                      <span key={idx} className="px-3 py-1 bg-gray-100 rounded-lg text-sm text-gray-700">
                        {typeof doc === 'string' ? doc : doc.name || `Document ${idx + 1}`}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {stallDetails.rejectedReason && (
                <div className="p-4 bg-red-50 rounded-xl">
                  <p className="text-sm font-medium text-red-800 mb-1">Rejection Reason:</p>
                  <p className="text-sm text-gray-700">{stallDetails.rejectedReason}</p>
                </div>
              )}

              {(stallDetails.approvalStatus === 'pending' || stallDetails.status === 'pending') && (
                <div className="flex space-x-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      handleApproveStall(stallDetails.shopId || stallDetails._id);
                    }}
                    className="flex-1 px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 font-medium"
                  >
                    Approve Stall
                  </button>
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      openRejectModal(stallDetails);
                    }}
                    className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 font-medium"
                  >
                    Reject Stall
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorDashboard;