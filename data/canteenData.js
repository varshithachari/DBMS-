/**
 * Chanakya Campus Connect - Canteen & Dining Data Architecture
 * 
 * Supports dynamic monthly rotations for campus food courts (Blue Dove & Sagar),
 * real-time itemized cafe pricing (The Iyengar's Canteen with whiteboard snapshot),
 * and upcoming dairy hub updates (Nandini Cafe).
 */

const CANTEEN_DATA = {
  activeMonth: "November 2026",
  cycleVersion: "Cycle 11/2026 (Monthly Rotating Schedule)",
  lastUpdated: "2026-11-18T10:00:00Z",
  availableMonths: [
    { id: "2026-11", label: "November 2026 (Active Current)", active: true },
    { id: "2026-12", label: "December 2026 (Upcoming Cycle)", active: false },
    { id: "2026-10", label: "October 2026 (Archived Cycle)", active: false }
  ],
  
  // Section 1: Campus Food Court (Dual Caterer Model with Monthly Menu Rotation)
  foodCourt: {
    id: "food_court_central",
    name: "Chanakya Central Food Court & Mess Pavilion",
    building: "Annapurna Dining Complex - Ground Floor",
    timings: "07:30 AM - 10:30 PM Daily",
    status: "Open",
    currentCrowdWaitMins: 8,
    rushHour: "12:45 PM - 02:00 PM & 08:00 PM - 09:15 PM",
    hygieneRating: "5.0 ★ (FSSAI Tier-1 Institutional)",
    mealTimings: {
      breakfast: "07:30 AM - 10:00 AM",
      lunch: "12:15 PM - 02:45 PM",
      snacks: "05:00 PM - 06:30 PM",
      dinner: "07:30 PM - 10:00 PM"
    },
    caterers: [
      {
        id: "caterer_blue_dove",
        name: "Blue Dove Dining & Caterers",
        code: "BD-MESS",
        description: "Specialized in South & North Indian multi-grain delicacies with traditional Ragi Mudde and regional sambars.",
        type: "Food Court - Wing A",
        rating: "4.8 ★",
        weeklySchedule: {
          monday: {
            day: "Monday",
            date: "2026-11-16",
            breakfast: ["Idly", "Coriander Rice", "Sambar", "Coconut Chutney", "Cornflakes", "Cut Fresh Fruits", "Boiled Egg (01 Limited)", "Bread", "Butter", "Fruit Jam", "Tea", "Coffee", "Hot Milk"],
            lunch: ["Masala Buttermilk", "Butter Roti & Ragi Ball", "Soppu Kaalu Palya", "White Kara Mani Masala", "Jeera Rice", "Steam Rice", "Boiled Rice", "Traditional Bassaru", "Fresh Curd", "Mango Pickle", "Fried Green Chilli", "Papad / Fryums", "Broken Wheat Payasa (Limited)"],
            snacks: ["Masala Puri (Limited)", "Hot Masala Tea", "Filter Coffee"],
            dinner: ["Hot and Sour Soup", "Phulka Roti", "Aloo Palak", "Steam Rice", "Dal Fry", "Pickle", "Fresh Curd", "Mint Rasam", "Chettinad Egg Masala (Limited)"]
          },
          tuesday: {
            day: "Tuesday",
            date: "2026-11-17",
            breakfast: ["Aloo Paratha", "Ven Pongal", "Fresh Curd", "Coconut Chutney", "Rolled Oats", "Fresh Banana", "Boiled Egg (01 Limited)", "Bread", "Butter", "Jam", "Masala Tea", "Coffee", "Hot Milk"],
            lunch: ["Ragi Ambli", "Butter Roti & Ragi Ball", "Beetroot Poriyal", "Aloo Palak Masala", "Fragrant Ghee Rice", "Steam Rice", "Boiled Rice", "Molakekalu Sambar", "Fresh Curd", "Pickle", "Fried Green Chilli", "Garden Salad", "Banana Sheera (Limited)"],
            snacks: ["Veg Maggi (Limited)", "Tea", "Filter Coffee"],
            dinner: ["Creamy Tomato Soup", "Roti", "Paneer Aloo Masala", "Steam Rice", "Dal Makhni", "Pickle", "Curd", "Black Pepper Rasam", "Curry Leaf Chicken (3 pcs Limited)"]
          },
          wednesday: {
            day: "Wednesday",
            date: "2026-11-18",
            breakfast: ["Kali Dosa", "Lemon Rice", "Udupi Sambar", "Chutney", "Cornflakes", "Cut Fruits", "Boiled Egg (01 Limited)", "Bread", "Butter", "Jam", "Tea", "Coffee", "Hot Milk"],
            lunch: ["Pangam Herbal Cooler", "Akki Roti", "Snake Gourd Palya", "Yennegayi Brinjal Masala", "Corn Pulao", "Steam Rice", "Boiled Rice", "Kadle Kaalu Huli", "Curd", "Pickle", "Fried Green Chilli", "Papad / Fryums", "Semiya Kheer (Limited)"],
            snacks: ["Veg Pasta in White Garlic Sauce (Limited)", "Masala Tea", "Coffee"],
            dinner: ["Sweet Corn Soup", "Roti", "Methi Chole Masala", "Steam Rice", "Plain Dal", "Pickle", "Curd", "Dal Rasam", "Muttai Kuzhambu (Egg Curry Limited)"]
          },
          thursday: {
            day: "Thursday",
            date: "2026-11-19",
            breakfast: ["Poori with Aloo Sagu", "Masala Poha", "Chutney", "Choco Flakes", "Cut Seasonal Fruits", "Boiled Egg (01 Limited)", "Bread", "Butter", "Jam", "Tea", "Coffee", "Hot Milk"],
            lunch: ["Jaljeera Refresh", "Butter Roti", "Cabbage Poriyal", "Veg Kadai Masala", "White Vegetable Pulao", "Steam Rice", "Boiled Rice", "Masoppu Sambar", "Curd", "Chow Chow Palya", "Fried Green Chilli", "Green Salad", "Rava Ladoo (1 pc)"],
            snacks: ["Bhel Puri (Limited)", "Tea", "Coffee"],
            dinner: ["Cream of Mushroom Soup", "Tawa Kulcha", "Paneer Do Pyaza", "Steam Rice", "Palak Dal", "Pickle", "Curd", "Spicy Chilli Rasam", "Andhra Style Chicken Curry (Limited)"]
          },
          friday: {
            day: "Friday",
            date: "2026-11-20",
            breakfast: ["Veg Stuffed Paratha", "Curry Leaf Spiced Rice", "Curd", "Chutney", "Cornflakes", "Banana", "Boiled Egg (01 Limited)", "Bread", "Butter", "Jam", "Masala Tea", "Coffee", "Hot Milk"],
            lunch: ["Ragi Ambli", "Butter Roti & Ragi Ball", "Mixed Vegetable Palya", "Aloo Black Channa Curry", "Curry Leaf Rice", "Steam Rice", "Boiled Rice", "Drumstick Sambar", "Curd", "Pickle", "Fried Green Chilli", "Papad / Fryums", "Green Moongdal Payasam"],
            snacks: ["Onion Bonda (2 pcs) with Mint Chutney", "Masala Tea", "Coffee"],
            dinner: ["Hot and Sour Soup", "Hyderabadi Veg Dum Biryani", "Mirchi Ka Salan", "Pickle", "Onion Raitha", "Jeera Rasam", "Ambur Egg Biryani (Limited)"]
          },
          saturday: {
            day: "Saturday",
            date: "2026-11-21",
            breakfast: ["Batura with Chole Masala", "Broken Wheat Upma", "Chutney", "Oats", "Cut Fruits", "Boiled Egg (01 Limited)", "Bread", "Butter", "Jam", "Tea", "Coffee", "Hot Milk"],
            lunch: ["Mint Lemon Juice", "Butter Roti", "Aloo Capsicum Palya", "Punjabi Rajma Masala", "Green Peas Pulao", "Steam Rice", "Boiled Rice", "Aloo Brinjal Sambar", "Curd", "Pickle", "Fried Green Chilli", "Fresh Salad", "Besan Ladoo (1 pc)"],
            snacks: ["Grilled Veg Sandwich (1 pc) with Tomato Dip", "Tea", "Coffee"],
            dinner: ["Drumstick Clear Soup", "Phulka Roti", "Veg Mushroom Masala", "Steam Rice", "Masala Dal", "Pickle", "Curd", "Mysore Rasam", "Chicken Masala Curry (Limited)"]
          },
          sunday: {
            day: "Sunday",
            date: "2026-11-22",
            breakfast: ["Crispy Masala Dosa (03 pcs)", "Tomato Bath", "Sambar", "Chutney", "Cornflakes", "Cut Fruits", "Boiled Egg (01 Limited)", "Bread", "Butter", "Jam", "Tea", "Coffee", "Hot Milk"],
            lunch: ["Jaljeera Digestive", "Butter Roti", "Pumpkin Palya", "Mixed Vegetable Curry", "Lemon Rice", "Steam Rice", "Boiled Rice", "Radish Sambar", "Curd", "Pickle", "Fried Green Chilli", "Papad / Fryums", "Chilled Fruit Custard (Limited)"],
            snacks: ["Crispy Punjabi Samosa (1 pc) with Mint Chutney", "Tea", "Coffee"],
            dinner: ["Vegetable Clear Soup", "Paneer Dum Biryani", "Steam Rice", "Salan", "Pickle", "Onion Cucumber Raitha", "Coriander Rasam", "Special Royal Chicken Biryani (Limited)"]
          }
        }
      },
      {
        id: "caterer_sagar",
        name: "Sagar Caterers & Dining",
        code: "SAGAR-MESS",
        description: "Known for Karnataka traditional breakfast varieties, nutritious chapathis, and specialty weekend biryanis.",
        type: "Food Court - Wing B",
        rating: "4.7 ★",
        weeklySchedule: {
          monday: {
            day: "Monday",
            date: "2026-11-16",
            breakfast: ["Puffy Bhatura with Chole Masala", "Tomato Chitranna", "Chutney", "Cornflakes", "Cut Fruits (Limited)", "Boiled Egg (01 Limited)", "Bread", "Butter", "Jam", "Tea", "Coffee", "Hot Milk"],
            lunch: ["Methi Chapathi", "Steam Rice", "Crispy Papad", "Aloo Bhendi Dry", "Jeera Rice", "Plain Dal", "Rajma Masala", "Gulab Jamun (1 pc)", "Ragi Malt", "Pickle", "Fresh Curd"],
            snacks: ["Masala Puri (Limited)", "Tea", "Coffee"],
            dinner: ["Wheat Chapathi", "Mysore Rasam", "Yellow Dal Tadka", "Egg Masala (02 pcs)", "Veg Hyderabadi Handi Masala", "Steam Rice", "Pickle", "Curd"]
          },
          tuesday: {
            day: "Tuesday",
            date: "2026-11-17",
            breakfast: ["Steamed Rava Idli with Aloo Saagu", "Ven Pongal", "Chutney", "Rolled Oats", "Cut Fruits", "Boiled Egg (01 Limited)", "Bread", "Butter", "Jam", "Tea", "Coffee", "Hot Milk"],
            lunch: ["Wheat Chapathi", "Steam Rice", "Cucumber Salad", "Soppu Kaalu Palya", "Lemon Rice", "Bassaru", "Aloo Palak Gravy", "Godhi Kadi Payasa (Limited)", "Spiced Buttermilk", "Pickle", "Curd"],
            snacks: ["Hot Samosa (1 pc)", "Tea", "Coffee"],
            dinner: ["Carrot Chapathi", "Black Pepper Rasam", "Tomato Dal", "Kundapura Chicken Curry (3 pcs)", "Paneer Butter Masala", "Steam Rice", "Pickle", "Curd"]
          },
          wednesday: {
            day: "Wednesday",
            date: "2026-11-18",
            breakfast: ["50-50 Stuffed Paratha", "Fresh Curd", "Vangi Bath (Brinjal Rice)", "Chutney", "Cornflakes", "Cut Fruits", "Boiled Egg (01 Limited)", "Bread", "Butter", "Jam", "Tea", "Coffee", "Hot Milk"],
            lunch: ["Jeera Chapathi", "Steam Rice", "Papad", "Carrot Beans Palya", "Soya Pulao", "Herekayi Sambar", "Karamani Masala", "Banana Sajjige (Limited)", "Fresh Lemon Juice", "Pickle", "Curd"],
            snacks: ["Crispy Bread Pakoda (1 pc)", "Tea", "Coffee"],
            dinner: ["Wheat Chapathi", "Huli Rasam", "Mixed Dal Fry", "Egg Paddu Masala (02 pcs)", "Bhuna Mushroom Masala", "Steam Rice", "Pickle", "Curd"]
          },
          thursday: {
            day: "Thursday",
            date: "2026-11-19",
            breakfast: ["Kali Dosa with Mix Veg Kurma", "Karnataka Puliyogare", "Chutney", "Oats", "Cut Fruits", "Boiled Egg (01 Limited)", "Bread", "Butter", "Jam", "Tea", "Coffee", "Hot Milk"],
            lunch: ["Wheat Chapathi", "Steam Rice", "Garden Salad", "Aloo Methi Dry", "Veg Biryani", "Mangalore Cucumber Sambar", "Soya Capsicum Masala", "Shahi Tukda (1 pc)", "Masala Buttermilk", "Pickle", "Curd"],
            snacks: ["Pani Puri (5 pcs)", "Tea", "Coffee"],
            dinner: ["Jeera Chapathi", "Udupi Rasam", "Dal Palak", "Patiala Chicken Masala (3 pcs)", "Mutter Paneer", "Steam Rice", "Pickle", "Curd"]
          },
          friday: {
            day: "Friday",
            date: "2026-11-20",
            breakfast: ["Thatte Idli with Aloo Saagu", "Masala Poha", "Red Chutney", "Cornflakes", "Cut Fruits", "Boiled Egg (01 Limited)", "Bread", "Butter", "Jam", "Tea", "Coffee", "Hot Milk"],
            lunch: ["Beetroot Chapathi", "Steam Rice", "Papad", "Yam Palya", "Coriander Rice", "Pumpkin Sambar", "Veg Do Pyaza Curry", "Fruit Custard (Limited)", "Cool Shikanji", "Pickle", "Curd"],
            snacks: ["Misal Pav (1 pc)", "Tea", "Coffee"],
            dinner: ["Mirchi Salan", "Methi Dal", "Egg Biryani (02 pcs)", "Veg Hyderabadi Biryani", "Steam Rice", "Pickle", "Cucumber Raitha"]
          },
          saturday: {
            day: "Saturday",
            date: "2026-11-21",
            breakfast: ["Aloo Paneer Paratha with Curd", "Veg Vegetable Pulao", "Chutney", "Oats", "Cut Fruits", "Boiled Egg (01 Limited)", "Bread", "Butter", "Jam", "Tea", "Coffee", "Hot Milk"],
            lunch: ["Wheat Chapathi", "Steam Rice", "Salad", "Beetroot Palya", "Curd Rice", "Mixed Vegetable Sambar", "Bhendi Masala", "Sabudana Payasa (Limited)", "Fresh Buttermilk", "Pickle"],
            snacks: ["Crispy Dal Vada (2 pcs)", "Tea", "Coffee"],
            dinner: ["Methi Chapathi", "Jeera Rasam", "Plain Dal", "Punjabi Chole Masala", "Steam Rice", "Pickle", "Curd"]
          },
          sunday: {
            day: "Sunday",
            date: "2026-11-22",
            breakfast: ["Masala Dosa (03 pcs)", "Sambar", "Bansi Rava Veg Upma", "Chutney", "Cornflakes", "Cut Fruits", "Boiled Egg (01 Limited)", "Bread", "Butter", "Jam", "Tea", "Coffee", "Hot Milk"],
            lunch: ["Carrot Chapathi", "Steam Rice", "Papad", "Raw Banana Palya", "Tomato Bath", "Soppu Sambar", "Avarebele Masala", "Rava Laddu (1 pc)", "Jaljeera", "Pickle", "Curd"],
            snacks: ["White Sauce Pasta (Limited)", "Tea", "Coffee"],
            dinner: ["Salan", "Andhra Rasam", "Chicken Pulao (3 pcs)", "Paneer Biryani", "Steam Rice", "Pickle", "Raitha"]
          }
        }
      }
    ]
  },

  // Section 2: The Iyengar's Canteen (Direct from Whiteboard Menu Board)
  iyengars: {
    id: "canteen_iyengars",
    name: "The Iyengar's Canteen & Cafe",
    building: "Academic Block 2 Courtyard",
    type: "Traditional Fast Casual, Bakery & Juices",
    timings: "08:00 AM - 09:30 PM Daily",
    status: "Open",
    currentCrowdWaitMins: 6,
    hygieneRating: "4.9 ★",
    verifiedBoardImage: "/images/iyengars_menu_board.jpg",
    parcelPolicy: "Parcel charges extra ₹5/- per item",
    categories: [
      {
        name: "Fresh Fruit Juice",
        icon: "🥤",
        items: [
          { name: "Water Melon Juice", price: 60, tag: "Fresh Press", prepTime: "3 mins" },
          { name: "Musk Melon Juice", price: 60, tag: "Fresh Press", prepTime: "3 mins" },
          { name: "Pine Apple Juice", price: 60, tag: "Fresh Press", prepTime: "4 mins" },
          { name: "Musambi Juice", price: 60, tag: "Citrus Rich", prepTime: "4 mins" },
          { name: "Mix Fruit Juice", price: 80, tag: "Chef Special", prepTime: "5 mins" },
          { name: "Lemon Juice", price: 40, tag: "Hydration", prepTime: "2 mins" },
          { name: "Pulpy Grapes Juice", price: 70, tag: "Seasonal", prepTime: "4 mins" },
          { name: "Cold Coffee", price: 100, tag: "Thick Blend", prepTime: "3 mins" }
        ]
      },
      {
        name: "Sandwich and Burger",
        icon: "🥪",
        items: [
          { name: "Corn Cheese Sandwich", price: 80, tag: "Toasted", prepTime: "6 mins" },
          { name: "Tandoori Paneer Sandwich", price: 80, tag: "Spicy", prepTime: "7 mins" },
          { name: "Tandoori Cheese Paneer Sandwich", price: 90, tag: "Bestseller", prepTime: "7 mins" },
          { name: "Veg Cheese Sandwich", price: 80, tag: "Classic", prepTime: "5 mins" },
          { name: "Veg Sandwich", price: 70, tag: "Light", prepTime: "5 mins" },
          { name: "Veg Burger", price: 80, tag: "Crispy Patty", prepTime: "8 mins" },
          { name: "Veg Cheese Burger", price: 90, tag: "Double Melt", prepTime: "8 mins" },
          { name: "Paneer Burger", price: 90, tag: "Grilled Paneer", prepTime: "8 mins" },
          { name: "Paneer Cheese Burger", price: 100, tag: "Supreme", prepTime: "9 mins" }
        ]
      },
      {
        name: "Milk Shake and Lassi",
        icon: "🥛",
        items: [
          { name: "Apple Milk Shake", price: 70, tag: "Rich Fruit", prepTime: "4 mins" },
          { name: "Banana Milk Shake", price: 70, tag: "Energy Boost", prepTime: "3 mins" },
          { name: "Oreo Milk Shake", price: 80, tag: "Popular", prepTime: "4 mins" },
          { name: "Banana Chocolate Milk Shake", price: 80, tag: "Indulgent", prepTime: "4 mins" },
          { name: "Papaya Milk Shake", price: 70, tag: "Nutritious", prepTime: "4 mins" },
          { name: "Butter Fruit Milk Shake (Avocado)", price: 90, tag: "Premium Creamy", prepTime: "5 mins" },
          { name: "Strawberry Milk Shake", price: 80, tag: "Berry Blend", prepTime: "4 mins" },
          { name: "Chocolate Milk Shake", price: 90, tag: "Thick Cocoa", prepTime: "4 mins" },
          { name: "Mango Milk Shake", price: 80, tag: "Alphonso Blend", prepTime: "4 mins" },
          { name: "Rose Milk", price: 60, tag: "Traditional Cold", prepTime: "2 mins" },
          { name: "Cold Badam Milk", price: 60, tag: "Kesar Badam", prepTime: "2 mins" },
          { name: "Rose Lassi", price: 60, tag: "Sweet Curd", prepTime: "3 mins" },
          { name: "Banana Lassi", price: 60, tag: "Thick Lassi", prepTime: "3 mins" },
          { name: "Mango Crush Lassi", price: 60, tag: "Fruity Curd", prepTime: "3 mins" },
          { name: "Mix Fruit Lassi", price: 70, tag: "Topped Fruit", prepTime: "4 mins" },
          { name: "Fruit Custard", price: 70, tag: "Chilled Dessert", prepTime: "2 mins" },
          { name: "Fresh Fruit Bowl", price: 60, tag: "Cut Fruit Mix", prepTime: "3 mins" }
        ]
      },
      {
        name: "Fries & Quick Bites",
        icon: "🍟",
        items: [
          { name: "French Fries", price: 70, tag: "Crispy Salted", prepTime: "5 mins" },
          { name: "Peri Peri Fries", price: 80, tag: "Hot & Tangy", prepTime: "5 mins" },
          { name: "Potato Wedges", price: 80, tag: "Herbed", prepTime: "6 mins" },
          { name: "Potato Cheese Wedges", price: 90, tag: "Cheesy Melt", prepTime: "6 mins" },
          { name: "Crinkle Pepper Fries", price: 80, tag: "Crinkle Cut", prepTime: "5 mins" },
          { name: "Crinkle Cheese Fries", price: 90, tag: "Crinkle Melt", prepTime: "5 mins" },
          { name: "Cheese Fries", price: 80, tag: "Loaded Dip", prepTime: "5 mins" },
          { name: "Peri Peri Cheese Fries", price: 90, tag: "Signature Fries", prepTime: "6 mins" },
          { name: "Veg Nuggets", price: 70, tag: "6 pcs Crisp", prepTime: "5 mins" },
          { name: "Potato Cheese Shots", price: 70, tag: "Bite Sized", prepTime: "5 mins" }
        ]
      },
      {
        name: "Campus Chats",
        icon: "🥟",
        items: [
          { name: "Masala Puri", price: 60, tag: "Bengaluru Special", prepTime: "4 mins" },
          { name: "Pani Puri", price: 60, tag: "Crispy Golgappa", prepTime: "3 mins" },
          { name: "Dahi Puri", price: 60, tag: "Sweet Curd & Sev", prepTime: "4 mins" },
          { name: "Bhel Puri", price: 60, tag: "Crunchy Spiced", prepTime: "3 mins" },
          { name: "Samosa Chat", price: 70, tag: "Crushed Samosa Gravy", prepTime: "4 mins" },
          { name: "Vada Pav", price: 70, tag: "2 pcs Chutney Pav", prepTime: "3 mins" }
        ]
      },
      {
        name: "Mojito and Soda",
        icon: "🍹",
        items: [
          { name: "Lime & Mint Mojito", price: 80, tag: "Virgin Classic", prepTime: "3 mins" },
          { name: "Pineapple Mojito", price: 80, tag: "Tropical Fizz", prepTime: "3 mins" },
          { name: "Strawberry Mojito", price: 80, tag: "Berry Splash", prepTime: "3 mins" },
          { name: "Blueberry Mojito", price: 80, tag: "Electric Blue", prepTime: "3 mins" },
          { name: "Mango Mojito", price: 80, tag: "Summer Sparkle", prepTime: "3 mins" },
          { name: "Guava Chilli Mojito", price: 80, tag: "Spicy Tang", prepTime: "3 mins" },
          { name: "Litchi Mojito", price: 80, tag: "Sweet Fizz", prepTime: "3 mins" },
          { name: "Lime Masala Soda", price: 80, tag: "Zesty Soda", prepTime: "2 mins" }
        ]
      }
    ]
  },

  // Section 3: Nandini Cafe (Awaiting Detailed Feed Tomorrow)
  nandiniCafe: {
    id: "canteen_nandini_cafe",
    name: "Nandini Milk Parlour & Campus Cafe",
    building: "Student Amphitheatre Walkway",
    type: "KMF Karnataka Dairy Outlet & Beverages",
    timings: "08:30 AM - 09:00 PM Daily",
    status: "Active (Awaiting Menu Feed)",
    currentCrowdWaitMins: 4,
    hygieneRating: "5.0 ★ (KMF Certified)",
    notice: "Official detailed price board sync scheduled for tomorrow. Core dairy essentials available at counter.",
    staplesPreview: [
      { name: "Nandini Degree Filter Coffee", estimatedPrice: "₹15", tag: "Hot Beverage" },
      { name: "Hot Badam Milk (Glass)", estimatedPrice: "₹25", tag: "Hot Beverage" },
      { name: "Cold Flavoured Milk (Pista / Choco / Badam)", estimatedPrice: "₹30", tag: "Chilled Bottle" },
      { name: "Special Mysore Pak & Milk Peda (Box)", estimatedPrice: "₹45", tag: "Traditional Sweet" },
      { name: "Nandini Premium Ice Cream Scoops & Kulfi", estimatedPrice: "₹35", tag: "Dessert" },
      { name: "Fresh Curd Cup & Sweet Lassi", estimatedPrice: "₹20", tag: "Probiotic Dairy" }
    ]
  }
};

module.exports = CANTEEN_DATA;
