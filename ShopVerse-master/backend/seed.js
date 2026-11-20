require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./models/product");
const User = require("./models/user");

const MONGODB_URL = process.env.MONGODB_URL || "mongodb://127.0.0.1:27017/shopverse";

const sampleProducts = [
  // --- MENS ---
  {
    title: "Classic Oxford Cotton Shirt",
    price: 1899,
    about: "Crafted from 100% breathable premium cotton. Ideal for formal events and sharp everyday office wear.",
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=80",
    category: "mens",
    type: "shirt",
    brand: "Armani",
    stock: "instock",
    color: "black",
    size: "L",
    gender: "male",
    fabric: "cotton"
  },
  {
    title: "Gucci Signature Casual Linen Shirt",
    price: 3499,
    about: "Effortlessly elegant pure linen shirt with a modern tailored slim cut and mother-of-pearl buttons.",
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&auto=format&fit=crop&q=80",
    category: "mens",
    type: "shirt",
    brand: "Gucci",
    stock: "instock",
    color: "red",
    size: "M",
    gender: "male",
    fabric: "linen"
  },
  {
    title: "Tailored Slim Fit Chino Pant",
    price: 2199,
    about: "Versatile stretch chinos designed for maximum comfort and durability from desk to dinner.",
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&auto=format&fit=crop&q=80",
    category: "mens",
    type: "pant",
    brand: "Armani",
    stock: "instock",
    color: "black",
    size: "M",
    gender: "male",
    fabric: "cotton"
  },
  {
    title: "Slim Fit Stretch Denim Jeans",
    price: 2799,
    about: "Classic five-pocket styling in a modern dark wash with stretch denim comfort.",
    image: "https://images.unsplash.com/photo-1542272604-780c96856592?w=600&auto=format&fit=crop&q=80",
    category: "mens",
    type: "jeans",
    brand: "Armani",
    stock: "instock",
    color: "black",
    size: "L",
    gender: "male"
  },
  {
    title: "Italian Wool Slim Fit Two-Piece Suit",
    price: 8999,
    about: "Impeccably tailored two-piece suit crafted from premium blended wool for weddings and galas.",
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&auto=format&fit=crop&q=80",
    category: "mens",
    type: "suit",
    brand: "Gucci",
    stock: "instock",
    color: "black",
    size: "L",
    gender: "male"
  },
  {
    title: "Rolex Submariner Chronometer Watch",
    price: 14500,
    about: "Iconic oystersteel luxury chronograph with sapphire crystal and automatic precision movement.",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80",
    category: "mens",
    type: "watch",
    brand: "Rolex",
    stock: "instock",
    color: "black",
    gender: "male"
  },

  // --- FEMALES ---
  {
    title: "Handwoven Crimson Silk Saree",
    price: 4999,
    about: "Traditional handloom silk saree adorned with rich golden zari borders and intricate pallu motifs.",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80",
    category: "females",
    type: "saree",
    stock: "instock",
    color: "red",
    fabric: "linen",
    gender: "female"
  },
  {
    title: "Embroidered Royal Anarkali Suit",
    price: 3799,
    about: "Stunning festive 3-piece Anarkali suit set featuring delicate threadwork and chiffon dupatta.",
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&auto=format&fit=crop&q=80",
    category: "females",
    type: "suit",
    stock: "instock",
    color: "black",
    size: "M",
    fabric: "cotton",
    gender: "female"
  },
  {
    title: "Floral Printed Bohemian Top",
    price: 1299,
    about: "Lightweight and flowy floral blouse crafted from soft breathable linen with gathered sleeves.",
    image: "https://images.unsplash.com/photo-1564257631407-4deb129f042b?w=600&auto=format&fit=crop&q=80",
    category: "females",
    type: "top",
    stock: "instock",
    color: "red",
    size: "S",
    fabric: "linen",
    gender: "female"
  },
  {
    title: "Evening Velvet Cocktail Dress",
    price: 3499,
    about: "Sophisticated midnight black velvet midi dress with flattering sweetheart neckline.",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&auto=format&fit=crop&q=80",
    category: "females",
    type: "dress",
    stock: "instock",
    color: "black",
    size: "M",
    gender: "female"
  },
  {
    title: "Titan Raga Rose Gold Watch",
    price: 5299,
    about: "Exquisite jewelry-inspired timepiece with mother-of-pearl dial and rose gold embellished strap.",
    image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop&q=80",
    category: "females",
    type: "watch",
    brand: "Titan",
    stock: "instock",
    color: "black",
    gender: "female"
  },

  // --- BEAUTY ---
  {
    title: "MamaEarth Vitamin C Radiance Day Cream",
    price: 599,
    about: "Enriched with pure Vitamin C and turmeric to brighten dull skin, fight pigmentation, and restore natural glow.",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80",
    category: "beauty",
    type: "cream",
    brand: "MamaEarth",
    stock: "instock",
    skinType: "oily"
  },
  {
    title: "Sugar Aquaholic Deep Hydrating Cream",
    price: 699,
    about: "Ultra-nourishing hyaluronic acid gel moisturizer designed to quench dehydrated skin all day long.",
    image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&auto=format&fit=crop&q=80",
    category: "beauty",
    type: "cream",
    brand: "Sugar",
    stock: "instock",
    skinType: "dry"
  },
  {
    title: "Tea Tree Gentle Purifying Facewash",
    price: 399,
    about: "Deep-cleansing foaming face wash with organic Australian tea tree extract and salicylic acid.",
    image: "https://images.unsplash.com/photo-1556228722-d0b71e16447c?w=600&auto=format&fit=crop&q=80",
    category: "beauty",
    type: "facewash",
    brand: "MamaEarth",
    stock: "instock",
    skinType: "oily"
  },
  {
    title: "Niacinamide Glow Booster Serum",
    price: 899,
    about: "10% Niacinamide and Zinc face serum for clear pore-refined skin and radiant texture.",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80",
    category: "beauty",
    type: "serum",
    brand: "Sugar",
    stock: "instock",
    skinType: "oily"
  },

  // --- ACCESSORIES ---
  {
    title: "Sony WH-1000XM5 Noise Cancelling Headphones",
    price: 24990,
    about: "Industry-leading active noise cancellation with twin processors, 8 microphones, and ultra-comfortable fit.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
    category: "access",
    type: "headph",
    brand: "Sony",
    stock: "instock",
    color: "black"
  },
  {
    title: "boAt Rockerz 550 Wireless Bluetooth Headphone",
    price: 1999,
    about: "50mm dynamic drivers providing immersive audio bass, 20 hours playback, and physical noise isolation.",
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80",
    category: "access",
    type: "headph",
    brand: "Boat",
    stock: "instock",
    color: "red"
  },
  {
    title: "Titan Classic Leather Strap Watch",
    price: 4499,
    about: "Timeless analog watch featuring mineral glass and genuine calfskin leather band.",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80",
    category: "access",
    type: "watch",
    brand: "Titan",
    stock: "instock",
    color: "black"
  },
  {
    title: "Full Grain Leather Reversible Belt",
    price: 1499,
    about: "Durable genuine leather belt with brushed gunmetal swivel buckle offering black and brown versatility.",
    image: "https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=600&auto=format&fit=crop&q=80",
    category: "access",
    type: "belt",
    brand: "Armani",
    stock: "instock",
    color: "black"
  },

  // --- KIDS & TOYS ---
  {
    title: "Kids Organic Cotton Dino Print Shirt",
    price: 899,
    about: "Super soft, skin-friendly organic cotton shirt with playful dinosaur prints for energetic toddlers.",
    image: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600&auto=format&fit=crop&q=80",
    category: "kids",
    type: "shirt",
    stock: "instock",
    color: "red",
    size: "S",
    fabric: "cotton",
    gender: "male"
  },
  {
    title: "Kids Stretch Denim Play Pants",
    price: 1099,
    about: "Reinforced knee seams and elasticated waistband designed for all-day active play and movement.",
    image: "https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=600&auto=format&fit=crop&q=80",
    category: "kids",
    type: "pant",
    stock: "instock",
    color: "black",
    size: "M",
    gender: "male"
  },
  {
    title: "Wooden Building Blocks & Puzzle Toy Set",
    price: 1299,
    about: "Non-toxic eco-friendly wooden educational shape and building blocks set developing spatial reasoning.",
    image: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600&auto=format&fit=crop&q=80",
    category: "kids",
    type: "toys",
    stock: "instock",
    color: "red"
  },

  // --- HOME & KITCHEN ---
  {
    title: "Titan Minimalist Modern Wall Clock",
    price: 2499,
    about: "Contemporary silent-sweep wooden frame wall clock adding warmth and timeless charm to any living space.",
    image: "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=600&auto=format&fit=crop&q=80",
    category: "home",
    type: "watch",
    brand: "Titan",
    stock: "instock",
    color: "black"
  },
  {
    title: "Rolex Heritage Mantle Brass Clock",
    price: 8999,
    about: "Antique-inspired luxury brass desktop clock engineered with precision quartz sweep movement.",
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&auto=format&fit=crop&q=80",
    category: "home",
    type: "watch",
    brand: "Rolex",
    stock: "instock",
    color: "black"
  },
  {
    title: "Nordic Ceramic Minimalist Vase Set",
    price: 1799,
    about: "Matte textured ceramic vase duo designed to elevate dining tables, shelves, and fireplace mantels.",
    image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=600&auto=format&fit=crop&q=80",
    category: "home",
    type: "decor",
    stock: "instock",
    color: "black"
  },

  // --- BAGS ---
  {
    title: "Handcrafted Vintage Leather Messenger Bag",
    price: 3999,
    about: "Full grain distressed leather messenger satchel with dedicated 15.6 inch laptop sleeve and antique brass hardware.",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&auto=format&fit=crop&q=80",
    category: "bags",
    type: "bag",
    stock: "instock",
    color: "black"
  },
  {
    title: "Urban Water-Resistant Everyday Backpack",
    price: 2499,
    about: "Ergonomic multi-compartment travel and commute backpack with USB charging port and anti-theft pocket.",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80",
    category: "bags",
    type: "backpack",
    stock: "instock",
    color: "red"
  },
  {
    title: "Structured Italian Leather Handbag",
    price: 4599,
    about: "Timeless top-handle structured satchel bag crafted with gold-toned zip closures and detachable strap.",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&auto=format&fit=crop&q=80",
    category: "bags",
    type: "handbag",
    stock: "instock",
    color: "black"
  },
  {
    title: "Italian Wool Double-Breasted Blazer",
    price: 6499,
    about: "Finely woven virgin wool blazer with peak lapels, horn buttons, and tailored silhouette for elite occasions.",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=80",
    category: "mens",
    type: "suit",
    brand: "Armani",
    stock: "instock",
    color: "black",
    size: "L",
    gender: "male",
    fabric: "cotton"
  },
  {
    title: "Streetwear Graphic Fleece Hoodie",
    price: 2499,
    about: "Heavyweight premium cotton blend fleece hoodie with kangaroo pocket and ribbed cuffs.",
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&auto=format&fit=crop&q=80",
    category: "mens",
    type: "shirt",
    brand: "Armani",
    stock: "instock",
    color: "black",
    size: "XL",
    gender: "male",
    fabric: "cotton"
  },
  {
    title: "Fine Knit Cashmere Cardigan Sweater",
    price: 3199,
    about: "Ultra-soft touch lightweight knit cardigan with v-neck cut and ribbed hemline.",
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&auto=format&fit=crop&q=80",
    category: "females",
    type: "top",
    brand: "Gucci",
    stock: "instock",
    color: "red",
    size: "M",
    gender: "female",
    fabric: "cotton"
  },
  {
    title: "High-Waist Tailored Wide Leg Trousers",
    price: 2999,
    about: "Sophisticated pleated front wide-leg trousers designed for modern effortless chic.",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&auto=format&fit=crop&q=80",
    category: "females",
    type: "pant",
    brand: "Gucci",
    stock: "instock",
    color: "black",
    size: "S",
    gender: "female",
    fabric: "linen"
  },
  {
    title: "SPF 50+ Invisible Sunscreen Gel",
    price: 649,
    about: "Non-greasy, fast-absorbing broad spectrum UV protection with zero white cast.",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80",
    category: "beauty",
    type: "cream",
    brand: "Nivea",
    stock: "instock",
    skinType: "combination"
  },
  {
    title: "Revitalizing Rose & Aloe Facial Mist",
    price: 499,
    about: "Refreshing natural botanical facial mist to hydrate, tone, and balance complexion on the go.",
    image: "https://images.unsplash.com/photo-1608248597358-1e42777f9791?w=600&auto=format&fit=crop&q=80",
    category: "beauty",
    type: "facewash",
    brand: "Lakme",
    stock: "instock",
    skinType: "dry"
  },
  {
    title: "Classic Aviator UV400 Polarized Sunglasses",
    price: 2299,
    about: "Iconic teardrop metal frame with glare-reducing polarized lenses offering full UV400 protection.",
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&auto=format&fit=crop&q=80",
    category: "access",
    type: "watch",
    brand: "Titan",
    stock: "instock",
    color: "black"
  },
  {
    title: "Active Noise-Cancelling Wireless Earbuds",
    price: 2999,
    about: "High-fidelity dynamic drivers with environmental noise cancellation and 36-hour total battery life.",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80",
    category: "access",
    type: "headph",
    brand: "Boat",
    stock: "instock",
    color: "black"
  },
  {
    title: "Educational Wooden Building Blocks Set",
    price: 899,
    about: "Colorful non-toxic natural solid wood blocks fostering STEM creativity and motor skills.",
    image: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600&auto=format&fit=crop&q=80",
    category: "kids",
    type: "toys",
    brand: "Armani",
    stock: "instock",
    gender: "kids"
  },
  {
    title: "Soft Plush Animal Buddy Companion",
    price: 749,
    about: "Super-soft hypoallergenic plush stuffed companion toy that is safe and cuddly for toddlers.",
    image: "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=600&auto=format&fit=crop&q=80",
    category: "kids",
    type: "toys",
    brand: "Armani",
    stock: "instock",
    gender: "kids"
  },
  {
    title: "Handcrafted Ceramic Artisan Coffee Mug Set",
    price: 999,
    about: "Set of 2 matte glazed ceramic mugs handmade by master potters. Microwave and dishwasher safe.",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80",
    category: "home",
    type: "decor",
    stock: "instock",
    color: "black"
  },
  {
    title: "Minimalist Nordic Ambient Desk Lamp",
    price: 1899,
    about: "Sleek matte metal bedside and study lamp with touch-sensitive dimming and warm LED glow.",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=80",
    category: "home",
    type: "decor",
    stock: "instock",
    color: "black"
  },
  {
    title: "Heavy-Duty Canvas Duffel Travel Bag",
    price: 2799,
    about: "Rugged waterproof waxed canvas duffel with reinforced genuine leather handles and shoe compartment.",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80",
    category: "bags",
    type: "bag",
    stock: "instock",
    color: "black"
  }
];

