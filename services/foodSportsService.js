const store = require('../data/store');
const canteenData = require('../data/canteenData');

class FoodSportsService {
  getCanteenData() {
    return canteenData;
  }

  getFoodOutlets() {
    // Return structured outlets for dashboard and campus views
    return [
      {
        id: "food_court_central",
        name: "Central Food Court (Blue Dove & Sagar)",
        building: "Annapurna Dining Complex",
        type: "Food Court (Monthly Rotating Mess)",
        status: "Open",
        avgWaitTimeMinutes: canteenData.foodCourt.currentCrowdWaitMins,
        queueLength: 6,
        timings: canteenData.foodCourt.timings,
        rating: "4.8 ★",
        caterers: canteenData.foodCourt.caterers.map(c => c.name),
        menu: [
          { item: "Breakfast (Idly / Paratha / Dosa)", price: 45 },
          { item: "Executive Lunch Thali", price: 80 },
          { item: "Evening Snacks & Tea", price: 30 },
          { item: "Royal Dinner Buffet", price: 85 }
        ],
        details: canteenData.foodCourt
      },
      {
        id: "canteen_iyengars",
        name: "The Iyengar's Canteen & Juice Bar",
        building: "Academic Block 2 Courtyard",
        type: "Traditional Fast Casual & Bakery",
        status: "Open",
        avgWaitTimeMinutes: canteenData.iyengars.currentCrowdWaitMins,
        queueLength: 4,
        timings: canteenData.iyengars.timings,
        rating: canteenData.iyengars.hygieneRating,
        verifiedBoardImage: canteenData.iyengars.verifiedBoardImage,
        parcelPolicy: canteenData.iyengars.parcelPolicy,
        menu: [
          { item: "Masala Puri / Pani Puri", price: 60 },
          { item: "Corn Cheese Sandwich", price: 80 },
          { item: "Fresh Fruit Juice", price: 60 },
          { item: "Cold Badam Milk", price: 60 },
          { item: "Peri Peri Fries", price: 80 },
          { item: "Lime & Mint Mojito", price: 80 }
        ],
        categories: canteenData.iyengars.categories
      },
      {
        id: "canteen_nandini_cafe",
        name: "Nandini Milk Parlour & Campus Cafe",
        building: "Student Amphitheatre Walkway",
        type: "KMF Karnataka Dairy Hub",
        status: "Active (Awaiting Data Feed)",
        avgWaitTimeMinutes: canteenData.nandiniCafe.currentCrowdWaitMins,
        queueLength: 2,
        timings: canteenData.nandiniCafe.timings,
        rating: canteenData.nandiniCafe.hygieneRating,
        notice: canteenData.nandiniCafe.notice,
        menu: canteenData.nandiniCafe.staplesPreview.map(s => ({
          item: s.name,
          price: parseInt(s.estimatedPrice.replace(/[^0-9]/g, '')) || 25
        })),
        staples: canteenData.nandiniCafe.staplesPreview
      }
    ];
  }

