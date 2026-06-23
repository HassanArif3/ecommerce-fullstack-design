export const categories = [
  "Automobiles",
  "Clothes and wear",
  "Home interiors",
  "Computer and tech",
  "Tools, equipments",
  "Sports and outdoor",
  "Animal and pets",
  "Machinery tools"
];

export const products = [
  // --- Electronics / Computer and tech ---
  {
    id: 1,
    title: "GoPro HERO6 4K Action Camera - Black",
    price: 99.50,
    originalPrice: 1128.00,
    rating: 7.5,
    reviews: 32,
    sold: 154,
    category: "Computer and tech",
    brand: "GoPro",
    features: ["Metallic", "Super power", "Large Memory"],
    description: "Experience the ultimate action capture with the GoPro HERO6. Features stunning 4K video recording, advanced video stabilization, and a rugged waterproof design, making it the perfect companion for your outdoor adventures.",
    image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500&auto=format&fit=crop&q=80",
    details: {
      "Model": "HERO-8786",
      "Style": "Action Cam",
      "Certificate": "ISO-8989",
      "Size": "66mm x 48mm x 24mm",
      "Memory": "MicroSD up to 256GB"
    }
  },
  {
    id: 2,
    title: "Smartwatches Premium Sports Edition v4",
    price: 99.50,
    originalPrice: 150.00,
    rating: 9.3,
    reviews: 48,
    sold: 210,
    category: "Computer and tech",
    brand: "Samsung",
    features: ["Metallic", "8GB Ram", "Super power"],
    description: "Track your fitness, receive notifications, and make payments on the go. Designed with a premium metallic finish and a vivid AMOLED screen, this smartwatch blend style and health tracking flawlessly.",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80",
    details: {
      "Model": "SW-400X",
      "Style": "Sports smartwatch",
      "Certificate": "CE-EMC",
      "Size": "42mm x 42mm x 11.5mm",
      "Memory": "8GB ROM / 1GB RAM"
    }
  },
  {
    id: 3,
    title: "Ultra Thin Core i7 Professional Laptop",
    price: 940.00,
    originalPrice: 1128.00,
    rating: 8.7,
    reviews: 120,
    sold: 80,
    category: "Computer and tech",
    brand: "Lenovo",
    features: ["8GB Ram", "Large Memory", "Super power"],
    description: "Boost your productivity with this ultra-thin laptop. Packed with a high-performance Core i7 processor, fast 8GB RAM, and a spacious SSD, it handles heavy programming, design work, and multitasking with ease.",
    image: "https://images.unsplash.com/photo-1496181130204-7552cc14ac1a?w=500&auto=format&fit=crop&q=80",
    details: {
      "Model": "LNV-THIN9",
      "Style": "Business Notebook",
      "Certificate": "ENERGY STAR",
      "Size": "315mm x 220mm x 14.9mm",
      "Memory": "512GB NVMe SSD"
    }
  },
  {
    id: 4,
    title: "Pro Sound Active Noise Cancelling Headphones",
    price: 99.50,
    originalPrice: 128.00,
    rating: 7.5,
    reviews: 64,
    sold: 140,
    category: "Computer and tech",
    brand: "Apple",
    features: ["Plastic cover", "Super power"],
    description: "Escape the noise with industry-leading Active Noise Cancelling technology. These headphones offer rich, high-fidelity audio, comfortable memory foam ear cushions, and up to 30 hours of continuous wireless playback.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80",
    details: {
      "Model": "ANC-PRO2",
      "Style": "Over-Ear Wireless",
      "Certificate": "FCC-ID",
      "Size": "180mm x 160mm x 80mm",
      "Memory": "N/A"
    }
  },
  {
    id: 5,
    title: "Canon Professional DSLR Camera Body Only",
    price: 689.00,
    originalPrice: 1128.00,
    rating: 7.5,
    reviews: 90,
    sold: 55,
    category: "Computer and tech",
    brand: "Huawei",
    features: ["Metallic", "Large Memory"],
    description: "Capture breathtaking, gallery-quality photographs with this high-resolution DSLR camera body. Perfectly suited for both portrait photography and cinematic video creation.",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&auto=format&fit=crop&q=80",
    details: {
      "Model": "EOS-200D",
      "Style": "DSLR Camera",
      "Certificate": "ISO-9001",
      "Size": "122mm x 93mm x 70mm",
      "Memory": "SD/SDHC/SDXC Dual Slot"
    }
  },
  
  // --- Home and Outdoor ---
  {
    id: 6,
    title: "Nordic Style Velvet Soft Single Armchair",
    price: 19.00,
    originalPrice: 45.00,
    rating: 9.0,
    reviews: 18,
    sold: 300,
    category: "Home interiors",
    brand: "Pocco",
    features: ["Plastic cover"],
    description: "Bring a touch of modern elegance to your living room or study. This armchair features soft velvet upholstery, dense foam cushioning, and sturdy solid wood legs for maximum comfort and style.",
    image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=500&auto=format&fit=crop&q=80",
    details: {
      "Model": "NC-CHAIR1",
      "Style": "Single Armchair",
      "Certificate": "FSC-Certified",
      "Size": "75cm x 80cm x 85cm",
      "Memory": "N/A"
    }
  },
  {
    id: 7,
    title: "Modern Fabric Sofa with Accent Lamp",
    price: 19.00,
    originalPrice: 50.00,
    rating: 8.5,
    reviews: 42,
    sold: 95,
    category: "Home interiors",
    brand: "Lenovo",
    features: ["Metallic"],
    description: "A comfortable, compact fabric sofa designed for apartments and modern houses. Sturdy construction combined with a minimalistic form factors.",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&auto=format&fit=crop&q=80",
    details: {
      "Model": "SF-FABRIC5",
      "Style": "Sofa",
      "Certificate": "ISO-14001",
      "Size": "180cm x 90cm x 85cm",
      "Memory": "N/A"
    }
  },
  {
    id: 8,
    title: "Premium Ceramic Dining Plate & Dish Set",
    price: 19.00,
    originalPrice: 35.00,
    rating: 9.5,
    reviews: 50,
    sold: 450,
    category: "Home interiors",
    brand: "Samsung",
    features: ["Plastic cover"],
    description: "Elevate your dining experience with this complete 12-piece ceramic dining dish set. Microwave and dishwasher safe, featuring a scratch-resistant glaze.",
    image: "https://images.unsplash.com/photo-1577964930171-4751efe76085?w=500&auto=format&fit=crop&q=80",
    details: {
      "Model": "PLATE-CER1",
      "Style": "Dining Tableware",
      "Certificate": "FDA-Approved",
      "Size": "Multiple sizes included",
      "Memory": "N/A"
    }
  },
  {
    id: 9,
    title: "Professional Kitchen Stand Mixer",
    price: 100.00,
    originalPrice: 199.00,
    rating: 8.8,
    reviews: 35,
    sold: 102,
    category: "Home interiors",
    brand: "Apple",
    features: ["Metallic", "Super power"],
    description: "A robust stand mixer featuring a high-torque motor and multiple speed options. Includes flat beater, dough hook, and wire whip accessories.",
    image: "https://images.unsplash.com/photo-1578643463396-0997cb5328c1?w=500&auto=format&fit=crop&q=80",
    details: {
      "Model": "MX-STAND3",
      "Style": "Kitchen Mixer",
      "Certificate": "UL-Listed",
      "Size": "350mm x 220mm x 360mm",
      "Memory": "N/A"
    }
  },
  {
    id: 10,
    title: "High-Speed Countertop Food Blender",
    price: 39.00,
    originalPrice: 89.00,
    rating: 7.9,
    reviews: 29,
    sold: 190,
    category: "Home interiors",
    brand: "Pocco",
    features: ["Plastic cover", "Super power"],
    description: "Blend smoothies, hot soups, and frozen desserts with ease. Equipped with stainless steel blades and variable speed control.",
    image: "https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=500&auto=format&fit=crop&q=80",
    details: {
      "Model": "BL-SPEED4",
      "Style": "Countertop Blender",
      "Certificate": "CE",
      "Size": "200mm x 220mm x 450mm",
      "Memory": "N/A"
    }
  },
  {
    id: 11,
    title: "Premium Espresso & Coffee Drip Maker",
    price: 19.00,
    originalPrice: 59.00,
    rating: 9.1,
    reviews: 80,
    sold: 340,
    category: "Home interiors",
    brand: "Samsung",
    features: ["Metallic", "Super power"],
    description: "Start your morning right with a fresh brew. Features programmable scheduling, automatic shutoff, and a reusable mesh filter.",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&auto=format&fit=crop&q=80",
    details: {
      "Model": "CF-DRIP8",
      "Style": "Drip Coffee Machine",
      "Certificate": "CE-CB",
      "Size": "220mm x 280mm x 340mm",
      "Memory": "N/A"
    }
  },

  // --- Clothes and Wear ---
  {
    id: 12,
    title: "Mens Long Sleeve T-shirt Cotton Base Layer",
    price: 10.30,
    originalPrice: 25.00,
    rating: 9.3,
    reviews: 32,
    sold: 154,
    category: "Clothes and wear",
    brand: "Apple",
    features: ["Plastic cover"],
    description: "Crafted from 100% organic cotton, this classic long sleeve tee provides superior comfort and breathability. Its slim-fit design makes it perfect as a standalone shirt or a cozy base layer for cooler seasons.",
    image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=500&auto=format&fit=crop&q=80",
    details: {
      "Model": "TS-COTTON-L",
      "Style": "Classic style",
      "Certificate": "ISO-898921212",
      "Size": "34mm x 450mm x 19mm",
      "Memory": "36GB RAM"
    }
  },
  {
    id: 13,
    title: "Classic Denim Jeans Shorts for Men",
    price: 9.99,
    originalPrice: 29.99,
    rating: 7.5,
    reviews: 14,
    sold: 80,
    category: "Clothes and wear",
    brand: "Pocco",
    features: ["Metallic"],
    description: "Durable and fashionable denim shorts. Offers a relaxed fit with multiple pockets, perfect for casual summer outings and daily leisure wear.",
    image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=500&auto=format&fit=crop&q=80",
    details: {
      "Model": "DM-SHORTS2",
      "Style": "Denim Shorts",
      "Certificate": "OEKO-TEX",
      "Size": "Waist 30-38 available",
      "Memory": "N/A"
    }
  },
  {
    id: 14,
    title: "Brown Winter Coat with Faux Fur Hood",
    price: 12.50,
    originalPrice: 89.99,
    rating: 8.9,
    reviews: 55,
    sold: 120,
    category: "Clothes and wear",
    brand: "Huawei",
    features: ["Metallic", "Super power"],
    description: "Stay warm in style. This heavy-duty winter coat is insulated with high-grade down filling and features a windproof exterior with an elegant faux-fur trimmed hood.",
    image: "https://images.unsplash.com/photo-1544923246-77307dd654cb?w=500&auto=format&fit=crop&q=80",
    details: {
      "Model": "WC-FUR88",
      "Style": "Heavy Outerwear",
      "Certificate": "ISO-Coat",
      "Size": "M, L, XL, XXL",
      "Memory": "N/A"
    }
  },
  {
    id: 15,
    title: "Jeans Bag for Travel & Everyday Wear",
    price: 34.00,
    originalPrice: 75.00,
    rating: 9.0,
    reviews: 30,
    sold: 190,
    category: "Clothes and wear",
    brand: "Samsung",
    features: ["Plastic cover"],
    description: "A trendy, durable denim travel backpack. Offers a main drawstring compartment with multiple side pockets for ultimate convenience.",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=80",
    details: {
      "Model": "JB-TRAVEL4",
      "Style": "Backpack",
      "Certificate": "ISO-Bag",
      "Size": "40cm x 30cm x 15cm",
      "Memory": "N/A"
    }
  },
  {
    id: 16,
    title: "Premium Handcrafted Leather Wallet",
    price: 99.00,
    originalPrice: 199.00,
    rating: 9.7,
    reviews: 44,
    sold: 310,
    category: "Clothes and wear",
    brand: "Apple",
    features: ["Metallic", "Large Memory"],
    description: "Made from full-grain vegetable-tanned leather, this slim bi-fold wallet contains card slots, a cash slot, and RFID-blocking technology.",
    image: "https://images.unsplash.com/photo-1507207611509-ec012433ff52?w=500&auto=format&fit=crop&q=80",
    details: {
      "Model": "LW-HAND9",
      "Style": "Bifold Wallet",
      "Certificate": "Leather-G",
      "Size": "110mm x 85mm x 15mm",
      "Memory": "N/A"
    }
  },
  {
    id: 17,
    title: "Minimalist Blue Leather Pocket Wallet",
    price: 10.30,
    originalPrice: 20.00,
    rating: 7.1,
    reviews: 12,
    sold: 99,
    category: "Clothes and wear",
    brand: "Pocco",
    features: ["Plastic cover"],
    description: "A sleek, minimal card holder wallet crafted in high-quality navy blue leather, perfect for carrying essential cards and folded cash.",
    image: "https://images.unsplash.com/photo-1627124765135-5e120220942c?w=500&auto=format&fit=crop&q=80",
    details: {
      "Model": "LW-MINI3",
      "Style": "Card Wallet",
      "Certificate": "CE",
      "Size": "100mm x 70mm x 8mm",
      "Memory": "N/A"
    }
  }
];
