import React, { useMemo } from 'react';
import { 
  FaCalendarAlt, 
  FaSearch, 
  FaFilter, 
  FaTimes, 
  FaSpinner, 
  FaPlus,
  FaEye,
  FaEdit,
  FaTimesCircle,
  FaMapMarkerAlt,
  FaClock,
  FaHourglass,
  FaExclamationTriangle
} from 'react-icons/fa';

const EventsTab = ({
  vendorEvents,
  vendorEventsLoading,
  vendorEventsError,
  activeFilters,
  setActiveFilters,
  showFilters,
  setShowFilters,
  searchTerm,
  setSearchTerm,
  itemsPerPage,
  setItemsPerPage,
  currentPage,
  setCurrentPage,
  clearAllFilters,
  onCreateEvent,
  onViewEvent,
  onEditEvent,
  onDeleteEvent,
  actionLoading
}) => {
  // Filter Functions
  const filterEvents = (events) => {
    if (!events) return [];
    
    return events.filter(event => {
      if (activeFilters.status && event.eventStatus !== activeFilters.status) {
        return false;
      }
      
      if (activeFilters.eventType) {
        if (activeFilters.eventType === 'live' && !event.isLive) return false;
        if (activeFilters.eventType === 'upcoming' && !event.isUpcoming) return false;
        if (activeFilters.eventType === 'past' && !event.isPast) return false;
      }
      
      if (activeFilters.dateRange) {
        const eventDate = new Date(event.eventStartDate);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        
        const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
        const endOfNextMonth = new Date(today.getFullYear(), today.getMonth() + 2, 0);
        
        switch(activeFilters.dateRange) {
          case 'today':
            if (eventDate.toDateString() !== today.toDateString()) return false;
            break;
          case 'tomorrow':
            if (eventDate.toDateString() !== tomorrow.toDateString()) return false;
            break;
          case 'thisWeek':
            if (eventDate < startOfWeek || eventDate > endOfWeek) return false;
            break;
          case 'thisMonth':
            if (eventDate < startOfMonth || eventDate > endOfMonth) return false;
            break;
          case 'nextMonth':
            if (eventDate < nextMonth || eventDate > endOfNextMonth) return false;
            break;
          default:
            break;
        }
      }
      
      if (activeFilters.location) {
        const searchLocation = activeFilters.location.toLowerCase();
        if (!event.eventLocation?.toLowerCase().includes(searchLocation)) {
          return false;
        }
      }
      
      if (activeFilters.timeOfDay) {
        const timeStr = event.eventTime;
        if (timeStr) {
          const hour = parseInt(timeStr.split(':')[0]);
          const isPM = timeStr.includes('PM');
          const hour24 = isPM && hour !== 12 ? hour + 12 : (hour === 12 && !isPM ? 0 : hour);
          
          switch(activeFilters.timeOfDay) {
            case 'morning':
              if (hour24 < 12) return true;
              break;
            case 'afternoon':
              if (hour24 >= 12 && hour24 < 17) return true;
              break;
            case 'evening':
              if (hour24 >= 17 && hour24 < 20) return true;
              break;
            case 'night':
              if (hour24 >= 20 || hour24 < 5) return true;
              break;
          }
          return false;
        }
      }
      
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        return (
          event.eventTitle?.toLowerCase().includes(search) ||
          event.eventSubject?.toLowerCase().includes(search) ||
          event.eventLocation?.toLowerCase().includes(search) ||
          event.eventDescription?.toLowerCase().includes(search)
        );
      }
      
      return true;
    });
  };

  const sortEvents = (events) => {
    if (!events || !activeFilters.sortBy) return events;
    
    return [...events].sort((a, b) => {
      switch(activeFilters.sortBy) {
        case 'dateDesc':
          return new Date(b.eventStartDate) - new Date(a.eventStartDate);
        case 'dateAsc':
          return new Date(a.eventStartDate) - new Date(b.eventStartDate);
        case 'titleAsc':
          return (a.eventTitle || '').localeCompare(b.eventTitle || '');
        case 'titleDesc':
          return (b.eventTitle || '').localeCompare(a.eventTitle || '');
        default:
          return 0;
      }
    });
  };

  const filteredEvents = useMemo(() => {
    let filtered = filterEvents(vendorEvents);
    filtered = sortEvents(filtered);
    return filtered;
  }, [vendorEvents, activeFilters, searchTerm]);

  const paginatedEvents = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredEvents.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredEvents, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);

  if (vendorEventsLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 text-center py-12">
        <FaSpinner className="animate-spin h-8 w-8 text-indigo-600 mx-auto mb-4" />
        <p className="text-gray-600">Loading your events...</p>
      </div>
    );
  }

  if (vendorEventsError) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 text-center py-12">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FaExclamationTriangle className="h-10 w-10 text-red-500" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-3">Error Loading Events</h3>
        <p className="text-gray-500">{vendorEventsError}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="px-6 py-5 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <FaCalendarAlt className="mr-2 text-indigo-600" />
              Your Events
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Manage your events ({vendorEvents.length} total)
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center space-x-3">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
              />
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2 border rounded-xl font-medium flex items-center ${
                showFilters || Object.keys(activeFilters).length > 0
                  ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <FaFilter className="mr-2 h-4 w-4" />
              Filters
              {Object.keys(activeFilters).length > 0 && (
                <span className="ml-2 bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {Object.keys(activeFilters).length}
                </span>
              )}
            </button>
            
            {Object.keys(activeFilters).length > 0 && (
              <button
                onClick={clearAllFilters}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium flex items-center"
              >
                <FaTimes className="mr-1 h-4 w-4" />
                Clear
              </button>
            )}
            
            <button
              onClick={onCreateEvent}
              className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-medium flex items-center"
            >
              <FaPlus className="mr-2 h-4 w-4" />
              Create Event
            </button>
          </div>
        </div>
        
        {showFilters && (
          <div className="mt-4 p-4 bg-white rounded-xl border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={activeFilters.status || ''}
                  onChange={(e) => setActiveFilters({...activeFilters, status: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="past">Past</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Event Type</label>
                <select
                  value={activeFilters.eventType || ''}
                  onChange={(e) => setActiveFilters({...activeFilters, eventType: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">All Types</option>
                  <option value="live">Live Now</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="past">Past Events</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                <select
                  value={activeFilters.dateRange || ''}
                  onChange={(e) => setActiveFilters({...activeFilters, dateRange: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">All Dates</option>
                  <option value="today">Today</option>
                  <option value="tomorrow">Tomorrow</option>
                  <option value="thisWeek">This Week</option>
                  <option value="thisMonth">This Month</option>
                  <option value="nextMonth">Next Month</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  placeholder="Filter by location..."
                  value={activeFilters.location || ''}
                  onChange={(e) => setActiveFilters({...activeFilters, location: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <select
                  value={activeFilters.sortBy || 'dateDesc'}
                  onChange={(e) => setActiveFilters({...activeFilters, sortBy: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="dateDesc">Date (Newest First)</option>
                  <option value="dateAsc">Date (Oldest First)</option>
                  <option value="titleAsc">Title (A-Z)</option>
                  <option value="titleDesc">Title (Z-A)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time of Day</label>
                <select
                  value={activeFilters.timeOfDay || ''}
                  onChange={(e) => setActiveFilters({...activeFilters, timeOfDay: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Any Time</option>
                  <option value="morning">Morning (Before 12 PM)</option>
                  <option value="afternoon">Afternoon (12 PM - 5 PM)</option>
                  <option value="evening">Evening (5 PM - 8 PM)</option>
                  <option value="night">Night (After 8 PM)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Items Per Page</label>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value={6}>6 per page</option>
                  <option value={12}>12 per page</option>
                  <option value={24}>24 per page</option>
                  <option value={48}>48 per page</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="p-6">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaCalendarAlt className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">No Events Found</h3>
            <p className="text-gray-500">
              {Object.keys(activeFilters).length > 0 
                ? "No events match your filter criteria. Try adjusting your filters."
                : "You haven't created any events yet."}
            </p>
            {Object.keys(activeFilters).length > 0 ? (
              <button
                onClick={clearAllFilters}
                className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
              >
                Clear Filters
              </button>
            ) : (
              <button
                onClick={onCreateEvent}
                className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
              >
                Create Your First Event
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm text-gray-600">
              Showing {paginatedEvents.length} of {filteredEvents.length} events
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedEvents.map((event) => (
                <div key={event._id} className="border-2 border-gray-100 rounded-2xl overflow-hidden hover:border-indigo-200 hover:shadow-lg transition-all duration-300">
                  {event.eventImage?.url && (
                    <img 
                      src={event.eventImage.url} 
                      alt={event.eventTitle}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-bold text-gray-900 text-lg">{event.eventTitle}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        event.eventStatus === 'active' ? 'bg-green-100 text-green-800' :
                        event.eventStatus === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                        event.isLive ? 'bg-red-100 text-red-800' :
                        event.isPast ? 'bg-gray-100 text-gray-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {event.isLive ? 'LIVE' : event.eventStatus || 'scheduled'}
                      </span>
                    </div>
                    
                    {event.eventSubject && (
                      <p className="text-sm text-gray-600 mb-2">{event.eventSubject}</p>
                    )}
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm">
                        <FaMapMarkerAlt className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                        <span className="text-gray-600 truncate">{event.eventLocation}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <FaClock className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                        <span className="text-gray-600">
                          {event.eventStartDate && !isNaN(new Date(event.eventStartDate))
                            ? new Date(event.eventStartDate).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })
                            : 'Date TBD'
                          } at {event.eventTime}
                        </span>
                      </div>
                      {event.timeRemaining && event.isUpcoming && (
                        <div className="flex items-center text-sm text-green-600">
                          <FaHourglass className="h-4 w-4 mr-2" />
                          <span>
                            Starts in: {event.timeRemaining.days > 0 && `${event.timeRemaining.days}d `}
                            {event.timeRemaining.hours}h {event.timeRemaining.minutes}m
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onViewEvent(event._id)}
                        className="flex-1 px-3 py-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 font-medium text-sm flex items-center justify-center"
                      >
                        <FaEye className="mr-1 h-3 w-3" />
                        View
                      </button>
                      <button
                        onClick={() => onEditEvent(event)}
                        className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 font-medium text-sm flex items-center justify-center"
                      >
                        <FaEdit className="mr-1 h-3 w-3" />
                        Edit
                      </button>
                      <button
                        onClick={() => onDeleteEvent(event._id)}
                        disabled={actionLoading[`delete-${event._id}`]}
                        className="flex-1 px-3 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 font-medium text-sm flex items-center justify-center"
                      >
                        {actionLoading[`delete-${event._id}`] ? (
                          <FaSpinner className="animate-spin h-3 w-3" />
                        ) : (
                          <FaTimesCircle className="mr-1 h-3 w-3" />
                        )}
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-500">
                  Showing page {currentPage} of {totalPages} ({filteredEvents.length} total events)
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaArrowLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
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
  );
};

export default EventsTab;