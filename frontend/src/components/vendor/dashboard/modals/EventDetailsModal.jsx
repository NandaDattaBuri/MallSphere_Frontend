import React, { useState, useEffect } from 'react';
import { FaTimesCircle, FaPlus, FaSpinner, FaUserFriends } from 'react-icons/fa';
import { vendorApi } from '../../../../hooks/vendorApi';

const EventDetailsModal = ({
  isOpen,
  onClose,
  event,
  onEventUpdated,
  onEventDeleted,
  actionLoading,
  setActionLoading
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [eventFormData, setEventFormData] = useState({
    eventTitle: '',
    eventSubject: '',
    eventDescription: '',
    eventStartDate: '',
    eventEndDate: '',
    eventTime: '',
    eventLocation: '',
    eventTimezone: 'Asia/Kolkata',
    guests: []
  });

  const [eventImage, setEventImage] = useState(null);
  const [guestImages, setGuestImages] = useState([]);
  const [guestList, setGuestList] = useState([{ guestName: '' }]);

  // Format ISO date to YYYY-MM-DD for input field
  const formatDateForInput = (isoDate) => {
    if (!isoDate) return '';
    try {
      const date = new Date(isoDate);
      return date.toISOString().split('T')[0];
    } catch (e) {
      return '';
    }
  };

  useEffect(() => {
    if (event && isEditing) {
      let parsedGuests = [{ guestName: '' }];
      if (event.eventGuests && event.eventGuests.length > 0) {
        parsedGuests = event.eventGuests;
      }

      setEventFormData({
        eventTitle: event.eventTitle || '',
        eventSubject: event.eventSubject || '',
        eventDescription: event.eventDescription || '',
        eventStartDate: formatDateForInput(event.eventStartDate),
        eventEndDate: formatDateForInput(event.eventEndDate),
        eventTime: event.eventTime || '',
        eventLocation: event.eventLocation || '',
        eventTimezone: event.eventTimezone || 'Asia/Kolkata',
        guests: parsedGuests
      });
      setGuestList(parsedGuests);
      setEventImage(null);
      setGuestImages([]);
    }
  }, [event, isEditing]);

  const resetForm = () => {
    setEventFormData({
      eventTitle: '',
      eventSubject: '',
      eventDescription: '',
      eventStartDate: '',
      eventEndDate: '',
      eventTime: '',
      eventLocation: '',
      eventTimezone: 'Asia/Kolkata',
      guests: []
    });
    setEventImage(null);
    setGuestImages([]);
    setGuestList([{ guestName: '' }]);
    setIsEditing(false);
  };

  const handleGuestChange = (index, value) => {
    const updatedGuests = [...guestList];
    updatedGuests[index].guestName = value;
    setGuestList(updatedGuests);
  };

  const addGuestField = () => {
    setGuestList([...guestList, { guestName: '' }]);
  };

  const removeGuestField = (index) => {
    if (guestList.length > 1) {
      const updatedGuests = guestList.filter((_, i) => i !== index);
      setGuestList(updatedGuests);
    }
  };

  const handleEventFormChange = (e) => {
    const { name, value } = e.target;
    setEventFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEventImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setEventImage(e.target.files[0]);
    }
  };

  const handleGuestImagesChange = (e) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setGuestImages(files);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!event?._id) { alert('Event ID is required'); return; }

    try {
      setActionLoading(prev => ({ ...prev, updateEvent: true }));

      const validGuests = guestList.filter(g => g.guestName.trim() !== '');

      const eventData = {
        eventTitle: eventFormData.eventTitle,
        eventSubject: eventFormData.eventSubject || '',
        eventDescription: eventFormData.eventDescription || '',
        eventStartDate: eventFormData.eventStartDate,
        eventEndDate: eventFormData.eventEndDate,
        eventTime: eventFormData.eventTime,
        eventLocation: eventFormData.eventLocation,
        eventTimezone: eventFormData.eventTimezone || 'Asia/Kolkata',
        guests: validGuests,
      };

      const response = await vendorApi.updateEvent(
        event._id,
        eventData,
        eventImage,
        guestImages
      );

      if (response.success) {
        alert('Event updated successfully!');
        resetForm();
        onEventUpdated();
        onClose();
      }
    } catch (error) {
      console.error('Error updating event:', error);
      alert(error.message || 'Failed to update event');
    } finally {
      setActionLoading(prev => ({ ...prev, updateEvent: false }));
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      return;
    }
    await onEventDeleted(event._id);
    onClose();
  };

  if (!isOpen || !event) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-900">
            {isEditing ? 'Edit Event' : event.eventTitle}
          </h3>
          <button
            onClick={() => {
              resetForm();
              onClose();
            }}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimesCircle className="h-6 w-6" />
          </button>
        </div>

        {isEditing ? (
          <form onSubmit={handleUpdate} className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Title *
                </label>
                <input
                  type="text"
                  name="eventTitle"
                  value={eventFormData.eventTitle}
                  onChange={handleEventFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Subject
                </label>
                <input
                  type="text"
                  name="eventSubject"
                  value={eventFormData.eventSubject}
                  onChange={handleEventFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Event Description
              </label>
              <textarea
                name="eventDescription"
                value={eventFormData.eventDescription}
                onChange={handleEventFormChange}
                rows="2"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date *
                </label>
                <input
                  type="date"
                  name="eventStartDate"
                  value={eventFormData.eventStartDate}
                  onChange={handleEventFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date *
                </label>
                <input
                  type="date"
                  name="eventEndDate"
                  value={eventFormData.eventEndDate}
                  onChange={handleEventFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Time *
                </label>
                <input
                  type="text"
                  name="eventTime"
                  value={eventFormData.eventTime}
                  onChange={handleEventFormChange}
                  placeholder="e.g., 7:00 PM"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Timezone
                </label>
                <input
                  type="text"
                  name="eventTimezone"
                  value={eventFormData.eventTimezone}
                  onChange={handleEventFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Event Location *
              </label>
              <input
                type="text"
                name="eventLocation"
                value={eventFormData.eventLocation}
                onChange={handleEventFormChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                required
              />
            </div>

            {event.eventBanner && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Banner
                </label>
                <img 
                  src={event.eventBanner} 
                  alt="Event banner"
                  className="w-full h-32 object-cover rounded-lg"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Event Banner Image (Optional)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleEventImageChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-medium text-gray-700">
                  Guests
                </label>
                <button
                  type="button"
                  onClick={addGuestField}
                  className="text-xs text-indigo-600 hover:text-indigo-700 font-medium flex items-center"
                >
                  <FaPlus className="mr-1 h-3 w-3" />
                  Add Guest
                </button>
              </div>
              
              <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
                {guestList.map((guest, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={guest.guestName}
                      onChange={(e) => handleGuestChange(index, e.target.value)}
                      placeholder={`Guest ${index + 1} Name`}
                      className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                    />
                    {guestList.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeGuestField(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTimesCircle className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="sticky bottom-0 bg-white pt-4 border-t border-gray-200 flex space-x-3">
              <button
                type="submit"
                disabled={actionLoading.updateEvent}
                className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium text-sm disabled:opacity-50 flex items-center justify-center"
              >
                {actionLoading.updateEvent ? (
                  <>
                    <FaSpinner className="animate-spin mr-2 h-4 w-4" />
                    Updating...
                  </>
                ) : (
                  'Update Event'
                )}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="p-6 space-y-4">
            {event.eventDescription && (
              <div>
                <h4 className="font-medium text-gray-900 mb-1 text-sm">Description</h4>
                <p className="text-gray-600 text-sm">{event.eventDescription}</p>
              </div>
            )}
            
            {event.eventGuests && event.eventGuests.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2 text-sm">Guests</h4>
                <div className="space-y-1">
                  {event.eventGuests.map((guest, idx) => (
                    <div key={idx} className="flex items-center p-2 bg-gray-50 rounded-lg">
                      <FaUserFriends className="h-3 w-3 text-gray-400 mr-2" />
                      <span className="text-gray-700 text-sm">{guest.guestName}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">Event ID: {event._id}</p>
              <p className="text-xs text-gray-500">
                Created: {new Date(event.createdAt).toLocaleString()}
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setIsEditing(true)}
                className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm"
              >
                Edit Event
              </button>
              <button
                onClick={handleDelete}
                disabled={actionLoading[`delete-${event._id}`]}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium text-sm disabled:opacity-50"
              >
                {actionLoading[`delete-${event._id}`] ? (
                  <FaSpinner className="animate-spin mx-auto" />
                ) : (
                  'Delete Event'
                )}
              </button>
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDetailsModal;