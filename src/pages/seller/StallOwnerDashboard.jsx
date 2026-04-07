import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import sellerApi from "../../hooks/sellerApi";
import { ITEMS_PER_PAGE } from "../../components/utils/constants";
import {
  emptyForm,
  calculateStats,
  filterOffers,
  validateOfferDates,
  validateDiscountValue,
  getChangedFields
} from "../../components/utils/offerHelpers";

// Components
import LoadingSpinner from "../../components/common/LoadingSpinner";
import Toast from "../../components/common/Toast";
import Pagination from "../../components/common/Pagination";
import SellerHeader from "../../components/seller/dashboard/SellerHeader";
import SellerTabs from "../../components/seller/dashboard/SellerTabs";
import StatsCards from "../../components/seller/dashboard/StatsCards";
import FilterBar from "../../components/seller/dashboard/FilterBar";
import ViewToggle from "../../components/seller/dashboard/ViewToggle";
import OfferGrid from "../../components/seller/offers/OfferGrid";
import OfferList from "../../components/seller/offers/OfferList";
import CreateEditOfferModal from "../../components/seller/offers/CreateEditOfferModal";
import OfferDetailModal from "../../components/seller/offers/OfferDetailModal";
import SellerProfile from "../../components/seller/profile/SellerProfile";

export default function StallOwnerDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("offers");
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  // allOffers holds the full unfiltered list from getCreatedOffers.
  // We never replace this with status-specific endpoint data —
  // all filtering is done client-side to avoid 403s on those endpoints.
  const [allOffers, setAllOffers] = useState([]);

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm());
  const [toast, setToast] = useState(null);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [profile, setProfile] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [authChecked, setAuthChecked] = useState(false);
  const [stats, setStats] = useState({
    all: 0,
    active: 0,
    scheduled: 0,
    expired: 0,
    disabled: 0
  });

  // ─── Auth Check ───────────────────────────────
  useEffect(() => {
    const checkAuth = () => {
      if (!sellerApi.isAuthenticated()) {
        navigate('/stall-owner/login');
        return;
      }
      setAuthChecked(true);
      setInitialLoading(false);
    };
    checkAuth();
  }, [navigate]);

  // ─── Fetch Initial Data ───────────────────────
  useEffect(() => {
    if (authChecked) {
      fetchProfile();
      fetchAllOffers();
    }
  }, [authChecked]);

  // Reset to page 1 whenever filter or search changes
  useEffect(() => {
    setPage(1);
  }, [filter, search]);

  // ─── Get Shop ID ──────────────────────────────
  const getShopId = async () => {
    if (profile?.data?.shopId) return profile.data.shopId;
    if (profile?.data?.sellerId) return profile.data.sellerId;

    const stored = localStorage.getItem('shopId') || localStorage.getItem('sellerId');
    if (stored && stored !== 'undefined' && stored !== 'null') return stored;

    try {
      const res = await sellerApi.getSellerStallProfile();
      if (res.success && res.data) {
        const id = res.data.shopId || res.data.sellerId || res.data._id;
        if (id) {
          localStorage.setItem('shopId', id);
          return id;
        }
      }
    } catch (err) {
      console.error('Could not fetch shopId from profile:', err);
    }

    return null;
  };

  // ─── Fetch Profile ────────────────────────────
  const fetchProfile = async () => {
    try {
      const response = await sellerApi.getSellerStallProfile();

      if (response.success && response.data) {
        setProfile(response);
        const shopId = response.data.shopId || response.data.sellerId || response.data._id;
        if (shopId) localStorage.setItem('shopId', shopId);
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      handleAuthError(error);
    }
  };

  // ─── Fetch All Offers (client-side filtering only) ───
  // We intentionally ONLY call getCreatedOffers here.
  // The per-status endpoints (get-scheduled-offers, get-expired-offers, etc.)
  // return 403 "Access denied" for non-approved sellers, so we avoid them entirely.
  // Stats and filtered views are derived from this single full list.
  const fetchAllOffers = async () => {
    setLoading(true);
    try {
      const response = await sellerApi.getCreatedOffers();

      if (response.success && response.data) {
        const offersList = response.data.offers || [];
        setAllOffers(offersList);
        setStats(calculateStats(offersList));
      } else {
        setAllOffers([]);
      }
    } catch (error) {
      console.error('Failed to fetch offers:', error);
      handleAuthError(error, 'Failed to load offers');
    } finally {
      setLoading(false);
    }
  };

  // ─── Auth Error Handler ───────────────────────
  const handleAuthError = (error, fallbackMsg) => {
    const msg = error?.message || '';
    if (
      msg.toLowerCase().includes('unauthorized') ||
      msg.includes('401') ||
      msg.includes('Session expired')
    ) {
      sellerApi.clearAuthData();
      navigate('/stall-owner/login');
    } else if (fallbackMsg) {
      showToast(fallbackMsg, 'error');
    }
  };

  // ─── Toast ────────────────────────────────────
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ─── Client-Side Filtering & Pagination ───────
  // All filtering is done locally from allOffers — no extra API calls needed.
  const filtered = filterOffers(allOffers, filter, search);
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  // ─── Open Create Modal ────────────────────────
  const openCreate = async () => {
    try {
      const shopId = await getShopId();

      if (!shopId) {
        showToast('Shop ID not found. Please refresh or login again.', 'error');
        return;
      }

      setEditing(null);
      setForm({
        shopId,
        offerTitle: "",
        offerDescription: "",
        offerType: "percentage",
        offerValue: "",
        offerStartDate: new Date().toISOString().split("T")[0],
        offerEndDate: new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
        offerTermsAndConditions: "",
      });
      setImageFiles([]);
      setImagePreviews([]);
      setModal(true);
    } catch (error) {
      console.error('Error in openCreate:', error);
      showToast('Error preparing offer creation', 'error');
    }
  };

  // ─── Open Edit Modal ──────────────────────────
  const openEdit = async (offer) => {
    try {
      const shopId = await getShopId();

      setEditing(offer);
      setForm({
        shopId: shopId || "",
        offerTitle: offer.offerTitle || "",
        offerDescription: offer.offerDescription || "",
        offerType: offer.offerType || "percentage",
        offerValue: offer.offerValue || "",
        offerStartDate: offer.offerStartDate?.split('T')[0] || offer.offerStartDate || "",
        offerEndDate: offer.offerEndDate?.split('T')[0] || offer.offerEndDate || "",
        offerTermsAndConditions: offer.offerTermsAndConditions || "",
      });
      setImageFiles([]);
      setImagePreviews(
        offer.offerImages?.length
          ? offer.offerImages.map(img => img.url || img)
          : []
      );
      setModal(true);
    } catch (error) {
      console.error('Error in openEdit:', error);
      showToast('Error preparing offer edit', 'error');
    }
  };

  // ─── Image Change ─────────────────────────────
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 4) {
      showToast('Maximum 4 images allowed', 'error');
      return;
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (files.some(f => !validTypes.includes(f.type))) {
      showToast('Only JPEG, PNG and WEBP images are allowed', 'error');
      return;
    }

    setImageFiles(files);
    setImagePreviews(files.map(f => URL.createObjectURL(f)));
  };

  // ─── Submit (Create / Edit) ───────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const shopId = await getShopId();

      if (!shopId) {
        showToast('Shop ID not found. Please refresh or login again.', 'error');
        return;
      }

      if (!form.offerTitle?.trim()) return showToast('Offer title is required', 'error');
      if (!form.offerDescription?.trim()) return showToast('Offer description is required', 'error');
      if (!form.offerValue || Number(form.offerValue) <= 0) return showToast('Valid discount value is required', 'error');

      const dateValidation = validateOfferDates(form.offerStartDate, form.offerEndDate);
      if (!dateValidation.valid) return showToast(dateValidation.error, 'error');

      const discountValidation = validateDiscountValue(form.offerType, form.offerValue);
      if (!discountValidation.valid) return showToast(discountValidation.error, 'error');

      const offerData = {
        shopId,
        offerTitle: form.offerTitle.trim(),
        offerDescription: form.offerDescription.trim(),
        offerStartDate: form.offerStartDate,
        offerEndDate: form.offerEndDate,
        offerTermsAndConditions: form.offerTermsAndConditions.trim() || 'No terms and conditions',
        offerType: form.offerType,
        offerValue: Number(form.offerValue),
      };

      const cleanupPreviews = () => {
        imagePreviews.forEach(p => { if (p.startsWith('blob:')) URL.revokeObjectURL(p); });
        setImageFiles([]);
        setImagePreviews([]);
      };

      if (editing) {
        const offerId = editing.offerId || editing._id;
        const updatedFields = getChangedFields(editing, offerData);

        if (Object.keys(updatedFields).length === 0 && imageFiles.length === 0) {
          showToast('No changes detected', 'info');
          setModal(false);
          return;
        }

        const response = await sellerApi.editOffer(offerId, updatedFields, imageFiles);
        if (response.success) {
          showToast('Offer updated successfully!');
          await fetchAllOffers();
          setModal(false);
          cleanupPreviews();
        }
      } else {
        if (!imageFiles || imageFiles.length === 0) {
          showToast('Please upload at least one offer image', 'error');
          return;
        }

        const response = await sellerApi.createOffer(offerData, imageFiles);
        if (response.success) {
          showToast('Offer created successfully!');
          await fetchAllOffers();
          setModal(false);
          cleanupPreviews();
        }
      }
    } catch (error) {
      console.error('Failed to save offer:', error);
      showToast(error.message || 'Failed to save offer', 'error');
    }
  };

  // ─── Delete Offer ─────────────────────────────
  const deleteOffer = async (id) => {
    if (!window.confirm('Are you sure you want to delete this offer?')) return;
    try {
      const response = await sellerApi.deleteOffer(id);
      if (response.success) {
        // Remove from local state immediately — no refetch needed
        setAllOffers(prev => prev.filter(o => o.offerId !== id && o._id !== id));
        setStats(prev => ({
          ...prev,
          all: prev.all - 1
        }));
        showToast('Offer removed successfully');
      }
    } catch (error) {
      console.error('Failed to delete offer:', error);
      showToast('Failed to delete offer', 'error');
    }
  };

  // ─── Toggle Offer Status ──────────────────────
  const toggleOfferStatus = async (offer) => {
    try {
      if (offer.isEnabled) {
        const response = await sellerApi.disableOffer(offer.offerId || offer._id);
        if (response.success) {
          showToast('Offer disabled successfully');
          await fetchAllOffers();
        }
      } else {
        const startDate = prompt(
          'Enter start date (YYYY-MM-DD):',
          new Date().toISOString().split('T')[0]
        );
        if (!startDate) return;

        const endDate = prompt(
          'Enter end date (YYYY-MM-DD):',
          new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]
        );
        if (!endDate) return;

        const response = await sellerApi.enableOffer(
          offer.offerId || offer._id,
          startDate,
          endDate
        );
        if (response.success) {
          showToast('Offer enabled successfully');
          await fetchAllOffers();
        }
      }
    } catch (error) {
      console.error('Failed to toggle offer status:', error);
      showToast(error.message || 'Failed to update offer', 'error');
    }
  };

  // ─── View Offer Details ───────────────────────
  const viewOfferDetails = async (offer) => {
    try {
      const response = await sellerApi.getSingleOffer(offer.offerId || offer._id);
      if (response.success) setSelectedOffer(response.data);
    } catch (error) {
      console.error('Failed to fetch offer details:', error);
      showToast('Failed to load offer details', 'error');
    }
  };

  // ─── Logout ───────────────────────────────────
  const handleLogout = async () => {
    try {
      await sellerApi.logoutSellerStall();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      navigate('/stall-owner/login');
    }
  };

  if (initialLoading) {
    return <LoadingSpinner message="Checking authentication..." />;
  }

  return (
    <div className="min-h-screen bg-stone-50 antialiased">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=Geist:wght@300;400;500;600&display=swap'); * { font-family: 'Geist', system-ui, sans-serif; } .df { font-family: 'Lora', Georgia, serif; }`}</style>

      <SellerHeader
        profile={profile}
        onLogout={handleLogout}
        onTabChange={setActiveTab}
      />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <SellerTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === "offers" && (
          <div>
            <div className="mb-7 flex items-center justify-between">
              <div>
                <h1 className="df text-3xl font-semibold text-stone-900 tracking-tight">
                  Offers Management
                </h1>
                <p className="text-stone-500 text-sm mt-1">
                  Create, track and manage all your stall promotions
                </p>
              </div>
              <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
            </div>

            <StatsCards stats={stats} />

            <div className="flex items-center justify-between mb-5">
              <FilterBar
                filter={filter}
                onFilterChange={setFilter}
                search={search}
                onSearchChange={setSearch}
                stats={stats}
              />

              <button
                onClick={openCreate}
                className="flex items-center gap-2 px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-sm font-medium rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-lg shadow-stone-900/20"
              >
                <Plus className="w-4 h-4" /> Create New Offer
              </button>
            </div>

            {loading && (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-4 border-stone-200 border-t-stone-900 rounded-full animate-spin" />
              </div>
            )}

            {!loading && viewMode === "grid" && (
              <OfferGrid
                offers={paged}
                onView={viewOfferDetails}
                onToggle={toggleOfferStatus}
                onEdit={openEdit}
                onDelete={deleteOffer}
              />
            )}

            {!loading && viewMode === "list" && (
              <OfferList
                offers={paged}
                onView={viewOfferDetails}
                onToggle={toggleOfferStatus}
                onEdit={openEdit}
                onDelete={deleteOffer}
              />
            )}

            {totalPages > 1 && (
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
                totalItems={filtered.length}
                pageSize={ITEMS_PER_PAGE}
              />
            )}
          </div>
        )}

        {activeTab === "profile" && <SellerProfile profile={profile} />}
      </div>

      <OfferDetailModal
        offer={selectedOffer}
        onClose={() => setSelectedOffer(null)}
        onEdit={openEdit}
        onDelete={deleteOffer}
      />

      <CreateEditOfferModal
        isOpen={modal}
        onClose={() => setModal(false)}
        form={form}
        setForm={setForm}
        editing={editing}
        imageFiles={imageFiles}
        imagePreviews={imagePreviews}
        onImageChange={handleImageChange}
        onSubmit={handleSubmit}
        loading={loading}
      />

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}