  getSportsCourts() {
    return [
      {
        id: "spt_badminton_1",
        name: "Badminton Court 1 (Indoor Wooden)",
        sport: "Badminton",
        location: "Chanakya Indoor Arena - Hall A",
        available: true,
        hourlyFee: 0,
        slots: [
          { time: "06:00 AM - 07:00 AM", status: "Available" },
          { time: "07:00 AM - 08:00 AM", status: "Booked (Hostel League)" },
          { time: "04:00 PM - 05:00 PM", status: "Available" },
          { time: "05:00 PM - 06:00 PM", status: "Booked (Faculty Club)" },
          { time: "06:00 PM - 07:00 PM", status: "Available" },
          { time: "07:00 PM - 08:00 PM", status: "Available" }
        ]
      },
      {
        id: "spt_badminton_2",
        name: "Badminton Court 2 (Synthetic Turf)",
        sport: "Badminton",
        location: "Chanakya Indoor Arena - Hall B",
        available: true,
        hourlyFee: 0,
        slots: [
          { time: "06:00 AM - 07:00 AM", status: "Available" },
          { time: "07:00 AM - 08:00 AM", status: "Available" },
          { time: "04:00 PM - 05:00 PM", status: "Available" },
          { time: "05:00 PM - 06:00 PM", status: "Available" },
          { time: "06:00 PM - 07:00 PM", status: "Booked (Girls Team)" },
          { time: "07:00 PM - 08:00 PM", status: "Available" }
        ]
      },
      {
        id: "spt_basketball_main",
        name: "Olympic Standard Basketball Court",
        sport: "Basketball",
        location: "Chanakya Sports Arena - Floodlit Ground",
        available: true,
        hourlyFee: 0,
        slots: [
          { time: "06:00 AM - 07:30 AM", status: "Available" },
          { time: "04:30 PM - 06:00 PM", status: "Booked (Varsity Practice)" },
          { time: "06:00 PM - 07:30 PM", status: "Available" },
          { time: "07:30 PM - 09:00 PM", status: "Available" }
        ]
      },
      {
        id: "spt_cricket_nets",
        name: "Cricket Practice Nets (Box Turf & Astro)",
        sport: "Cricket",
        location: "Chanakya Sports Grounds - North Pavilion",
        available: true,
        hourlyFee: 0,
        slots: [
          { time: "06:00 AM - 07:30 AM", status: "Available" },
          { time: "04:00 PM - 05:30 PM", status: "Available" },
          { time: "05:30 PM - 07:00 PM", status: "Booked (College XI)" },
          { time: "07:00 PM - 08:30 PM", status: "Available" }
        ]
      },
      {
        id: "spt_table_tennis",
        name: "Table Tennis Championship Arena (4 Tables)",
        sport: "Table Tennis",
        location: "Student Activity Center - 1st Floor",
        available: true,
        hourlyFee: 0,
        slots: [
          { time: "08:00 AM - 10:00 AM", status: "Available" },
          { time: "04:00 PM - 06:00 PM", status: "Available" },
          { time: "06:00 PM - 08:00 PM", status: "Available" },
          { time: "08:00 PM - 10:00 PM", status: "Available" }
        ]
      },
      {
        id: "spt_gymnasium",
        name: "Campus Fitness & Strength Gymnasium",
        sport: "Gym & Fitness",
        location: "Sports Complex - Ground Floor",
        available: true,
        hourlyFee: 0,
        slots: [
          { time: "06:00 AM - 09:00 AM (Morning Slot)", status: "Open" },
          { time: "04:30 PM - 09:30 PM (Evening Slot)", status: "Open" }
        ]
      }
    ];
  }

  bookCourt(courtId, slotTime, userName) {
    const courts = this.getSportsCourts();
    const court = courts.find(c => c.id === courtId);
    if (!court) throw new Error("Court not found");

    return {
      success: true,
      bookingId: "SPT-" + Math.floor(1000 + Math.random() * 9000),
      courtId,
      courtName: court.name,
      sport: court.sport,
      slotTime,
      userName: userName || "Student Player",
      confirmedAt: new Date().toISOString()
    };
  }

  simulateOrder(outletId, items, studentName) {
    const outlets = this.getFoodOutlets();
    const outlet = outlets.find(o => o.id === outletId) || outlets[0];

    const orderId = "ORD-" + Math.floor(10000 + Math.random() * 90000);
    const token = "TKN-" + Math.floor(100 + Math.random() * 900);
    
    let total = 0;
    (items || []).forEach(i => { total += (i.price || 50) * (i.qty || 1); });
    if (total === 0) total = 80;

    return {
      orderId,
      token,
      outletName: outlet.name,
      studentName: studentName || "Student Customer",
      items: items || [{ name: "Standard Meal / Order", qty: 1, price: total }],
      totalAmount: total,
      estimatedWaitMins: outlet.avgWaitTimeMinutes || 10,
      pickupCounter: "Express Counter 1",
      status: "Confirmed & In Preparation",
      placedAt: new Date().toISOString()
    };
  }
}

module.exports = new FoodSportsService();
