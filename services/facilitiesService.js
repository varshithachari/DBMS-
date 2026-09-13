const store = require('../data/store');

class FacilitiesService {
  getAll() {
    return store.getAllFacilities();
  }

  book(id, bookingData) {
    return store.bookFacilitySlot(id, bookingData);
  }
}

module.exports = new FacilitiesService();