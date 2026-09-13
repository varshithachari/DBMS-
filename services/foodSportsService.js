const store = require('../data/store');

class FoodSportsService {
  getFoodOutlets() {
    return store.getAllFoodOutlets();
  }

  getSportsCourts() {
    return store.getAllSportsCourts();
  }

  bookCourt(courtId, slotTime, userName) {
    return store.bookSportsSlot(courtId, slotTime, userName);
  }

  simulateOrder(outletId, items, studentName) {
    const outlet = store.foodOutlets.find(o => o.id === outletId);
    if (!outlet) throw new Error("Outlet not found");

    const orderId = "ORD-" + Math.floor(10000 + Math.random() * 90000);
    const token = "TKN-" + Math.floor(100 + Math.random() * 900);
    
    let total = 0;
    items.forEach(i => { total += (i.price || 50) * (i.qty || 1); });

    return {
      orderId,
      token,
      outletName: outlet.name,
      studentName: studentName || "Student Customer",
      items,
      totalAmount: total,
      estimatedWaitMins: outlet.currentCrowdWaitMins,
      pickupCounter: "Counter 2 (Digital Express)",
      status: "Preparing",
      placedAt: new Date().toISOString()
    };
  }
}

module.exports = new FoodSportsService();