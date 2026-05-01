// pages/VendorDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { vendorApi } from '../../hooks/vendorApi';
import DashboardHeader from '../../components/vendor/dashboard/DashboardHeader';
import DashboardTabs from '../../components/vendor/dashboard/DashboardTabs';
import ErrorBanner from '../../components/common/ErrorBanner';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StatsOverview from '../../components/vendor/dashboard/StatsOverview';

// Tab Components
import PendingStallsTab from '../../components/vendor/dashboard/tabs/PendingStallsTab';
import ApprovedStallsTab from '../../components/vendor/dashboard/tabs/ApprovedStallsTab';
import RejectedStallsTab from '../../components/vendor/dashboard/tabs/RejectedStallsTab';
import AllStallsTab from '../../components/vendor/dashboard/tabs/AllStallsTab';
import LicensesTab from '../../components/vendor/dashboard/tabs/LicensesTab';
import EventsTab from '../../components/vendor/dashboard/tabs/EventsTab';
import ActiveOffersTab from '../../components/vendor/dashboard/tabs/ActiveOffersTab';
import OverviewTab from '../../components/vendor/dashboard/tabs/OverviewTab';

// Modals
import CreateEventModal from '../../components/vendor/dashboard/modals/CreateEventModal';
import EventDetailsModal from '../../components/vendor/dashboard/modals/EventDetailsModal';
import RejectModal from '../../components/vendor/dashboard/modals/RejectModal';
import AssignLicenseModal from '../../components/vendor/dashboard/modals/AssignLicensesModal';
import StallDetailsModal from '../../components/vendor/dashboard/modals/StallsDetailsModal';

