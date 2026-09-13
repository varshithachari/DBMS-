const store = require('../data/store');
const campusConfig = require('../config/campusConfig');

class SearchService {
  search(query, category = "all") {
    if (!query || query.trim() === "") {
      return {
        events: store.getAllEvents().slice(0, 4),
        landmarks: store.landmarks.slice(0, 4),
        facilities: store.facilities.slice(0, 3)
      };
    }

    const q = query.toLowerCase().trim();
    const tokens = q.split(/\s+/);

    // Search events
    const matchedEvents = store.getAllEvents().filter(event => {
      const text = [
        event.title,
        event.shortTitle,
        event.category,
        event.department,
        event.description,
        event.venueName,
        ...(event.tags || [])
      ].join(" ").toLowerCase();

      return tokens.some(tok => text.includes(tok));
    });

    // Search landmarks / buildings
    const matchedLandmarks = store.landmarks.filter(lm => {
      const text = [
        lm.name,
        lm.shortName,
        lm.category,
        lm.description,
        ...(lm.departments || [])
      ].join(" ").toLowerCase();

      return tokens.some(tok => text.includes(tok));
    });

    // Search facilities
    const matchedFacilities = store.facilities.filter(fac => {
      const text = [
        fac.name,
        fac.buildingName,
        fac.type,
        ...(fac.equipment || [])
      ].join(" ").toLowerCase();

      return tokens.some(tok => text.includes(tok));
    });

    // Search food items
    const matchedFood = [];
    store.foodOutlets.forEach(outlet => {
      outlet.menuCategories.forEach(cat => {
        cat.items.forEach(item => {
          if (item.name.toLowerCase().includes(q) || item.tag.toLowerCase().includes(q)) {
            matchedFood.push({
              ...item,
              outletName: outlet.name,
              buildingId: outlet.buildingId
            });
          }
        });
      });
    });

    return {
      query,
      resultsCount: matchedEvents.length + matchedLandmarks.length + matchedFacilities.length + matchedFood.length,
      events: matchedEvents,
      landmarks: matchedLandmarks,
      facilities: matchedFacilities,
      food: matchedFood
    };
  }
}

module.exports = new SearchService();