async function seedDatabase() {
  try {
    console.log("Connecting to MongoDB:", MONGODB_URL);
    await mongoose.connect(MONGODB_URL);
    console.log("Connected to MongoDB successfully.");

    // 1. Ensure a default seller/admin exists
    let seller = await User.findOne({ role: "admin" });
    if (!seller) {
      seller = await User.findOne({ role: "Seller" });
    }
    if (!seller) {
      console.log("Creating default admin/seller user...");
      seller = await User.create({
        name: "ShopVerse Official",
        email: "admin@shopverse.com",
        contact: 9876543210,
        password: "AdminPassword123!",
        role: "admin",
        signupVerify: true
      });
      console.log("Admin user created with ID:", seller._id);
    } else {
      console.log("Using existing seller/admin ID:", seller._id);
    }

    // 2. Insert or update sample products idempotently
    let insertedCount = 0;
    let updatedCount = 0;

    for (const p of sampleProducts) {
      const productData = {
        ...p,
        seller: seller._id,
        isActive: true
      };

      const existing = await Product.findOne({ title: p.title });
      if (existing) {
        await Product.updateOne({ _id: existing._id }, { $set: productData });
        updatedCount++;
      } else {
        await Product.create(productData);
        insertedCount++;
      }
    }

    const totalCount = await Product.countDocuments();
    console.log(`\nSeed Complete!`);
    console.log(`- New products inserted: ${insertedCount}`);
    console.log(`- Existing products updated: ${updatedCount}`);
    console.log(`- Total products in database: ${totalCount}`);

    process.exit(0);
  } catch (error) {
    console.error("Seeding failed with error:", error);
    process.exit(1);
  }
}

seedDatabase();