const VendorDashboard = () => {
  const navigate = useNavigate();
  const [vendorData, setVendorData] = useState(null);

  // Stalls data
  const [pendingStalls, setPendingStalls] = useState([]);
  const [approvedStalls, setApprovedStalls] = useState([]);
  const [rejectedStalls, setRejectedStalls] = useState([]);
  const [allStalls, setAllStalls] = useState([]);

  // Licenses data
  const [licenses, setLicenses] = useState([]);
  const [licensesLoading, setLicensesLoading] = useState(false);
  const [licensesError, setLicensesError] = useState('');

  // Active Offers data
  const [activeOffers, setActiveOffers] = useState([]);
  const [activeOffersLoading, setActiveOffersLoading] = useState(false);
  const [activeOffersError, setActiveOffersError] = useState('');
  const [activeOffersPagination, setActiveOffersPagination] = useState({
    page: 1,
    limit: 6,
    total: 0,
    totalPages: 1
  });

  // Events data
  const [vendorEvents, setVendorEvents] = useState([]);
  const [vendorEventsLoading, setVendorEventsLoading] = useState(false);
  const [vendorEventsError, setVendorEventsError] = useState('');

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  // ✅ FIXED: Declare userRole and canEditOffers as state
  const [userRole, setUserRole] = useState('user');
  const [canEditOffers, setCanEditOffers] = useState(false);

  // Pagination state
  const [pagination, setPagination] = useState({
    pending: { page: 1, limit: 10, total: 0, totalPages: 1 },
    approved: { page: 1, limit: 10, total: 0, totalPages: 1 },
    rejected: { page: 1, limit: 10, total: 0, totalPages: 1 },
    all: { page: 1, limit: 10, total: 0, totalPages: 1 },
    licenses: { page: 1, limit: 12, total: 0, totalPages: 1 }
  });

  // Action loading states
  const [actionLoading, setActionLoading] = useState({});
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedStall, setSelectedStall] = useState(null);
  const [stallDetails, setStallDetails] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // License assignment states
  const [showAssignLicenseModal, setShowAssignLicenseModal] = useState(false);
  const [selectedLicense, setSelectedLicense] = useState(null);
  const [selectedStallForLicense, setSelectedStallForLicense] = useState('');
  const [assigningLicense, setAssigningLicense] = useState(false);

  // Filter States
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState({});
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);

  // License Filter States
  const [showLicenseFilters, setShowLicenseFilters] = useState(false);
  const [licenseFilters, setLicenseFilters] = useState({});
  const [licenseSearchTerm, setLicenseSearchTerm] = useState('');
  const [licenseItemsPerPage, setLicenseItemsPerPage] = useState(6);
  const [licenseCurrentPage, setLicenseCurrentPage] = useState(1);

  // ✅ FIXED: Move getUserRole inside useEffect and properly declare
  useEffect(() => {
    const getUserRole = async () => {
      try {
        // Try to get vendor profile first
        const response = await vendorApi.getVendorProfile();
        
        console.log('Vendor profile loaded:', response);
        
        if (response?.success && response?.data) {
          // Check if user is a vendor or seller
          const role = response.data.role || response.data.userType;
          
          console.log('User role detected:', role);
          
          if (role === 'vendor' || role === 'seller') {
            setUserRole(role);
            setCanEditOffers(true);
            console.log('Edit offers enabled:', true);
          } else {
            setUserRole('user');
            setCanEditOffers(false);
            console.log('Edit offers disabled');
          }
        } else {
          // Check localStorage for role
          const storedVendorData = localStorage.getItem('vendorData');
          if (storedVendorData) {
            try {
              const parsedData = JSON.parse(storedVendorData);
              const role = parsedData.role || parsedData.userType;
              if (role === 'vendor' || role === 'seller') {
                setUserRole(role);
                setCanEditOffers(true);
                console.log('Role from localStorage:', role);
              }
            } catch (e) {
              console.error('Error parsing vendorData:', e);
            }
          }
        }
      } catch (error) {
        console.error('Error getting user role:', error);
        setUserRole('user');
        setCanEditOffers(false);
      }
    };

    getUserRole();
  }, []); // Empty dependency array means this runs once on mount

  // ==================== SINGLE AUTH + BOOT useEffect ====================
  useEffect(() => {
    const checkAuthAndLoad = async () => {
      if (!vendorApi.isAuthenticated()) {
        navigate('/vendor/login');
        return;
      }

      try {
        const profile = await vendorApi.getVendorProfile();

        if (profile && (profile.success || profile.data || profile.vendor)) {
          await loadVendorData();
          await Promise.allSettled([
            loadActiveOffers(),
            loadVendorEvents(),
          ]);
        } else {
          navigate('/vendor/login');
        }
      } catch (err) {
        console.error('Auth check failed:', err);

        if (err.message?.includes('expired') || err.message?.includes('401')) {
          try {
            await vendorApi.refreshToken();
            await loadVendorData();
            await Promise.allSettled([
              loadActiveOffers(),
              loadVendorEvents(),
            ]);
            return;
          } catch (refreshError) {
            console.error('Token refresh failed:', refreshError);
          }
        }

        vendorApi.clearAuthData();
        navigate('/vendor/login');
      }
    };

    checkAuthAndLoad();
  }, [navigate]);

  // ==================== API DATA LOADING FUNCTIONS ====================

  const loadVendorData = async () => {
    try {
      setLoading(true);
      setError('');

      await loadVendorProfile();
      await Promise.all([
        loadPendingStalls(1),
        loadApprovedStalls(1),
        loadRejectedStalls(1),
        loadVendorLicenses()
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
      const profile = await vendorApi.getVendorProfile();
      const vendor = profile?.data?.vendor || profile?.data || profile?.vendor || profile || {};
      setVendorData(vendor);
      if (vendor && Object.keys(vendor).length > 0) {
        localStorage.setItem('vendorData', JSON.stringify(vendor));
      }
      console.log('Vendor profile loaded:', profile);
    } catch (error) {
      console.error('Error loading vendor profile:', error);
      const savedData = localStorage.getItem('vendorData');
      if (savedData) {
        try {
          setVendorData(JSON.parse(savedData));
        } catch (_) {}
      }
    }
  };

  // Refresh handlers for each tab
  const handleRefreshPendingStalls = async () => {
    setActionLoading(prev => ({ ...prev, refreshing: true }));
    try {
      await loadPendingStalls(pagination.pending.page);
    } catch (error) {
      console.error('Error refreshing pending stalls:', error);
      setError('Failed to refresh pending stalls');
    } finally {
      setActionLoading(prev => ({ ...prev, refreshing: false }));
    }
  };

  const handleRefreshApprovedStalls = async () => {
    setActionLoading(prev => ({ ...prev, refreshing: true }));
    try {
      await loadApprovedStalls(pagination.approved.page);
    } catch (error) {
      console.error('Error refreshing approved stalls:', error);
      setError('Failed to refresh approved stalls');
    } finally {
      setActionLoading(prev => ({ ...prev, refreshing: false }));
    }
  };

  const handleRefreshRejectedStalls = async () => {
    setActionLoading(prev => ({ ...prev, refreshing: true }));
    try {
      await loadRejectedStalls(pagination.rejected.page);
    } catch (error) {
      console.error('Error refreshing rejected stalls:', error);
      setError('Failed to refresh rejected stalls');
    } finally {
      setActionLoading(prev => ({ ...prev, refreshing: false }));
    }
  };

  const handleRefreshAllStalls = async () => {
    setActionLoading(prev => ({ ...prev, refreshing: true }));
    try {
      await Promise.all([
        loadPendingStalls(pagination.pending.page),
        loadApprovedStalls(pagination.approved.page),
        loadRejectedStalls(pagination.rejected.page)
      ]);
    } catch (error) {
      console.error('Error refreshing all stalls:', error);
      setError('Failed to refresh stalls');
    } finally {
      setActionLoading(prev => ({ ...prev, refreshing: false }));
    }
  };

  const loadVendorLicenses = async () => {
    try {
      setLicensesLoading(true);
      setLicensesError('');
      const response = await vendorApi.getVendorStallLicenses();

      if (response?.success && response?.data) {
        setLicenses(response.data);
        setPagination(prev => ({
          ...prev,
          licenses: {
            ...prev.licenses,
            total: response.data.length,
            totalPages: Math.ceil(response.data.length / prev.licenses.limit) || 1
          }
        }));
      } else if (Array.isArray(response)) {
        setLicenses(response);
        setPagination(prev => ({
          ...prev,
          licenses: {
            ...prev.licenses,
            total: response.length,
            totalPages: Math.ceil(response.length / prev.licenses.limit) || 1
          }
        }));
      } else {
        setLicenses([]);
      }
    } catch (error) {
      console.error('Error loading licenses:', error);
      setLicensesError(error.message || 'Failed to load licenses');
    } finally {
      setLicensesLoading(false);
    }
  };

  const loadPendingStalls = async (page = 1) => {
    try {
      setActionLoading(prev => ({ ...prev, pending: true }));
      const response = await vendorApi.getVendorPendingStalls();

      let stalls = [];
      if (response?.success && response.pendingStalls && Array.isArray(response.pendingStalls)) {
        stalls = response.pendingStalls;
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
    } finally {
      setActionLoading(prev => ({ ...prev, pending: false }));
    }
  };

  const loadApprovedStalls = async (page = 1) => {
    try {
      setActionLoading(prev => ({ ...prev, approved: true }));
      const response = await vendorApi.getVendorApprovedStalls();

      let stalls = [];
      if (response?.success && response.pendingStalls && Array.isArray(response.pendingStalls)) {
        stalls = response.pendingStalls;
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
    } finally {
      setActionLoading(prev => ({ ...prev, approved: false }));
    }
  };

  const loadRejectedStalls = async (page = 1) => {
    try {
      setActionLoading(prev => ({ ...prev, rejected: true }));
      const response = await vendorApi.getVendorRejectedStalls();

      let stalls = [];
      if (response?.success && response.rejectedStalls && Array.isArray(response.rejectedStalls)) {
        stalls = response.rejectedStalls;
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
    } finally {
      setActionLoading(prev => ({ ...prev, rejected: false }));
    }
  };

  const updateAllStalls = () => {
    const allStallsList = [
      ...pendingStalls.map(s => ({ ...s, status: 'pending' })),
      ...approvedStalls.map(s => ({ ...s, status: 'approved' })),
      ...rejectedStalls.map(s => ({ ...s, status: 'rejected' }))
    ];

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

  useEffect(() => {
    updateAllStalls();
  }, [pendingStalls, approvedStalls, rejectedStalls]);

  const loadStallDetails = async (stallId) => {
    try {
      setActionLoading(prev => ({ ...prev, [stallId]: 'loading' }));
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
    if (!window.confirm('Are you sure you want to approve this stall?')) return;

    try {
      setActionLoading(prev => ({ ...prev, [shopId]: 'approving' }));
      const response = await vendorApi.approveStall(shopId);

      if (response.success) {
        alert('Stall approved successfully!');
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

      if (response.success) {
        alert('Stall rejected successfully!');
        setShowRejectModal(false);
        setRejectionReason('');
        setSelectedStall(null);

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

  const handleAssignLicense = async () => {
    if (!selectedLicense || !selectedStallForLicense) {
      alert('Please select a stall');
      return;
    }

    try {
      setAssigningLicense(true);
      // Add your license assignment API call here
      alert('License assigned successfully!');
      setShowAssignLicenseModal(false);
      setSelectedLicense(null);
      setSelectedStallForLicense('');
      await loadVendorLicenses();
    } catch (error) {
      console.error('Error assigning license:', error);
      alert(error.message || 'Failed to assign license');
    } finally {
      setAssigningLicense(false);
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

  const loadActiveOffers = async () => {
    try {
      setActiveOffersLoading(true);
      setActiveOffersError('');
      const response = await vendorApi.getMallActiveOffers();

      console.log('Active offers response:', response);

      let offers = [];
      if (response?.success && response?.offers && Array.isArray(response.offers)) {
        offers = response.offers;
      } else if (response?.data && Array.isArray(response.data)) {
        offers = response.data;
      } else if (Array.isArray(response)) {
        offers = response;
      }

      setActiveOffers(offers);
      const totalPages = Math.ceil(offers.length / activeOffersPagination.limit);
      setActiveOffersPagination(prev => ({
        ...prev,
        total: offers.length,
        totalPages: totalPages || 1
      }));
    } catch (error) {
      console.error('Error loading active offers:', error);
      setActiveOffersError(error.message || 'Failed to load active offers');
      setActiveOffers([]);
    } finally {
      setActiveOffersLoading(false);
    }
  };

  const loadVendorEvents = async () => {
    try {
      setVendorEventsLoading(true);
      setVendorEventsError('');
      const response = await vendorApi.getVendorEvents();

      const events = (response?.success && response?.data) ? response.data :
        Array.isArray(response) ? response : response?.data ? response.data : [];

      const safeEvents = events.filter(event => {
        if (!event.eventStartDate) return false;
        return !isNaN(new Date(event.eventStartDate).getTime());
      });

      setVendorEvents(safeEvents);
    } catch (error) {
      console.error('Error loading vendor events:', error);
      setVendorEventsError(error.message || 'Failed to load events');
      setVendorEvents([]);
    } finally {
      setVendorEventsLoading(false);
    }
  };

  const loadSingleEvent = async (eventId) => {
    try {
      setActionLoading(prev => ({ ...prev, [`event-${eventId}`]: true }));
      const response = await vendorApi.getSingleVendorEvent(eventId);

      if (response?.success && response?.data) {
        setSelectedEvent(response.data);
      } else if (response?.data) {
        setSelectedEvent(response.data);
      } else {
        setSelectedEvent(response);
      }
      setShowEventModal(true);
    } catch (error) {
      console.error('Error loading event details:', error);
      alert(error.message || 'Failed to load event details');
    } finally {
      setActionLoading(prev => ({ ...prev, [`event-${eventId}`]: false }));
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;

    try {
      setActionLoading(prev => ({ ...prev, [`delete-${eventId}`]: true }));
      const response = await vendorApi.deleteEvent(eventId);

      if (response.success) {
        alert('Event deleted successfully!');
        await loadVendorEvents();
        if (selectedEvent?._id === eventId) {
          setShowEventModal(false);
          setSelectedEvent(null);
        }
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      alert(error.message || 'Failed to delete event');
    } finally {
      setActionLoading(prev => ({ ...prev, [`delete-${eventId}`]: false }));
    }
  };

  const handleAuthError = (error) => {
    if (
      error.message.includes('No vendor ID found') ||
      error.message.includes('Unauthorized') ||
      error.message.includes('authentication')
    ) {
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

  // ==================== PAGINATION HANDLERS ====================

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

  const handleActiveOffersPageChange = (newPage) => {
    if (newPage >= 1 && newPage <= activeOffersPagination.totalPages) {
      setActiveOffersPagination(prev => ({
        ...prev,
        page: newPage
      }));
    }
  };

  const getPaginatedOffers = () => {
    const start = (activeOffersPagination.page - 1) * activeOffersPagination.limit;
    const end = start + activeOffersPagination.limit;
    return activeOffers.slice(start, end);
  };

  const getFilteredStalls = (stalls) => {
    if (!searchTerm) return stalls;
    return stalls.filter(stall =>
      (stall.shopName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (stall.shopId?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (stall.location?.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  const getPaginatedItems = (items, page, limit) => {
    const start = (page - 1) * limit;
    const end = start + limit;
    return items.slice(start, end);
  };

  // Debug log to see if edit is enabled
  console.log('canEditOffers in dashboard:', canEditOffers);
  console.log('userRole:', userRole);

  if (loading) {
    return <LoadingSpinner message="Preparing your dashboard..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <DashboardHeader
        vendorData={vendorData}
        pendingStallsCount={pendingStalls.length}
        onLogout={handleLogout}
      />

      <DashboardTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        pendingCount={pendingStalls.length}
        approvedCount={approvedStalls.length}
        rejectedCount={rejectedStalls.length}
        allStallsCount={allStalls.length}
        licensesCount={licenses.length}
        eventsCount={vendorEvents.length}
        offersCount={activeOffers.length}
      />

      {error && (
        <ErrorBanner error={error} onDismiss={() => setError('')} />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <StatsOverview
          pendingStalls={pendingStalls.length}
          approvedStalls={approvedStalls.length}
          rejectedStalls={rejectedStalls.length}
          allStalls={allStalls.length}
          licenses={licenses.length}
        />

        <div className="space-y-8">
          {activeTab === 'pending' && (
            <PendingStallsTab
              pendingStalls={pendingStalls}
              actionLoading={actionLoading}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              pagination={pagination.pending}
              onPageChange={handlePendingPageChange}
              onViewDetails={loadStallDetails}
              onApprove={handleApproveStall}
              onReject={(stall) => {
                setSelectedStall(stall);
                setShowRejectModal(true);
              }}
              getFilteredStalls={getFilteredStalls}
              getPaginatedItems={getPaginatedItems}
              onRefresh={handleRefreshPendingStalls}
            />
          )}

          {activeTab === 'approved' && (
            <ApprovedStallsTab
              approvedStalls={approvedStalls}
              actionLoading={actionLoading}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              pagination={pagination.approved}
              onPageChange={handleApprovedPageChange}
              onViewDetails={loadStallDetails}
              getFilteredStalls={getFilteredStalls}
              getPaginatedItems={getPaginatedItems}
              getRatingStars={(rating) => {
                return '⭐'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
              }}
              onRefresh={handleRefreshApprovedStalls}
            />
          )}

          {activeTab === 'rejected' && (
            <RejectedStallsTab
              rejectedStalls={rejectedStalls}
              actionLoading={actionLoading}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              pagination={pagination.rejected}
              onPageChange={handleRejectedPageChange}
              onViewDetails={loadStallDetails}
              getFilteredStalls={getFilteredStalls}
              getPaginatedItems={getPaginatedItems}
              onRefresh={handleRefreshRejectedStalls}
            />
          )}

          {activeTab === 'all-stalls' && (
            <AllStallsTab
              allStalls={allStalls}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              pagination={pagination.all}
              onPageChange={handleAllStallsPageChange}
              onViewDetails={loadStallDetails}
              getFilteredStalls={getFilteredStalls}
              getPaginatedItems={getPaginatedItems}
              onRefresh={handleRefreshAllStalls}
              actionLoading={actionLoading}
            />
          )}

          {activeTab === 'licenses' && (
            <LicensesTab
              licenses={licenses}
              licensesLoading={licensesLoading}
              licensesError={licensesError}
              licenseFilters={licenseFilters}
              setLicenseFilters={setLicenseFilters}
              showLicenseFilters={showLicenseFilters}
              setShowLicenseFilters={setShowLicenseFilters}
              licenseSearchTerm={licenseSearchTerm}
              setLicenseSearchTerm={setLicenseSearchTerm}
              licenseItemsPerPage={licenseItemsPerPage}
              setLicenseItemsPerPage={setLicenseItemsPerPage}
              licenseCurrentPage={licenseCurrentPage}
              setLicenseCurrentPage={setLicenseCurrentPage}
              clearLicenseFilters={() => {
                setLicenseFilters({});
                setLicenseSearchTerm('');
                setLicenseCurrentPage(1);
              }}
              onRefresh={loadVendorLicenses}
              onAssignLicense={(license) => {
                setSelectedLicense(license);
                setShowAssignLicenseModal(true);
              }}
              approvedStalls={approvedStalls}
            />
          )}

          {activeTab === 'events' && (
            <EventsTab
              vendorEvents={vendorEvents}
              vendorEventsLoading={vendorEventsLoading}
              vendorEventsError={vendorEventsError}
              activeFilters={activeFilters}
              setActiveFilters={setActiveFilters}
              showFilters={showFilters}
              setShowFilters={setShowFilters}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              itemsPerPage={itemsPerPage}
              setItemsPerPage={setItemsPerPage}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              clearAllFilters={() => {
                setActiveFilters({});
                setSearchTerm('');
                setCurrentPage(1);
              }}
              onCreateEvent={() => {
                setShowCreateEventModal(true);
              }}
              onViewEvent={loadSingleEvent}
              onEditEvent={(event) => {
                setSelectedEvent(event);
                setShowEventModal(true);
              }}
              onDeleteEvent={handleDeleteEvent}
              actionLoading={actionLoading}
            />
          )}

          {activeTab === 'offers' && (
            <ActiveOffersTab
              activeOffers={activeOffers}
              activeOffersLoading={activeOffersLoading}
              activeOffersError={activeOffersError}
              activeOffersPagination={activeOffersPagination}
              onPageChange={handleActiveOffersPageChange}
              onRefresh={loadActiveOffers}
              getPaginatedOffers={getPaginatedOffers}
              canEdit={canEditOffers}
              onOfferUpdated={(updatedOffer) => {
                console.log('Offer updated:', updatedOffer);
                loadActiveOffers(); // Refresh offers after update
              }}
            />
          )}

          {activeTab === 'overview' && (
            <OverviewTab
              pendingStalls={pendingStalls}
              approvedStalls={approvedStalls}
              rejectedStalls={rejectedStalls}
              licenses={licenses}
              vendorData={vendorData}
              onTabChange={setActiveTab}
              getPaginatedItems={getPaginatedItems}
              onLogout={handleLogout}
            />
          )}
        </div>
      </div>

      {/* Modals */}
      <CreateEventModal
        isOpen={showCreateEventModal}
        onClose={() => {
          setShowCreateEventModal(false);
        }}
        onEventCreated={() => {
          loadVendorEvents();
        }}
        actionLoading={actionLoading}
        setActionLoading={setActionLoading}
      />

      <EventDetailsModal
        isOpen={showEventModal}
        onClose={() => {
          setShowEventModal(false);
          setSelectedEvent(null);
        }}
        event={selectedEvent}
        onEventUpdated={() => {
          loadVendorEvents();
        }}
        onEventDeleted={handleDeleteEvent}
        actionLoading={actionLoading}
        setActionLoading={setActionLoading}
      />

      <RejectModal
        isOpen={showRejectModal}
        onClose={() => {
          setShowRejectModal(false);
          setSelectedStall(null);
          setRejectionReason('');
        }}
        stall={selectedStall}
        rejectionReason={rejectionReason}
        setRejectionReason={setRejectionReason}
        onReject={handleRejectStall}
        actionLoading={actionLoading}
      />

      <AssignLicenseModal
        isOpen={showAssignLicenseModal}
        onClose={() => {
          setShowAssignLicenseModal(false);
          setSelectedLicense(null);
          setSelectedStallForLicense('');
        }}
        license={selectedLicense}
        approvedStalls={approvedStalls}
        selectedStallForLicense={selectedStallForLicense}
        setSelectedStallForLicense={setSelectedStallForLicense}
        onAssign={handleAssignLicense}
        assigningLicense={assigningLicense}
      />

      <StallDetailsModal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setStallDetails(null);
        }}
        stall={stallDetails}
        onApprove={handleApproveStall}
        onReject={(stall) => {
          setShowDetailsModal(false);
          setSelectedStall(stall);
          setShowRejectModal(true);
        }}
      />
    </div>
  );
};

export default VendorDashboard;