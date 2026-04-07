import React from 'react';

export const getStatusColor = (status) => {
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

export const getStatusIconName = (status) => {
  switch (status?.toLowerCase()) {
    case 'approved':
      return 'check-circle';
    case 'rejected':
      return 'times-circle';
    case 'pending':
      return 'hourglass-half';
    default:
      return 'info-circle';
  }
};

export const getRatingArray = (rating) => {
  if (!rating) return [];
  return Array(5).fill(0).map((_, i) => i < Math.floor(rating));
};