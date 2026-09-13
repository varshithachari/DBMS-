const store = require('../data/store');

class EventsService {
  getEvents(filters) {
    return store.getAllEvents(filters);
  }

  getEvent(id) {
    return store.getEventById(id);
  }

  createEvent(data) {
    return store.createEvent(data);
  }

  approveEvent(id, stage, action, actor, notes) {
    return store.updateEventApproval(id, stage, action, actor, notes);
  }

  registerUser(eventId, userData) {
    return store.registerForEvent(eventId, userData);
  }

  getEventRegistrations(eventId) {
    return store.getRegistrationsByEvent(eventId);
  }

  getUserRegistrations(email) {
    return store.getUserRegistrations(email);
  }
}

module.exports = new EventsService();