export const ITEMS_PER_PAGE = 8;

export const STATUS_CONFIG = {
  active:   { label: "Active",   dot: "bg-emerald-400", badge: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200", border: "border-l-emerald-400", bg: "bg-emerald-500" },
  scheduled: { label: "Scheduled", dot: "bg-amber-400",   badge: "bg-amber-50 text-amber-700 ring-1 ring-amber-200", border: "border-l-amber-400",   bg: "bg-amber-500"   },
  expired:  { label: "Expired",  dot: "bg-rose-400",    badge: "bg-rose-50 text-rose-700 ring-1 ring-rose-200", border: "border-l-rose-400",    bg: "bg-rose-500"    },
  disabled: { label: "Disabled", dot: "bg-stone-400",   badge: "bg-stone-50 text-stone-700 ring-1 ring-stone-200", border: "border-l-stone-400",   bg: "bg-stone-500"   },
};

export const FILTERS = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "scheduled", label: "Scheduled" },
  { key: "expired", label: "Expired" },
  { key: "disabled", label: "Disabled" },
];

export const emptyForm = (shopId = "") => ({
  offerTitle: "", 
  offerDescription: "", 
  offerType: "percentage", 
  offerValue: "",
  offerStartDate: new Date().toISOString().split("T")[0],
  offerEndDate: new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
  offerTermsAndConditions: "",
  offerImages: [],
  shopId: shopId,
});