import {
  FaChartPie,
  FaHourglassHalf,
  FaCheckCircle,
  FaTimesCircle,
  FaStore,
  FaBarcode,
  FaCalendarAlt,
  FaTags
} from 'react-icons/fa';

const DashboardTabs = ({ 
  activeTab, 
  onTabChange, 
  pendingCount,
  approvedCount,
  rejectedCount,
  allStallsCount,
  licensesCount,
  eventsCount,
  offersCount
}) => {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: FaChartPie, count: null },
    { id: 'pending', label: 'Pending', icon: FaHourglassHalf, count: pendingCount },
    { id: 'approved', label: 'Approved', icon: FaCheckCircle, count: approvedCount },
    { id: 'rejected', label: 'Rejected', icon: FaTimesCircle, count: rejectedCount },
    { id: 'all-stalls', label: 'All Stalls', icon: FaStore, count: allStallsCount },
    { id: 'licenses', label: 'Licenses', icon: FaBarcode, count: licensesCount },
    { id: 'events', label: 'Events', icon: FaCalendarAlt, count: eventsCount },
    { id: 'offers', label: 'Active Offers', icon: FaTags, count: offersCount },
  ];

  return (
    <div className="bg-white shadow-md sticky top-20 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-4 overflow-x-auto py-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
              {tab.count !== null && <span>({tab.count})</span>}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default DashboardTabs;