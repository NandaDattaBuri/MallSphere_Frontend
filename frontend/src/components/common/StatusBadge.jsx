import React from 'react';
import { 
  FaCheckCircle, 
  FaTimesCircle, 
  FaHourglassHalf, 
  FaInfoCircle 
} from 'react-icons/fa';

const StatusBadge = ({ status }) => {
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

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${getStatusColor(status)}`}>
      {getStatusIcon(status)}
      <span className="ml-1">{status || 'Unknown'}</span>
    </span>
  );
};

export default StatusBadge;