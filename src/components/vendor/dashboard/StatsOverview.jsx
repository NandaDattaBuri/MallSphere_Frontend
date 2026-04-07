import {
  FaHourglassHalf,
  FaCheckCircle,
  FaTimesCircle,
  FaStore,
  FaBarcode
} from 'react-icons/fa';

const StatCard = ({ icon: Icon, label, value, color, trend }) => (
  <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
    <div className="flex items-center">
      <div className={`p-4 rounded-2xl bg-${color}-100 text-${color}-600 mr-4`}>
        <Icon className="h-7 w-7" />
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        <p className="text-xs text-gray-500 mt-1">{trend}</p>
      </div>
    </div>
  </div>
);

const StatsOverview = ({ pendingStalls, approvedStalls, rejectedStalls, allStalls, licenses }) => {
  const stats = [
    { 
      icon: FaHourglassHalf, 
      label: 'Pending Stalls', 
      value: pendingStalls, 
      color: 'yellow',
      trend: 'Awaiting approval' 
    },
    { 
      icon: FaCheckCircle, 
      label: 'Approved Stalls', 
      value: approvedStalls, 
      color: 'green',
      trend: 'Active stalls' 
    },
    { 
      icon: FaTimesCircle, 
      label: 'Rejected Stalls', 
      value: rejectedStalls, 
      color: 'red',
      trend: 'Need attention' 
    },
    { 
      icon: FaStore, 
      label: 'Total Stalls', 
      value: allStalls, 
      color: 'blue',
      trend: 'All your stalls' 
    },
    { 
      icon: FaBarcode, 
      label: 'Licenses', 
      value: licenses, 
      color: 'purple',
      trend: 'Available licenses' 
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default StatsOverview;